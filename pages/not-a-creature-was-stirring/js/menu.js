// The menu, written on the living room itself (the Kings County Lanes front door, for this game). The title is
// a sampler stitched with the lines the title comes from, framed above the mantel; the two ways in are gift tags
// hung from the mantel garland: PLAY (in your room, mixed reality) and PREVIEW (on this screen). Nothing floats
// in front of the world: each label is on something a living room at Christmas has anyway.
//
// The page's own buttons (#enter, #preview) stay the real buttons. Each frame they are laid, invisible, over
// their tags on screen, so a tap on a tag is a tap on the button: the Quest Browser starts mixed reality from a
// real tap, Tab and Enter work, a screen reader reads them, and a test clicks them where a player would.
//
// The camera frames the station for the screen's shape (composed from the sampler's and tags' corners), pulls
// back from the sampler's first line when the page opens, and hands its pose to the preview, which glides from
// it into the seat. With reduced motion there is no pull-back. Pure logic and canvases: it runs in Node too.
import { v3, q, m4, clamp, smooth } from './math.js';
import * as G from './geo.js';
import { Node } from './scene.js';
import { PREVIEW_ROOM } from './preview.js';
import * as M from './models.js';

const SERIF = "Georgia, 'Times New Roman', serif";
const DEG = Math.PI / 180;

export const MENU = {
  crane: 3.4, // s: the pull-back from the sampler's first line to the station
  craneHold: 0.5, // s on the first line before it starts
  fly: 2.2, // s: the preview's glide from the station into the seat
  tint: { sampler: [0.74, 0.66, 0.56], tag: [0.84, 0.78, 0.7], lit: [1.06, 1.0, 0.9] }, // the room's light on them; a tag under the pointer or focus
  // Framing per screen shape: where the camera looks from (yaw, pitch), its vertical field of view, and the
  // part of the screen (NDC: x0 x1 y0 y1) the sampler and the tags must fill.
  frames: {
    wide: { yaw: 0.1, pitch: 0, fov: 46, rect: [-0.86, 0.1, -0.4, 0.92] }, // the fireplace left, the one by the wall right
    square: { yaw: 0.08, pitch: -0.14, fov: 56, rect: [-0.92, 0.45, -0.05, 0.9] },
    tall: { yaw: 0.14, pitch: 0.0, fov: 62, rect: [-0.9, 0.9, -0.12, 0.84] },
  },
};

const wallZ = -PREVIEW_ROOM.d / 2; // the front wall, where the fireplace is (js/models.js previewRoom)
const FX = -1.35; // the fireplace's centre along it
export const SAMPLER = { pos: [FX, 1.8, wallZ + 0.045], w: 1.24, h: 0.66 };
const TAG = { w: 0.46, h: 0.32, z: wallZ + 0.415, hang: 1.1 };
export const TAGS = {
  enter: { x: FX - 0.41, y: 0.925, tilt: 2.5 * DEG }, // in front of the left stocking, covering it cuff to toe
  preview: { x: FX + 0.41, y: 0.92, tilt: -2 * DEG }, // and the right one; the middle stocking hangs between
};

// Fits a font to `room` pixels wide, at most `size`.
function fit(ctx, text, size, room, font) {
  ctx.font = font(size);
  const w = ctx.measureText(text).width;
  if (w > room && w > 0) ctx.font = font(Math.max(8, Math.floor((size * room) / w)));
}

