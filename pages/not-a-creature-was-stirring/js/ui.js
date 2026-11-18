// In-world text panels drawn on a 2D canvas and shown as textured quads.
// Buttons are pressed with a pinch while the fingertip is on them, or by poking.
// The canvas factory is injected so the game can run headless in tests.
import { m4 } from './math.js';
import * as G from './geo.js';
import { Node } from './scene.js';

const SERIF = "Georgia, 'Times New Roman', serif";

// One quad per panel size, shared by every panel (each new game and each headset visit makes new panels).
const quads = new Map();
const quadFor = (w, h) => {
  const k = `${w}x${h}`;
  if (!quads.has(k)) quads.set(k, G.quad(w, h));
  return quads.get(k);
};

// Panel shapes: 'card' (a dark rounded card), 'tag' (a gift tag on its side, its hole and string on the right, tied
// to the ornament box beside it) and 'tags' (the night's result on a big tag, each choice a small red tag tied
// under it, the bundle hung on a string from the middle of the top edge). Buttons are the same rectangles in every
// shape, so pressing works the same way.
const INK = { card: '#f4e6c8', tag: '#3a1f14', tags: '#3a1f14' };
const CREAM = '#f3e7cc', GOLD = '#c9962f';

export class Panel {
  constructor(makeCanvas, { w = 0.36, h = 0.12, px = 640, name = 'panel', shape = 'card' } = {}) {
    this.w = w; this.h = h;
    this.shape = shape;
    this.canvas = makeCanvas(px, Math.round((px * h) / w));
    this.tex = { canvas: this.canvas, version: 0 };
    this.node = new Node(name, quadFor(w, h), { layer: 'ui', tex: this.tex, alpha: 1 });
    this.buttons = [];
    this.inv = m4.identity();
  }

  // lines: [{ t, size (px), color, font }], buttons: [{ id, label }]
  // corner: a small faint label in the bottom-right corner (the build, on the panels players screenshot).
  show(lines, buttons = [], opts = {}) {
    this.draw(lines, buttons, opts);
    this.reveal();
  }

  reveal() {
    if (!this.node.visible) this.appear = 0; // fades in (the game animates it); a new text on a shown panel does not
    this.node.visible = true;
  }

  // Paints the panel without showing it. The same words, buttons and look as last time are not painted
  // again: painting takes milliseconds, and each painting is one more upload to the GPU.
  draw(lines, buttons = [], { bg = 'rgba(14,10,18,0.78)', border = 'rgba(230,180,80,0.9)', corner = null } = {}) {
    const key = JSON.stringify([lines, buttons, bg, border, corner]);
    if (key === this.key) return;
    this.key = key;
    this.lines = lines.map((l) => l.t); // what it says, for tests and the debug readout
    this.corner = corner;
    const ctx = this.canvas.getContext('2d');
    const W = this.canvas.width, H = this.canvas.height;
    ctx.clearRect(0, 0, W, H);
    if (this.shape === 'tag') { this.drawTag(ctx, W, H, lines, corner); this.tex.version++; return; }
    if (this.shape === 'tags') { this.drawTags(ctx, W, H, lines, buttons, corner); this.tex.version++; return; }
    roundRect(ctx, 6, 6, W - 12, H - 12, 26);
    ctx.fillStyle = bg; ctx.fill();
    ctx.lineWidth = 5; ctx.strokeStyle = border; ctx.stroke();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    // The corner label has a band of its own along the bottom: lines and buttons stay above it.
    const cornerPx = corner ? Math.round(Math.min(18, H * 0.075)) : 0;
    const bottom = corner ? H - cornerPx - 18 : H;
    const btnH = buttons.length ? H * 0.26 : 0;
    // Lines share the room above the buttons; if they would not fit, they all shrink together.
    const natural = lines.reduce((s, l) => s + (l.size || 40) * 1.25, 0);
    const k = Math.min(1, (bottom - btnH - 24) / natural);
    const total = natural * k;
    let y = (bottom - btnH - total) / 2 + 6;
    for (const l of lines) {
      const size = (l.size || 40) * k;
      fitFont(ctx, l.t, Math.round(size), W - 44, (px) => `${l.weight || 'bold'} ${px}px ${l.font || SERIF}`);
      ctx.fillStyle = l.color || '#f4e6c8';
      y += size * 0.62;
      ctx.fillText(l.t, W / 2, y);
      y += size * 0.63;
    }
    this.buttons = [];
    buttons.forEach((b, i) => {
      const bw = Math.min(W * 0.42, (W - 40) / buttons.length - 20);
      const x0 = W / 2 - ((bw + 20) * buttons.length - 20) / 2 + i * (bw + 20);
      const y0 = bottom - btnH - 14;
      roundRect(ctx, x0, y0, bw, btnH - 6, 18);
      ctx.fillStyle = 'rgba(170,30,40,0.95)'; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = '#f2c66d'; ctx.stroke();
      fitFont(ctx, b.label, Math.round(btnH * 0.42), bw - 16, (px) => `bold ${px}px ${SERIF}`);
      ctx.fillStyle = '#fff6e0';
      ctx.fillText(b.label, x0 + bw / 2, y0 + (btnH - 6) / 2 + 2);
      this.buttons.push({ id: b.id, x0: x0 / W, y0: y0 / H, x1: (x0 + bw) / W, y1: (y0 + btnH - 6) / H });
    });
    if (corner) {
      ctx.font = `${cornerPx}px ui-monospace, Menlo, monospace`;
      ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
      ctx.fillStyle = 'rgba(244,230,200,0.38)';
      ctx.fillText(corner, W - 22, H - 14);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    }
    this.tex.version++;
  }

