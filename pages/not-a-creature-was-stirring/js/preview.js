// Phone / desktop preview: a virtual living room stands in for your real one.
// Drag to look around. Press on an ornament and drag it onto the tree.
// Also drives the headless tests through window.__nac hooks.
import { v3, q, m4, clamp } from './math.js';
import { buildLayout, makePlane } from './room.js';
import * as M from './models.js';

export const PREVIEW_ROOM = { w: 4.4, d: 4.4, h: 2.5, seatZ: 0.6, table: { center: [0, 0.45, 0], w: 0.9, d: 0.5 } };

export function previewPlanes(spec = PREVIEW_ROOM) {
  const { w, d, h, table } = spec;
  return [
    makePlane({ center: [0, 0, 0], normal: [0, 1, 0], w, h: d, label: 'floor' }),
    makePlane({ center: [0, h, 0], normal: [0, -1, 0], w, h: d, label: 'ceiling' }),
    makePlane({ center: table.center, normal: [0, 1, 0], w: table.w, h: table.d, label: 'table' }),
    makePlane({ center: [0, h / 2, -d / 2], normal: [0, 0, 1], w, h, label: 'wall' }),
    makePlane({ center: [0, h / 2, d / 2], normal: [0, 0, -1], w, h, label: 'wall' }),
    makePlane({ center: [-w / 2, h / 2, 0], normal: [1, 0, 0], w: d, h, label: 'wall' }),
    makePlane({ center: [w / 2, h / 2, 0], normal: [-1, 0, 0], w: d, h, label: 'wall' }),
  ];
}

