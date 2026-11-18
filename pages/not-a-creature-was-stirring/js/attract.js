// The menu's backdrop: the preview's living room, with night 1 playing itself in silence behind the title.
// The camera looks around like a nervous player, and whatever it isn't watching creeps closer. When one gets
// near the seat the camera turns, finds him, and stares him down until he sinks into the floor. After a while
// the room fades to black and the night begins again.
// It plays no sound, saves nothing (it shows the player's own tree, read only), shows no hint or panel, and never shows a strike or the scare: if one
// ever came, the room would fade at once. It stops for good the moment a button is pressed. With reduced
// motion it is a single still frame.
import { v3, q, m4, clamp } from './math.js';
import { buildLayout } from './room.js';
import * as M from './models.js';
import { Game } from './game.js';
import { PREVIEW_ROOM, previewPlanes } from './preview.js';

const SILENT = { play() {}, music() {}, setListener() {}, ambience() {}, pause() {}, unlock() {} };
export const ATTRACT = {
  loop: 55, // seconds of night before the room fades and it begins again
  close: 1.6, // a nutcracker this near the seat (m, across the floor) is turned to and stared down
  fade: 1.2, // seconds to fade out, and again to fade in
  calm: [3.5, 5.5], // seconds spent looking at the tree between glances away
  glance: [1.8, 3], // seconds of each glance away
  minGap: 25, // ms between drawn frames at least: about 30 a second on a 60 or 90 Hz screen
  judgeFrames: 40, // frames timed before deciding whether this device can keep up
  slowGap: 70, // ms: a median gap longer than this holds the backdrop still
};
const NO_HAND = { side: 'right', active: false };
const NEAR_STATES = new Set(['emerging', 'active', 'looming']);

// A small seeded random stream, so a test sees the same glances every time.
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}
const angleTo = (a, b) => Math.atan2(Math.sin(b - a), Math.cos(b - a)); // the short way round, from a to b

