// The title on the player's wall, in bulbs: a 5x7 dot font, one bulb per dot with its glow, one node per word, so
// the words light (and go out) one at a time. Where it goes and how much room it has come from layout.title
// (room.js). Geometry and timing only: no DOM or GPU, so it is unit-tested in Node.
import { q, v3, clamp } from './math.js';
import * as G from './geo.js';
import { Node } from './scene.js';
import { cached } from './models.js';
import { faceYaw } from './room.js';

// 5 columns by 7 rows; # is a bulb.
export const GLYPHS = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  D: ['###..', '#..#.', '#...#', '#...#', '#...#', '#..#.', '###..'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.###.'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['.###.', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  J: ['..###', '...#.', '...#.', '...#.', '...#.', '#..#.', '.##..'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  N: ['#...#', '#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '#.#.#', '.#.#.'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
};

// Letters 8 to 25 cm tall (7 rows of bulbs). Bigger than 25 cm crowds the whole view; the room may allow it. Down to
// 5 cm only where a narrow stretch of wall leaves no more room (a nook, a corner of the room jutting in): close
// enough to read that small. Clearing a window never shrinks it past 8 cm.
export const MAX_PITCH = 0.25 / 7;
export const MIN_PITCH = 0.05 / 7;
export const CLEAR_PITCH = 0.08 / 7;
const GAP = 1, WORD_GAP = 3, LINE_GAP = 3, ROWS = 7;
const BULB = 0.32; // bulb radius, in pitches
const SOCKET = 0.5; // the dark socket round each bulb, radius in pitches: the letters read on a white wall too
const SOCKET_COL = [0.035, 0.028, 0.026];
const faceSeat = q.fromAxisAngle([1, 0, 0], Math.PI / 2); // a disc lying flat, turned to face the seat (+Z)
const HALO = 1.4; // glow size, in pitches: any bigger and the letters blur into one another
const LOOKS = {
  title: () => [1.0, 0.84, 0.55], // warm white, like a marquee
  win: (letter) => (letter % 2 ? [0.15, 0.85, 0.3] : [0.9, 0.12, 0.12]), // red and green, letter by letter
};
const lightOf = (c) => { const m = Math.max(...c, 1e-3); return c.map((x) => 0.75 * (x / m) + 0.25); };

// Dot positions in pitch units, the block centred on (0, 0), x right and y up. Each line is centred on its own.
export function textDots(lines) {
  const dots = [], words = [];
  const rows = lines.length * (ROWS + LINE_GAP) - LINE_GAP;
  let cols = 0, letter = 0;
  lines.forEach((line, li) => {
    const lineDots = [];
    let x = 0, width = 0;
    line.split(/ +/).filter(Boolean).forEach((text, k) => {
      if (k) x += WORD_GAP - GAP;
      const word = words.length;
      words.push({ text, line: li });
      for (const ch of text) {
        const g = GLYPHS[ch.toUpperCase()];
        if (g) g.forEach((row, r) => [...row].forEach((c, col) => { if (c === '#') lineDots.push({ c: x + col, r: li * (ROWS + LINE_GAP) + r, word, letter }); }));
        width = x + 5;
        x += 5 + GAP;
        letter++;
      }
    });
    cols = Math.max(cols, width);
    for (const d of lineDots) dots.push({ x: d.c - (width - 1) / 2, y: (rows - 1) / 2 - d.r, word: d.word, letter: d.letter });
  });
  return { dots, words, cols, rows };
}

// The bulb spacing that fits the widest line and every line into the room the wall gives (layout.title).
export function fitPitch(cols, rows, place) {
  return Math.max(MIN_PITCH, Math.min(MAX_PITCH, place.maxW / cols, (place.maxY - place.minY) / rows));
}

// Where the block goes and how big: { p (bulb spacing), s (along the wall from place.center), cy (height of its
// middle) }. Inside minY..maxY, as near the preferred height as fits, slid in from a wall's end. Clear of the
// windows, doors, TV and wall art in place.avoid where it can be: the nearest clear spot at the largest size that has
// one, letters shrinking step by step; with no clear spot at any size, where it would have gone anyway.
const CLEAR = 0.05; // m kept between the title and a window, a door, a TV or a picture
export function layoutBlock(T, place) {
  const sMin = place.sMin ?? -Infinity, sMax = place.sMax ?? Infinity;
  const at = (p) => {
    const W = T.cols * p, H = T.rows * p;
    const lo = place.minY + H / 2, hi = place.maxY - H / 2;
    const cy = lo <= hi ? clamp(place.center[1], lo, hi) : (place.minY + place.maxY) / 2;
    const s = sMax - sMin >= W ? clamp(0, sMin + W / 2, sMax - W / 2) : (sMin + sMax) / 2;
    return { p, s, cy, W, H, lo, hi };
  };
  const first = at(fitPitch(T.cols, T.rows, place));
  const avoid = place.avoid || [];
  const clear = (s, cy, W, H) => avoid.every((a) => s + W / 2 + CLEAR <= a.s0 || s - W / 2 - CLEAR >= a.s1 || cy + H / 2 + CLEAR <= a.y0 || cy - H / 2 - CLEAR >= a.y1);
  if (!avoid.length || clear(first.s, first.cy, first.W, first.H)) return { p: first.p, s: first.s, cy: first.cy };
  for (let p = first.p; ; p = Math.max(Math.min(first.p, CLEAR_PITCH), p * 0.88)) {
    const { W, H, lo, hi, cy: pref } = at(p);
    if (lo <= hi + 1e-9) {
      const ys = [pref, ...avoid.flatMap((a) => [a.y1 + CLEAR + H / 2, a.y0 - CLEAR - H / 2])].filter((y) => y >= lo - 1e-9 && y <= hi + 1e-9);
      const ss = sMax - sMin >= W ? [0, ...avoid.flatMap((a) => [a.s0 - CLEAR - W / 2, a.s1 + CLEAR + W / 2])].map((s) => clamp(s, sMin + W / 2, sMax - W / 2)) : [];
      let best = null;
      for (const cy of ys) for (const s of ss) {
        if (!clear(s, cy, W, H)) continue;
        const d = Math.abs(s) + Math.abs(cy - pref);
        if (!best || d < best.d) best = { d, p, s, cy };
      }
      if (best) return { p: best.p, s: best.s, cy: best.cy };
    }
    if (p <= Math.min(first.p, CLEAR_PITCH)) break;
  }
  return { p: first.p, s: first.s, cy: first.cy };
}

