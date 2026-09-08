// node test/smoke_dom.js — runs the built index.html's scripts against a fake THREE + fake DOM
// and plays a whole game through the UI code paths. Catches runtime errors, not visuals.
const fs = require('fs');
const vm = require('vm');

// ---------------- fake THREE ----------------
class V3 { constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
  set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; } setScalar(s) { return this.set(s, s, s); }
  copy(v) { return this.set(v.x, v.y, v.z); } clone() { return new V3(this.x, this.y, this.z); }
  addScaledVector(v, s) { this.x += v.x * s; this.y += v.y * s; this.z += v.z * s; return this; }
  lerp(v, a) { this.x += (v.x - this.x) * a; this.y += (v.y - this.y) * a; this.z += (v.z - this.z) * a; return this; }
  project() { const x = this.x, z = this.z; this.x = x / 4.3; this.y = -(z + 1.2) / 10.75; return this; } }
class V2 { constructor(x = 0, y = 0) { this.x = x; this.y = y; } set(x, y) { this.x = x; this.y = y; return this; } }
class Color { constructor(h) { this.h = h; } set(h) { this.h = h; return this; } copy(c) { this.h = c.h; return this; } multiply() { return this; } multiplyScalar() { return this; } lerp() { return this; } }
class Obj { constructor() { this.position = new V3(); this.rotation = new V3(); this.scale = new V3(1, 1, 1); this.visible = true; this.parent = null; this.children = []; this.userData = {}; }
  add(c) { c.parent = this; this.children.push(c); return this; } remove(c) { c.parent = null; this.children = this.children.filter(x => x !== c); }
  lookAt() {} updateMatrixWorld() {} clone() { const o = new this.constructor(this.geometry, this.material); o.position.copy(this.position); o.rotation.copy(this.rotation); o.userData = Object.assign({}, this.userData); return o; } }
class Group extends Obj {}
class Mesh extends Obj { constructor(g, m) { super(); this.geometry = g; this.material = m; } }
class Scene extends Obj { constructor() { super(); this.background = null; } }
class Geo { translate() { return this; } }
class Mat { constructor(o) { Object.assign(this, { color: new Color(), emissive: new Color(), emissiveIntensity: 0, opacity: 1 }, o || {}); } clone() { return new this.constructor(Object.assign({}, this)); } }
class Cam extends Obj {}
class Light extends Obj { constructor(c, i) { super(); this.color = new Color(c); this.intensity = i; } }
class Raycaster { constructor() { this.ndc = new V2(); this.ray = { intersectPlane: (p, t) => { t.set(this.ndc.x * 4.3, 0, -1.2 - this.ndc.y * 10.75); return t; } }; } setFromCamera(n) { this.ndc.set(n.x, n.y); } }
const THREE = {
  Vector3: V3, Vector2: V2, Color, Group, Mesh, Scene, Plane: class { constructor() {} }, Raycaster,
  BoxGeometry: Geo, SphereGeometry: Geo, ConeGeometry: Geo, CylinderGeometry: Geo, PlaneGeometry: Geo, CircleGeometry: Geo, RingGeometry: Geo, DodecahedronGeometry: Geo,
  MeshPhongMaterial: Mat, MeshBasicMaterial: Mat, BackSide: 1,
  OrthographicCamera: Cam, AmbientLight: Light, DirectionalLight: Light, PointLight: Light,
  WebGLRenderer: class { constructor() { this.renders = 0; } setPixelRatio() {} setSize() {} render() { this.renders++; } },
};

// ---------------- fake DOM ----------------
const listeners = new Map();
function makeEl(id) {
  const el = { id, style: {}, className: '', textContent: '', innerHTML: '', children: [], offsetWidth: 1, attrs: {}, _ls: {},
    classList: { add(c) { if (!el.className.split(' ').includes(c)) el.className = (el.className + ' ' + c).trim(); }, remove(c) { el.className = el.className.split(' ').filter(x => x !== c).join(' '); } },
    addEventListener(t, fn) { (el._ls[t] = el._ls[t] || []).push(fn); },
    appendChild(c) { el.children.push(c); c.parentEl = el; }, remove() { if (el.parentEl) el.parentEl.children = el.parentEl.children.filter(c => c !== el); },
    getBoundingClientRect() { return { left: 0, top: 0, width: 390, height: 844 }; },
    setAttribute(k, v) { el.attrs[k] = v; }, getAttribute(k) { return el.attrs[k]; },
    closest(sel) { const key = sel.replace(/[\[\]]/g, ''); let e = el; while (e) { if (e.attrs && e.attrs[key] !== undefined) return e; e = e.parentEl; } return null; },
    fire(t, ev) { (el._ls[t] || []).forEach(fn => fn(Object.assign({ preventDefault() {}, stopPropagation() {}, target: el, clientX: 0, clientY: 0 }, ev))); },
  };
  return el;
}
const ids = ['stage', 'gl', 'hud-top', 'hud-bottom', 'n-night', 'n-truck', 'infest-fill', 'infest-pct', 'infest-label', 'graffiti', 'alert', 'teach', 'day-panel', 'unlock', 'preview-rats', 'preview-text', 'btn-nightfall', 'n-bags', 'n-binned', 'n-tokens', 'n-score', 'btn-pause', 'radial', 'ripples', 'flash', 'overlay'];
const els = {}; ids.forEach(i => els[i] = makeEl(i));
els['btn-nightfall'].attrs['data-ui'] = '1'; els['btn-pause'].attrs['data-ui'] = '1'; els.radial.attrs['data-ui'] = '1'; els.overlay.attrs['data-ui'] = '1';
els.radial.innerHTMLSet = null;
Object.defineProperty(els.radial, 'innerHTML', { get() { return ''; }, set() { els.radial.children = []; } });
Object.defineProperty(els.overlay, 'innerHTML', { get() { return this._h || ''; }, set(v) { this._h = v; } });
const document = { getElementById: id => els[id], createElement: () => makeEl('dyn'), hidden: false, addEventListener(t, fn) { listeners.set('doc:' + t, fn); } };
let rafCb = null;
const window = { innerWidth: 390, innerHeight: 844, devicePixelRatio: 2, addEventListener(t, fn) { listeners.set('win:' + t, fn); } };
const navigator = { vibrate: () => true };
const timeouts = [];
global.THREE = THREE; global.window = window; global.document = document; global.navigator = navigator;
global.requestAnimationFrame = cb => { rafCb = cb; };
global.setTimeout = (fn, ms) => { timeouts.push({ fn, at: nowMs + (ms || 0) }); return timeouts.length; };
let nowMs = 0;