  // The night's tag: on its side, the hole and string at the right (toward the box), the words to the left of it.
  drawTag(ctx, W, H, lines, corner) {
    const x = W * 0.02, y = H * 0.06, w = W * 0.96, h = H * 0.88, notch = h * 0.3;
    tagPath(ctx, x, y, w, h, notch, 'right');
    ctx.fillStyle = CREAM; ctx.fill();
    ctx.lineWidth = 5; ctx.strokeStyle = GOLD; ctx.stroke();
    punch(ctx, x + w - notch * 0.85, y + h / 2, h * 0.08);
    string(ctx, [x + w - notch * 0.85, y + h / 2], [W, H * 0.3]);
    const cornerPx = corner ? Math.round(Math.min(16, H * 0.09)) : 0;
    this.buttons = [];
    layLines(ctx, lines, W * 0.02, y, W * 0.82, y + h - (corner ? cornerPx + 8 : 0), INK.tag);
    if (corner) cornerLabel(ctx, corner, x + w - notch - 8, y + h - 10, cornerPx, 'rgba(58,31,20,0.5)');
  }

  // The night's end: what happened on a big tag, each choice a small red tag tied under it.
  drawTags(ctx, W, H, lines, buttons, corner) {
    const bx = W * 0.03, by = H * 0.07, bw = W * 0.94, bh = H * 0.56, notch = Math.min(bw, bh) * 0.16;
    string(ctx, [W / 2, 0], [W / 2, by + notch * 0.9]);
    tagPath(ctx, bx, by, bw, bh, notch, 'top');
    ctx.fillStyle = CREAM; ctx.fill();
    ctx.lineWidth = 5; ctx.strokeStyle = GOLD; ctx.stroke();
    punch(ctx, W / 2, by + notch * 0.9, notch * 0.32);
    const cornerPx = corner ? Math.round(Math.min(18, H * 0.05)) : 0;
    layLines(ctx, lines, bx, by + notch * 1.5, bx + bw, by + bh - (corner ? cornerPx + 10 : 4), INK.tags);
    if (corner) cornerLabel(ctx, corner, bx + bw - 18, by + bh - 12, cornerPx, 'rgba(58,31,20,0.5)');
    this.buttons = [];
    const n = buttons.length, gap = W * 0.05;
    const tw = Math.min(W * 0.4, (bw - (n - 1) * gap) / Math.max(1, n)), th = H * 0.3, ty = H * 0.68, tn = Math.min(tw, th) * 0.2;
    buttons.forEach((b, i) => {
      const tx = (W - (n * tw + (n - 1) * gap)) / 2 + i * (tw + gap);
      string(ctx, [tx + tw / 2, by + bh - 3], [tx + tw / 2, ty + tn * 0.9]);
      tagPath(ctx, tx, ty, tw, th, tn, 'top');
      ctx.fillStyle = 'rgba(168,30,40,0.97)'; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = '#f2c66d'; ctx.stroke();
      punch(ctx, tx + tw / 2, ty + tn * 0.9, tn * 0.3);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      fitFont(ctx, b.label, Math.round(th * 0.36), tw - 20, (px) => `bold ${px}px ${SERIF}`);
      ctx.fillStyle = '#fff6e0';
      ctx.fillText(b.label, tx + tw / 2, ty + tn + (th - tn) / 2);
      this.buttons.push({ id: b.id, x0: tx / W, y0: ty / H, x1: (tx + tw) / W, y1: (ty + th) / H });
    });
  }

  hide() { this.node.visible = false; }