// The title on the wall, dark until told. lightUp and dieOut set when each word changes; update(t) applies it and
// returns what changed ([{ type: 'on' | 'off', at }]), so the game can play a sound where each word is.
export class WallTitle {
  constructor(lines, place, look = 'title') {
    const T = textDots(lines);
    const { p, s, cy } = layoutBlock(T, place);
    this.pitch = p;
    const center = v3.addScaled(place.center, place.right, s);
    center[1] = cy;
    this.node = new Node('wallTitle');
    this.node.pos = center;
    this.node.rot = q.fromYaw(faceYaw(place.normal));

    const colOf = LOOKS[look] || LOOKS.title;
    const key = `wallTitle:${look}:${lines.join('/')}:${Math.round(p * 1e4)}`;
    this.words = T.words.map((w, i) => {
      const mine = T.dots.filter((d) => d.word === i);
      const bulbs = cached(`${key}:${i}`, () => G.merge(mine.flatMap((d) => [
        G.at(G.sphere(BULB * p, 5, 3, colOf(d.letter)), [d.x * p, d.y * p, 0]),
        G.at(G.disc(SOCKET * p, 8, SOCKET_COL), [d.x * p, d.y * p, -0.006], faceSeat),
      ])));
      // The title twinkles a little, bulb by bulb. MERRY CHRISTMAS chases like a marquee: each bulb's phase steps
      // along its row (a quarter turn per column), so a ripple of light runs across the letters (renderer.js sprites).
      const glows = cached(`${key}:${i}:glow`, () => G.sprites(mine.map((d, k) => ({
        p: [d.x * p, d.y * p, 0.004], size: HALO * p, col: lightOf(colOf(d.letter)),
        phase: look === 'win' ? -d.x * (Math.PI / 2) + d.y * 0.3 : (d.letter * 7 + k) * 1.7,
        twinkle: look === 'win' ? 0.7 : 0.12,
      }))));
      const node = new Node(`wallWord${i}`, bulbs, { emissive: 0.04 });
      const glow = new Node(`wallWordGlow${i}`, glows, { layer: 'add', sprite: true, alpha: 0 });
      node.add(glow);
      this.node.add(node);
      const mid = mine.reduce((m, d) => [m[0] + d.x / mine.length, m[1] + d.y / mine.length], [0, 0]);
      return { node, glow, text: w.text, onAt: Infinity, offAt: Infinity, flickerOut: false, lit: false,
        center: v3.add(center, q.rotate(this.node.rot, [mid[0] * p, mid[1] * p, 0])) };
    });
  }

  // Each word in turn, `gap` seconds apart, from t0.
  lightUp(t0, gap) {
    this.words.forEach((w, i) => { w.onAt = t0 + i * gap; w.offAt = Infinity; w.flickerOut = false; });
  }

  // Out one after another, `gap` apart; the last one flickers for a moment first. For the title, the last word left
  // burning is STIRRING.
  dieOut(t0, gap, order = this.words.length === 5 ? [0, 3, 1, 2, 4] : this.words.map((_, i) => i)) {
    order.forEach((i, k) => {
      const w = this.words[i];
      const last = k === order.length - 1;
      w.offAt = Math.min(w.offAt, t0 + k * gap + (last ? 0.6 : 0));
      w.flickerOut = last;
    });
  }

  update(t) {
    const events = [];
    this.words.forEach((w, i) => {
      const lit = t >= w.onAt && t < w.offAt;
      if (lit !== w.lit) { w.lit = lit; events.push({ type: lit ? 'on' : 'off', at: w.center }); }
      let level = lit ? 1 : 0;
      if (lit && t - w.onAt < 0.16) level = Math.floor((t - w.onAt) / 0.04) % 2 ? 0.15 : 1; // catches, like a real bulb
      else if (lit && w.flickerOut && w.offAt - t < 0.6) level = Math.sin(t * 91.7 + i * 13.1) > 0.1 ? 1 : 0.1; // sputters
      w.node.emissive = level > 0.5 ? 0.9 + 0.06 * Math.sin(t * 2.3 + i) : 0.04 + 0.4 * level;
      w.glow.alpha = level > 0.5 ? 0.6 : 0.4 * level * (lit ? 1 : 0);
    });
    return events;
  }

  litCount() { return this.words.filter((w) => w.lit).length; }
}
