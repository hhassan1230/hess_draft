// Entry point: picks mixed reality (Quest Browser) or the on-screen preview.
// URL options: ?night=N (start a given night), ?debug (test readout in the headset),
// ?judge (the judges' link: a winner may go straight on to the next night),
// ?test (preview steps only when driven by the test hooks; no menu backdrop unless ?attract), ?nopsx (no vertex snapping),
// ?pin (a spatial anchor keeps the scene on your real table when the headset recenters: js/pin.js).
// ?nojuice (the game feel of js/feel.js off, for comparing).
import { Renderer } from './renderer.js';
import { Audio } from './audio.js';
import { Game } from './game.js';
import { startXR, isARSupported } from './xr.js';
import { startPreview } from './preview.js';
import { startAttract } from './attract.js';
import { buildMenu, menuCamera, screenBox, TAG_SIZE, MENU } from './menu.js';
import { todayString, loadSave, menuProgress, unlockedNight } from './save.js';
import { BUILD } from './build.js';

const params = new URLSearchParams(location.search);
const debug = params.has('debug');
const test = params.has('test');
const judge = params.has('judge');
let night = parseInt(params.get('night'), 10) || null; // the judges' link can choose another on the menu
const feel = !params.has('nojuice');
const $ = (id) => document.getElementById(id);

function showError(msg) {
  const el = $('error');
  el.textContent = msg;
  el.hidden = false;
}
addEventListener('error', (e) => showError(`Error: ${e.message}`));
addEventListener('unhandledrejection', (e) => showError(`Error: ${(e.reason && e.reason.message) || e.reason}`));

const storage = (() => {
  try { localStorage.setItem('__nac', '1'); localStorage.removeItem('__nac'); return localStorage; } catch { return null; }
})();
const makeCanvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

const canvas = $('gl');
const gl = canvas.getContext('webgl2', { xrCompatible: true, antialias: true, alpha: true, premultipliedAlpha: true });
if (!gl) showError('This browser does not support WebGL2.');
const renderer = gl ? new Renderer(gl) : null;
const audio = new Audio();
const newGame = (mode) => new Game({ audio, storage, today: todayString(), makeCanvas, seed: (Math.random() * 1e9) | 0, night, mode, judge, feel });

window.__nac = { ready: false };

