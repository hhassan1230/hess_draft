/* ============================================================================
   RAT CITY — src/ui.js
   DOM layer: HUD bands, the day panel (wave preview = the greed decision,
   staring at you), the radial slot menu, alerts, teach lines, cards.
   Text lives in DOM because text in DOM is crisp, cheap, and accessible.
   ========================================================================== */

const UI = (() => {
  const C = CONFIG;
  const $ = id => document.getElementById(id);
  let els = {};
  let alertQueue = [], alertT = 0;
  let scoreShown = 0, scoreTarget = 0, scoreTick = 0, scoreStep = 0.1;
  let lastPreview = '', teachTrashShown = false, teachTapShown = false, teachT = 0;
  let radialSlot = null;
let bestScore = 0, taughtTrash = false, binNoteShown = false, pileFullShown = false;
  let onAction = null;   // Main injects: (action, slotId, type) => void

  function init(hooks) {
    onAction = hooks.onAction;
    ['hud-top', 'hud-bottom', 'n-night', 'n-truck', 'infest-fill', 'infest-pct', 'infest-label', 'graffiti', 'alert', 'teach',
     'day-panel', 'unlock', 'preview-rats', 'preview-text', 'btn-nightfall', 'n-bags', 'n-binned', 'n-tokens', 'n-score',
     'btn-pause', 'radial', 'ripples', 'flash', 'overlay', 'stage'].forEach(id => els[id] = $(id));
    els['btn-nightfall'].addEventListener('pointerdown', e => { e.preventDefault(); hooks.onNightfall(); });
    els['btn-pause'].addEventListener('pointerdown', e => { e.preventDefault(); hooks.onPause(); });
  }

  // ------------------------------------------------------------ overlays ---
  function showTitle() {
    els.overlay.className = 'show title';
    els.overlay.innerHTML = `
      <div class="card">
        <div class="eyebrow">made in brooklyn</div>
        <h1>RAT<br>CITY</h1>
        <p class="tag">${COPY.title}</p>
        <p class="cta">tap to start</p>
      </div>`;
  }
  function showPause(muted) {
    els.overlay.className = 'show pause';
    els.overlay.innerHTML = `
      <div class="card">
        <h2>paused</h2>
        <button class="big" data-act="resume">resume</button>
        <button class="big" data-act="mute">sound ${muted ? 'off' : 'on'}</button>
        <button class="big ghost" data-act="restart">restart</button>
      </div>`;
  }
  function showScore(g) {
    const win = g.result === 'victory';
    const newBest = g.score > bestScore;
    bestScore = Math.max(bestScore, g.score);
    const leftBin = Sim.binned(g);
    els.overlay.className = 'show score' + (win ? ' win' : ' loss');
    els.overlay.innerHTML = `
      <div class="card">
        <div class="eyebrow">${win ? 'night 10 survived' : COPY.storm.toLowerCase() + ' · night ' + g.night}</div>
        <h2>${win ? COPY.victory : COPY.loss}</h2>
        <div class="score-big"><span class="lbl">banked</span><span class="num">${g.score}</span><span class="lbl">bags</span></div>
        <div class="score-row"><span>${newBest && bestScore > 0 ? 'new best' : 'best'}</span><span class="mono">${bestScore}</span></div>
        ${leftBin > 0 ? `<div class="score-row"><span>${COPY.binLeft}</span><span class="mono">${leftBin}</span></div>` : ''}
        <div class="score-row"><span>tokens</span><span class="mono">${g.tokensGrabbed}/${g.tokensTotal}</span></div>
        <p class="tokens-line">${COPY.tokens}</p>
        <div class="score-row small"><span>rats swatted</span><span class="mono">${g.stats.kills}</span></div>
        <div class="score-row small"><span>bags lost</span><span class="mono">${g.lostTotal}</span></div>
        <button class="big" data-act="restart">${COPY.restart}</button>
      </div>`;
  }
  function hideOverlay() { els.overlay.className = ''; els.overlay.innerHTML = ''; }

  // --------------------------------------------------------------- radial ---
  function openRadial(g, slot) {
    radialSlot = slot;
    const opts = Sim.slotOptions(g, slot);
    const p = Render.project(slot.x, 0.3, slot.z);
    const r = els.radial;
    r.className = ''; r.innerHTML = '';
    r.style.left = p.sx + 'px'; r.style.top = p.sy + 'px';
    const n = opts.length;
    const angles = n === 1 ? [-90] : n === 2 ? [-135, -45] : [-150, -90, -30];
    opts.forEach((o, i) => {
      const a = angles[i] * Math.PI / 180, R = 74;
      const b = document.createElement('button');
      b.setAttribute('data-ui', '1');
      b.className = 'rbtn' + (o.ok ? '' : ' off') + (o.maxed ? ' maxed' : '');
      if (o.action === 'place') b.innerHTML = `<span class="rname">${o.type}</span><span class="rcost">${o.cost} bag${o.cost > 1 ? 's' : ''}</span>`;
      else if (o.action === 'upgrade') b.innerHTML = o.maxed ? `<span class="rname">max</span>` : `<span class="rname">upgrade</span><span class="rcost">${o.cost} bags</span>`;
      else b.innerHTML = `<span class="rname">sell</span><span class="rcost">+${o.refund}</span>`;
      b.style.left = Math.cos(a) * R + 'px'; b.style.top = Math.sin(a) * R + 'px';
      b.style.animationDelay = (i * 0.03) + 's';
      b.addEventListener('pointerdown', e => {
        e.preventDefault(); e.stopPropagation();
        if (!o.ok || o.maxed) { b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 300); Audio.sfx.denied(); return; }
        onAction(o.action, slot.id, o.type);
        closeRadial();
      });
      r.appendChild(b);
    });
    // slot label under the ring so the furniture names read
    const lbl = document.createElement('div'); lbl.className = 'rlabel'; lbl.textContent = slot.tower ? (slot.tower.name || slot.tower.type + (slot.tower.level === 2 ? ' L2' : '')) : slot.label; r.appendChild(lbl);
  }
  function closeRadial() { radialSlot = null; els.radial.className = 'hidden'; els.radial.innerHTML = ''; }
  const isRadialOpen = () => !!radialSlot;

  // --------------------------------------------------------------- alerts ---
  function alert(text, cls) { alertQueue.push({ text, cls: cls || '' }); }
  function ripple(sx, sy) {
    const d = document.createElement('div'); d.className = 'ripple'; d.style.left = sx + 'px'; d.style.top = sy + 'px';
    els.ripples.appendChild(d); setTimeout(() => d.remove(), 420);
  }
  function flash(cls, ms) { els.flash.className = cls; if (ms) setTimeout(() => { if (els.flash.className === cls) els.flash.className = ''; }, ms); }
  function teach(text, sx, sy) {
    const t = els.teach; t.textContent = text; t.className = 'show';
    if (sx !== undefined) { t.style.left = sx + 'px'; t.style.top = (sy - 44) + 'px'; t.classList.add('at'); } else { t.style.left = ''; t.style.top = ''; }
    teachT = 2.2;
  }

  function handleEvent(ev, g) {
    switch (ev.type) {
      case 'run': hideOverlay(); closeRadial(); scoreShown = 0; scoreTarget = 0; lastPreview = ''; teachTrashShown = false; teachTapShown = false; taughtTrash = false; binNoteShown = false; pileFullShown = false; els.graffiti.className = 'hidden'; els.flash.className = ''; alertQueue = []; break;
      case 'day': if (ev.night === 1 && !teachTrashShown) { teachTrashShown = true; setTimeout(() => teach(COPY.teachPlace), 1400); } break;
      case 'unlock': if (ev.night > 1) { els.unlock.textContent = ev.what + ' unlocked'; els.unlock.className = 'pulse'; setTimeout(() => els.unlock.className = '', 4000); } break;
      case 'nightfall': closeRadial(); if (ev.rattle) alert('something under the street.', 'quiet'); if (ev.boss) alert('PIZZA RAT', 'boss'); if (ev.quiet) alert('too quiet.', 'quiet'); break;
      case 'grab': flash('theft', 140); break;
      case 'escape': alert(ev.name ? COPY.theft(ev.name) : COPY.theftNoCat, 'theft'); break;
      case 'nearMiss': alert(COPY.nearMiss(ev.name), 'good'); break;
      case 'recover': alert(COPY.recovered, 'good'); break;
      case 'pileFull': if (!pileFullShown) { pileFullShown = true; teach(COPY.pileFull); } Audio.sfx.denied(); break;
      case 'stash': if (!binNoteShown) { binNoteShown = true; alert(COPY.binNote, 'quiet'); } break;
      case 'marked': els.graffiti.textContent = COPY.marked; els.graffiti.className = 'slam'; flash('theft', 260); break;
      case 'nightClear': alert(ev.lost ? `night ${ev.night} · ${ev.lost} bag${ev.lost > 1 ? 's' : ''} lost` : `night ${ev.night} · nothing lost`, ev.lost ? 'theft' : 'good'); break;
      case 'bank': scoreTarget = ev.score; scoreStep = Math.max(0.035, C.TIMING.truckDur * 0.55 / Math.max(1, ev.amount)); scoreTick = ev.bonus ? 0.2 : 0.9; alert(ev.bonus ? `+${ev.amount} banked` : `${COPY.truck} · +${ev.amount} banked`, 'bank'); break;
      case 'tokenSpawn': if (ev.first && !teachTapShown) { teachTapShown = true; const p = Render.project(ev.x, 0.3, ev.z); teach(COPY.teachTap, p.sx, p.sy); } break;
      case 'bossEnter': if (ev.returning) alert('he came back.', 'boss'); break;
      case 'bossEnrage': alert('ENRAGED', 'boss'); break;
      case 'bossDeath': alert('the slice is gone.', 'good'); break;
      case 'storm': flash('storm'); els['day-panel'].className = 'hidden'; closeRadial(); break;
      case 'over': setTimeout(() => showScore(g), ev.result === 'victory' ? 900 : 400); break;
    }
  }

  // ---------------------------------------------------------------- sync ---
  function previewHTML(pv) {
    if (pv.boss) {
      const n = pv.size;
      return { rats: `<span class="rat boss"></span>` + (n ? `<span class="plus">+${n}</span>` : ''), text: `PIZZA RAT tonight${n ? ` · +${n} scout${n > 1 ? 's' : ''} for your trash` : ''}${pv.marked ? ' · MARKED' : ''}` };
    }
    const n = pv.size, cap = 24, own = pv.extra;
    let s = '';
    for (let i = 0; i < Math.min(n, cap); i++) s += `<span class="rat${i >= n - own ? ' own' : ''}"></span>`;
    if (n > cap) s += `<span class="plus">+${n - cap}</span>`;
    let text = `${n} rat${n !== 1 ? 's' : ''} tonight`;
    if (own > 0) text += ` · <b>+${own}</b> for your trash`;
    if (pv.marked) text += ' · <b class="red">MARKED +25%</b>';
    if (pv.truckAfterThis) text += ' · <b>truck at dawn</b>';
    return { rats: s, text };
  }

  function sync(g, dt) {
    // HUD numbers
    els['n-night'].textContent = g.night || 1;
    const ti = Sim.nextTruckIn(g);
    els['n-truck'].textContent = g.night === 10 ? 'last night' : ti === 1 ? 'at dawn' : `in ${ti}`;
    const pct = Math.round(g.infestation);
    els['infest-fill'].style.width = pct + '%';
    els['infest-pct'].textContent = pct + '%';
    els['infest-label'].textContent = g.marked ? 'MARKED' : 'infestation';
    els['hud-top'].className = g.marked ? 'marked' : '';
    els['n-bags'].textContent = Sim.liquidBags(g);
    const bn = Sim.binned(g);
    els['n-binned'].textContent = bn ? `· ${bn} binned` : '';
    els['n-tokens'].textContent = `${g.tokensGrabbed}/${g.tokensTotal}`;
    // score ticks digit by digit during the truck
    if (scoreShown < scoreTarget) { scoreTick -= dt; if (scoreTick <= 0) { scoreShown++; scoreTick = scoreStep; Audio.sfx.tally(); } }
    els['n-score'].textContent = scoreShown;
    // day panel
    const day = g.phase === 'day';
    els['day-panel'].className = day ? '' : 'hidden';
    if (day) {
      const nfLabel = g.hand > 0 ? `DROP YOUR TRASH · ${g.hand}` : 'NIGHTFALL';
      if (els['btn-nightfall'].textContent !== nfLabel) els['btn-nightfall'].textContent = nfLabel;
      const pv = Sim.preview(g);
      if (!taughtTrash && pv.extra > 0) { taughtTrash = true; teach(COPY.teachTrash); }
      const html = previewHTML(pv);
      const key = html.rats + html.text;
      if (key !== lastPreview) { lastPreview = key; els['preview-rats'].innerHTML = html.rats; els['preview-text'].innerHTML = html.text; els['preview-rats'].classList.remove('grow'); void els['preview-rats'].offsetWidth; els['preview-rats'].classList.add('grow'); }
    }
    // alerts
    if (alertT > 0) { alertT -= dt; if (alertT <= 0) els.alert.className = ''; }
    else if (alertQueue.length) { const a = alertQueue.shift(); els.alert.textContent = a.text; els.alert.className = 'show ' + a.cls; alertT = 1.7; }
    if (teachT > 0) { teachT -= dt; if (teachT <= 0) els.teach.className = ''; }
  }

  return { init, showTitle, showPause, showScore, hideOverlay, openRadial, closeRadial, isRadialOpen, alert, ripple, flash, teach, handleEvent, sync };
})();
