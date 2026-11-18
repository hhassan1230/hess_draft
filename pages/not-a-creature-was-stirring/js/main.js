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
import { todayString, loadSave, menuProgress } from './save.js';
import { BUILD } from './build.js';

const params = new URLSearchParams(location.search);
const debug = params.has('debug');
const test = params.has('test');
const judge = params.has('judge');
const night = parseInt(params.get('night'), 10) || null;
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

// The menu's backdrop: night 1 playing itself, silently, in the preview's living room (js/attract.js).
// It starts once the menu is up, stops when either button is pressed, and starts again when you come back
// from mixed reality. Anything wrong with it leaves the plain menu.
let attract = null, attractTimer = 0;
function stopAttract() {
  clearTimeout(attractTimer);
  attractTimer = 0;
  if (attract) { try { attract.stop(); } catch { /* the menu goes on without it */ } }
  document.body.classList.remove('attract');
}
function startBackdrop() {
  if (!renderer || (test && !params.has('attract'))) return;
  clearTimeout(attractTimer);
  attractTimer = setTimeout(() => {
    attractTimer = 0;
    try {
      document.body.classList.add('attract');
      const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
      attract = startAttract({ canvas, renderer, makeCanvas, storage, seed: test ? 1 : (Math.random() * 1e9) | 0, manual: test, still, feel });
      window.__nac.attract = attract;
    } catch (e) {
      stopAttract();
      console.warn('menu backdrop off:', e);
    }
  }, 0);
}
startBackdrop();

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
      onEnd: () => { entering = false; $('menu').classList.remove('in-xr'); audio.music('stop'); audio.ambience(false); startBackdrop(); },
    });
  } catch (e) {
    entering = false;
    $('menu').classList.remove('in-xr');
    showError(`Could not start mixed reality: ${(e && e.message) || e}. Tap Enter to try again.`);
    startBackdrop();
  }
}

function enterPreview() {
  stopAttract();
  audio.unlock();
  const game = newGame('preview');
  document.body.classList.add('previewing');
  window.__nac.preview = startPreview({ canvas, gl, renderer, game, test, psx: !params.has('nopsx') });
}

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
  window.__nac.ready = true;
})();