// Cross-stitched text: the letters drawn on a grid of little X stitches, as on a sampler. Where the canvas
// cannot be read back (the Node stub), plain lettering.
function stitch(ctx, makeCanvas, text, cx, cy, size, color, cell, font) {
  const probe = makeCanvas(8, 8).getContext('2d');
  fit(probe, text, size, Infinity, font);
  const w = Math.ceil(probe.measureText(text).width) + 8, h = Math.ceil(size * 1.3);
  const off = makeCanvas(w, h), o = off.getContext('2d');
  o.font = font(size); o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillStyle = '#000';
  o.fillText(text, w / 2, h / 2);
  const img = o.getImageData && o.getImageData(0, 0, w, h);
  if (!img || !img.data) { ctx.font = font(size); ctx.fillStyle = color; ctx.fillText(text, cx, cy); return; }
  const px = img.data;
  const x0 = cx - w / 2, y0 = cy - h / 2;
  ctx.lineCap = 'round';
  for (let y = 0; y < h; y += cell) {
    for (let x = 0; x < w; x += cell) {
      const sx = Math.min(w - 1, Math.round(x + cell / 2)), sy = Math.min(h - 1, Math.round(y + cell / 2));
      if (px[(sy * w + sx) * 4 + 3] < 110) continue;
      const X = x0 + x, Y = y0 + y, e = cell * 0.12;
      ctx.lineWidth = cell * 0.46;
      ctx.strokeStyle = color;
      ctx.beginPath(); ctx.moveTo(X + e, Y + e); ctx.lineTo(X + cell - e, Y + cell - e);
      ctx.moveTo(X + cell - e, Y + e); ctx.lineTo(X + e, Y + cell - e); ctx.stroke();
      ctx.lineWidth = cell * 0.12; ctx.strokeStyle = 'rgba(255,235,220,0.28)'; // the thread's sheen
      ctx.beginPath(); ctx.moveTo(X + cell - e * 1.6, Y + e * 1.6); ctx.lineTo(X + cell * 0.55, Y + cell * 0.45); ctx.stroke();
    }
  }
}