// The menu, written on the preview's living room (js/menu.js, drawn by js/attract.js): the title stitched on a
// sampler above the mantel, PLAY and PREVIEW on gift tags hung from it. The page's own buttons are laid,
// invisible, over the tags, so a tap on a tag is a real tap on the button. It starts once the menu is up, stops
// when either button is pressed, and starts again when you come back from mixed reality. If the written menu
// cannot be built, night 1 plays behind the plain menu as before; if the room cannot be drawn, the plain menu.
let attract = null, attractTimer = 0, menu = null, menuCam = null;
let judgeMark = null; // the judges' link: marks the night that is open (judgeNights)
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const TAG_BUTTONS = { enter: $('enter'), preview: $('preview') };
// While the written menu is on its way (the headset check, then the room), the plain menu stays hidden: it would
// flash, and a press on it would race the room. It shows if the written menu can't go up, and after 4 s regardless.
const wantRoom = !!renderer && !(test && !params.has('attract'));
const showPlain = () => document.body.classList.remove('menu-pending');
if (wantRoom) { document.body.classList.add('menu-pending'); setTimeout(showPlain, 4000); }
function stopAttract() {
  clearTimeout(attractTimer);
  attractTimer = 0;
  if (attract) { try { attract.stop(); } catch { /* the menu goes on without it */ } }
  document.body.classList.remove('attract', 'menu3d');
  showPlain();
  for (const b of Object.values(TAG_BUTTONS)) b.removeAttribute('style');
}
// Each drawn frame: the page buttons over their tags (a box round each tag's corners on screen).
function placeButtons(viewProj, w, h) {
  if (!menu) return;
  const cw = canvas.clientWidth || w, ch = canvas.clientHeight || h;
  for (const [id, b] of Object.entries(TAG_BUTTONS)) {
    const box = screenBox(menu.tags[id].node, TAG_SIZE.w, TAG_SIZE.h, viewProj, cw, ch);
    if (!box) { b.style.visibility = 'hidden'; continue; }
    b.style.visibility = '';
    b.style.left = `${box.left.toFixed(1)}px`; b.style.top = `${box.top.toFixed(1)}px`;
    b.style.width = `${box.width.toFixed(1)}px`; b.style.height = `${box.height.toFixed(1)}px`;
  }
}
function menuInfo() {
  const save = loadSave(storage);
  let framed = false;
  try { framed = window.top !== window; } catch { framed = true; }
  // The night PLAY starts: for a returning player (or a judge, who picks it under the menu) it says which.
  return { ar: window.__nac.ar ?? null, framed, nextNight: judge || save.best ? (night || unlockedNight(save, todayString())) : null };
}
// What a tap does changed (the headset check answered, a judge picked a night): the tags say so, and a still menu
// draws again.
function menuInfoChanged() {
  if (menu && menu.setInfo(menuInfo()) && attract && !attract.stopped && (attract.held || reduced())) attract.redraw();
}
function startBackdrop({ crane = true } = {}) {
  if (judgeMark) judgeMark(); // back from the headset: the night now open is the one marked (judges' link)
  if (!renderer || (test && !params.has('attract'))) return;
  clearTimeout(attractTimer);
  attractTimer = setTimeout(() => {
    attractTimer = 0;
    if (entering || document.body.classList.contains('previewing')) { showPlain(); return; } // a button was pressed first
    if (attract && !attract.stopped) { try { attract.stop(); } catch { /* never two backdrops at once */ } }
    const still = reduced();
    const opts = { canvas, renderer, makeCanvas, storage, seed: test ? 1 : (Math.random() * 1e9) | 0, manual: test, still, feel };
    try {
      document.body.classList.add('attract');
      try {
        if (!menu) menu = buildMenu({ makeCanvas });
        menu.reset();
        menu.setInfo(menuInfo());
        // What the pointer and keyboard are on now (a hover from before mixed reality is long gone).
        for (const [id, b] of Object.entries(TAG_BUTTONS)) menu.setState(id, { hover: b.matches(':hover'), focus: document.activeElement === b && b.matches(':focus-visible') });
        menuCam = menuCamera(menu, { crane: crane && !still });
        attract = startAttract({ ...opts, menu: { camera: menuCam, roots: [menu.node], onDraw: placeButtons, flicker: menu.flicker } });
        document.body.classList.add('menu3d');
        showPlain();
      } catch (e) {
        console.warn('written menu off:', e);
        menu = null; menuCam = null; stopAttract();
        document.body.classList.add('attract');
        attract = startAttract(opts);
      }
      window.__nac.attract = attract;
      window.__nac.menu = menu;
      window.__nac.menuCam = menuCam;
    } catch (e) {
      stopAttract();
      console.warn('menu backdrop off:', e);
    }
    showPlain();
  }, 0);
}
// Lights a tag while the pointer is over its button or the keyboard has focused it; a still menu draws again.
function lightTag(id, s) {
  if (menu && menu.setState(id, s) && document.body.classList.contains('menu3d') && attract && !attract.stopped && (attract.held || reduced())) attract.redraw();
}
for (const [id, b] of Object.entries(TAG_BUTTONS)) {
  b.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') lightTag(id, { hover: true }); });
  b.addEventListener('pointerleave', () => lightTag(id, { hover: false }));
  b.addEventListener('focus', () => lightTag(id, { focus: b.matches(':focus-visible') }));
  b.addEventListener('blur', () => lightTag(id, { focus: false }));
}
// The browser took the display away (a phone backgrounded under memory pressure, a GPU reset): the room can't be
// drawn now, so the plain menu comes back, with a line saying why.
canvas.addEventListener('webglcontextlost', () => {
  const inMenu = document.body.classList.contains('attract');
  stopAttract();
  if (inMenu || !document.body.classList.contains('previewing')) showError('The browser reset the graphics. Reload the page to play.');
});
// The screen changes shape (a phone turned): the station is framed again, and a still menu redrawn.
addEventListener('resize', () => { if (attract && !attract.stopped && (attract.held || reduced())) attract.redraw(); });
// The menu goes up once the headset check has said whether PLAY can start mixed reality here (so its tag is
// written right the first time), or after 1.5 s if the check hangs: then the tag is rewritten when it answers.
let backdropAsked = false;
const askBackdrop = () => { if (!backdropAsked) { backdropAsked = true; startBackdrop(); } };
setTimeout(askBackdrop, 1500);
// They only move when you look away: hide the page or leave it, come back, and the one by the wall is nearer.
let away = false;
const lookAway = () => { away = true; };
const lookBack = () => {
  if (!away) return;
  away = false;
  if (menu && attract && !attract.stopped && document.body.classList.contains('menu3d') && menu.lookedAway() && (attract.held || reduced())) attract.redraw();
};
document.addEventListener('visibilitychange', () => (document.hidden ? lookAway() : lookBack()));
addEventListener('blur', lookAway);
addEventListener('focus', lookBack);
// The first touch on the room itself (not a tag) winds the music box, and hurries the opening pull-back.
canvas.addEventListener('pointerdown', () => {
  if (!document.body.classList.contains('menu3d')) return;
  if (menuCam) menuCam.hurry();
  if (audio.musicState === 'off') { audio.unlock(); audio.music('start'); audio.ambience(true); }
});

