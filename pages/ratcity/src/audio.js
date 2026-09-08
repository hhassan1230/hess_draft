/* ============================================================================
   RAT CITY — src/audio.js
   All procedural Web Audio. Zero audio files (GDD §10). The context unlocks on
   the first user tap (mobile autoplay rule). One signature sound per rarity
   tier: if everything dings, nothing dings.
   ========================================================================== */

const Audio = (() => {
  const C = CONFIG;
  let ctx = null, master = null, humGain = null, purrGain = null, noiseBuf = null;
  let muted = false, ready = false, mode = 'day', bossTimer = 0, bossNote = 0, pigeonTimer = 6;
  const SEMI = 1.059463094359;

  function ensure() {
    if (ready) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = muted ? 0 : 0.9; master.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    startHum();
    ready = true;
    return true;
  }
  function resume() { if (ctx && ctx.state === 'suspended') ctx.resume(); }

  // --- ambient beds ----------------------------------------------------------
  function startHum() {
    // city hum: bandpassed noise + a 55Hz "traffic" sine with a slow wobble
    humGain = ctx.createGain(); humGain.gain.value = 0.0; humGain.connect(master);
    const n = ctx.createBufferSource(); n.buffer = noiseBuf; n.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 190; bp.Q.value = 0.8;
    const ng = ctx.createGain(); ng.gain.value = 0.06;
    n.connect(bp); bp.connect(ng); ng.connect(humGain); n.start();
    const s = ctx.createOscillator(); s.type = 'sine'; s.frequency.value = 55;
    const sg = ctx.createGain(); sg.gain.value = 0.05;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.13; const lg = ctx.createGain(); lg.gain.value = 0.025;
    lfo.connect(lg); lg.connect(sg.gain); lfo.start();
    s.connect(sg); sg.connect(humGain); s.start();
    // night-9 purr: low sawtooth with a 24Hz tremolo, normally silent
    purrGain = ctx.createGain(); purrGain.gain.value = 0; purrGain.connect(master);
    const p = ctx.createOscillator(); p.type = 'sawtooth'; p.frequency.value = 42;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 220;
    const trem = ctx.createOscillator(); trem.frequency.value = 24; const tg = ctx.createGain(); tg.gain.value = 0.5;
    const pg = ctx.createGain(); pg.gain.value = 0.5;
    trem.connect(tg); tg.connect(pg.gain); trem.start();
    p.connect(lp); lp.connect(pg); pg.connect(purrGain); p.start();
    humGain.gain.setTargetAtTime(1.0, ctx.currentTime, 1.5);
  }

  function setMode(m, opts) {
    mode = m;
    if (!ready) return;
    const t = ctx.currentTime;
    if (m === 'day') { humGain.gain.setTargetAtTime(1.0, t, 0.8); purrGain.gain.setTargetAtTime(0, t, 0.5); }
    else if (m === 'night') {
      // hum ducks -8dB into 3s of near-silence, then the wave (GDD §10)
      humGain.gain.cancelScheduledValues(t); humGain.gain.setTargetAtTime(opts && opts.quiet ? 0.12 : 0.4, t, 0.25);
      purrGain.gain.setTargetAtTime(opts && opts.quiet ? 0.09 : 0, t, 1.0);
    } else if (m === 'storm') { humGain.gain.setTargetAtTime(0, t, 0.4); purrGain.gain.setTargetAtTime(0, t, 0.2); }
  }

  // --- one-shot voices -------------------------------------------------------
  function tone(type, f0, f1, dur, gain, opts) {
    if (!ready || muted) return;
    const t = ctx.currentTime + (opts && opts.delay || 0);
    const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t);
    if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + (opts && opts.attack || 0.006));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = o;
    if (opts && opts.lp) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = opts.lp; o.connect(f); node = f; }
    node.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function noise(dur, gain, filt, freq, opts) {
    if (!ready || muted) return;
    const t = ctx.currentTime + (opts && opts.delay || 0);
    const n = ctx.createBufferSource(); n.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = filt || 'highpass'; f.frequency.value = freq || 2000; f.Q.value = opts && opts.q || 1;
    const g = ctx.createGain(); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    n.connect(f); f.connect(g); g.connect(master); n.start(t); n.stop(t + dur + 0.02);
  }

  const sfx = {
    tick() { tone('square', 1800, 1200, 0.03, 0.05); },
    swat() { tone('sine', 320, 70, 0.11, 0.5); tone('sine', 95, 42, 0.13, 0.4); noise(0.05, 0.14, 'bandpass', 900); },
    snap() { noise(0.06, 0.5, 'highpass', 1500); tone('square', 1300, 300, 0.05, 0.25, { delay: 0.01 }); tone('sine', 120, 50, 0.16, 0.4, { delay: 0.02 }); },
    squeak() { tone('sawtooth', 2400 + Math.random() * 900, 3400 + Math.random() * 600, 0.07, 0.05, { lp: 5000 }); },
    grab() { tone('square', 660, 660, 0.08, 0.16); tone('square', 880, 880, 0.08, 0.16, { delay: 0.09 }); tone('square', 660, 660, 0.08, 0.16, { delay: 0.18 }); },
    alarm() { for (let i = 0; i < 3; i++) { tone('square', i % 2 ? 880 : 660, 0, 0.09, 0.3, { delay: i * 0.1 }); } noise(0.3, 0.16, 'bandpass', 1400, { delay: 0.05 }); },
    ding(step) {
      const semis = C.TOKENS.scale[Math.min(step, C.TOKENS.scale.length - 1)] + (step >= C.TOKENS.scale.length ? 12 * Math.floor(step / C.TOKENS.scale.length) : 0);
      const f = 523.25 * Math.pow(SEMI, semis);
      tone('sine', f, f, 0.28, 0.32, { attack: 0.004 }); tone('sine', f * 2, f * 2, 0.16, 0.12); tone('triangle', f * 3.01, f * 3, 0.1, 0.06);
    },
    lost() { tone('sine', 300, 180, 0.12, 0.05); },
    horn() { tone('sawtooth', 110, 108, 0.7, 0.28, { lp: 900, attack: 0.03 }); tone('sawtooth', 165, 162, 0.7, 0.2, { lp: 900, attack: 0.03 }); },
    tally() { tone('square', 1500, 1500, 0.025, 0.07); },
    place() { tone('sine', 240, 400, 0.12, 0.25); noise(0.08, 0.15, 'lowpass', 600); },
    upgrade() { tone('sine', 400, 600, 0.12, 0.2); tone('sine', 600, 900, 0.16, 0.2, { delay: 0.1 }); },
    sell() { tone('sine', 500, 250, 0.14, 0.18); },
    stash() { noise(0.08, 0.25, 'lowpass', 900); tone('sine', 180, 90, 0.12, 0.3); },
    unload() { tone('sine', 140, 260, 0.1, 0.22); },
    rearm() { noise(0.04, 0.3, 'highpass', 3000); tone('square', 900, 1400, 0.05, 0.15); },
    denied() { tone('square', 200, 160, 0.12, 0.12); },
    marked() { tone('sine', 90, 35, 0.5, 0.7); noise(0.45, 0.35, 'lowpass', 500); noise(0.2, 0.25, 'highpass', 2500, { delay: 0.05 }); },
    nightfall() { tone('sine', 220, 110, 0.9, 0.12, { attack: 0.2 }); },
    dawn() { tone('sine', 330, 330, 0.5, 0.06, { attack: 0.2 }); tone('sine', 495, 495, 0.6, 0.05, { attack: 0.3, delay: 0.15 }); },
    recover() { noise(0.05, 0.35, 'highpass', 2500); tone('sine', 700, 220, 0.14, 0.32, { delay: 0.02 }); tone('sine', 110, 55, 0.12, 0.35, { delay: 0.05 }); },
    dropBag() { tone('sine', 150, 65, 0.1, 0.28); noise(0.05, 0.12, 'lowpass', 700); },
    catch() { tone('sine', 500, 900, 0.18, 0.3); tone('sine', 900, 1200, 0.2, 0.2, { delay: 0.12 }); },
    bossEnter() { for (let i = 0; i < 4; i++) tone('sine', 55, 40, 0.28, 0.9, { delay: i * 0.3 }); noise(1.2, 0.2, 'lowpass', 300); },
    bossThump(hi) { tone('sine', hi ? 65 : 49, 30, 0.2, 0.8); noise(0.06, 0.15, 'lowpass', 400); },
    bossEnrage() { tone('sawtooth', 120, 400, 0.5, 0.3, { lp: 1200 }); noise(0.5, 0.3, 'bandpass', 900); },
    bossDeath() { for (let i = 0; i < 10; i++) tone('sine', 523 * Math.pow(SEMI, C.TOKENS.scale[i % 10]), 0, 0.2, 0.18, { delay: i * 0.06 }); noise(0.8, 0.4, 'lowpass', 700); },
    storm() { noise(2.4, 0.6, 'bandpass', 500, { q: 0.4 }); tone('sawtooth', 60, 25, 2.2, 0.5, { lp: 200, attack: 0.5 }); },
    victory() { [0, 4, 7, 12, 16].forEach((s, i) => tone('sine', 392 * Math.pow(SEMI, s), 0, 0.5, 0.22, { delay: i * 0.14 })); },
    pigeon() { tone('sine', 420, 300, 0.16, 0.05, { attack: 0.03 }); tone('sine', 400, 280, 0.2, 0.05, { attack: 0.03, delay: 0.19 }); },
  };

  function handleEvent(ev, g) {
    switch (ev.type) {
      case 'nightfall': setMode('night', { quiet: ev.quiet }); sfx.nightfall(); break;
      case 'nightClear': setMode('day'); sfx.dawn(); break;
      case 'spawn': if (ev.rat !== 'boss' && Math.random() < 0.35) sfx.squeak(); break;
      case 'swat': sfx.swat(); break;
      case 'snap': sfx.snap(); break;
      case 'grab': sfx.alarm(); break;
      case 'escape': sfx.lost(); break;
      case 'tokenGrab': sfx.ding(ev.step); break;
      case 'place': sfx.place(); break;
      case 'upgrade': sfx.upgrade(); break;
      case 'sell': sfx.sell(); break;
      case 'stash': sfx.stash(); break;
      case 'unload': sfx.unload(); break;
      case 'rearm': if (!ev.free) sfx.rearm(); else sfx.tick(); break;
      case 'denied': sfx.denied(); break;
      case 'marked': sfx.marked(); break;
      case 'bank': sfx.horn(); break;
      case 'nearMiss': sfx.catch(); break;
      case 'recover': sfx.recover(); break;
      case 'placeBag': sfx.dropBag(); break;
      case 'bossEnter': sfx.bossEnter(); bossTimer = 1.0; break;
      case 'bossEnrage': sfx.bossEnrage(); break;
      case 'bossDeath': sfx.bossDeath(); break;
      case 'storm': setMode('storm'); sfx.storm(); break;
      case 'over': if (ev.result === 'victory') sfx.victory(); break;
    }
  }

  // called every frame: boss bass pulse tempo tied to boss HP; occasional day pigeon
  function update(dt, g) {
    if (!ready || muted) return;
    if (g.phase === 'night' && g.boss && g.boss.alive) {
      const b = g.rats.find(r => r.type === 'boss');
      const hp = b ? b.hp / b.maxHp : 1;
      bossTimer -= dt;
      if (bossTimer <= 0) { bossNote ^= 1; sfx.bossThump(bossNote === 1); bossTimer = 0.32 + 0.9 * hp; }
    }
    if (g.phase === 'day') { pigeonTimer -= dt; if (pigeonTimer <= 0) { sfx.pigeon(); pigeonTimer = 7 + Math.random() * 9; } }
  }

  function setMuted(m) { muted = m; if (master) master.gain.setTargetAtTime(m ? 0 : 0.9, ctx.currentTime, 0.05); }
  function isMuted() { return muted; }

  return { ensure, resume, handleEvent, update, setMode, setMuted, isMuted, sfx, isReady: () => ready };
})();
