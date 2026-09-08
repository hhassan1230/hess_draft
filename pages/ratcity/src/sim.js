/* ============================================================================
   RAT CITY — src/sim.js
   The game, with no pictures. Pure state + fixed-timestep update. Emits events
   into g.events; the render/audio/ui layers drain them every frame. Nothing in
   here touches the DOM or THREE, which is why it can run headless in node.
   ========================================================================== */

const Sim = (() => {
  const C = (typeof CONFIG !== 'undefined') ? CONFIG : require('./config.js').CONFIG;

  const dist = (ax, az, bx, bz) => Math.hypot(ax - bx, az - bz);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const emit = (g, type, data) => { const ev = Object.assign({}, data || {}); ev.type = type; g.events.push(ev); };

  // ---------------------------------------------------------------- state ---
  function fresh(rng) {
    return {
      rng,
      phase: 'title',          // title | day | night | dawn | storm | over
      night: 0,                // the upcoming (day) or current (night) night
      t: 0, nightLen: 0,
      dawn: null,
      piles: C.PILES.map((p, i) => ({ idx: i, id: p.id, label: p.label, x: p.x, z: p.z, bags: 0 })),
      slots: C.SLOTS.map(s => ({ id: s.id, label: s.label, x: s.x, z: s.z, tower: null })),
      rats: [], tokens: [], flying: [], queue: [], events: [],
      hand: 0,
      infestation: 0, marked: false,
      score: 0,
      tokensGrabbed: 0, tokensTotal: 0, tokensNight: 0, grabsNight: 0, firstTokenSeen: false,
      unlocked: { cat: false, trap: false, bin: false },
      catNameIdx: 0,
      lostTotal: 0, lostNight: 0,
      script: { nearMissDone: false },
      boss: null,
      stormT: 0,
      result: null,
      stats: { kills: 0, thefts: 0, escapes: 0, banked: [], nightsSurvived: 0 },
      ids: 1,
    };
  }

  function createGame(rng) { return fresh(rng || Math.random); }

  function startRun(g) {
    Object.assign(g, fresh(g.rng));
    g.phase = 'day';
    g.night = 1;
    checkUnlocks(g);
    landBags(g, C.ECON.startBags, 0.22);
    emit(g, 'run');
    emit(g, 'day', { night: 1 });
  }

  // -------------------------------------------------------------- queries ---
  const spendable = g => g.piles.reduce((s, p) => s + p.bags, 0) + g.hand;
  const carried = g => g.rats.reduce((s, r) => s + (r.carry || 0), 0);
  const liquidBags = g => spendable(g) + carried(g) + g.flying.length;
  const handCount = g => g.hand;
  const binned = g => g.slots.reduce((s, sl) => s + (sl.tower && sl.tower.type === 'bin' ? sl.tower.bags : 0), 0);
  const canAfford = (g, n) => spendable(g) >= n;
  const nightCfg = g => C.NIGHTS[g.night];

  function waveSize(g, night) {
    const cfg = C.NIGHTS[night || g.night];
    if (!cfg) return 0;
    let n = cfg.base + Math.floor(liquidBags(g) / 2);
    if (g.marked) n = Math.ceil(n * C.INFEST.markedMult);
    return n;
  }

  function nextTruckIn(g) {
    const t = C.TRUCK_NIGHTS.find(n => n >= g.night);
    return t ? t - g.night + 1 : 0;
  }

  function preview(g) {
    const cfg = nightCfg(g) || {};
    const extra = Math.floor(liquidBags(g) / 2);
    return {
      night: g.night, len: cfg.len || 0, base: cfg.base || 0, extra,
      size: waveSize(g), boss: !!cfg.boss, quiet: !!cfg.quiet, marked: g.marked,
      truckIn: nextTruckIn(g), truckAfterThis: C.TRUCK_NIGHTS.includes(g.night),
      liquid: liquidBags(g), binnedBags: binned(g),
    };
  }

  function nearestCat(g, x, z) {
    let best = null, bd = Infinity;
    for (const s of g.slots) {
      if (!s.tower || s.tower.type !== 'cat') continue;
      const d = dist(s.x, s.z, x, z);
      if (d < bd) { bd = d; best = s; }
    }
    return best;
  }

  function nearestPileIdx(g, x, z) {
    let bi = 0, bd = Infinity;
    g.piles.forEach((p, i) => { const d = dist(p.x, p.z, x, z); if (d < bd) { bd = d; bi = i; } });
    return bi;
  }

  // ----------------------------------------------------------------- bags ---
  function pickPile(g) {
    if (g.rng() < C.ECON.centerBias) return 1;
    return Math.floor(g.rng() * g.piles.length);
  }

  function landBags(g, n, stagger) {
    // dawn bags land at the curb edge, in the player's hands. Placing them is the day's first verb.
    for (let i = 0; i < n; i++) {
      g.flying.push({
        id: g.ids++, kind: 'drop', to: 'hand',
        x0: C.HAND.x + (g.rng() - 0.5) * 0.9, z0: C.HAND.z + (g.rng() - 0.5) * 0.2, y0: 5.5,
        tx: C.HAND.x + (i - (n - 1) / 2) * 0.42, tz: C.HAND.z,
        t: -(stagger || 0) * i, dur: C.TIMING.bagsLand,
      });
    }
  }

  // the player drops one bag from the hand onto a pile — the bait verb (fun pass #1)
  function pickPileCapped(g) {
    const open = g.piles.filter(p => pilePlanned(g, p.idx) < C.PILE_CAP);
    if (!open.length) { let least = g.piles[0]; for (const p of g.piles) if (pilePlanned(g, p.idx) < pilePlanned(g, least.idx)) least = p; return least.idx; }
    return open[Math.floor(g.rng() * open.length)].idx;
  }

  function placeBag(g, pileIdx) {
    if (g.phase !== 'day' || g.hand <= 0) return false;
    if (pilePlanned(g, pileIdx) >= C.PILE_CAP) { emit(g, 'pileFull', { pile: pileIdx }); return false; }
    g.hand--;
    const p = g.piles[pileIdx];
    g.flying.push({
      id: g.ids++, kind: 'place', to: 'pile', pile: pileIdx,
      x0: C.HAND.x, z0: C.HAND.z, y0: 0,
      t: 0, dur: 0.38 + dist(C.HAND.x, C.HAND.z, p.x, p.z) * 0.045,
    });
    emit(g, 'placeBag', { pile: pileIdx, x: p.x, z: p.z, left: g.hand });
    return true;
  }

  function returnBag(g, x, z, pileIdx) {
    const p = g.piles[pileIdx];
    g.flying.push({ id: g.ids++, kind: 'return', to: 'pile', pile: pileIdx, x0: x, z0: z, y0: 0, t: 0, dur: 0.55 + dist(x, z, p.x, p.z) * 0.06 });
  }

  function spend(g, n) {
    if (!canAfford(g, n)) return false;
    for (let i = 0; i < n; i++) {
      if (g.hand > 0) { g.hand--; emit(g, 'spend', { from: 'hand', x: C.HAND.x, z: C.HAND.z }); continue; }
      let best = null;
      for (const p of g.piles) if (p.bags > 0 && (!best || p.bags > best.bags)) best = p;
      best.bags--;
      emit(g, 'spend', { from: 'pile', pile: best.idx, x: best.x, z: best.z });
    }
    return true;
  }

  function refund(g, n, x, z) {
    for (let i = 0; i < n; i++) {
      g.flying.push({ id: g.ids++, kind: 'return', to: 'hand', x0: x, z0: z, y0: 0.2, t: i * 0.08, dur: 0.5 });
    }
  }


  function updateFlying(g, dt) {
    for (let i = g.flying.length - 1; i >= 0; i--) {
      const f = g.flying[i];
      f.t += dt;
      if (f.t >= f.dur) {
        if (f.to === 'hand') { g.hand++; emit(g, 'bagLand', { to: 'hand', kind: f.kind, x: C.HAND.x, z: C.HAND.z }); }
        else { g.piles[f.pile].bags++; emit(g, 'bagLand', { to: 'pile', pile: f.pile, kind: f.kind, x: g.piles[f.pile].x, z: g.piles[f.pile].z }); }
        g.flying.splice(i, 1);
      }
    }
  }

  // ---------------------------------------------------------------- towers ---
  function makeTower(g, type, slot) {
    const T = C.TOWERS[type];
    const t = { type, level: 1, spent: T.cost };
    if (type === 'cat') {
      t.name = C.CAT_NAMES[g.catNameIdx++ % C.CAT_NAMES.length];
      t.radius = T.radius; t.timer = 0; t.face = 0; t.lunge = null;
    } else if (type === 'trap') {
      t.armed = true; t.cooldown = 0; t.cd = T.cooldown;
    } else if (type === 'bin') {
      t.bags = 0; t.cap = T.cap; t.pile = nearestPileIdx(g, slot.x, slot.z);
    }
    return t;
  }

  function place(g, slotId, type) {
    if (g.phase !== 'day') return false;
    const slot = g.slots.find(s => s.id === slotId);
    if (!slot || slot.tower || !g.unlocked[type]) return false;
    const T = C.TOWERS[type];
    if (!spend(g, T.cost)) return false;
    slot.tower = makeTower(g, type, slot);
    emit(g, 'place', { slotId, tower: type, name: slot.tower.name || null, x: slot.x, z: slot.z });
    return true;
  }

  function upgrade(g, slotId) {
    if (g.phase !== 'day') return false;
    const slot = g.slots.find(s => s.id === slotId);
    const t = slot && slot.tower;
    if (!t || t.level !== 1) return false;
    const T = C.TOWERS[t.type];
    if (!spend(g, T.l2)) return false;
    t.level = 2; t.spent += T.l2;
    if (t.type === 'cat') t.radius = T.l2Radius;
    if (t.type === 'trap') t.cd = T.l2Cooldown;
    if (t.type === 'bin') t.cap = T.l2Cap;
    emit(g, 'upgrade', { slotId, tower: t.type, x: slot.x, z: slot.z });
    return true;
  }

  function sell(g, slotId) {
    if (g.phase !== 'day') return false;
    const slot = g.slots.find(s => s.id === slotId);
    const t = slot && slot.tower;
    if (!t) return false;
    const back = Math.floor(t.spent * C.ECON.sellRate);
    if (t.type === 'bin') for (let i = 0; i < t.bags; i++) returnBag(g, slot.x, slot.z, t.pile);
    refund(g, back, slot.x, slot.z);
    slot.tower = null;
    emit(g, 'sell', { slotId, tower: t.type, refund: back, x: slot.x, z: slot.z });
    return true;
  }

  function stash(g, pileIdx) {
    if (g.phase !== 'day') return false;
    const p = g.piles[pileIdx];
    if (!p || p.bags <= 0) return false;
    const slot = g.slots.find(s => s.tower && s.tower.type === 'bin' && s.tower.pile === pileIdx && s.tower.bags < s.tower.cap);
    if (!slot) return false;
    p.bags--; slot.tower.bags++;
    emit(g, 'stash', { slotId: slot.id, pile: pileIdx, x: slot.x, z: slot.z });
    return true;
  }

  function unload(g, slotId) {
    if (g.phase !== 'day') return false;
    const slot = g.slots.find(s => s.id === slotId);
    const t = slot && slot.tower;
    if (!t || t.type !== 'bin' || t.bags <= 0) return false;
    t.bags--;
    g.flying.push({ id: g.ids++, kind: 'return', to: 'hand', x0: slot.x, z0: slot.z, y0: 0.4, t: 0, dur: 0.5 });
    emit(g, 'unload', { slotId, x: slot.x, z: slot.z });
    return true;
  }

  function rearm(g, slotId) {
    if (g.phase !== 'night') return false;
    const slot = g.slots.find(s => s.id === slotId);
    const t = slot && slot.tower;
    if (!t || t.type !== 'trap' || t.armed) return false;
    if (!spend(g, C.TOWERS.trap.rearmCost)) { emit(g, 'denied', { slotId, x: slot.x, z: slot.z }); return false; }
    t.armed = true; t.cooldown = 0;
    emit(g, 'rearm', { slotId, free: false, x: slot.x, z: slot.z });
    return true;
  }

  function slotOptions(g, slot) {
    if (!slot.tower) {
      return ['cat', 'trap', 'bin'].filter(k => g.unlocked[k])
        .map(k => ({ action: 'place', type: k, cost: C.TOWERS[k].cost, ok: canAfford(g, C.TOWERS[k].cost) }));
    }
    const t = slot.tower, T = C.TOWERS[t.type];
    return [
      { action: 'upgrade', cost: T.l2, ok: t.level === 1 && canAfford(g, T.l2), maxed: t.level === 2 },
      { action: 'sell', refund: Math.floor(t.spent * C.ECON.sellRate), ok: true },
    ];
  }

  function updateTowers(g, dt) {
    for (const s of g.slots) {
      const t = s.tower;
      if (!t) continue;
      if (t.type === 'cat') {
        if (t.lunge) { t.lunge.t += dt; if (t.lunge.t >= t.lunge.dur) t.lunge = null; continue; }
        t.timer -= dt;
        if (t.timer > 0) continue;
        let target = null, bestScore = -Infinity;
        for (const r of g.rats) {
          if (r.dead || r.state === 'caught' || r.state === 'flee') continue;
          const d = dist(s.x, s.z, r.x, r.z);
          if (d > t.radius) continue;
          const score = (r.state === 'drag' ? 100 : r.state === 'grab' ? 50 : 0) - d;
          if (score > bestScore) { bestScore = score; target = r; }
        }
        if (target) {
          t.timer = C.TOWERS.cat.period;
          t.face = Math.atan2(target.x - s.x, target.z - s.z);
          emit(g, 'swat', { slotId: s.id, name: t.name, x: target.x, z: target.z, ratId: target.id });
          damage(g, target, C.TOWERS.cat.dmg, 'cat');
        } else t.timer = 0;
      } else if (t.type === 'trap') {
        if (t.armed) {
          for (const r of g.rats) {
            if (r.dead || r.state === 'caught' || r.state === 'flee') continue;
            if (dist(s.x, s.z, r.x, r.z) <= C.TOWERS.trap.radius) {
              t.armed = false; t.cooldown = t.cd;
              emit(g, 'snap', { slotId: s.id, x: s.x, z: s.z, ratId: r.id });
              damage(g, r, C.TOWERS.trap.dmg, 'trap');
              break;
            }
          }
        } else {
          t.cooldown -= dt;
          if (t.cooldown <= 0) { t.armed = true; t.cooldown = 0; emit(g, 'rearm', { slotId: s.id, free: true, x: s.x, z: s.z }); }
        }
      }
    }
  }

  // ------------------------------------------------------------------ rats ---
  function activeSpawns(g) { return C.SPAWNS.filter(s => s.from <= g.night); }

  function buildQueue(g) {
    const cfg = nightCfg(g), q = [], T = C.TIMING;
    const spawns = activeSpawns(g);
    const pick = () => spawns[Math.floor(g.rng() * spawns.length)];
    if (cfg.boss) {
      q.push({ at: T.silence + 0.6, type: 'boss', spawn: pick() });
      const extra = waveSize(g), s0 = pick();
      for (let i = 0; i < extra; i++) q.push({ at: C.BOSS_PULSES.extraAt + i * T.pulseGap, type: 'scout', spawn: s0 });
      for (let at = C.BOSS_PULSES.first; at < cfg.len - 10; at += C.BOSS_PULSES.every) {
        const s = pick();
        for (let i = 0; i < C.BOSS_PULSES.scouts; i++) q.push({ at: at + i * T.pulseGap, type: 'scout', spawn: s });
      }
    } else {
      const n = waveSize(g), fat = Math.min(cfg.fat, n);
      const types = new Array(n).fill('scout');
      for (let k = 0; k < fat; k++) types[Math.min(n - 1, Math.floor((k + 0.5) * n / fat))] = 'fat';
      const pulses = Math.ceil(n / T.pulseSize);
      const window = Math.max(0, cfg.len * T.spawnWindow - T.silence);
      const pulseSpawn = []; for (let p = 0; p < pulses; p++) pulseSpawn.push(pick());
      for (let i = 0; i < n; i++) {
        const p = Math.floor(i / T.pulseSize), k = i % T.pulseSize;
        const at = T.silence + (pulses > 1 ? p * window / (pulses - 1) : 0) + k * T.pulseGap;
        q.push({ at, type: types[i], spawn: pulseSpawn[p] });
      }
    }
    q.sort((a, b) => a.at - b.at);
    return q;
  }

  function pickTarget(g, r) {
    const R = C.RATS[r.type];
    let best = null, bv = -Infinity;
    for (const p of g.piles) {
      if (p.bags <= 0) continue;
      const d = dist(r.x, r.z, p.x, p.z);
      const v = R.target === 'richest' ? p.bags * 100 - d : -d;
      if (v > bv) { bv = v; best = p; }
    }
    return best ? best.idx : -1;
  }

  // nothing to steal? rats still come looking: nearest pile, sniff, run home (visible, swattable)
  function nearestPile(g, r) {
    let best = -1, bd = Infinity;
    for (const p of g.piles) { const d = dist(r.x, r.z, p.x, p.z); if (d < bd) { bd = d; best = p.idx; } }
    return best;
  }

  function spawnRat(g, type, spawn) {
    const R = C.RATS[type];
    const r = {
      id: g.ids++, type, hp: R.hp, maxHp: R.hp, speed: R.speed, size: R.size,
      x: spawn.x + (g.rng() - 0.5) * 0.7, z: spawn.z, sx: spawn.x, sz: spawn.z,
      state: 'walk', timer: 0, carry: 0, origin: -1, target: -1, dir: 0, enraged: false, tokenAcc: 0,
      wig: g.rng() * 6.28,
    };
    r.target = pickTarget(g, r);
    if (r.target < 0) r.target = nearestPile(g, r);   // nothing to steal: come looking anyway
    if (type === 'boss') {
      g.boss = g.boss || { dead: false };
      // A boss who escaped comes back with the wounds he left with.
      if (g.boss.hp !== undefined) { r.hp = g.boss.hp; r.enraged = g.boss.enraged; if (r.enraged) r.speed *= R.enrageSpeed; }
      g.boss.alive = true; g.boss.id = r.id;
    }
    g.rats.push(r);
    emit(g, 'spawn', { ratId: r.id, rat: type, x: r.x, z: r.z, spawnId: spawn.id });
    if (type === 'boss') emit(g, 'bossEnter', { ratId: r.id, x: r.x, z: r.z, hp: r.hp, maxHp: r.maxHp, returning: g.boss.passes > 0 });
    return r;
  }

  function moveToward(r, tx, tz, speed, dt) {
    const dx = tx - r.x, dz = tz - r.z, d = Math.hypot(dx, dz);
    if (d < 1e-4) return 0;
    const step = Math.min(d, speed * dt);
    r.x += dx / d * step; r.z += dz / d * step;
    r.dir = Math.atan2(dx, dz);
    return d - step;
  }

  function escape(g, r) {
    const lost = r.carry;
    r.carry = 0;
    g.lostTotal += lost; g.lostNight += lost;
    g.infestation = clamp(g.infestation + C.INFEST.perBag * lost, 0, 100);
    g.stats.escapes++;
    const cat = nearestCat(g, r.x, r.z);
    emit(g, 'escape', { ratId: r.id, rat: r.type, bags: lost, x: r.x, z: r.z, name: cat ? cat.tower.name : null, infestation: g.infestation });
    if (!g.marked && g.infestation >= C.INFEST.marked) { g.marked = true; emit(g, 'marked', { infestation: g.infestation }); }
    if (r.type === 'boss') { g.boss.alive = false; g.boss.hp = r.hp; g.boss.enraged = r.enraged; g.boss.returnAt = g.t + C.RATS.boss.returnDelay; }
    r.gone = true;
    if (g.infestation >= C.INFEST.storm) startStorm(g);
  }

  function updateRat(g, r, dt) {
    const R = C.RATS[r.type];
    switch (r.state) {
      case 'walk': {
        if (r.target < 0 || g.piles[r.target].bags <= 0) {
          const t = pickTarget(g, r);
          if (t >= 0) r.target = t;
          else if (r.target < 0) r.target = nearestPile(g, r);
        }
        if (r.target < 0) { r.state = 'flee'; break; }
        const p = g.piles[r.target];
        const left = moveToward(r, p.x, p.z, r.speed, dt);
        if (left <= 0.42) {
          emit(g, 'arrive', { ratId: r.id, rat: r.type, pile: r.target, empty: p.bags <= 0, x: r.x, z: r.z });
          if (r.type === 'boss' && !r.enraged) {
            r.state = 'stalk'; r.timer = g.boss.passes ? R.stalkAgain : R.stalk; g.boss.passes = (g.boss.passes || 0) + 1; r.stalkA = 0;
            emit(g, 'bossStalk', { ratId: r.id, pile: r.target, x: r.x, z: r.z });
          } else { r.state = 'grab'; r.timer = p.bags > 0 ? R.grabTime : R.grabTime * 0.7; } // empty pile: a sniff, then home
        }
        break;
      }
      case 'stalk': {
        // Beat 1: pace in front of the pile, shrugging off chip damage. Enrage ends it early.
        r.timer -= dt;
        r.stalkA += dt * 0.9;
        const p = g.piles[r.target];
        moveToward(r, p.x + Math.cos(r.stalkA) * 1.3, p.z - 0.9 + Math.sin(r.stalkA * 2) * 0.35, r.speed, dt);
        if (p.bags <= 0) { const t = pickTarget(g, r); if (t >= 0) { r.target = t; r.state = 'walk'; break; } }
        if (r.timer <= 0 || r.enraged) { r.state = 'grab'; r.timer = R.grabTime; }
        break;
      }
      case 'grab': {
        r.timer -= dt;
        if (r.timer > 0) break;
        const p = g.piles[r.target];
        const take = Math.min(R.carry, p.bags);
        if (take <= 0) {
          const t = pickTarget(g, r);
          if (t >= 0) { r.target = t; r.state = 'walk'; }
          else if (r.type === 'boss') { r.state = 'stalk'; r.timer = R.stalkAgain; r.stalkA = 0; }
          else { r.state = 'flee'; emit(g, 'sniff', { ratId: r.id, x: r.x, z: r.z }); }
          break;
        }
        p.bags -= take; r.carry = take; r.origin = r.target;
        r.state = 'drag';
        r.edgeDir = r.x < -0.01 ? -1 : r.x > 0.01 ? 1 : (g.rng() < 0.5 ? -1 : 1);
        g.stats.thefts++;
        emit(g, 'grab', { ratId: r.id, rat: r.type, pile: r.target, bags: take, x: r.x, z: r.z });
        if (g.rng() < C.TOKENS.onBagHit) spawnToken(g, r.x, r.z, false);
        break;
      }
      case 'drag': {
        moveToward(r, r.edgeDir * (C.BOARD.edge + 0.6), r.z, r.speed * C.DRAG_FACTOR, dt);
        // GDD §7 night-1 scripted near-miss: the first thief on night 1 is caught at the edge by a cat.
        if (g.night === 1 && !g.script.nearMissDone && Math.abs(r.x) >= C.BOARD.edge - 0.75) {
          const cat = nearestCat(g, r.x, r.z);
          if (cat) {
            g.script.nearMissDone = true;
            r.state = 'caught'; r.timer = 0.32;
            cat.tower.lunge = { x: r.x, z: r.z, t: 0, dur: 0.75, ratId: r.id };
            cat.tower.face = Math.atan2(r.x - cat.x, r.z - cat.z);
            emit(g, 'lunge', { slotId: cat.id, name: cat.tower.name, x: r.x, z: r.z, ratId: r.id });
            break;
          }
        }
        if (Math.abs(r.x) >= C.BOARD.edge) escape(g, r);
        break;
      }
      case 'flee': {
        const left = moveToward(r, r.sx, r.sz, r.speed * C.FLEE_FACTOR, dt);
        if (left <= 0.3) { r.gone = true; emit(g, 'despawn', { ratId: r.id }); }
        break;
      }
      case 'caught': {
        r.timer -= dt;
        if (r.timer <= 0) {
          const cat = nearestCat(g, r.x, r.z);
          killRat(g, r, 'lunge');
          emit(g, 'nearMiss', { name: cat ? cat.tower.name : '', x: r.x, z: r.z });
        }
        break;
      }
    }
  }

  function damage(g, r, amt, src) {
    if (r.dead || r.state === 'caught') return;
    r.hp -= amt;
    emit(g, 'hit', { ratId: r.id, rat: r.type, x: r.x, z: r.z, amt, src, hp: r.hp, maxHp: r.maxHp });
    if (r.type === 'fat' && g.rng() < C.RATS.fat.tokenOnHit) spawnToken(g, r.x, r.z, false);
    if (r.type === 'boss') {
      const B = C.RATS.boss;
      if (!r.enraged && r.hp <= r.maxHp * B.enrageAt) {
        r.enraged = true; r.speed *= B.enrageSpeed;
        emit(g, 'bossEnrage', { ratId: r.id, x: r.x, z: r.z });
      }
      if (r.enraged) { r.tokenAcc += amt; while (r.tokenAcc >= B.tokenPerHp) { r.tokenAcc -= B.tokenPerHp; spawnToken(g, r.x, r.z, true); } }
    }
    if (r.hp <= 0) killRat(g, r, src);
  }

  function killRat(g, r, src) {
    if (r.dead) return;
    r.dead = true;
    for (let i = 0; i < r.carry; i++) returnBag(g, r.x + (g.rng() - 0.5) * 0.4, r.z, r.origin);
    r.carry = 0;
    g.stats.kills++;
    emit(g, 'death', { ratId: r.id, rat: r.type, x: r.x, z: r.z, src, size: r.size });
    if (r.type === 'boss') {
      g.boss.alive = false; g.boss.dead = true;
      for (let i = 0; i < C.TOKENS.bossBurst; i++) spawnToken(g, r.x, r.z, true, i / C.TOKENS.bossBurst * Math.PI * 2);
      emit(g, 'bossDeath', { x: r.x, z: r.z });
    } else if (g.rng() < C.TOKENS.onDeath) spawnToken(g, r.x, r.z, false);
  }

  function updateRats(g, dt) {
    for (const r of g.rats) if (!r.dead && !r.gone) updateRat(g, r, dt);
    if (g.rats.some(r => r.dead || r.gone)) g.rats = g.rats.filter(r => !r.dead && !r.gone);
  }

  // ---------------------------------------------------------------- tokens ---
  function spawnToken(g, x, z, force, angle) {
    if (!force && g.tokensNight >= C.TOKENS.cap) return null;
    g.tokensNight++; g.tokensTotal++;
    const burst = angle !== undefined;
    const tok = {
      id: g.ids++, x, z, y: 0.35, age: 0,
      vx: burst ? Math.cos(angle) * 2.4 : (g.rng() - 0.5) * 1.6,
      vz: burst ? Math.sin(angle) * 2.4 + 0.5 : 0.9 + g.rng() * 1.2,
      vy: burst ? 3.6 : 2.6 + g.rng() * 1.2,
    };
    if (z > C.BOARD.gutterZ - 0.4 && !burst) tok.vz = -0.3;
    g.tokens.push(tok);
    emit(g, 'tokenSpawn', { id: tok.id, x, z, first: !g.firstTokenSeen });
    g.firstTokenSeen = true;
    return tok;
  }

  function updateTokens(g, dt) {
    for (let i = g.tokens.length - 1; i >= 0; i--) {
      const k = g.tokens[i];
      k.age += dt;
      k.vy -= 9.5 * dt; k.y += k.vy * dt;
      if (k.y <= 0) { k.y = 0; k.vy = Math.abs(k.vy) > 0.6 ? -k.vy * 0.35 : 0; }
      k.x += k.vx * dt; k.z += k.vz * dt;
      k.vx *= Math.max(0, 1 - 1.4 * dt); k.vz *= Math.max(0, 1 - 0.5 * dt);
      if (k.z >= C.BOARD.gutterZ) { k.z = C.BOARD.gutterZ; k.vz = 0; }
      const lim = C.BOARD.halfW - 0.35;
      if (k.x > lim) { k.x = lim; k.vx = -Math.abs(k.vx) * 0.5; }
      if (k.x < -lim) { k.x = -lim; k.vx = Math.abs(k.vx) * 0.5; }
      if (k.age >= C.TOKENS.life) { emit(g, 'tokenLost', { id: k.id, x: k.x, z: k.z }); g.tokens.splice(i, 1); }
    }
  }

  // ----------------------------------------------------------------- phase ---
  function checkUnlocks(g) {
    for (const k of Object.keys(C.UNLOCKS)) {
      if (!g.unlocked[k] && g.night >= C.UNLOCKS[k]) { g.unlocked[k] = true; emit(g, 'unlock', { what: k, night: g.night }); }
    }
  }

  // bags on the pile plus bags already flying to it — the cap counts both
  function pilePlanned(g, pileIdx) {
    let n = g.piles[pileIdx].bags;
    for (const f of g.flying) if (f.to === 'pile' && f.pile === pileIdx && f.kind !== 'return') n++;
    return n;
  }

  function placeBagScatter(g) {
    if (g.hand <= 0) return;
    g.hand--;
    const pi = pickPileCapped(g), p = g.piles[pi];
    g.flying.push({ id: g.ids++, kind: 'place', to: 'pile', pile: pi, x0: C.HAND.x, z0: C.HAND.z, y0: 0, t: 0, dur: 0.3 + dist(C.HAND.x, C.HAND.z, p.x, p.z) * 0.04 });
  }

  function nightfall(g) {
    if (g.phase !== 'day') return false;
    const cfg = nightCfg(g);
    while (g.hand > 0) { placeBagScatter(g); }
    for (const f of g.flying) if (f.to === 'hand') { f.to = 'pile'; f.pile = pickPileCapped(g); delete f.tx; delete f.tz; }  // nothing rides out the night in your hands
    g.phase = 'night'; g.t = 0; g.nightLen = cfg.len;
    g.lostNight = 0; g.tokensNight = 0; g.grabsNight = 0;
    g.queue = buildQueue(g);
    if (cfg.boss) g.boss = { alive: false, dead: false, returnAt: -1, id: null };
    emit(g, 'nightfall', { night: g.night, size: waveSize(g), boss: !!cfg.boss, quiet: !!cfg.quiet, rattle: !!cfg.rattle, len: cfg.len });
    return true;
  }

  function endNight(g) {
    const cfg = nightCfg(g);
    for (const r of g.rats) { for (let i = 0; i < r.carry; i++) returnBag(g, r.x, r.z, r.origin); r.carry = 0; r.gone = true; }
    g.rats = [];
    for (const s of g.slots) {
      const t = s.tower; if (!t) continue;
      if (t.type === 'trap') { t.armed = true; t.cooldown = 0; }
      if (t.type === 'cat') { t.lunge = null; t.timer = 0; }
    }
    g.stats.nightsSurvived = g.night;
    emit(g, 'nightClear', { night: g.night, lost: g.lostNight, tokens: g.grabsNight, boss: !!cfg.boss, bossDead: !!(g.boss && g.boss.dead) });
    g.phase = 'dawn';
    g.dawn = cfg.boss ? { step: 'victory', timer: 2.2 } : { step: 'quiet', timer: C.TIMING.quietBeat };
  }

  function bank(g, bonus) {
    // The truck takes what's on the CURB. Binned bags are safe from rats and invisible
    // to the truck alike — wealth that never risked the night is worth nothing (fun pass #2).
    let total = 0;
    for (const p of g.piles) { total += p.bags; p.bags = 0; }
    for (const f of g.flying) if (f.to !== 'hand') total++;   // curb-bound bags mid-air count
    g.flying = g.flying.filter(f => f.to === 'hand');
    total += g.hand; g.hand = 0;                              // nightfall scatters the hand, so this is 0 except in edge cases
    total += bonus || 0;
    g.score += total;
    g.stats.banked.push(total);
    emit(g, 'bank', { amount: total, score: g.score, night: g.night, bonus: bonus || 0, leftBin: binned(g) });
    return total;
  }

  function startStorm(g) {
    if (g.phase === 'storm' || g.phase === 'over') return;
    g.phase = 'storm'; g.stormT = C.TIMING.stormDur;
    emit(g, 'storm', {});
  }

  function finish(g, result) {
    g.phase = 'over'; g.result = result;
    emit(g, 'over', { result, score: g.score, night: g.night, tokens: g.tokensGrabbed, tokensTotal: g.tokensTotal });
  }

  function updateDawn(g, dt) {
    const d = g.dawn, T = C.TIMING;
    d.timer -= dt;
    if (d.timer > 0) return;
    switch (d.step) {
      case 'quiet':
        if (C.TRUCK_NIGHTS.includes(g.night)) { bank(g, 0); d.step = 'truck'; d.timer = T.truckDur; }
        else { landBags(g, C.ECON.dawnBags, 0.2); d.step = 'land'; d.timer = T.bagsLand + 0.5; }
        break;
      case 'truck':
        landBags(g, C.ECON.dawnBags, 0.2); d.step = 'land'; d.timer = T.bagsLand + 0.5;
        break;
      case 'land':
        g.night++; g.phase = 'day'; g.dawn = null;
        checkUnlocks(g);
        emit(g, 'day', { night: g.night });
        break;
      case 'victory':
        bank(g, C.VICTORY_BONUS);
        finish(g, 'victory');
        break;
    }
  }

  function updateNight(g, dt) {
    g.t += dt;
    while (g.queue.length && g.queue[0].at <= g.t) { const q = g.queue.shift(); spawnRat(g, q.type, q.spawn); }
    const cfg = nightCfg(g);
    if (cfg.boss && g.boss && !g.boss.alive && !g.boss.dead && g.boss.returnAt >= 0 && g.t >= g.boss.returnAt) {
      const spawns = activeSpawns(g);
      spawnRat(g, 'boss', spawns[Math.floor(g.rng() * spawns.length)]);
      g.boss.returnAt = -1;
    }
    updateTowers(g, dt);
    updateRats(g, dt);
    if (g.phase !== 'night') return; // a storm may have started
    if (cfg.boss) {
      if (g.boss.dead || g.t >= g.nightLen) endNight(g);
    } else if (g.t >= g.nightLen && g.queue.length === 0 && g.rats.length === 0) endNight(g);
    else if (g.t >= g.nightLen + C.TIMING.resolveCap) endNight(g);
  }

  function update(g, dt) {
    if (g.phase === 'night') updateNight(g, dt);
    else if (g.phase === 'dawn') updateDawn(g, dt);
    else if (g.phase === 'storm') { g.stormT -= dt; if (g.stormT <= 0) finish(g, 'storm'); }
    updateTokens(g, dt);
    updateFlying(g, dt);
  }

  // ----------------------------------------------------------------- input ---
  function hitSlot(g, x, z) {
    let best = null, bd = C.TAP.slot;
    for (const s of g.slots) { const d = dist(s.x, s.z, x, z); if (d < bd) { bd = d; best = s; } }
    return best;
  }
  function hitPile(g, x, z) {
    let best = null, bd = C.TAP.pile;
    for (const p of g.piles) { const d = dist(p.x, p.z, x, z); if (d < bd) { bd = d; best = p; } }
    return best;
  }
  function hitToken(g, x, z) {
    let best = null, bd = C.TOKENS.tapRadius;
    for (const k of g.tokens) { const d = dist(k.x, k.z, x, z); if (d < bd) { bd = d; best = k; } }
    return best;
  }

  function tapDay(g, x, z) {
    const slot = hitSlot(g, x, z);
    if (slot) {
      if (slot.tower && slot.tower.type === 'bin' && slot.tower.bags > 0 && unload(g, slot.id)) return { kind: 'unload', slot };
      return { kind: 'slot', slot };
    }
    const pile = hitPile(g, x, z);
    if (pile) {
      if (g.hand > 0 && placeBag(g, pile.idx)) return { kind: 'placeBag', pile };
      return { kind: stash(g, pile.idx) ? 'stash' : 'pile', pile };
    }
    if (g.hand > 0) { const near = nearestPileTo(g, x, z); if (near >= 0 && placeBag(g, near)) return { kind: 'placeBag', pile: g.piles[near] }; }
    return null;
  }

  function nearestPileTo(g, x, z) {
    let best = -1, bd = 1.9;
    for (const p of g.piles) { const d = dist(x, z, p.x, p.z); if (d < bd) { bd = d; best = p.idx; } }
    return best;
  }

  function tapNight(g, x, z) {
    const tok = hitToken(g, x, z);
    if (tok) {
      g.tokens.splice(g.tokens.indexOf(tok), 1);
      g.tokensGrabbed++; g.grabsNight++;
      emit(g, 'tokenGrab', { id: tok.id, x: tok.x, z: tok.z, step: g.grabsNight - 1, grabbed: g.tokensGrabbed, total: g.tokensTotal });
      return { kind: 'token' };
    }
    let dragger = null, dd = C.RECOVER.radius;
    for (const r of g.rats) {
      if (r.state !== 'drag' || r.carry <= 0 || r.type === 'boss') continue;
      const d = dist(x, z, r.x, r.z);
      if (d < dd) { dd = d; dragger = r; }
    }
    if (dragger) {
      for (let i = 0; i < dragger.carry; i++) returnBag(g, dragger.x, dragger.z, dragger.origin);
      const dropped = dragger.carry;
      dragger.carry = 0; dragger.state = 'flee';
      g.stats.recovers++;
      emit(g, 'recover', { ratId: dragger.id, rat: dragger.type, bags: dropped, x: dragger.x, z: dragger.z });
      return { kind: 'recover' };
    }
    const slot = hitSlot(g, x, z);
    if (slot && slot.tower && slot.tower.type === 'trap' && !slot.tower.armed) return { kind: 'rearm', ok: rearm(g, slot.id), slot };
    return null;
  }

  return {
    createGame, startRun, update, nightfall,
    place, upgrade, sell, stash, unload, rearm, slotOptions, placeBag,
    tapDay, tapNight, hitSlot, hitPile, hitToken,
    preview, waveSize, liquidBags, spendable, binned, canAfford, nextTruckIn, nearestPileIdx, handCount,
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = { Sim };