let entering = false; // a second tap while the first is still opening (or open) must do nothing
async function enterMR() {
  if (entering) return;
  stopAttract();
  entering = true;
  $('error').hidden = true;
  audio.unlock();
  const game = newGame('xr');
  const hooks = { game, renderer };
  window.__nac.xr = hooks;
  $('menu').classList.add('in-xr');
  try {
    hooks.session = await startXR({
      gl, renderer, game, makeCanvas, debug, hooks, pin: params.has('pin'),
      onEnd: () => { entering = false; $('menu').classList.remove('in-xr'); audio.music('stop'); audio.ambience(false); startBackdrop({ crane: false }); },
    });
  } catch (e) {
    entering = false;
    $('menu').classList.remove('in-xr');
    showError(`Could not start mixed reality: ${(e && e.message) || e}. Tap ${menu ? 'PLAY' : 'Enter'} to try again.`);
    startBackdrop({ crane: false });
  }
}

function enterPreview() {
  // From the written menu, the camera glides from where it is into the seat as the night begins (not with
  // reduced motion: then the seat at once).
  const from = attract && !attract.stopped && menu && document.body.classList.contains('menu3d') && !reduced() ? attract.viewPose() : null;
  stopAttract();
  audio.unlock();
  const game = newGame('preview');
  document.body.classList.add('previewing');
  const fly = from ? { from, duration: MENU.fly, roots: [menu.node], tagsAlpha: (a) => menu.tagsAlpha(a), update: (vp, k) => menu.glide(vp, k) } : null;
  window.__nac.preview = startPreview({ canvas, gl, renderer, game, test, psx: !params.has('nopsx'), fly });
}

// The judges' link: the night to start on, chosen on the menu. A second visit can replay night 1 (the toy and
// the bell are night 1's), and nights 2 and 3 can be seen without playing the ones before. Until a judge taps one,
// it starts on the night that is open, as the normal link does: that night is marked, not chosen, and worked out
// again after each visit to the headset, so the nights won there carry on.
function judgeNights() {
  const box = $('judge-nights');
  if (!box) return; // an older page (a cached index.html) has no choice: the link then plays as the normal one does
  const mark = () => {
    const n = night || unlockedNight(loadSave(storage), todayString());
    if (!box.querySelector(`button[data-n="${n}"]`)) { // past night 3 (the next-night button goes on): offered too
      const b = document.createElement('button');
      b.dataset.n = String(n); b.textContent = String(n);
      box.appendChild(b);
    }
    for (const b of box.querySelectorAll('button')) b.setAttribute('aria-pressed', String(+b.dataset.n === n));
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    night = +b.dataset.n;
    mark();
    menuInfoChanged(); // the PLAY tag names the night
  });
  mark();
  box.hidden = false;
  judgeMark = mark;
}
if (judge) judgeNights();

$('build').textContent = `build ${BUILD.label}`;
// Coming back: your tree and tonight's night, in a line under the pitch (the backdrop shows the same tree).
const progress = menuProgress(loadSave(storage), todayString());
if (progress) { $('progress').textContent = progress; $('progress').hidden = false; }

// Wired before anything is awaited, so a tap always does something even if the headset check is slow.
$('enter').addEventListener('click', enterMR);
$('preview').addEventListener('click', enterPreview);
if (!gl) $('preview').disabled = true;

(async () => {
  const ar = await isARSupported();
  $('enter').disabled = !ar || !gl;
  $('xr-note').hidden = ar;
  $('judge-note').hidden = !judge;
  let framed = false;
  try { framed = window.top !== window; } catch { framed = true; }
  if (!ar && framed) $('xr-note').textContent = 'Mixed reality runs from the hosted copy in the Quest Browser. This page is the preview.';
  window.__nac.ar = ar;
  menuInfoChanged();
  askBackdrop();
  window.__nac.ready = true;
})();