// ---------------- load scripts from the built file ----------------
const html = fs.readFileSync(__dirname + '/../index.html', 'utf8');
const scripts = [...html.matchAll(/<script>\n([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (scripts.length !== 6) throw new Error('expected 6 inline scripts, got ' + scripts.length);
scripts.forEach(s => vm.runInThisContext(s));
listeners.get('win:DOMContentLoaded')();

const Main = vm.runInThisContext('Main'), Sim = vm.runInThisContext('Sim'), Render = vm.runInThisContext('Render'), UI = vm.runInThisContext('UI'), CONFIG = vm.runInThisContext('CONFIG');

function frame(ms) { nowMs += ms; rafCb(nowMs); for (const t of timeouts.splice(0)) { if (t.at <= nowMs) t.fn(); else timeouts.push(t); } }
function tapAt(sx, sy) { els.stage.fire('pointerdown', { clientX: sx, clientY: sy, target: makeEl('board') }); }
function tapWorld(x, z) { const p = Render.project(x, 0, z); tapAt(p.sx, p.sy); }
function radialPick(name) { const b = els.radial.children.find(c => (c.innerHTML || '').toLowerCase().includes(name)); if (!b) throw new Error('no radial option ' + name + ' among ' + els.radial.children.map(c => c.innerHTML).join('|')); b.fire('pointerdown', {}); }

// grab the live game state via a tap-through: Main keeps g private, so read it through a trick — Sim.preview needs g; expose by monkey-patching update.
let g = null; const origUpdate = Sim.update; Sim.update = function (gg, dt) { g = gg; return origUpdate(gg, dt); };


// ---- night 1 trace ----
const evlog = [];
const origDispatchTest = null;
tapAt(100, 100); for (let i = 0; i < 4; i++) frame(17);
for (let i = 0; i < 90; i++) frame(16.7);
const slot = g.slots.find(s => s.id === 'stoopRail');
tapWorld(slot.x, slot.z); radialPick('cat');
console.log('cat placed?', !!slot.tower, 'bags', Sim.spendable(g), 'piles', g.piles.map(p => p.bags));
while (g.hand > 0) { tapWorld(g.piles[0].x, g.piles[0].z); }
for (let i = 0; i < 40; i++) frame(16.7);
els['btn-nightfall'].fire('pointerdown', {});
frame(16.7);
els['btn-nightfall'].fire('pointerdown', {});
frame(16.7);
console.log('phase', g.phase, 'queue', g.queue.map(q => q.at.toFixed(2) + ':' + q.type + '@' + q.spawn.id).join(' '));
const RV = vm.runInThisContext('Render');
const origH = UI.handleEvent; UI.handleEvent = (ev, gg) => { if (['lunge','nearMiss','escape','grab','death','caught'].includes(ev.type)) console.log(`   EV t=${gg.t.toFixed(2)} ${ev.type} ${ev.name||''} x=${(ev.x||0).toFixed(2)}`); return origH(ev, gg); };
let sec = 0;
for (let f = 0; f < 60 * 24 && g.phase === 'night'; f++) {
  const before = g.events.length;
  frame(16.7);
  if (f % 60 === 0) {
    const rats = g.rats.map(r => `${r.type}:${r.state}@(${r.x.toFixed(1)},${r.z.toFixed(1)})`).join(' ');
    // reach into the render layer through the scene graph: count visible rat groups
    const scene = vm.runInThisContext('(function(){ try { return Render._scene } catch(e) { return null } })()');
    console.log(`t=${g.t.toFixed(1)} queue=${g.queue.length} rats=${g.rats.length} ${rats}`);
    for (const r of g.rats) { const p = RV.project(r.x, 0.2, r.z); console.log(`   screen ${r.type} sx=${p.sx.toFixed(0)} sy=${p.sy.toFixed(0)}`); }
  }
}
console.log('night ended: phase', g.phase, 'lost', g.lostNight, 'infest', g.infestation);
