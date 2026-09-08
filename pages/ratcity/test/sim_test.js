// Headless playtest: node test/sim_test.js
// Scripted players play full runs at 60Hz. No rendering. Prints per-night tables.
const { CONFIG } = require('../src/config.js');
const { Sim } = require('../src/sim.js');

function lcg(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

// --- player policies -------------------------------------------------------
const policies = {
  // Plays the way the GDD hopes: cat early, trap on a lane, bin on pickup eve, upgrades when flush.
  sensible(g) {
    const slot = id => g.slots.find(s => s.id === id);
    const richest = g.piles.reduce((a, b) => (b.bags > a.bags ? b : a));
    const outer = richest.idx === 2 ? 'hydrant' : 'stoopRail';
    const otherOuter = outer === 'hydrant' ? 'stoopRail' : 'hydrant';
    const inner = richest.idx === 2 ? 'scaffolding' : 'lamppost';
    if (!slot(outer).tower) Sim.place(g, outer, 'cat');
    if (g.unlocked.trap && !slot(inner).tower && g.night < 4) Sim.place(g, inner, 'trap');
    if (g.unlocked.bin && !slot(inner).tower) Sim.place(g, inner, 'bin');
    if (g.unlocked.bin && slot(inner).tower && slot(inner).tower.type === 'trap' && Sim.spendable(g) >= 5) { Sim.sell(g, inner); Sim.place(g, inner, 'bin'); }
    if (!slot(otherOuter).tower && Sim.spendable(g) >= 4) Sim.place(g, otherOuter, 'cat');
    for (const id of [outer, otherOuter]) if (slot(id).tower && slot(id).tower.level === 1 && Sim.spendable(g) >= 5) Sim.upgrade(g, id);
    if (g.night >= 5 && !slot(otherOuter === 'hydrant' ? 'scaffolding' : 'lamppost').tower && Sim.spendable(g) >= 3 && g.unlocked.trap)
      Sim.place(g, otherOuter === 'hydrant' ? 'scaffolding' : 'lamppost', 'trap');
    // curb-only banking: hide wealth in bins on ordinary nights, empty them onto the curb on pickup eve
    if (CONFIG.TRUCK_NIGHTS.includes(g.night)) {
      for (const s of g.slots) if (s.tower && s.tower.type === 'bin') for (let i = 0; i < 8; i++) Sim.unload(g, s.id);
      while (g.flying.length) { Sim.update(g, 1 / CONFIG.SIM_HZ); g.events.length = 0; }   // let unloads reach the hand
    } else if (g.night !== 10) {
      let guard = 8;
      while (Sim.spendable(g) - g.hand > 4 && guard-- > 0) { let did = false; for (let p = 0; p < 3 && !did; p++) did = Sim.stash(g, p); if (!did) break; }
    }
    // bait placement: concentrate the curb on the pile the cats cover
    let guard2 = 30;
    while (g.hand > 0 && guard2-- > 0) { if (!Sim.placeBag(g, richest.idx)) { let placed = false; for (let p = 0; p < 3 && !placed; p++) placed = Sim.placeBag(g, p); if (!placed) break; } }
    while (g.flying.length) { Sim.update(g, 1 / CONFIG.SIM_HZ); g.events.length = 0; }
  },
  // Never spends after the first cat. Hoards. This is the "greed" failure case.
  hoarder(g) {
    if (!g.slots[0].tower) Sim.place(g, 'stoopRail', 'cat');
    let guard = 30;
    while (g.hand > 0 && guard-- > 0) { if (!Sim.placeBag(g, 0)) { let placed = false; for (let p = 0; p < 3 && !placed; p++) placed = Sim.placeBag(g, p); if (!placed) break; } }
  },
  // Builds nothing. Should die around night 3–5.
  nothing() {},
  // Spends everything every day on towers/upgrades. Safe but broke.
  spender(g) {
    for (const s of g.slots) {
      if (!s.tower) { for (const t of ['cat', 'trap']) if (g.unlocked[t] && Sim.place(g, s.id, t)) break; }
      else if (s.tower.level === 1) Sim.upgrade(g, s.id);
    }
  },
};

function runGame(policyName, seed, opts = {}) {
  const rng = lcg(seed);
  const g = Sim.createGame(rng);
  Sim.startRun(g);
  const dt = 1 / CONFIG.SIM_HZ;
  const rows = [];
  let steps = 0, tokenTaps = 0, rearms = 0, nearMiss = false, lunges = 0;
  const grabChance = opts.grabChance ?? 0.6;
  const pendingGrabs = new Map(); // tokenId -> time to tap

  while (g.phase !== 'over' && steps < 60 * 60 * 30) {
    if (g.phase === 'day') {
      // let bags land first (flying)
      while (g.flying.length) { Sim.update(g, dt); g.events.length = 0; steps++; }
      policies[policyName](g);
      g.events.length = 0;
      const pv = Sim.preview(g);
      rows.push({ night: g.night, liquid: pv.liquid, binned: pv.binnedBags, wave: pv.size, extra: pv.extra });
      Sim.nightfall(g);
    }
    Sim.update(g, dt);
    steps++;
    for (const ev of g.events) {
      if (ev.type === 'tokenSpawn' && rng() < grabChance) pendingGrabs.set(ev.id, g.t + 0.6 + rng() * 1.6);
      if (ev.type === 'nearMiss') nearMiss = true;
      if (ev.type === 'lunge') lunges++;
      if (ev.type === 'nightClear') { const row = rows[rows.length - 1]; row.lost = ev.lost; row.infest = g.infestation; row.tokens = ev.tokens; row.kills = g.stats.kills; row.secs = g.t.toFixed(0); row.boss = ev.boss ? (ev.bossDead ? 'DEAD' : 'alive') : ''; }
      if (ev.type === 'bank') rows[rows.length - 1].banked = ev.amount;
    }
    g.events.length = 0;
    // token grabbing (imperfect player)
    if (g.phase === 'night') {
      for (const [id, at] of pendingGrabs) {
        if (g.t >= at) {
          const tok = g.tokens.find(k => k.id === id);
          if (tok && Sim.tapNight(g, tok.x, tok.z)) tokenTaps++;
          pendingGrabs.delete(id);
        }
      }
      // re-arm traps if flush
      if (policyName === 'sensible' && Sim.spendable(g) >= 3) for (const s of g.slots) if (s.tower && s.tower.type === 'trap' && !s.tower.armed && s.tower.cooldown > 5 && Sim.rearm(g, s.id)) rearms++;
      g.events.length = 0;
    }
  }
  return { g, rows, steps, tokenTaps, rearms, nearMiss, lunges };
}

function fmt(v, w) { return String(v ?? '').padStart(w); }

function report(name, seed) {
  const r = runGame(name, seed);
  const g = r.g;
  console.log(`\n=== ${name}  seed ${seed}  →  ${g.result}  night ${g.night}  score ${g.score}  tokens ${g.tokensGrabbed}/${g.tokensTotal}  kills ${g.stats.kills}  escapes ${g.stats.escapes}  steps ${r.steps}  nearMiss ${r.nearMiss}`);
  console.log(' night liquid binned wave extra  lost infest tokens banked  secs boss');
  for (const row of r.rows) console.log(` ${fmt(row.night, 5)} ${fmt(row.liquid, 6)} ${fmt(row.binned, 6)} ${fmt(row.wave, 4)} ${fmt(row.extra, 5)}  ${fmt(row.lost, 4)} ${fmt(row.infest, 6)} ${fmt(row.tokens, 6)} ${fmt(row.banked, 6)} ${fmt(row.secs, 5)} ${row.boss || ''}`);
}

for (const seed of [1, 2, 3]) report('sensible', seed);
report('hoarder', 1);
report('nothing', 1);
report('spender', 1);

// aggregate: 20 seeds of the sensible player
let wins = 0, scores = [], nights = [];
for (let s = 10; s < 30; s++) { const r = runGame('sensible', s); if (r.g.result === 'victory') wins++; scores.push(r.g.score); nights.push(r.g.night); }
console.log(`\nsensible ×20: wins ${wins}/20  avg score ${(scores.reduce((a, b) => a + b, 0) / 20).toFixed(1)}  nights reached ${nights.join(',')}`);