  // World point -> { id, depth } if it is over a button (depth: meters in front of the panel).
  hit(p) {
    if (!this.node.visible || !this.buttons.length) return null;
    m4.invert(this.node.world, this.inv);
    const l = m4.point(this.inv, p);
    const u = l[0] / this.w + 0.5, v = 0.5 - l[1] / this.h;
    // Buttons are forgiving at their edges; where two of them overlap that way, the nearer one wins.
    let best = null, bd = Infinity;
    for (const b of this.buttons) {
      if (u >= b.x0 - 0.03 && u <= b.x1 + 0.03 && v >= b.y0 - 0.06 && v <= b.y1 + 0.06) {
        const d = Math.max(b.x0 - u, u - b.x1);
        if (d < bd) { bd = d; best = b; }
      }
    }
    return best ? { id: best.id, depth: l[2] } : null;
  }

  // A pointing ray (origin, direction in world space) -> { id, point, dist } if it meets a button
  // from in front of the panel; point is where on the panel, dist how far along the ray.
  rayHit(origin, dir) {
    if (!this.node.visible || !this.buttons.length) return null;
    m4.invert(this.node.world, this.inv);
    const o = m4.point(this.inv, origin), d = m4.dir(this.inv, dir);
    if (o[2] <= 0 || d[2] >= -1e-6) return null; // behind the panel, or pointing away from it
    const t = -o[2] / d[2];
    const p = [o[0] + d[0] * t, o[1] + d[1] * t, 0];
    const b = this.hit(m4.point(this.node.world, p));
    if (!b) return null;
    const point = m4.point(this.node.world, p);
    return { id: b.id, point, dist: Math.hypot(point[0] - origin[0], point[1] - origin[1], point[2] - origin[2]) };
  }
}

// Sets ctx.font for the text at the wanted size, or smaller if it would be wider than `room` pixels.
// Headsets substitute their own fonts, so a string that fits on a desk may not fit there.
function fitFont(ctx, text, size, room, fontOf) {
  ctx.font = fontOf(size);
  const wide = ctx.measureText(text).width;
  if (wide > room && wide > 0) ctx.font = fontOf(Math.max(8, Math.floor((size * room) / wide)));
}

// Lines centred in a box, all shrunk together if they would not fit its height, each shrunk to its width.
function layLines(ctx, lines, x0, y0, x1, y1, ink) {
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const natural = lines.reduce((s, l) => s + (l.size || 40) * 1.25, 0);
  const k = Math.min(1, (y1 - y0 - 12) / Math.max(1, natural));
  let y = y0 + (y1 - y0 - natural * k) / 2;
  for (const l of lines) {
    const size = (l.size || 40) * k;
    fitFont(ctx, l.t, Math.round(size), x1 - x0 - 44, (px) => `${l.weight || 'bold'} ${px}px ${l.font || SERIF}`);
    ctx.fillStyle = l.color || ink;
    y += size * 0.62;
    ctx.fillText(l.t, (x0 + x1) / 2, y);
    y += size * 0.63;
  }
}

function cornerLabel(ctx, text, x, y, px, color) {
  ctx.font = `${px}px ui-monospace, Menlo, monospace`;
  ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
}

// A gift tag's outline: a rectangle with two corners cut off at the end that carries the hole.
function tagPath(ctx, x, y, w, h, n, end) {
  ctx.beginPath();
  if (end === 'right') {
    ctx.moveTo(x, y); ctx.lineTo(x + w - n, y); ctx.lineTo(x + w, y + n); ctx.lineTo(x + w, y + h - n);
    ctx.lineTo(x + w - n, y + h); ctx.lineTo(x, y + h);
  } else {
    ctx.moveTo(x, y + n); ctx.lineTo(x + n, y); ctx.lineTo(x + w - n, y); ctx.lineTo(x + w, y + n);
    ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h);
  }
  ctx.closePath();
}

// A punched hole with a brass ring.
function punch(ctx, x, y, r) {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.beginPath(); ctx.arc(x, y, r * 1.25, 0, Math.PI * 2);
  ctx.lineWidth = Math.max(2, r * 0.45); ctx.strokeStyle = '#d4a640'; ctx.stroke();
}

// Red string, with a little sag.
function string(ctx, a, b) {
  ctx.beginPath();
  ctx.moveTo(a[0], a[1]);
  ctx.quadraticCurveTo((a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.05, (a[1] + b[1]) / 2 + Math.abs(b[0] - a[0]) * 0.15, b[0], b[1]);
  ctx.lineWidth = 4; ctx.strokeStyle = '#b3141c'; ctx.stroke();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Canvas stand-in for Node tests: every drawing call is a no-op.
export function stubCanvas(w, h) {
  const ctx = new Proxy({}, {
    get: (t, k) => (k in t ? t[k] : k === 'measureText' ? (s) => ({ width: String(s).length * 10 }) : () => {}),
    set: (t, k, v) => { t[k] = v; return true; },
  });
  return { width: w, height: h, getContext: () => ctx };
}