function holly(ctx, x, y, s, flip) {
  ctx.save(); ctx.translate(x, y); ctx.scale(flip ? -s : s, s);
  ctx.fillStyle = '#1f5a34';
  for (const [a, dx] of [[-0.5, -1], [0.5, 1]]) {
    ctx.save(); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(dx * 18, 0, 20, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  ctx.fillStyle = '#b3141f';
  for (const [bx, by] of [[-5, -4], [5, -4], [0, 4]]) { ctx.beginPath(); ctx.arc(bx, by, 5.5, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}

// The sampler: wood frame with a gold lip, linen, a stitched border, holly in the corners, and the lines.
export function paintSampler(canvas, makeCanvas) {
  const ctx = canvas.getContext('2d'), W = canvas.width, H = canvas.height;
  const F = Math.round(W * 0.034);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#2a170b'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(120,70,30,0.35)'; ctx.lineWidth = 2;
  for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(0, 4 + i * (F / 9)); ctx.lineTo(W, 4 + i * (F / 9) + 3); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, H - 4 - i * (F / 9)); ctx.lineTo(W, H - 6 - i * (F / 9)); ctx.stroke(); }
  ctx.fillStyle = '#c9a24a'; ctx.fillRect(F - 7, F - 7, W - 2 * F + 14, H - 2 * F + 14);
  ctx.fillStyle = '#8a6a2a'; ctx.fillRect(F - 3, F - 3, W - 2 * F + 6, H - 2 * F + 6);
  ctx.fillStyle = '#ebdfc4'; ctx.fillRect(F, F, W - 2 * F, H - 2 * F);
  ctx.strokeStyle = 'rgba(110,90,60,0.1)'; ctx.lineWidth = 1;
  for (let x = F; x < W - F; x += 5) { ctx.beginPath(); ctx.moveTo(x + 0.5, F); ctx.lineTo(x + 0.5, H - F); ctx.stroke(); }
  for (let y = F; y < H - F; y += 5) { ctx.beginPath(); ctx.moveTo(F, y + 0.5); ctx.lineTo(W - F, y + 0.5); ctx.stroke(); }
  const I = F + 18;
  ctx.setLineDash([12, 7]); ctx.lineWidth = 5; ctx.strokeStyle = '#9d1d27';
  ctx.strokeRect(I, I, W - 2 * I, H - 2 * I);
  ctx.setLineDash([6, 6]); ctx.lineWidth = 3; ctx.strokeStyle = '#2f6a3e';
  ctx.strokeRect(I + 12, I + 12, W - 2 * I - 24, H - 2 * I - 24);
  ctx.setLineDash([]);
  holly(ctx, I + 40, I + 34, 1.1, false); holly(ctx, W - I - 40, I + 34, 1.1, true);
  holly(ctx, I + 40, H - I - 34, 1.1, false); holly(ctx, W - I - 40, H - I - 34, 1.1, true);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const italic = (px) => `italic ${px}px ${SERIF}`, bold = (px) => `bold ${px}px ${SERIF}`;
  // The poem's lines in plain lettering (small stitches blur at a distance); the title cross-stitched.
  const room = W - 2 * I - 170;
  fit(ctx, '’Twas the night before Christmas, when all through the house', Math.round(H * 0.085), room, italic);
  ctx.fillStyle = '#173f26';
  ctx.fillText('’Twas the night before Christmas, when all through the house', W / 2, H * 0.215);
  const big = Math.round(H * 0.215);
  stitch(ctx, makeCanvas, 'Not a Creature', W / 2, H * 0.44, big, '#8e1820', 5, bold);
  stitch(ctx, makeCanvas, 'Was Stirring', W / 2, H * 0.645, big, '#8e1820', 5, bold);
  ctx.font = italic(Math.round(H * 0.085)); ctx.fillStyle = '#173f26';
  ctx.fillText('not even a mouse.', W / 2, H * 0.81);
}

// A gift tag: card with clipped top corners, a red border, an eyelet at the top for its ribbon, a big word and a
// line under it. Lit (under the pointer or keyboard focus) it glows gold; disabled it is faded.
export function paintTag(canvas, { word, line, lit = false, disabled = false }) {
  const ctx = canvas.getContext('2d'), W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const m = 14, c = H * 0.2;
  const shape = () => {
    ctx.beginPath();
    ctx.moveTo(m + c, m); ctx.lineTo(W - m - c, m); ctx.lineTo(W - m, m + c); ctx.lineTo(W - m, H - m - 10);
    ctx.quadraticCurveTo(W - m, H - m, W - m - 10, H - m); ctx.lineTo(m + 10, H - m); ctx.quadraticCurveTo(m, H - m, m, H - m - 10);
    ctx.lineTo(m, m + c); ctx.closePath();
  };
  ctx.save();
  if (lit) { ctx.shadowColor = 'rgba(255,200,90,0.95)'; ctx.shadowBlur = 22; }
  shape(); ctx.fillStyle = disabled ? '#d8cfbd' : '#f3e7cb'; ctx.fill();
  ctx.restore();
  shape(); ctx.lineWidth = lit ? 9 : 6; ctx.strokeStyle = lit ? '#e2b04a' : (disabled ? '#9a8a78' : '#a3202a'); ctx.stroke();
  ctx.save(); shape(); ctx.clip();
  ctx.strokeStyle = disabled ? 'rgba(120,100,80,0.35)' : 'rgba(163,32,42,0.45)'; ctx.lineWidth = 2; ctx.setLineDash([8, 6]);
  ctx.beginPath(); ctx.moveTo(m + c + 6, m + 14); ctx.lineTo(W - m - c - 6, m + 14); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  // The eyelet the ribbon goes through.
  ctx.fillStyle = '#c9a24a'; ctx.beginPath(); ctx.arc(W / 2, m + 26, 15, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(W / 2, m + 26, 8, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  fit(ctx, word, Math.round(H * 0.36), W - 2 * m - 40, (px) => `bold ${px}px ${SERIF}`);
  ctx.fillStyle = disabled ? '#857565' : '#8a131c';
  ctx.fillText(word, W / 2, H * 0.5);
  fit(ctx, line, Math.round(H * 0.15), W - 2 * m - 36, (px) => `italic ${px}px ${SERIF}`);
  ctx.fillStyle = disabled ? '#857565' : '#3d2616';
  ctx.fillText(line, W / 2, H * 0.77);
}

// What each tag says. On a headset that can start mixed reality, PLAY is in your room; anywhere else it says
// where it can be played. Coming back, PLAY names tonight's night.
// Until the check answers (it only shows if the check hangs), PLAY says so and looks it: its button can't be
// pressed yet. In an embedded copy, mixed reality runs from the hosted link instead.
export function tagText(id, { ar = null, nextNight = null, framed = false } = {}) {
  if (id === 'preview') return { word: 'PREVIEW', line: 'on this screen' };
  if (ar === null) return { word: 'PLAY', line: 'looking for a headset…', disabled: true };
  if (ar === false) return { word: 'PLAY', line: framed ? 'from the hosted link' : 'on a Quest, in its browser', disabled: true };
  return { word: 'PLAY', line: nextNight ? `night ${nextNight} · in your room` : 'in your room' };
}

// The one who waits by the wall, right of the fireplace. He only moves when you look away: each time the page is
// hidden or loses focus and comes back, he has taken a step toward you (at most three), and stands still again.
// He keeps to the wall and comes along it toward the fireplace, so his face stays in view on a wide screen (his
// legs run past the frame's bottom), and turns to face you. On an upright phone he comes into view at the last step.
export const WATCHER = [
  { pos: [0.42, 0, -1.9] },
  { pos: [0.08, 0, -1.82] },
  { pos: [-0.28, 0, -1.72] },
  { pos: [-0.62, 0, -1.56] }, // at the hearth's corner, beside PREVIEW: on an upright phone he is in view now
];
const FACING = [-0.3, 0, 0.6]; // he faces the seat, where you are

const corners = (w, h) => [[-w / 2, -h / 2, 0], [w / 2, -h / 2, 0], [w / 2, h / 2, 0], [-w / 2, h / 2, 0]];

export function buildMenu({ makeCanvas }) {
  const node = new Node('menu');

  // The sampler: a wooden backing for its depth, the painted canvas in front of it.
  const sCanvas = makeCanvas(1024, Math.round((1024 * SAMPLER.h) / SAMPLER.w));
  paintSampler(sCanvas, makeCanvas);
  const backing = new Node('samplerBacking', G.at(G.box(SAMPLER.w + 0.04, SAMPLER.h + 0.04, 0.03, [0.16, 0.09, 0.04]), [0, 0, 0]));
  backing.pos = [SAMPLER.pos[0], SAMPLER.pos[1], wallZ + 0.015];
  const sampler = new Node('sampler', G.quad(SAMPLER.w, SAMPLER.h), { layer: 'ui', tex: { canvas: sCanvas, version: 1 }, tint: [...MENU.tint.sampler] });
  sampler.pos = [...SAMPLER.pos];
  node.add(backing, sampler);

  // The tags, each on a red ribbon from the garland.
  const tags = {};
  for (const [id, T] of Object.entries(TAGS)) {
    const canvas = makeCanvas(512, Math.round((512 * TAG.h) / TAG.w));
    const n = new Node(`tag.${id}`, G.quad(TAG.w, TAG.h), { layer: 'ui', tex: { canvas, version: 0 }, tint: [...MENU.tint.tag] });
    n.pos = [T.x, T.y, TAG.z];
    n.rot = q.fromAxisAngle([0, 0, 1], T.tilt);
    const eye = [T.x - Math.sin(T.tilt) * (TAG.h / 2 - 0.035), T.y + Math.cos(T.tilt) * (TAG.h / 2 - 0.035), TAG.z - 0.004];
    const ribbon = new Node(`ribbon.${id}`, G.merge([
      G.tube([[eye[0] - 0.012, TAG.hang, TAG.z - 0.03], [eye[0] - 0.006, eye[1] + 0.03, TAG.z - 0.006], eye], 0.004, 4, [0.62, 0.05, 0.08]),
      G.tube([[eye[0] + 0.012, TAG.hang, TAG.z - 0.03], [eye[0] + 0.006, eye[1] + 0.03, TAG.z - 0.006], eye], 0.004, 4, [0.62, 0.05, 0.08]),
      G.at(G.box(0.07, 0.03, 0.012, [0.7, 0.06, 0.09]), [eye[0], TAG.hang + 0.004, TAG.z - 0.025], q.fromAxisAngle([0, 0, 1], 0.25)),
      G.at(G.box(0.07, 0.03, 0.012, [0.7, 0.06, 0.09]), [eye[0], TAG.hang + 0.004, TAG.z - 0.025], q.fromAxisAngle([0, 0, 1], -0.25)),
    ]));
    node.add(ribbon, n);
    tags[id] = { node: n, ribbon, canvas, state: { lit: false }, painted: null };
  }
  const watcher = M.nutcracker();
  watcher.name = 'watcher';
  watcher.rim = 1;
  let steps = 0;
  const stand = () => {
    const W = WATCHER[steps];
    watcher.pos = [...W.pos];
    watcher.rot = q.fromYaw(Math.atan2(FACING[0] - W.pos[0], FACING[2] - W.pos[2]));
  };
  stand();
  node.add(watcher);
  node.updateWorld();

  let info = { ar: null, nextNight: null };
  function paint(id) {
    const t = tags[id];
    const text = tagText(id, info);
    const look = { ...text, lit: !text.disabled && !!(t.state.hover || t.state.focus) }; // a tag that can't be pressed never lights
    const key = JSON.stringify(look);
    if (key === t.painted) return false;
    t.painted = key;
    paintTag(t.canvas, look);
    t.node.tex.version++;
    t.node.tint = look.lit && !look.disabled ? [...MENU.tint.lit] : [...MENU.tint.tag];
    return true;
  }
  for (const id of Object.keys(tags)) paint(id);

  // The station's corners: what the framing must show whole.
  const cluster = () => {
    node.updateWorld();
    const pts = corners(SAMPLER.w + 0.04, SAMPLER.h + 0.04).map((c) => m4.point(sampler.world, c));
    for (const t of Object.values(tags)) for (const c of corners(TAG.w, TAG.h)) pts.push(m4.point(t.node.world, c));
    return pts;
  };

  return {
    node, sampler, tags, cluster,
    // Tells the tags what to say: whether mixed reality can start here, and tonight's night for a returning player.
    setInfo(next) { info = { ...info, ...next }; let changed = false; for (const id of Object.keys(tags)) changed = paint(id) || changed; return changed; },
    // Pointer over, or keyboard focus on, a tag's button: it lights up.
    setState(id, s) { const t = tags[id]; if (!t) return false; Object.assign(t.state, s); return paint(id); },
    info: () => ({ ...info }),
    // The firelight on the sampler and tags.
    flicker(k) {
      sampler.tint = MENU.tint.sampler.map((c) => c * k);
      for (const t of Object.values(tags)) {
        const lit = t.state.hover || t.state.focus;
        if (!lit) t.node.tint = MENU.tint.tag.map((c) => c * (0.5 + 0.5 * k));
      }
    },
    watcher,
    get steps() { return steps; },
    // You looked away (the page was hidden, or lost focus) and came back: he is a step nearer, unless he is
    // already as near as he comes. Returns whether he moved.
    lookedAway() { if (steps >= WATCHER.length - 1) return false; steps++; stand(); node.updateWorld(); return true; },
    // During the glide into the seat (k from 0 to 1): you are looking straight at him all the way in, so he is
    // stared down, as in the game. He trembles, sinks into the floor and is gone by the time you sit. If the
    // glide turns away from him first, he is simply gone: they move when you look away.
    glide(viewProj, k = 0) {
      if (!Number.isFinite(k)) return;
      // The sampler hands the wall over to the game's own title (the bulbs on the wall, js/walltitle.js): it fades as
      // you glide in, and is gone by the time you sit.
      const a = 1 - smooth(k / 0.85);
      sampler.alpha = backing.alpha = a;
      backing.layer = a < 1 ? 'blend' : 'opaque';
      sampler.visible = backing.visible = a > 0.01;
      if (!watcher.visible) return;
      const W = WATCHER[steps].pos;
      const head = m4.point(watcher.world, [0, 1.0, 0]);
      const v = m4.point4(viewProj, head);
      const seen = v[3] > 0 && Math.abs(v[0] / v[3]) < 1.02 && Math.abs(v[1] / v[3]) < 1.02;
      const sink = smooth((k - 0.4) / 0.5);
      if (!seen || k >= 1 || sink >= 1) { watcher.visible = false; return; }
      const shake = sink > 0 ? 0.008 * Math.sin(k * 190) : 0;
      watcher.pos = [W[0] + shake, W[1] - 1.25 * sink, W[2]];
      node.updateWorld();
    },
    // Fades the tags (and their ribbons) out: the preview's glide into the seat takes them down.
    tagsAlpha(a) { for (const t of Object.values(tags)) { t.node.alpha = a; t.node.visible = a > 0.01; t.ribbon.visible = a > 0.01; } },
    // Back on the menu (after mixed reality): everything up again where it was.
    reset() {
      for (const t of Object.values(tags)) { t.node.alpha = 1; t.node.visible = true; t.ribbon.visible = true; t.state.hover = false; t.state.focus = false; paint(Object.keys(tags).find((k) => tags[k] === t)); }
      sampler.alpha = backing.alpha = 1; backing.layer = 'opaque'; sampler.visible = backing.visible = true;
      watcher.visible = true; stand(); node.updateWorld();
    },
  };
}

// ---------------------------------------------------------------- framing

export function frameKind(aspect) { return aspect < 0.85 ? 'tall' : aspect < 1.3 ? 'square' : 'wide'; }

const basis = (yaw, pitch) => {
  const r = q.fromYPR(yaw, pitch, 0);
  return { f: q.rotate(r, [0, 0, -1]), r: q.rotate(r, [1, 0, 0]), u: q.rotate(r, [0, 1, 0]) };
};

// The camera that shows these points filling the rect (NDC) on a screen of this aspect, looking from yaw and
// pitch with this vertical field of view (radians): its distance and offset are solved for.
export function fitCamera(points, { yaw, pitch, fov, rect, aspect }) {
  const { f, r, u } = basis(yaw, pitch);
  const tv = Math.tan(fov / 2), th = tv * aspect;
  const c = points.reduce((a, p) => v3.add(a, p), [0, 0, 0]).map((x) => x / points.length);
  const [x0, x1, y0, y1] = rect;
  let D = 3, s = 0, t = 0;
  for (let k = 0; k < 40; k++) {
    let ax = Infinity, bx = -Infinity, ay = Infinity, by = -Infinity;
    for (const p of points) {
      const d = v3.sub(p, c);
      const z = v3.dot(d, f) + D;
      const X = (v3.dot(d, r) - s) / (z * th), Y = (v3.dot(d, u) - t) / (z * tv);
      ax = Math.min(ax, X); bx = Math.max(bx, X); ay = Math.min(ay, Y); by = Math.max(by, Y);
    }
    const scale = Math.max((bx - ax) / (x1 - x0), (by - ay) / (y1 - y0));
    D *= scale;
    s -= ((x0 + x1) / 2 - (ax + bx) / 2) * D * th;
    t -= ((y0 + y1) / 2 - (ay + by) / 2) * D * tv;
  }
  const pos = v3.add(v3.add(v3.sub(c, v3.scale(f, D)), v3.scale(r, s)), v3.scale(u, t));
  return { pos, yaw, pitch, fov };
}

// The station's camera for a screen of this aspect.
export function stationPose(menu, aspect) {
  const F = MENU.frames[frameKind(aspect)];
  // At least 30 degrees across: on a very tall window a narrower view would back the camera out through the wall.
  const fov = Math.min(100 * DEG, Math.max(F.fov * DEG, 2 * Math.atan(Math.tan(15 * DEG) / aspect)));
  const pose = fitCamera(menu.cluster(), { yaw: F.yaw, pitch: F.pitch, fov, rect: F.rect, aspect });
  const { w, d, h } = PREVIEW_ROOM; // and never outside the room, whatever the shape
  pose.pos = [clamp(pose.pos[0], -w / 2 + 0.15, w / 2 - 0.15), clamp(pose.pos[1], 0.4, h - 0.15), clamp(pose.pos[2], -d / 2 + 0.15, d / 2 - 0.15)];
  return pose;
}

// The opening shot: close on the sampler's first line, square to the wall.
export function openingPose(aspect) {
  const fov = 40 * DEG;
  const target = [SAMPLER.pos[0], SAMPLER.pos[1] + SAMPLER.h * 0.29, SAMPLER.pos[2]];
  const halfW = SAMPLER.w * 0.36; // the line's width, a little more than half the sampler
  const D = Math.max(halfW / (Math.tan(fov / 2) * Math.max(0.4, aspect)), 0.45);
  return { pos: [target[0], target[1], target[2] + D], yaw: 0, pitch: 0, fov };
}

const lerpAngle = (a, b, k) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * k;
export function blendPose(a, b, k) {
  return { pos: v3.lerp(a.pos, b.pos, k), yaw: lerpAngle(a.yaw, b.yaw, k), pitch: a.pitch + (b.pitch - a.pitch) * k, fov: a.fov + (b.fov - a.fov) * k };
}

// The camera over time: the pull-back (crane) from the opening shot to the station, then the station itself.
export function menuCamera(menu, { crane = true } = {}) {
  let t = crane ? 0 : Infinity;
  return {
    get t() { return t; },
    get settled() { return t >= MENU.craneHold + MENU.crane; },
    advance(dt) { t += dt; },
    settle() { t = Infinity; },
    // A tap during the pull-back hurries it to the end.
    hurry() { if (t < MENU.craneHold + MENU.crane) t = Math.max(t, MENU.craneHold + MENU.crane * 0.82); },
    pose(aspect) {
      const end = stationPose(menu, aspect);
      if (t >= MENU.craneHold + MENU.crane) return end;
      const k = clamp((t - MENU.craneHold) / MENU.crane, 0, 1);
      return blendPose(openingPose(aspect), end, 1 - Math.pow(1 - smooth(k), 2));
    },
  };
}

// Lays a page button over a tag on screen: the tag's corners projected, a box around them in CSS pixels.
// Returns the box, or null if the tag is out of sight.
export function screenBox(node, w, h, viewProj, cssW, cssH) {
  let ax = Infinity, bx = -Infinity, ay = Infinity, by = -Infinity;
  for (const c of corners(w, h)) {
    const p = m4.point(node.world, c);
    const v = m4.point4(viewProj, p);
    if (v[3] <= 0.01) return null;
    const X = ((v[0] / v[3]) + 1) / 2 * cssW, Y = (1 - (v[1] / v[3])) / 2 * cssH;
    ax = Math.min(ax, X); bx = Math.max(bx, X); ay = Math.min(ay, Y); by = Math.max(by, Y);
  }
  if (bx < 0 || by < 0 || ax > cssW || ay > cssH) return null;
  return { left: ax, top: ay, width: bx - ax, height: by - ay };
}
export const TAG_SIZE = { w: TAG.w, h: TAG.h };