export function startPreview({ canvas, gl, renderer, game, test = false, psx = true }) {
  const spec = PREVIEW_ROOM;
  const cam = { pos: [0, 1.15, spec.seatZ], yaw: 0, pitch: -0.62, fov: 70 * Math.PI / 180 };
  const room = M.previewRoom(spec);
  room.updateWorld();
  game.setLayout(buildLayout(previewPlanes(spec), { pos: cam.pos, forward: [0, -0.55, -1] }));
  renderer.prepare([game.scene, room, room.fx], game.geometries());

  let viewProj = m4.identity();
  let viewport = [0, 0, 1, 1];
  const quat = () => q.fromYPR(cam.yaw, cam.pitch, 0);
  const headInfo = () => ({ pos: cam.pos, quat: quat(), forward: q.rotate(quat(), [0, 0, -1]) });

  function updateCamera() {
    const dpr = Math.min(2, globalThis.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr)), h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    viewport = [0, 0, w, h];
    // Keep at least ~57 degrees across in portrait so the box and the tree both fit on a phone.
    const aspect = w / h;
    const fov = Math.min(100 * Math.PI / 180, Math.max(cam.fov, 2 * Math.atan(Math.tan(32 * Math.PI / 180) / aspect)));
    const world = m4.compose(cam.pos, quat(), [1, 1, 1]);
    viewProj = m4.mul(m4.perspective(fov, aspect, 0.03, 40), m4.invert(world));
  }

  function lookAt(p) {
    const f = v3.norm(v3.sub(p, cam.pos));
    cam.yaw = Math.atan2(-f[0], -f[2]);
    cam.pitch = Math.asin(clamp(f[1], -1, 1));
  }

  // ---- pointer as a hand
  const ptr = { x: 0, y: 0, over: false };
  let drag = null;
  let pinching = false;

  function ray(px, py) {
    const r = canvas.getBoundingClientRect();
    const nx = ((px - r.left) / r.width) * 2 - 1, ny = 1 - ((py - r.top) / r.height) * 2;
    const inv = m4.invert(viewProj);
    const un = (z) => { const p = m4.point4(inv, [nx, ny, z]); return [p[0] / p[3], p[1] / p[3], p[2] / p[3]]; };
    const a = un(-1), b = un(1);
    return { o: a, d: v3.norm(v3.sub(b, a)) };
  }
  const rayDist = (r, p) => { const t = v3.dot(v3.sub(p, r.o), r.d); return { t, d: v3.dist(p, v3.addScaled(r.o, r.d, t)) }; };

  function pick(r) {
    let best = null;
    for (const g of game.grabbables()) {
      const h = rayDist(r, g.pos);
      if (h.t > 0 && h.d < 0.06 && (!best || h.d < best.d)) best = { depth: h.t, d: h.d };
    }
    for (const p of Object.values(game.panels)) {
      if (!p.node.visible || !p.buttons.length) continue;
      const w = p.node.world;
      const n = [w[8], w[9], w[10]], c = [w[12], w[13], w[14]];
      const den = v3.dot(r.d, n);
      if (Math.abs(den) < 1e-4) continue;
      const t = v3.dot(v3.sub(c, r.o), n) / den;
      if (t > 0 && p.hit(v3.addScaled(r.o, r.d, t))) best = { depth: t, d: 0 };
    }
    return best;
  }

  // Where the last carried frame held the ornament, and whether the pointer has just let go of it there.
  // A lifted finger leaves the canvas at once (pointerup, then pointerleave), so the release must not
  // wait for the pointer: the next step lets go where the ornament was, or it would fly back to the box.
  let carriedAt = null, lifted = false;

  function handNow() {
    if (lifted) { lifted = false; return { side: 'right', active: true, pos: carriedAt, tip: carriedAt, pinching: false }; }
    if (!ptr.over && !drag) return { side: 'right', active: false };
    const r = ray(ptr.x, ptr.y);
    let depth = drag && drag.mode === 'carry' ? drag.depth : v3.dist(cam.pos, game.tablePos());
    if (drag && drag.mode === 'carry') {
      let best = null;
      for (const s of game.targets()) { const h = rayDist(r, s); if (h.t > 0 && h.d < 0.07 && (!best || h.d < best.d)) best = h; }
      if (best) depth = best.t;
    }
    const p = v3.addScaled(r.o, r.d, depth);
    if (drag && drag.mode === 'carry') carriedAt = p;
    return { side: 'right', active: true, pos: p, tip: p, pinching };
  }

  canvas.style.touchAction = 'none';
  canvas.addEventListener('pointerdown', (e) => {
    try { canvas.setPointerCapture(e.pointerId); } catch { /* synthetic events */ }
    ptr.x = e.clientX; ptr.y = e.clientY; ptr.over = true;
    carriedAt = null; lifted = false;
    updateCamera();
    const hit = pick(ray(ptr.x, ptr.y));
    if (hit) { drag = { mode: 'carry', depth: hit.depth }; pinching = true; }
    else drag = { mode: 'look', x: e.clientX, y: e.clientY, yaw: cam.yaw, pitch: cam.pitch };
  });
  canvas.addEventListener('pointermove', (e) => {
    ptr.x = e.clientX; ptr.y = e.clientY; ptr.over = true;
    if (drag && drag.mode === 'look') {
      cam.yaw = drag.yaw + (e.clientX - drag.x) * 0.005;
      cam.pitch = clamp(drag.pitch + (e.clientY - drag.y) * 0.005, -1.35, 1.2);
    }
  });
  const up = () => { if (drag && drag.mode === 'carry' && carriedAt) lifted = true; pinching = false; drag = null; };
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('pointerleave', () => { if (!drag) ptr.over = false; });
  addEventListener('keydown', (e) => {
    const k = { ArrowLeft: [0.08, 0], ArrowRight: [-0.08, 0], ArrowUp: [0, 0.06], ArrowDown: [0, -0.06] }[e.key];
    if (k) { cam.yaw += k[0]; cam.pitch = clamp(cam.pitch + k[1], -1.35, 1.2); }
  });
  addEventListener('blur', () => game.setPaused(true));
  addEventListener('focus', () => game.setPaused(false));
  document.addEventListener('visibilitychange', () => game.setPaused(document.hidden));

  function step(dt, override = {}) {
    updateCamera();
    const hand = override.hand || handNow();
    game.update(dt, { head: headInfo(), viewProjs: [viewProj], hands: [hand] });
  }

  // The fire flickers, and lights the room as a fourth light (the game uses at most three).
  function roomParams() {
    const rp = game.renderParams, t = rp.time || 0;
    const flick = 0.85 + 0.1 * Math.sin(t * 9.3) + 0.06 * Math.sin(t * 23.7);
    const { fire, glow } = room.fx.parts;
    fire.scl = [1, flick + 0.05, 1];
    glow.alpha = 0.6 + 0.25 * flick;
    room.fx.updateWorld();
    const L = room.fireLight;
    return { ...rp, lights: [...(rp.lights || []), { ...L, intensity: L.intensity * flick }].slice(0, 4) };
  }

  let prepared = game.scene;
  function draw() {
    updateCamera();
    // A new round (Play again, the judges' next night) is a new scene: its panels go up with the button press.
    if (game.scene !== prepared) { renderer.prepare([game.scene]); prepared = game.scene; }
    renderer.render([game.scene, room.fx], [{ viewProj, viewport, camPos: cam.pos }], roomParams(), {
      clearColor: [0.02, 0.02, 0.03, 1], backdrop: room, snap: psx ? 220 : 0,
    });
  }

  let lastT = null;
  function loop(now) {
    requestAnimationFrame(loop);
    const dt = lastT == null ? 0 : Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    if (!test) step(dt);
    draw();
  }
  requestAnimationFrame(loop);

  // Test hooks: deterministic stepping and helpers for scripted play.
  const hooks = {
    game, cam, renderer,
    lookAt, draw,
    setLook(yaw, pitch) { cam.yaw = yaw; cam.pitch = pitch; },
    tick(dt, hand = null) { step(dt, { hand }); },
    vp: () => viewProj,
    advance(sec, { dt = 1 / 60, look = null, hand = null } = {}) {
      for (let t = 0; t < sec; t += dt) {
        if (typeof look === 'function') lookAt(look());
        else if (look) lookAt(look);
        step(dt, { hand: typeof hand === 'function' ? hand() : hand });
      }
      draw();
      return game.state;
    },
    hangNext() {
      const item = game.grabbables()[0];
      if (!item) return false;
      const H = (pos, p) => ({ side: 'right', active: true, pos, tip: pos, pinching: p });
      const from = [...item.pos];
      this.advance(0.05, { look: game.tablePos(), hand: H(from, false) });
      this.advance(0.05, { look: game.tablePos(), hand: H(from, true) });
      const target = game.targets()[0];
      this.advance(0.2, { look: game.tablePos(), hand: H(target, true) });
      this.advance(0.05, { look: game.tablePos(), hand: H(target, false) });
      return true;
    },
  };
  return hooks;
}
