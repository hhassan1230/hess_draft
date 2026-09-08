/* ============================================================================
   RAT CITY — src/main.js
   Boot, portrait letterbox, taps-only input, fixed-timestep loop. The sim runs
   at 60Hz decoupled from render; render draws whatever state exists. Events
   fan out to Render / Audio / UI after each batch of sim steps.
   ========================================================================== */

const Main = (() => {
  const C = CONFIG;
  const W = C.VIEW.W, H = C.VIEW.H, STEP = 1 / C.SIM_HZ;
  let g, stage, scale = 1, last = 0, acc = 0, paused = false, freezeFrames = 0, started = false, nudged = false, handNudgeNight = -1;

  function fit() {
    scale = Math.min(window.innerWidth / W, window.innerHeight / H);
    stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  // ---- diagnostics: errors print on the stage (phones have no console); ?debug adds a readout ----
  function showErr(msg) {
    let e = document.getElementById('err');
    if (!e) { e = document.createElement('div'); e.id = 'err'; (stage || document.body).appendChild(e); }
    e.textContent = msg;
  }
  window.addEventListener('error', e => showErr('ERR: ' + e.message + (e.lineno ? ' @' + e.lineno : '')));
  window.addEventListener('unhandledrejection', e => showErr('ERR: ' + String(e.reason)));
  const DEBUG = typeof location !== 'undefined' && /debug/.test(location.search);
  let dbgEl = null, fpsAcc = 0, fpsN = 0, fps = 0;
  function debugReadout(dt) {
    if (!DEBUG) return;
    if (!dbgEl) { dbgEl = document.createElement('div'); dbgEl.id = 'dbg'; stage.appendChild(dbgEl); }
    fpsAcc += dt; fpsN++; if (fpsAcc >= 0.5) { fps = Math.round(fpsN / fpsAcc); fpsAcc = 0; fpsN = 0; }
    const st = Render.stats();
    dbgEl.textContent = `${g.phase} n${g.night} t${(g.t || 0).toFixed(1)} rats${g.rats.length} tok${g.tokens.length} q${g.queue ? g.queue.length : 0} liq${Sim.liquidBags(g)} calls${st.calls} tri${st.triangles} ${fps}fps`;
  }

  function boot() {
    stage = document.getElementById('stage');
    fit(); window.addEventListener('resize', fit);
    Render.init(document.getElementById('gl'));
    UI.init({ onAction, onNightfall, onPause });
    g = Sim.createGame();
    UI.showTitle();
    stage.addEventListener('pointerdown', onPointer, { passive: false });
    stage.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('visibilitychange', () => { if (document.hidden && started && g.phase === 'night' && !paused) setPaused(true); else if (!document.hidden) Audio.resume(); });
    requestAnimationFrame(loop);
  }

  function startRun() {
    Sim.startRun(g);
    paused = false; freezeFrames = 0; acc = 0; nudged = false; handNudgeNight = -1;
    UI.hideOverlay();
    started = true;
  }

  // ---------------------------------------------------------------- input ---
  function stageXY(e) {
    const r = stage.getBoundingClientRect();
    return { sx: (e.clientX - r.left) / scale, sy: (e.clientY - r.top) / scale };
  }

  function onPointer(e) {
    e.preventDefault();
    Audio.ensure(); Audio.resume();
    const { sx, sy } = stageXY(e);
    const ui = e.target.closest && e.target.closest('[data-ui]');
    // overlay cards
    if (g.phase === 'title') { UI.ripple(sx, sy); Audio.sfx.tick(); startRun(); return; }
    if (paused) { const act = e.target.closest && e.target.closest('[data-act]'); if (act) onOverlayAct(act.getAttribute('data-act')); return; }
    if (g.phase === 'over') { const act = e.target.closest && e.target.closest('[data-act]'); if (act) onOverlayAct(act.getAttribute('data-act')); return; }
    if (ui) return; // HUD buttons and radial handle themselves
    UI.ripple(sx, sy); Audio.sfx.tick();
    const w = Render.unproject(sx, sy);
    if (!w) return;
    if (g.phase === 'day') {
      const r = Sim.tapDay(g, w.x, w.z);
      if (r && r.kind === 'slot') UI.openRadial(g, r.slot);
      else UI.closeRadial();
    } else if (g.phase === 'night') {
      Sim.tapNight(g, w.x, w.z);
    }
    dispatch();
  }

  function onAction(action, slotId, type) {
    if (action === 'place') Sim.place(g, slotId, type);
    else if (action === 'upgrade') Sim.upgrade(g, slotId);
    else if (action === 'sell') Sim.sell(g, slotId);
    dispatch();
  }
  function onNightfall() {
    if (g.phase !== 'day') return;
    UI.closeRadial();
    // bags still in hand: one nudge per day, then the second press scatters them and starts the night
    if (g.hand > 0 && handNudgeNight !== g.night) { handNudgeNight = g.night; UI.teach(COPY.teachDropFirst); Audio.sfx.denied(); return; }
    // night-1 nudge, once: an empty board with a cat in the budget gets one hint, then we respect the player
    if (g.night === 1 && !nudged && !g.slots.some(s => s.tower) && Sim.canAfford(g, C.TOWERS.cat.cost)) { nudged = true; UI.teach(COPY.teachCat); Audio.sfx.denied(); return; }
    Sim.nightfall(g); dispatch();
  }
  function onPause() { if (!started || g.phase === 'over' || g.phase === 'title') return; setPaused(!paused); }
  function setPaused(p) { paused = p; if (p) UI.showPause(Audio.isMuted()); else UI.hideOverlay(); }
  function onOverlayAct(act) {
    if (act === 'resume') setPaused(false);
    else if (act === 'mute') { Audio.setMuted(!Audio.isMuted()); UI.showPause(Audio.isMuted()); }
    else if (act === 'restart') startRun();
  }

  // ----------------------------------------------------------------- loop ---
  function dispatch() {
    if (!g.events.length) return;
    const evs = g.events.splice(0);
    for (const ev of evs) {
      Render.handleEvent(ev, g); Audio.handleEvent(ev, g); UI.handleEvent(ev, g);
      if (ev.type === 'snap') freezeFrames = 2;                                  // 2-frame freeze on SNAP (GDD §8)
      if (ev.type === 'grab' && navigator.vibrate) navigator.vibrate(50);       // theft
      if (ev.type === 'recover' && navigator.vibrate) navigator.vibrate(30);    // snatched it back
      if (ev.type === 'marked' && navigator.vibrate) navigator.vibrate(100);    // MARKED
      if (ev.type === 'bossEnter' && navigator.vibrate) navigator.vibrate([60, 40, 60]);
      if (ev.type === 'over') paused = false;
    }
  }

  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min(0.1, (now - (last || now)) / 1000); last = now;
    if (!paused) {
      if (freezeFrames > 0) { freezeFrames--; acc = 0; }
      else {
        acc += dt;
        let n = 0;
        while (acc >= STEP && n < 6) { Sim.update(g, STEP); acc -= STEP; n++; }
        dispatch();
      }
      Audio.update(dt, g);
    }
    Render.sync(g, paused ? 0 : dt, now / 1000);
    UI.sync(g, paused ? 0 : dt);
    Render.draw();
    debugReadout(dt);
  }

  return { boot, startRun };
})();

window.addEventListener('DOMContentLoaded', Main.boot);