// menu (js/menu.js, through js/main.js): the menu written on the room. Then the room is dressed and lit but no
// night begins (the game is held in its tutorial: nothing creeps, nothing can block a tag or jump at the menu),
// there is no fade to begin again, and the view is the menu's camera: { camera, roots, onDraw, flicker }.
export function startAttract({ canvas, renderer, makeCanvas, storage = null, seed = 1, manual = false, still = false, feel = true, menu = null }) {
  // The player's own tree (the ornaments kept from nights they won), read but never written.
  const peek = storage && { getItem: (k) => storage.getItem(k), setItem() {}, removeItem() {} };
  const spec = PREVIEW_ROOM;
  const seat = [0, 1.15, spec.seatZ];
  const cam = { pos: seat, yaw: 0, pitch: -0.5, fov: 70 * Math.PI / 180 };
  const room = M.previewRoom(spec);
  room.updateWorld();
  const rand = rng(seed);
  // Two cameras. The head sits in the seat and is what the game counts as looking. The view is a ghost a step
  // behind and above it, turned with it, so the backdrop shows the room around the player: and the nutcrackers
  // creeping up while the head looks away. On a wide screen it turns a little further, so the tree stands to the
  // right of the menu's words.
  const BACK = 1.0, UP = 0.3, WIDE_TURN = 0.42;
  const view = { pos: [...seat], yaw: 0, pitch: 0 };
  let viewProj = m4.identity(), headProj = m4.identity(), viewport = [0, 0, 1, 1], viewFov = cam.fov;
  let game = null, prepared = null, t = 0, fade = 1, ending = false, loops = 0, frames = 0, stopped = false, held = false, raf = 0, last = null;
  let aim = { kind: 'tree', until: 0 };
  const watched = new Set(); // nutcrackers it has turned to (for tests: it stares them down, never lets one strike)

  function newNight() {
    if (game) renderer.release([game.scene]);
    game = new Game({ audio: SILENT, storage: peek, today: '2026-12-24', makeCanvas, seed: (rand() * 1e9) | 0, night: 1, mode: 'preview', feel, wallTitle: false, scares: false }); // the page has its own title
    game.setLayout(buildLayout(previewPlanes(spec), { pos: seat, forward: [0, -0.55, -1] }));
    t = 0; ending = false; fade = 1;
    cam.yaw = 0; cam.pitch = -0.5;
    aim = { kind: 'tree', until: 2.5 };
    hideUI(); // the new night's title panel, too
  }

  function updateCamera() {
    const w = Math.max(1, Math.round(canvas.clientWidth)), h = Math.max(1, Math.round(canvas.clientHeight)); // 1 px per CSS px: a backdrop
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    viewport = [0, 0, w, h];
    const aspect = w / h;
    const fov = Math.min(100 * Math.PI / 180, Math.max(cam.fov, 2 * Math.atan(Math.tan(32 * Math.PI / 180) / aspect)));
    const proj = m4.perspective(fov, aspect, 0.03, 40);
    headProj = m4.mul(proj, m4.invert(m4.compose(cam.pos, q.fromYPR(cam.yaw, cam.pitch, 0), [1, 1, 1])));
    if (menu) {
      const p = menu.camera.pose(aspect);
      view.pos = p.pos; view.yaw = p.yaw; view.pitch = p.pitch; viewFov = p.fov;
      viewProj = m4.mul(m4.perspective(p.fov, aspect, 0.03, 40), m4.invert(m4.compose(view.pos, q.fromYPR(view.yaw, view.pitch, 0), [1, 1, 1])));
      return;
    }
    viewFov = fov;
    const back = [Math.sin(cam.yaw), 0, Math.cos(cam.yaw)]; // behind the head, across the floor
    view.pos = [seat[0] + back[0] * BACK, seat[1] + UP, seat[2] + back[2] * BACK];
    view.yaw = cam.yaw + (aspect > 1.2 ? WIDE_TURN : 0);
    view.pitch = clamp(cam.pitch * 0.5 + 0.02, -0.42, 0.08);
    viewProj = m4.mul(proj, m4.invert(m4.compose(view.pos, q.fromYPR(view.yaw, view.pitch, 0), [1, 1, 1])));
  }

  const flat = (p) => Math.hypot(p[0] - seat[0], p[2] - seat[2]);
  function nearest() {
    let best = null;
    for (const n of game.nutcrackers) if (NEAR_STATES.has(n.state) && flat(n.pos) < ATTRACT.close && (!best || flat(n.pos) < flat(best.pos))) best = n;
    return best;
  }

  // The tree, a little above the table, swaying slowly as a head does.
  function treeAim() {
    const f = v3.norm(v3.sub(game.tablePos(), seat));
    return [Math.atan2(-f[0], -f[2]) + 0.08 * Math.sin(t * 0.37), Math.asin(clamp(f[1], -1, 1)) + 0.12];
  }

  // Where to look: a nutcracker near the seat first; otherwise the tree, with glances away now and then.
  function steer(dt) {
    const n = nearest();
    let yaw, pitch, rate;
    if (n) {
      watched.add(n);
      const f = v3.norm(v3.sub([n.pos[0], n.pos[1] + 0.6, n.pos[2]], seat));
      yaw = Math.atan2(-f[0], -f[2]); pitch = Math.asin(clamp(f[1], -1, 1)); rate = 5; // startled
      aim = { kind: 'tree', until: t + 1.5 }; // and then back to the tree
    } else {
      if (t >= aim.until) {
        const [a, b] = aim.kind === 'tree' ? ATTRACT.glance : ATTRACT.calm;
        const side = rand() < 0.5 ? -1 : 1;
        aim = aim.kind === 'tree'
          ? { kind: 'away', until: t + a + rand() * (b - a), yaw: side * (1.15 + rand() * 0.6), pitch: -0.12 + rand() * 0.12 }
          : { kind: 'tree', until: t + a + rand() * (b - a) };
      }
      if (aim.kind === 'away') { yaw = aim.yaw; pitch = aim.pitch; rate = 2.2; }
      else { [yaw, pitch] = treeAim(); rate = 1.8; }
    }
    const k = 1 - Math.exp(-rate * dt);
    cam.yaw += angleTo(cam.yaw, yaw) * k;
    cam.pitch += (pitch - cam.pitch) * k;
  }

  function hideUI() {
    for (const p of Object.values(game.panels)) p.node.visible = false;
    game.pinchHint.visible = false; game.snapMarker.visible = false; game.cursor.visible = false;
  }

  function step(dt) {
    t += dt;
    steer(dt);
    if (menu) menu.camera.advance(dt);
    updateCamera();
    const quat = q.fromYPR(cam.yaw, cam.pitch, 0);
    game.update(dt, { head: { pos: cam.pos, quat, forward: q.rotate(quat, [0, 0, -1]) }, viewProjs: [headProj], hands: [NO_HAND] });
    hideUI();
    if (menu) { // held in the tutorial: the room stays dressed and lit, and no night begins
      if (game.state === 'tutorial') game.stateT = 0;
      fade = Math.max(0, fade - dt / ATTRACT.fade);
      return;
    }
    // Never a strike, never the scare: if one came, fade at once. Otherwise fade after a while, and begin again.
    if (!ending && (t >= ATTRACT.loop || game.candlesLit < 3 || game.state === 'scare' || game.state === 'lose')) ending = true;
    if (ending) {
      fade = Math.min(1, fade + dt / ATTRACT.fade);
      if (fade >= 1) { loops++; newNight(); }
    } else fade = Math.max(0, fade - dt / ATTRACT.fade);
  }

  // The fire flickers and lights the room, as in the preview; the fade is a black flash over everything.
  function params() {
    const rp = game.renderParams, tt = rp.time || t;
    const flick = 0.85 + 0.1 * Math.sin(tt * 9.3) + 0.06 * Math.sin(tt * 23.7);
    const { fire, glow } = room.fx.parts;
    fire.scl = [1, flick + 0.05, 1];
    glow.alpha = 0.6 + 0.25 * flick;
    room.fx.updateWorld();
    const L = room.fireLight;
    if (menu && menu.flicker) menu.flicker(flick);
    return { ...rp, lights: [...(rp.lights || []), { ...L, intensity: L.intensity * flick }].slice(0, 4), flash: [0, 0, 0, fade] };
  }

  function draw() {
    const gl = renderer.gl;
    if (gl) gl.bindFramebuffer(gl.FRAMEBUFFER, null); // the page, not a headset session's framebuffer left bound
    updateCamera();
    if (game.scene !== prepared) { renderer.prepare([game.scene, room, room.fx, ...(menu ? menu.roots : [])], game.geometries()); prepared = game.scene; }
    renderer.render([game.scene, room.fx, ...(menu ? menu.roots : [])], [{ viewProj, viewport, camPos: view.pos }], params(), {
      clearColor: [0.02, 0.02, 0.03, 1], backdrop: room, snap: 220,
    });
    frames++;
    if (menu && menu.onDraw) menu.onDraw(viewProj, viewport[2], viewport[3]);
  }

  // A backdrop must never make the menu sluggish. It draws at about 30 frames a second at most, and on a device
  // that cannot keep up even with that (its first 40 frames a median of more than 70 ms apart: software
  // WebGL, an old phone) it holds still on the frame it has. Driven by hand (manual: the tests and tools step
  // every frame themselves), the gaps are theirs, not the device's, so it never judges.
  const gaps = [];
  function loop(now) {
    if (stopped || held) return;
    raf = requestAnimationFrame(loop);
    if (last != null && now - last < ATTRACT.minGap) return;
    if (!manual && last != null && gaps.length < ATTRACT.judgeFrames) {
      gaps.push(now - last);
      if (gaps.length === ATTRACT.judgeFrames && [...gaps].sort((x, y) => x - y)[gaps.length >> 1] > ATTRACT.slowGap) {
        held = true;
        cancelAnimationFrame(raf);
        holdStill();
        return;
      }
    }
    const dt = last == null ? 0 : Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!manual) step(dt);
    draw();
  }

  // A still frame: the room dressed and lit as the night begins, the camera on the tree, nothing creeping.
  function holdStill() {
    aim = { kind: 'tree', until: Infinity };
    if (menu) menu.camera.settle();
    while (t < 4) step(1 / 60);
    [cam.yaw, cam.pitch] = treeAim();
    fade = 0;
    draw();
  }

  newNight();
  if (still) holdStill(); // reduced motion
  else raf = requestAnimationFrame(loop);

  return {
    get game() { return game; },
    get frames() { return frames; },
    get loops() { return loops; },
    get stopped() { return stopped; },
    get held() { return held; },
    get fade() { return fade; },
    get t() { return t; },
    cam, view, watched,
    advance(sec, dt = 1 / 60, each = null) { for (let s = 0; s < sec; s += dt) { step(dt); if (each) each(game); } draw(); },
    // Draws again without moving on: a still menu after its tags change, or after the screen changes shape.
    redraw() { if (!stopped) draw(); },
    get viewProj() { return viewProj; },
    // Where the view is now (the preview glides on from here).
    viewPose() { return { pos: [...view.pos], yaw: view.yaw, pitch: view.pitch, fov: viewFov }; },
    room,
    stop() {
      if (stopped) return;
      stopped = true;
      cancelAnimationFrame(raf);
      renderer.release([game.scene]);
    },
  };
}
