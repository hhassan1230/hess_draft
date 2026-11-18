// Procedural low-poly models, all built from code (no asset files).
// Every model faces +Z and stands on its origin unless noted.
import { q, makeRng } from './math.js';
import * as G from './geo.js';
import { Node } from './scene.js';
import { decodeProp } from './props.js';

export const C = {
  red: [0.78, 0.08, 0.1], darkRed: [0.42, 0.03, 0.05], gold: [0.95, 0.7, 0.22], black: [0.05, 0.045, 0.05],
  white: [0.95, 0.93, 0.88], skin: [0.93, 0.76, 0.62], cheek: [0.9, 0.36, 0.36], wood: [0.52, 0.31, 0.15],
  darkWood: [0.32, 0.18, 0.08], green: [0.1, 0.38, 0.17], darkGreen: [0.04, 0.22, 0.1], blue: [0.16, 0.32, 0.78],
  silver: [0.8, 0.82, 0.86], purple: [0.38, 0.1, 0.48], fur: [0.42, 0.36, 0.33], pink: [0.92, 0.55, 0.6],
  cream: [0.93, 0.87, 0.72], flame: [1.0, 0.72, 0.3], glow: [1.0, 0.85, 0.55],
};

const at = G.at;

// Geometry is cached by key so models built again (every spawn, every restart)
// share the same GPU buffers instead of uploading new ones.
const memo = new Map();
export const cached = (key, make) => {
  if (!memo.has(key)) memo.set(key, make());
  return memo.get(key);
};
// A prop from the Christmas Megapack (js/props.js), its meshes decoded once.
export const prop = (name) => cached(`prop.${name}`, () => decodeProp(name));
// Several props as one mesh, one draw call: [{ name, pos, height, yaw = 0 }], heights in metres.
export function propGroup(label, list) {
  return new Node(label, cached(`props.${label}`, () => G.merge(list.map(({ name, pos, height, yaw = 0 }) => G.at(prop(name), pos, q.fromYaw(yaw), [height, height, height])))));
}
export const cachedKeys = () => [...memo.keys()];
// Every geometry built so far (a wall hole caches a few parts under one key).
export const cachedGeos = () => [...memo.values()].flatMap((v) => (v && v.pos && v.count != null ? [v] : Object.values(v || {}).filter((g) => g && g.pos && g.count != null)));

// Builds every model play can spawn, so the first nutcracker, the Mouse King and the finale's debris cost
// nothing when they appear: each takes tens of milliseconds the first time, a hitch in the headset
// at exactly the moments that matter. The game calls this when it is created, before the session opens.
export function warm() {
  nutcracker(); mouseKing(); wallHole(7); wallBlot(); sparkle(); snowflake(); smokePuff();
  for (let i = 0; i < 6; i++) debrisChunk(() => (i + 0.5) / 6);
  for (let i = 0; i < 10; i++) splinter(() => (i + 0.5) / 10);
}
const rx = (a) => q.fromAxisAngle([1, 0, 0], a);
const ry = (a) => q.fromYaw(a);
const rz = (a) => q.fromAxisAngle([0, 0, 1], a);

// Bulb colour to the colour of its light: full strength, a little washed toward white like a hot filament.
const lightOf = (c) => { const m = Math.max(...c, 1e-3); return c.map((x) => 0.75 * (x / m) + 0.25); };

export function blobShadow(r) {
  return new Node('shadow', cached(`shadow${r}`, () => G.disc(r, 12, [0, 0, 0])), { layer: 'blend', alpha: 0.45, emissive: 1, tint: [0, 0, 0], pos: [0, 0.003, 0] });
}

// ---------------------------------------------------------------- nutcracker
// Returns the root node with named parts the game animates:
// legL, legR, armL, armR (pivot nodes), body, head, jaw, pupils.
export function nutcracker(scale = 0.9) {
  const root = new Node('nutcracker');
  const rig = new Node('rig');
  rig.scl = [scale, scale, scale];
  root.add(rig);
  const F8 = Math.PI / 8; // eight-sided turned wood, a flat face to the front

  // Coat: flared tails with a gold hem, a black belt, broad shoulders. Crossed white
  // belts with a gold plate, epaulettes with fringe, a high gold collar.
  const body = new Node('body', cached('nc.body2', () => {
    const parts = [
      G.lathe([[0, 0.19, C.red], [0.12, 0.19, C.gold], [0.118, 0.207, C.red], [0.103, 0.278, C.black], [0.103, 0.302, C.red], [0.1, 0.4, C.red], [0.109, 0.462, C.red], [0.08, 0.49, C.red], [0, 0.49]], 8, C.red, { phase: F8 }),
      at(G.box(0.036, 0.03, 0.012, C.gold), [0, 0.29, 0.097]),
      at(G.box(0.016, 0.016, 0.014, C.black), [0, 0.29, 0.1]),
      at(G.box(0.022, 0.25, 0.01, C.white), [0, 0.385, 0.098], rz(0.5)),
      at(G.box(0.022, 0.25, 0.01, C.white), [0, 0.385, 0.1], rz(-0.5)),
      at(G.cyl(0.02, 0.02, 0.008, 8, C.gold), [0, 0.385, 0.101], rx(Math.PI / 2)),
      at(G.lathe([[0, 0.478], [0.075, 0.478], [0.066, 0.51], [0, 0.51]], 8, C.gold, { phase: F8 }), [0, 0, 0]),
    ];
    for (const side of [-1, 1]) {
      const ep = [at(G.cyl(0.042, 0.04, 0.016, 8, C.gold), [0, 0, 0])];
      for (let i = 0; i < 6; i++) {
        const a = Math.PI * (0.15 + 0.7 * (i / 5)) - Math.PI / 2;
        ep.push(at(G.cyl(0.0045, 0.0045, 0.032, 4, C.gold), [Math.cos(a) * 0.038, -0.03, Math.sin(a) * 0.038]));
      }
      parts.push(at(G.merge(ep), [side * 0.108, 0.47, 0], rz(-side * 0.22), [side, 1, 1]));
    }
    return G.merge(parts);
  }));
  rig.add(body);

  for (const side of [-1, 1]) {
    // White trousers into tall black boots with a cuff and a rounded toe.
    const leg = new Node(side < 0 ? 'legL' : 'legR', cached('nc.leg2', () => G.merge([
      G.lathe([[0, -0.15], [0.034, -0.15], [0.038, 0], [0, 0]], 8, C.white, { phase: F8 }),
      G.lathe([[0, -0.29], [0.036, -0.29], [0.036, -0.15, C.black], [0.043, -0.15, C.black], [0.044, -0.128, C.black], [0, -0.128]], 8, C.black, { phase: F8 }),
      at(G.box(0.07, 0.022, 0.1, C.black), [0, -0.289, 0.018]),
      at(G.sphere(0.036, 8, 4, C.black), [0, -0.278, 0.048], q.identity(), [0.95, 0.55, 1.05]),
    ])));
    leg.pos = [side * 0.055, 0.3, 0];
    rig.add(leg);

    // Red sleeve, gold cuff, white glove.
    const arm = new Node(side < 0 ? 'armL' : 'armR', cached('nc.arm2', () => G.merge([
      G.lathe([[0, -0.16], [0.03, -0.16], [0.034, 0], [0, 0]], 8, C.red, { phase: F8 }),
      at(G.cyl(0.035, 0.035, 0.022, 8, C.gold), [0, -0.175, 0]),
      at(G.sphere(0.03, 7, 5, C.white), [0, -0.205, 0.004], q.identity(), [1, 1.15, 1.05]),
    ])));
    arm.pos = [side * 0.125, 0.47, 0];
    rig.add(arm);
  }

  // A sabre in the left hand, carried point forward and down: it swings with the arm.
  const sword = new Node('sword', cached('nc.sword', () => G.merge([
    at(G.box(0.006, 0.022, 0.27, C.silver), [0, 0, 0.165]),
    at(G.cone(0.011, 0.03, 4, C.silver), [0, 0, 0.3], rx(Math.PI / 2), [0.55, 1, 1]),
    at(G.box(0.07, 0.012, 0.016, C.gold), [0, 0, 0.03]),
    at(G.cyl(0.008, 0.008, 0.055, 6, C.darkWood), [0, 0, 0.025], rx(-Math.PI / 2)),
    at(G.sphere(0.011, 6, 4, C.gold), [0, 0, -0.032]),
  ])), { spec: 0.6 });
  sword.pos = [0, -0.205, 0.01];
  sword.rot = rx(0.95);
  rig.children.find((n) => n.name === 'armL').add(sword);

  // Head: turned wood, white hair, a long pointed nose, angry brows, rosy cheeks,
  // a handlebar moustache over a row of teeth, a tall shako with a plume.
  const head = new Node('head', cached('nc.head2', () => {
    const moustache = (sx) => at(G.tube(
      [[0, 0.072, 0.086], [0.03, 0.069, 0.087], [0.056, 0.075, 0.083], [0.068, 0.092, 0.075]],
      [0.012, 0.011, 0.008, 0.004], 5, C.white), [0, 0, 0], q.identity(), [sx, 1, 1]);
    const parts = [
      G.lathe([[0, 0.02], [0.08, 0.02], [0.08, 0.17], [0, 0.17]], 8, C.skin, { phase: F8 }),
      at(G.box(0.17, 0.13, 0.05, C.white), [0, 0.085, -0.062]),
      at(G.box(0.022, 0.12, 0.1, C.white), [0.084, 0.08, -0.012]),
      at(G.box(0.022, 0.12, 0.1, C.white), [-0.084, 0.08, -0.012]),
      at(G.box(0.04, 0.03, 0.01, C.white), [0.036, 0.12, 0.078]),
      at(G.box(0.04, 0.03, 0.01, C.white), [-0.036, 0.12, 0.078]),
      at(G.box(0.054, 0.016, 0.016, C.black), [0.038, 0.147, 0.08], rz(0.4)),
      at(G.box(0.054, 0.016, 0.016, C.black), [-0.038, 0.147, 0.08], rz(-0.4)),
      at(G.cyl(0.019, 0.019, 0.004, 8, C.cheek), [0.052, 0.088, 0.074], rx(Math.PI / 2)),
      at(G.cyl(0.019, 0.019, 0.004, 8, C.cheek), [-0.052, 0.088, 0.074], rx(Math.PI / 2)),
      at(G.cone(0.02, 0.055, 4, C.skin), [0, 0.096, 0.072], rx(Math.PI / 2)),
      moustache(1), moustache(-1),
      at(G.box(0.1, 0.034, 0.01, [0.12, 0.02, 0.03]), [0, 0.048, 0.074]),
      ...[-0.036, -0.018, 0, 0.018, 0.036].map((x) => at(G.box(0.015, 0.016, 0.008, C.white), [x, 0.058, 0.078])),
      G.lathe([[0, 0.165, C.black], [0.086, 0.165, C.gold], [0.087, 0.19, C.black], [0.091, 0.31, C.gold], [0.092, 0.33, C.black], [0, 0.33]], 8, C.black, { phase: F8 }),
      at(G.box(0.12, 0.01, 0.055, C.black), [0, 0.17, 0.088], rx(0.22)),
      at(G.star(0.026, 0.011, 0.007, 5, C.gold), [0, 0.252, 0.088]),
      at(G.box(0.008, 0.11, 0.01, C.gold), [0.083, 0.115, 0.035], rz(0.06)),
      at(G.box(0.008, 0.11, 0.01, C.gold), [-0.083, 0.115, 0.035], rz(-0.06)),
      at(G.lathe([[0, 0.33], [0.024, 0.35], [0.033, 0.39], [0.024, 0.43], [0, 0.465]], 7, C.red), [0, 0, 0.01], rx(-0.12)),
      at(G.cyl(0.022, 0.026, 0.012, 7, C.gold), [0, 0.327, 0.005]),
    ];
    return G.merge(parts);
  }));
  head.pos = [0, 0.5, 0];
  rig.add(head);

  // Pupils are a very dark red: black in normal light, glowing red when emissive.
  const pupils = new Node('pupils', cached('nc.pupils', () => G.merge([
    at(G.box(0.016, 0.022, 0.01, [0.22, 0.02, 0.02]), [0.034, 0.118, 0.083]),
    at(G.box(0.016, 0.022, 0.01, [0.22, 0.02, 0.02]), [-0.034, 0.118, 0.083]),
  ])));
  head.add(pupils);

  // The jaw: lower teeth, a pointed white beard, and the lever at the back that works it.
  const jaw = new Node('jaw', cached('nc.jaw2', () => G.merge([
    at(G.box(0.13, 0.036, 0.1, C.skin), [0, -0.012, 0.045]),
    ...[-0.03, -0.01, 0.01, 0.03].map((x) => at(G.box(0.015, 0.014, 0.008, C.white), [x, 0.008, 0.094])),
    at(G.box(0.15, 0.06, 0.05, C.white), [0, -0.045, 0.075]),
    at(G.cone(0.05, 0.075, 6, C.white), [0, -0.072, 0.075], rx(Math.PI)),
    at(G.box(0.018, 0.13, 0.018, C.darkWood), [0, -0.05, -0.075], rx(-0.25)),
  ])));
  jaw.pos = [0, 0.035, -0.02];
  head.add(jaw);

  root.add(blobShadow(0.13));
  const part = (name) => rig.children.find((n) => n.name === name);
  root.parts = { rig, body, head, jaw, pupils, sword, legL: part('legL'), legR: part('legR'), armL: part('armL'), armR: part('armR') };
  return withRim(root, 0.9);
}

// Rim light on every lit part (not shadows, glows or self-lit parts): see the rim in renderer.js.
function withRim(root, k) {
  root.traverse((n) => { if (n.geo && n.layer === 'opaque' && !n.sprite && n.emissive < 1) n.rim = k; });
  return root;
}

// ---------------------------------------------------------------- tree
// Tabletop tree. Returns { node, snaps: [local positions], top: local star point, lights: Node }.
// The tree's tiers, bottom to top: y where the tier starts (its tips droop below it), tip radius r,
// height h to its point, and how many branch tips go round it.
const TREE_TIERS = [
  { y: 0.085, r: 0.165, h: 0.12, tips: 14 },
  { y: 0.135, r: 0.14, h: 0.115, tips: 12 },
  { y: 0.185, r: 0.115, h: 0.105, tips: 10 },
  { y: 0.235, r: 0.09, h: 0.1, tips: 8 },
  { y: 0.28, r: 0.065, h: 0.095, tips: 7 },
  { y: 0.32, r: 0.04, h: 0.105, tips: 6 },
].map((T, i) => ({ ...T, droop: 0.22, phase: i * 0.61 }));

// Where a tier's branch tips are, in the tree's own space.
export function firTips(T) {
  return Array.from({ length: T.tips }, (_, k) => {
    const a = T.phase + (k / T.tips) * Math.PI * 2;
    return [Math.sin(a) * T.r, T.y - T.droop * T.h, Math.cos(a) * T.r];
  });
}

export function tree() {
  const node = new Node('tree');
  const tiers = TREE_TIERS;
  const rng = makeRng(11);
  const parts = [
    at(G.cyl(0.06, 0.05, 0.07, 10, C.red), [0, 0, 0]),
    at(G.cyl(0.064, 0.064, 0.012, 10, C.gold), [0, 0.065, 0]),
    at(G.cyl(0.016, 0.016, 0.05, 5, C.darkWood), [0, 0.07, 0]),
  ];
  tiers.forEach((T, i) => {
    const shades = Array.from({ length: T.tips }, () => 0.86 + rng() * 0.26);
    parts.push(at(G.fir(T.r, T.h, T.tips, {
      droop: T.droop, phase: T.phase, col: i % 2 ? [0.13, 0.45, 0.2] : [0.11, 0.41, 0.18],
      inCol: [0.05, 0.24, 0.11], underCol: [0.03, 0.15, 0.07], jitter: (k) => shades[k],
    }), [0, T.y, 0]));
  });
  node.add(new Node('treeBody', cached('tree.body', () => G.merge(parts)), { rim: 0.35 }));

  // Ornament spots: on every other branch tip, the ball on the tip's end. 28 in all.
  const per = [7, 6, 5, 4, 3, 3];
  const snaps = [];
  tiers.forEach((T, i) => {
    const tips = firTips(T), step = T.tips / per[i];
    for (let k = 0; k < per[i]; k++) {
      const p = tips[Math.round(k * step) % T.tips], out = (T.r + 0.006) / T.r;
      snaps.push([p[0] * out, p[1] - 0.004, p[2] * out]);
    }
  });
  // Front-facing snaps first so the first ornaments land where the player looks.
  snaps.sort((a, b) => b[2] - a[2]);

  // How far out the foliage reaches at a height: the widest tier there.
  const reach = (y) => tiers.reduce((m, T) => {
    const top = T.y + T.h, bot = T.y - T.droop * T.h;
    return y >= bot && y <= top ? Math.max(m, (T.r * (top - y)) / (top - bot)) : m;
  }, 0);
  const spiral = (turns, from, to, out, phase, n) => Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1), y = from + t * (to - from), a = phase + t * turns * Math.PI * 2, r = reach(y) * out + 0.004;
    return [Math.sin(a) * r, y, Math.cos(a) * r];
  });
  // A gold garland draped through the branches: hidden behind the tips, showing in the notches.
  const garland = new Node('treeGarland', cached('tree.garland', () => G.tube(spiral(2.5, 0.1, 0.37, 0.84, 2.2, 90), 0.0028, 4, C.gold)), { spec: 0.9 });
  node.add(garland);

  // A string of bulbs spiraling up the other way.
  const bulbs = [], halos = [];
  const cols = [C.red, C.gold, C.blue, C.white];
  spiral(-3.5, 0.11, 0.4, 0.9, 0, 26).forEach((p, i) => {
    bulbs.push(at(G.sphere(0.0065, 6, 4, cols[i % 4]), p));
    const out = (Math.hypot(p[0], p[2]) + 0.004) / Math.max(1e-6, Math.hypot(p[0], p[2]));
    halos.push({ p: [p[0] * out, p[1], p[2] * out], size: 0.02, col: lightOf(cols[i % 4]), phase: i * 2.39996, twinkle: 0.65 });
  });
  const lights = new Node('treeLights', cached('tree.lights', () => G.merge(bulbs)), { emissive: 0.3 });
  const glows = new Node('treeGlows', cached('tree.glows', () => G.sprites(halos)), { layer: 'add', sprite: true, alpha: 0 });
  node.add(lights, glows);
  node.add(blobShadow(0.13));
  return { node, snaps, top: [0, 0.425, 0], lights, glows, tiers };
}

// Glass baubles in three shapes: a ball with a painted band, a teardrop, and a
// faceted gem. The shape follows from the colour, so every caller gets a mix.
export function ornamentStyle(col) {
  return (Math.round(col[0] * 10) + Math.round(col[1] * 10) * 3 + Math.round(col[2] * 10) * 7) % 3;
}
export function ornament(col, style = ornamentStyle(col)) {
  const band = col[0] + col[1] + col[2] > 2.2 ? C.red : C.gold;
  return new Node('ornament', cached(`orn2:${style}:${col.join(',')}`, () => {
    const cap = [
      at(G.cyl(0.0075, 0.0085, 0.011, 6, C.gold), [0, 0.022, 0]),
      at(G.tube(Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2; return [Math.cos(a) * 0.0045, 0.0375 + Math.sin(a) * 0.0045, 0]; }), 0.0012, 3, C.gold, { closed: true }), [0, 0, 0]),
    ];
    if (style === 1) {
      return G.merge([G.lathe([[0, -0.035], [0.007, -0.027], [0.018, -0.014], [0.026, 0.0], [0.024, 0.014], [0.014, 0.024], [0, 0.026]], 10, col), ...cap]);
    }
    if (style === 2) {
      return G.merge([G.lathe([[0, -0.033], [0.027, -0.004], [0.027, 0.006], [0.012, 0.024], [0, 0.026]], 6, col, { phase: Math.PI / 6 }), ...cap]);
    }
    return G.merge([
      G.lathe([[0, -0.026], [0.0135, -0.0225], [0.0225, -0.013], [0.026, -0.004, band], [0.0262, 0.004, col], [0.0225, 0.013], [0.0135, 0.0225], [0, 0.026]], 10, col),
      ...cap,
    ]);
  }), { spec: 1 });
}

export function star() {
  return new Node('star', cached('star', () => G.star(0.042, 0.018, 0.014, 5, C.gold)), { emissive: 0.5, spec: 0.8 });
}

// Ornament tray. Returns { node, slots: [local positions] } with `count` slots in two rows.
export function ornamentBox(count) {
  const cols = Math.ceil(count / 2);
  const w = Math.max(0.14, cols * 0.06 + 0.02), d = 0.13, h = 0.035, t = 0.008;
  const node = new Node('box', cached(`box${count}`, () => G.merge([
    at(G.box(w, t, d, C.darkRed), [0, t / 2, 0]),
    at(G.box(w, h, t, C.red), [0, h / 2, d / 2 - t / 2]),
    at(G.box(w, h, t, C.red), [0, h / 2, -d / 2 + t / 2]),
    at(G.box(t, h, d, C.red), [w / 2 - t / 2, h / 2, 0]),
    at(G.box(t, h, d, C.red), [-w / 2 + t / 2, h / 2, 0]),
    at(G.box(w, 0.006, 0.004, C.gold), [0, h + 0.002, d / 2]),
    at(G.box(0.004, h * 0.8, d - 2 * t, C.darkRed), [0, h * 0.4, 0]),
  ])));
  node.add(blobShadow(Math.max(w, d) * 0.62));
  const slots = [];
  for (let i = 0; i < count; i++) {
    const row = i % 2, col = Math.floor(i / 2);
    slots.push([-w / 2 + 0.04 + col * ((w - 0.08) / Math.max(1, cols - 1 || 1)), 0.036, row ? -0.032 : 0.032]);
  }
  if (cols === 1) for (const s of slots) s[0] = 0;
  return { node, slots };
}

// Candle on a brass chamberstick: ivory wax with a melted top and drips, a flame
// node the game flickers and snuffs, and a glow that goes out with it.
const BRASS = [0.8, 0.57, 0.24];
const WAX = [0.95, 0.9, 0.78];
export function candle(height = 0.08, col = WAX) {
  const top = 0.016 + height;
  const node = new Node('candle', cached(`candle2:${height}:${col}`, () => {
    const parts = [
      G.lathe([[0, 0.016], [0.015, 0.016], [0.015, top], [0.0115, top - 0.003], [0, top - 0.0045]], 8, col),
      at(G.cyl(0.0012, 0.0012, 0.012, 3, C.black), [0, top - 0.004, 0]),
    ];
    // Drips run down from the rim: one long, two short.
    [[0.5, 0.034], [2.3, 0.016], [4.1, 0.022]].forEach(([a, len]) => {
      const r = 0.0152, x = Math.cos(a) * r, z = Math.sin(a) * r;
      parts.push(G.tube([[x, top - 0.001, z], [x * 1.04, top - len * 0.6, z * 1.04], [x * 1.05, top - len, z * 1.05]], [0.0034, 0.003, 0.0036], 4, col));
    });
    return G.merge(parts);
  }));
  const holder = new Node('holder', cached('chamberstick', () => G.merge([
    G.lathe([[0, 0], [0.036, 0], [0.037, 0.008], [0.032, 0.008], [0.031, 0.004], [0.019, 0.004], [0.019, 0.022], [0.022, 0.022], [0.022, 0.026], [0.0155, 0.026], [0.0155, 0.018], [0, 0.018]], 10, BRASS),
    at(G.tube(Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * Math.PI * 2; return [Math.cos(a) * 0.012, Math.sin(a) * 0.012, 0]; }), 0.0028, 4, BRASS, { closed: true }), [0.046, 0.014, 0]),
    at(G.box(0.012, 0.004, 0.008, BRASS), [0.037, 0.006, 0]),
  ])), { spec: 0.7 });
  const flame = new Node('flame', cached('flame', () => G.merge([
    at(G.cone(0.009, 0.03, 5, C.flame), [0, 0, 0]),
    at(G.cone(0.009, 0.006, 5, C.flame), [0, 0, 0], rx(Math.PI)),
  ])), { layer: 'add', emissive: 1, alpha: 1 });
  flame.pos = [0, top, 0];
  // A wide warm halo and a small hot core, both soft: the candles are the player's lives, so they must read as light.
  const glow = new Node('glow', cached('candleGlow', () => G.sprites([
    { p: [0, 0, 0], size: 0.085, col: [1.0, 0.5, 0.16] },
    { p: [0, 0, 0], size: 0.024, col: [1.0, 0.92, 0.7] },
  ])), { layer: 'add', sprite: true, alpha: 0.8 });
  glow.pos = [0, top + 0.014, 0];
  node.add(holder, flame, glow, blobShadow(0.042));
  node.holder = holder;
  node.flame = flame;
  node.glow = glow;
  return node;
}

// Warm light the candles throw on the table: a flat glow lying on the node's XZ plane.
export function lightPool(r, col = [1.0, 0.5, 0.18]) {
  return new Node('lightPool', cached(`pool${r}`, () => G.sprites([{ p: [0, 0, 0], size: r, col }])), { layer: 'add', sprite: true, flat: true, alpha: 0 });
}

// One puff of a snuffed wick's smoke: soft, pale, and it hides what is behind it a little.
export function smokePuff() {
  return new Node('smoke', cached('smokePuff', () => G.sprites([{ p: [0, 0, 0], size: 0.018, col: [0.8, 0.8, 0.82] }])), { layer: 'blend', sprite: true, cover: 1, alpha: 0.5 });
}


// Small round table the game uses when no real table is in reach. Origin at the top surface.
export function sideTable(height) {
  height = Math.round(height * 100) / 100;
  return new Node('sideTable', cached(`side${height}`, () => G.merge([
    at(G.cyl(0.23, 0.23, 0.03, 12, C.darkWood), [0, -0.03, 0]),
    at(G.cyl(0.235, 0.235, 0.006, 12, C.gold), [0, -0.033, 0]),
    at(G.cyl(0.025, 0.035, Math.max(0.05, height - 0.05), 6, C.darkWood), [0, -height, 0]),
    at(G.cyl(0.13, 0.15, 0.025, 8, C.darkWood), [0, -height, 0]),
  ])));
}

export const haloGeo = () => G.sprites([{ p: [0, 0, 0], size: 0.13, col: [1.0, 0.78, 0.35] }]);

// ---------------------------------------------------------------- string lights
// runs: [[a, b], ...] world-space segments. Returns { node, runs: [Node per run] }.
export function stringLights(runs) {
  const key = 'lights' + JSON.stringify(runs.map(([a, b]) => [...a, ...b].map((x) => Math.round(x * 1000))));
  const built = cached(key, () => buildLights(runs));
  const node = new Node('stringLights');
  const runNodes = built.runs.map((g, i) => {
    const run = new Node('run', g, { emissive: 1 });
    run.glow = new Node('runGlow', built.glows[i], { layer: 'add', sprite: true, alpha: 0 });
    run.add(run.glow);
    return run;
  });
  node.add(...runNodes);
  if (built.wire) node.add(new Node('wire', built.wire));
  return { node, runs: runNodes };
}

function buildLights(runs) {
  const cols = [C.red, [0.2, 0.9, 0.3], C.gold, C.blue, [0.9, 0.3, 0.8]];
  const wire = [];
  const runNodes = [], glowGeos = [];
  let k = 0;
  for (const [a, b] of runs) {
    const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
    const len = Math.hypot(dx, dy, dz);
    const n = Math.max(2, Math.floor(len / 0.22));
    const yaw = Math.atan2(dx, dz);
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const sag = -0.07 * Math.abs(Math.sin(t * Math.PI * Math.max(1, Math.round(len / 0.9))));
      pts.push([a[0] + dx * t, a[1] + dy * t + sag, a[2] + dz * t]);
    }
    const bulbs = [], halos = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i], p2 = pts[i + 1];
      const mid = [(p[0] + p2[0]) / 2, (p[1] + p2[1]) / 2, (p[2] + p2[2]) / 2];
      const seg = Math.hypot(p2[0] - p[0], p2[1] - p[1], p2[2] - p[2]);
      const pitch = Math.atan2(p2[1] - p[1], Math.hypot(p2[0] - p[0], p2[2] - p[2]));
      wire.push(at(G.box(0.005, 0.005, seg, [0.05, 0.12, 0.06]), mid, q.mul(ry(yaw), rx(-pitch))));
      const bp = [p[0], p[1] - 0.025, p[2]];
      bulbs.push(at(G.cyl(0.007, 0.007, 0.014, 5, [0.05, 0.2, 0.08]), [bp[0], bp[1] + 0.012, bp[2]]));
      const col = cols[k++ % cols.length];
      bulbs.push(at(G.sphere(0.014, 6, 4, col), [bp[0], bp[1], bp[2]], q.identity(), [1, 1.35, 1]));
      halos.push({ p: [bp[0], bp[1] - 0.004, bp[2]], size: 0.05, col: lightOf(col), phase: k * 1.7, twinkle: 0.25 });
    }
    runNodes.push(G.merge(bulbs));
    glowGeos.push(G.sprites(halos));
  }
  return { runs: runNodes, glows: glowGeos, wire: wire.length ? G.merge(wire) : null };
}

// ---------------------------------------------------------------- Mouse King
// Three crowned rat heads over a purple cape. Returns root with parts.eyes and parts.heads.
export function mouseKing() {
  const root = new Node('mouseKing');
  const ermine = [0.96, 0.95, 0.92];
  // A hunched royal robe with an ermine hem and mantle, a gold chain of office, clawed
  // arms reaching out of ermine cuffs, and a great sabre raised in the right claw.
  const cape = new Node('cape', cached('king.robe', () => {
    const parts = [
      at(G.lathe([[0, -0.87, C.purple], [0.47, -0.87, ermine], [0.48, -0.8, C.purple], [0.42, -0.62, C.purple], [0.33, -0.44, C.purple], [0.285, -0.36, ermine], [0.305, -0.31, ermine], [0.27, -0.23, ermine], [0.17, -0.165, ermine], [0, -0.15]], 9, C.purple), [0, 0, -0.12]),
      at(G.tube(Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return [Math.cos(a) * 0.3, -0.31 - 0.07 * Math.max(0, Math.sin(a)), Math.sin(a) * 0.3]; }), 0.012, 4, C.gold, { closed: true }), [0, 0, -0.12]),
      at(G.cyl(0.05, 0.05, 0.014, 8, C.gold), [0, -0.38, 0.185], rx(Math.PI / 2)),
      at(G.box(0.03, 0.03, 0.01, C.red), [0, -0.38, 0.2], rz(Math.PI / 4)),
    ];
    // Ermine flecks on the hem and the mantle.
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2 + 0.2;
      parts.push(at(G.box(0.014, 0.03, 0.006, C.black), [Math.cos(a) * 0.48, -0.835, Math.sin(a) * 0.48 - 0.12], ry(-a + Math.PI / 2)));
      parts.push(at(G.box(0.011, 0.022, 0.006, C.black), [Math.cos(a + 0.22) * 0.302, i % 2 ? -0.32 : -0.28, Math.sin(a + 0.22) * 0.302 - 0.12], ry(-a - 0.22 + Math.PI / 2)));
    }
    for (const side of [-1, 1]) {
      const sh = [side * 0.27, -0.27, -0.06], el = [side * 0.42, -0.4, 0.05], wr = [side * 0.4, -0.42, 0.24];
      parts.push(G.tube([sh, el, wr], [0.075, 0.06, 0.05], 6, C.purple));
      parts.push(G.tube([[wr[0] * 0.99, wr[1], wr[2] - 0.02], [wr[0], wr[1], wr[2] + 0.025]], 0.064, 7, ermine));
      parts.push(at(G.sphere(0.048, 6, 5, C.fur), [wr[0], wr[1], wr[2] + 0.06]));
      for (let k = 0; k < 3; k++) {
        const x = wr[0] + (k - 1) * 0.026;
        parts.push(at(G.cone(0.011, 0.055, 4, C.cream), [x, wr[1] - 0.012, wr[2] + 0.09], rx(Math.PI / 2 + 0.5)));
      }
    }
    // The sabre, raised high in the right claw.
    const hand = [0.4, -0.42, 0.3];
    const blade = q.mul(rz(-0.35), rx(-0.55));
    parts.push(at(G.merge([
      at(G.box(0.012, 0.6, 0.05, C.silver), [0, 0.33, 0]),
      at(G.cone(0.026, 0.07, 4, C.silver), [0, 0.63, 0], q.identity(), [0.45, 1, 1]),
      at(G.box(0.13, 0.018, 0.03, C.gold), [0, 0.03, 0]),
      at(G.cyl(0.014, 0.014, 0.08, 6, C.darkWood), [0, -0.05, 0]),
      at(G.sphere(0.02, 6, 4, C.gold), [0, -0.06, 0]),
    ]), hand, blade));
    return G.merge(parts);
  }), { spec: 0.35 });
  root.add(cape);

  // A long bare tail curling out from under the hem.
  const tail = new Node('tail', cached('king.tail', () => G.tube(
    [[0, -0.84, -0.5], [0.02, -0.86, -0.68], [0.16, -0.84, -0.82], [0.34, -0.78, -0.8], [0.44, -0.66, -0.68], [0.42, -0.55, -0.56]],
    [0.04, 0.034, 0.026, 0.019, 0.012, 0.005], 6, C.pink)));
  root.add(tail);

  const heads = [];
  const eyes = [];
  const place = [
    { pos: [0, 0, 0.06], yaw: 0, roll: 0, s: 1 },
    { pos: [-0.33, -0.06, -0.02], yaw: -0.45, roll: 0.25, s: 0.74 },
    { pos: [0.33, -0.06, -0.02], yaw: 0.45, roll: -0.25, s: 0.74 },
  ];
  for (const p of place) {
    // Rat head: a long snout, pink nose, big ears, buck teeth, splayed whiskers,
    // angry brows, and a spiked gold crown with a ruby.
    const h = new Node('kingHead', cached('king.head2', () => {
      const parts = [
        at(G.sphere(0.14, 9, 7, C.fur), [0, 0, 0], q.identity(), [1, 0.94, 1.05]),
        at(G.lathe([[0, 0], [0.09, 0], [0.075, 0.1], [0.045, 0.19], [0, 0.235]], 8, C.fur), [0, -0.035, 0.07], rx(Math.PI / 2), [1, 1, 0.82]),
        at(G.sphere(0.026, 6, 4, C.pink), [0, -0.03, 0.305]),
        at(G.box(0.022, 0.05, 0.012, C.cream), [0.013, -0.09, 0.2]),
        at(G.box(0.022, 0.05, 0.012, C.cream), [-0.013, -0.09, 0.2]),
        at(G.box(0.13, 0.02, 0.025, [0.25, 0.2, 0.19]), [0.055, 0.075, 0.12], rz(0.42)),
        at(G.box(0.13, 0.02, 0.025, [0.25, 0.2, 0.19]), [-0.055, 0.075, 0.12], rz(-0.42)),
        at(G.cyl(0.095, 0.09, 0.05, 8, C.gold), [0, 0.11, -0.01]),
        ...[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2;
          return at(G.cone(0.02, 0.06, 4, C.gold), [Math.sin(a) * 0.085, 0.16, Math.cos(a) * 0.085 - 0.01]);
        }),
        ...[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2;
          return at(G.sphere(0.009, 4, 3, C.white), [Math.sin(a) * 0.085, 0.22, Math.cos(a) * 0.085 - 0.01]);
        }),
        at(G.box(0.03, 0.03, 0.012, C.red), [0, 0.135, 0.087], rz(Math.PI / 4)),
      ];
      for (const sx of [-1, 1]) {
        parts.push(at(G.lathe([[0, 0], [0.078, 0], [0.078, 0.016], [0, 0.016]], 9, C.fur), [sx * 0.115, 0.12, -0.01], q.mul(rz(-sx * 0.35), rx(Math.PI / 2))));
        parts.push(at(G.cyl(0.054, 0.054, 0.006, 9, C.pink), [sx * 0.117, 0.122, 0.008], q.mul(rz(-sx * 0.35), rx(Math.PI / 2))));
        for (let k = 0; k < 3; k++) parts.push(at(G.box(0.2, 0.004, 0.004, C.black), [sx * 0.1, -0.035 + (k - 1) * 0.012, 0.25], rz(sx * (0.08 + (k - 1) * 0.14))));
      }
      return G.merge(parts);
    }));
    h.pos = p.pos;
    h.rot = q.mul(ry(p.yaw), rz(p.roll));
    h.scl = [p.s, p.s, p.s];
    const e = new Node('kingEyes', cached('king.eyes', () => G.merge([
      at(G.sphere(0.024, 5, 4, [1, 0.1, 0.05]), [0.06, 0.045, 0.118]),
      at(G.sphere(0.024, 5, 4, [1, 0.1, 0.05]), [-0.06, 0.045, 0.118]),
    ])), { emissive: 1 });
    h.add(e);
    eyes.push(e);
    heads.push(h);
    root.add(h);
  }
  root.parts = { heads, eyes, cape, tail };
  return withRim(root, 1.1);
}

// ---------------------------------------------------------------- wall crack
// Jagged hole in a wall, facing +Z (the wall normal). parts.cracks scale in as it breaks.
export function wallHole(seed = 7) {
  const g = cached(`hole${seed}`, () => holeGeo(seed));
  const root = new Node('hole');
  const hole = new Node('holeBlack', g.hole, { emissive: 1, tint: [0, 0, 0] });
  hole.pos = [0, 0, 0.012];
  const inner = new Node('holeGlow', g.inner, { emissive: 1 });
  inner.pos = [0, -0.04, 0.014];
  const shade = new Node('holeShade', g.shade, { layer: 'blend', alpha: 0.6, emissive: 1, tint: [0.02, 0.02, 0.02] });
  shade.pos = [0, 0, 0.01];
  const crackNode = new Node('cracks', g.cracks, { emissive: 1, tint: [0, 0, 0] });
  crackNode.pos = [0, 0, 0.011];
  root.add(shade, crackNode, hole, inner);
  root.parts = { hole, inner, shade, cracks: crackNode };
  return root;
}

function holeGeo(seed) {
  const rng = makeRng(seed);
  const N = 16;
  const jag = (r0, r1) => Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2;
    const r = r0 + rng() * (r1 - r0);
    return [Math.cos(a) * r * 1.15, Math.sin(a) * r];
  });
  const hole = G.poly(jag(0.42, 0.56), [0, 0, 0]);
  const inner = G.poly(jag(0.2, 0.3), [0.5, 0.05, 0.03]);
  const shade = G.poly(jag(0.6, 0.72), [0, 0, 0]);
  const cracks = [];
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + rng() * 0.4;
    const len = 0.25 + rng() * 0.35;
    const r = 0.5;
    cracks.push(at(G.box(len, 0.014, 0.004, [0, 0, 0]), [Math.cos(a) * (r + len / 2) * 1.1, Math.sin(a) * (r + len / 2), 0], rz(a)));
  }
  return { hole, inner, shade, cracks: G.merge(cracks) };
}

export function debrisChunk(rng) {
  const i = Math.floor(rng() * 6);
  return new Node('debris', cached(`debris${i}`, () => {
    const r = makeRng(100 + i);
    const s = 0.02 + r() * 0.04;
    return G.box(s, s * (0.5 + r()), s * (0.5 + r()), i % 2 ? [0.85, 0.83, 0.8] : [0.4, 0.38, 0.36]);
  }));
}

export function splinter(rng) {
  const i = Math.floor(rng() * 10);
  return new Node('splinter', cached(`splinter${i}`, () => {
    const r = makeRng(200 + i);
    const cols = [C.red, C.white, C.black, C.gold, C.skin];
    return G.box(0.02 + r() * 0.05, 0.015 + r() * 0.03, 0.015 + r() * 0.02, cols[i % cols.length]);
  }));
}

export function sparkle() {
  return new Node('sparkle', cached('sparkle', () => G.star(0.012, 0.004, 0.003, 4, C.glow)), { layer: 'add', emissive: 1 });
}

// A snowflake: a small six-pointed star, glowing white, for the snow that falls in the room.
export function snowflake() {
  return new Node('snowflake', cached('snowflake', () => G.star(0.009, 0.003, 0.002, 6, C.white)), { layer: 'add', emissive: 1 });
}

// Dark doorway on the wall a nutcracker steps out of; it hides the part still "inside" the wall.
export function wallBlot() {
  return new Node('blot', cached('blot', () => G.poly(Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    const r = 1 + (i % 2) * 0.08;
    return [Math.cos(a) * 0.2 * r, Math.sin(a) * 0.5 * r + 0.48];
  }), [0, 0, 0])), { emissive: 1, tint: [0, 0, 0] });
}

// Two fingertip dots that pinch together: the no-text "pinch here" hint.
export function pinchHint() {
  const root = new Node('pinchHint');
  const dot = cached('dot', () => G.sphere(0.008, 6, 4, C.glow));
  const a = new Node('thumb', dot, { layer: 'add', emissive: 1 });
  const b = new Node('index', dot, { layer: 'add', emissive: 1 });
  root.add(a, b);
  root.parts = { a, b };
  return root;
}

// Where a pointing ray meets a button: a small bright dot with a soft ring of light.
export function cursorDot() {
  return new Node('cursor', cached('cursorDot', () => G.sprites([
    { p: [0, 0, 0], size: 0.03, col: [1.0, 0.85, 0.55] },
    { p: [0, 0, 0], size: 0.009, col: [1, 1, 1] },
  ])), { layer: 'top', sprite: true, alpha: 1 }); // drawn after the panels it sits on
}

export function snapMarker() {
  return new Node('snapMarker', cached('marker', () => G.sphere(0.009, 6, 4, C.glow)), { layer: 'add', emissive: 1, alpha: 0.9 });
}

// ---------------------------------------------------------------- preview room
// A virtual living room for the phone/desktop preview: floor, walls, ceiling,
// coffee table, couch, door, window, rug. spec: { w, d, h, table: {center, w, d} }.
// The preview's stand-in for your living room: striped wallpaper over wood panelling, a plank floor and a
// rug, a fireplace with stockings on the front wall (left of the middle, where the Mouse King breaks
// through), a wreath, a moonlit window with curtains, a door and a couch. Built once, drawn as the backdrop.
// room.fx holds the fire and its glow (drawn with the game, so the fire burns through the dark), and
// room.fireLight the warm light it throws.
export function previewRoom(spec) {
  const { w, d, h } = spec;
  const hash = (a, b = 0) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
  const parts = [];
  const RAIL = 0.95;
  // Each wall as a frame: x along the wall as seen from inside, y up, z out of the wall into the room.
  const walls = [
    { len: w, pos: [0, 0, -d / 2], rot: [0, 0, 0, 1] },
    { len: w, pos: [0, 0, d / 2], rot: ry(Math.PI) },
    { len: d, pos: [-w / 2, 0, 0], rot: ry(Math.PI / 2) },
    { len: d, pos: [w / 2, 0, 0], rot: ry(-Math.PI / 2) },
  ];
  const onWall = (W, g, x, y, z = 0, rot = [0, 0, 0, 1]) => at(at(g, [x, y, z], rot), W.pos, W.rot);
  const paper = (ix) => (ix % 9 === 0 ? [0.36, 0.33, 0.2] : Math.floor((ix % 9 - 1) / 4) ? [0.17, 0.3, 0.22] : [0.13, 0.25, 0.18]);
  for (const W of walls) {
    const hp = h - RAIL;
    parts.push(onWall(W, G.grid(W.len, hp, Math.round(W.len / 0.037), 4, (ix) => paper(ix)), 0, RAIL + hp / 2, 0.001));
    parts.push(onWall(W, G.grid(W.len, RAIL, Math.round(W.len / 0.5), 3, (ix, iy) => (iy === 0 ? [0.17, 0.1, 0.05] : (ix % 2 ? [0.25, 0.14, 0.07] : [0.23, 0.13, 0.065]))), 0, RAIL / 2, 0.001));
    for (let x = -W.len / 2 + 0.3; x < W.len / 2 - 0.2; x += 0.55) parts.push(onWall(W, G.box(0.42, 0.48, 0.014, [0.29, 0.17, 0.09]), x, 0.5, 0.007));
    parts.push(onWall(W, G.box(W.len, 0.045, 0.025, [0.86, 0.8, 0.66]), 0, RAIL, 0.0125));
    parts.push(onWall(W, G.box(W.len, 0.09, 0.04, [0.86, 0.8, 0.66]), 0, h - 0.045, 0.02));
    parts.push(onWall(W, G.box(W.len, 0.1, 0.022, [0.16, 0.09, 0.045]), 0, 0.05, 0.011));
  }
  // Floor of planks (its own mesh, drawn first, so the rug can be painted over it), and a ceiling.
  const plank = [[0.36, 0.22, 0.12], [0.33, 0.2, 0.11], [0.39, 0.24, 0.13], [0.31, 0.19, 0.1]];
  const floor = at(G.grid(w, d, Math.round(w / 0.14), 16, (ix, iy) => plank[Math.floor(hash(ix) * 4)].map((c) => c * (0.93 + 0.12 * hash(ix, iy)))), [0, 0, 0], rx(-Math.PI / 2));
  parts.push(at(G.box(w, 0.02, d, [0.16, 0.15, 0.15]), [0, h + 0.01, 0]));
  // A rug under the table: gold border, red field, dark green centre, a gold diamond. Flat layers painted over
  // the floor and over each other in this order: a decal (see the backdrop pass in js/renderer.js). It was four
  // boxes 0.5 to 4 mm apart, and the PSX vertex snap moves each surface's depth by more than that, so its
  // layers traded places as the camera moved: the rug flickered.
  const rugAt = (g) => at(g, [0, 0.003, -0.3], rx(-Math.PI / 2));
  const rug = [
    rugAt(G.quad(2.45, 1.95, [0.72, 0.55, 0.25])),
    rugAt(G.quad(2.3, 1.8, [0.5, 0.08, 0.1])),
    rugAt(G.quad(1.95, 1.45, [0.1, 0.22, 0.14])),
    rugAt(G.quad(1.85, 1.35, [0.42, 0.07, 0.09])),
    rugAt(G.poly([[0, 0.45], [0.6, 0], [0, -0.45], [-0.6, 0]], [0.72, 0.55, 0.25])),
  ];

  // Fireplace on the front wall.
  const F = walls[0], fx0 = -1.35;
  const brick = (ix, iy) => [[0.45, 0.17, 0.12], [0.4, 0.15, 0.1], [0.5, 0.2, 0.14]][Math.floor(hash(ix + (iy % 2) * 0.5, iy) * 3)];
  // Brick pillars and a lintel round an open firebox (so the fire inside can be seen).
  for (const [x, ww, y, hh, nx, ny] of [[-0.4725, 0.305, 0.55, 1.1, 2, 11], [0.4725, 0.305, 0.55, 1.1, 2, 11], [0, 0.64, 0.85, 0.5, 4, 5]]) {
    parts.push(onWall(F, G.box(ww, hh, 0.24, [0.42, 0.16, 0.11]), fx0 + x, y, 0.12));
    parts.push(onWall(F, G.grid(ww, hh, nx, ny, (ix, iy) => brick(ix + Math.round((x + 1) * 7), iy)), fx0 + x, y, 0.2405));
  }
  parts.push(onWall(F, G.box(0.64, 0.6, 0.02, [0.05, 0.035, 0.03]), fx0, 0.3, 0.01)); // soot-black back
  for (const sx of [-1, 1]) parts.push(onWall(F, G.box(0.02, 0.6, 0.22, [0.16, 0.07, 0.05]), fx0 + sx * 0.31, 0.3, 0.12));
  parts.push(onWall(F, G.box(1.5, 0.06, 0.46, [0.42, 0.4, 0.38]), fx0, 0.03, 0.23));
  parts.push(onWall(F, G.box(1.55, 0.08, 0.34, [0.84, 0.78, 0.64]), fx0, 1.14, 0.17));
  // Christmas Megapack props (js/props.js): presents on the hearth and one on the floor, a teddy by the fire,
  // a lantern, a gingerbread man and a candy cane on the mantel. The left of the hearth stays bare: a nutcracker
  // steps out of the side wall there (test/preview-room.test.mjs).
  const P = (name, x, y, z, height, yaw = 0) => parts.push(onWall(F, at(prop(name), [0, 0, 0], q.identity(), [height, height, height]), fx0 + x, y, z, ry(yaw)));
  P('present1', 0.5, 0.06, 0.33, 0.22, 0.4);
  P('present7', 0.67, 0.06, 0.37, 0.15, -0.3);
  P('present2', 0.56, 0, 0.62, 0.12, 0.25);
  P('teddy', -0.18, 0, 0.62, 0.3, 0.35); // his paw stays out of that corner spawn's way
  P('lantern', -0.6, 1.18, 0.17, 0.28);
  P('gingerbread', 0.42, 1.18, 0.13, 0.2, -0.15);
  P('candycane', 0.6, 1.18, 0.15, 0.22, 0.5);
  const log = at(G.cyl(0.035, 0.035, 0.34, 6, [0.3, 0.17, 0.08]), [-0.17, 0, 0], rz(-Math.PI / 2)); // lying along x, centred
  for (const [x, y, z, yaw] of [[-0.05, 0.095, 0.1, 0.2], [0.06, 0.095, 0.15, -0.25], [0, 0.15, 0.12, 0.05]]) parts.push(onWall(F, log, fx0 + x, y, z, ry(yaw)));
  // A garland in swags along the mantel's front, with red berries.
  const swag = Array.from({ length: 31 }, (_, i) => { const t = i / 30; return [fx0 - 0.74 + t * 1.48, 1.11 - 0.07 * Math.abs(Math.sin(t * Math.PI * 3)), 0.355]; });
  parts.push(onWall(F, G.tube(swag, 0.028, 5, [0.09, 0.3, 0.14]), 0, 0, 0));
  swag.forEach((p, i) => { if (i % 3 === 1) parts.push(onWall(F, G.sphere(0.012, 4, 3, [0.75, 0.06, 0.08]), p[0], p[1] + 0.02 * (hash(i) - 0.5), p[2] + 0.02)); });
  // Three stockings.
  for (const [x, col] of [[-0.45, [0.72, 0.08, 0.1]], [0, [0.1, 0.36, 0.17]], [0.45, [0.72, 0.08, 0.1]]]) {
    parts.push(onWall(F, G.box(0.11, 0.26, 0.04, col), fx0 + x, 0.92, 0.36));
    parts.push(onWall(F, G.box(0.16, 0.08, 0.04, col), fx0 + x + 0.03, 0.8, 0.36));
    parts.push(onWall(F, G.box(0.13, 0.06, 0.05, [0.95, 0.93, 0.88]), fx0 + x, 1.05, 0.36));
  }
  // A wreath on the right of the front wall, with a red bow and berries.
  const ring = Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return [1.35 + Math.cos(a) * 0.2, 1.5 + Math.sin(a) * 0.2, 0.06]; });
  parts.push(onWall(F, G.tube(ring, 0.06, 5, [0.08, 0.3, 0.13], { closed: true }), 0, 0, 0));
  ring.forEach((p, i) => { if (i % 2) parts.push(onWall(F, G.sphere(0.014, 4, 3, [0.78, 0.07, 0.09]), p[0] + 0.03 * (hash(i, 2) - 0.5), p[1], 0.12)); });
  parts.push(onWall(F, G.box(0.07, 0.07, 0.04, [0.8, 0.06, 0.08]), 1.35, 1.3, 0.12));
  for (const s of [-1, 1]) parts.push(onWall(F, G.box(0.13, 0.06, 0.03, [0.8, 0.06, 0.08]), 1.35 + s * 0.08, 1.31, 0.11, rz(s * 0.45)));
  for (const s of [-1, 1]) parts.push(onWall(F, G.box(0.04, 0.13, 0.02, [0.8, 0.06, 0.08]), 1.35 + s * 0.04, 1.22, 0.11, rz(s * 0.3)));

  // Window on the right wall: night sky, a moon, snow on rooftops and the sill, curtains.
  const R = walls[3], wx = 0.6; // along the right wall, x = 0.6 is z = -0.6
  parts.push(onWall(R, G.grid(1.1, 1.0, 1, 6, (ix, iy) => [0.02 + 0.012 * (5 - iy), 0.03 + 0.016 * (5 - iy), 0.09 + 0.03 * (5 - iy)]), wx, 1.45, 0.004));
  for (let i = 0; i < 5; i++) {
    const x = wx - 0.48 + i * 0.24, hh = 0.14 + 0.1 * hash(i, 7);
    parts.push(onWall(R, G.box(0.2, hh, 0.004, [0.03, 0.035, 0.06]), x, 0.95 + hh / 2, 0.008));
    parts.push(onWall(R, G.box(0.22, 0.025, 0.005, [0.82, 0.86, 0.95]), x, 0.95 + hh, 0.009));
  }
  parts.push(onWall(R, G.box(1.16, 0.04, 0.06, [0.92, 0.94, 0.98]), wx, 0.97, 0.03));
  parts.push(onWall(R, G.box(0.03, 1.08, 0.05, C.cream), wx - 0.55, 1.45, 0.02));
  parts.push(onWall(R, G.box(0.03, 1.08, 0.05, C.cream), wx + 0.55, 1.45, 0.02));
  parts.push(onWall(R, G.box(1.12, 0.05, 0.05, C.cream), wx, 1.95, 0.02));
  parts.push(onWall(R, G.box(1.12, 0.05, 0.05, C.cream), wx, 0.95, 0.02));
  parts.push(onWall(R, G.box(0.03, 1.0, 0.04, C.cream), wx, 1.45, 0.02));
  parts.push(onWall(R, G.box(1.1, 0.03, 0.04, C.cream), wx, 1.45, 0.02));
  for (const side of [-1, 1]) {
    for (let k = 0; k < 4; k++) parts.push(onWall(R, G.box(0.09, 1.38, k % 2 ? 0.02 : 0.034, k % 2 ? [0.42, 0.05, 0.07] : [0.5, 0.07, 0.09]), wx + side * (0.62 + k * 0.08), 1.56, 0.02));
  }
  parts.push(onWall(R, G.box(1.66, 0.16, 0.04, [0.46, 0.06, 0.08]), wx, 2.25, 0.025));
  const moon = new Node('moon', cached('room.moon', () => onWall(R, G.poly(Array.from({ length: 12 }, (_, i) => [Math.cos(i / 12 * Math.PI * 2) * 0.075, Math.sin(i / 12 * Math.PI * 2) * 0.075]), [0.95, 0.93, 0.8]), wx + 0.25, 1.75, 0.006)), { emissive: 1 });

  // Door on the left wall.
  parts.push(at(G.box(0.03, 2.05, 0.9, [0.3, 0.17, 0.08]), [-w / 2 + 0.016, 1.025, -0.9]));
  for (const [y, hh] of [[0.55, 0.7], [1.5, 0.75]]) for (const z of [-1.12, -0.68]) parts.push(at(G.box(0.012, hh, 0.32, [0.35, 0.2, 0.1]), [-w / 2 + 0.035, y, z]));
  parts.push(at(G.box(0.035, 2.1, 0.06, C.cream), [-w / 2 + 0.02, 1.05, -1.38]));
  parts.push(at(G.box(0.035, 2.1, 0.06, C.cream), [-w / 2 + 0.02, 1.05, -0.42]));
  parts.push(at(G.box(0.05, 0.05, 0.05, C.gold), [-w / 2 + 0.04, 1.0, -0.55]));

  const t = spec.table;
  if (t) {
    const top = t.center[1];
    parts.push(at(G.box(t.w, 0.04, t.d, [0.4, 0.24, 0.12]), [t.center[0], top - 0.02, t.center[2]]));
    parts.push(at(G.box(0.24, 0.002, t.d + 0.05, [0.6, 0.08, 0.1]), [t.center[0], top + 0.001, t.center[2]]));
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      parts.push(at(G.box(0.04, top - 0.04, 0.04, [0.3, 0.17, 0.08]), [t.center[0] + sx * (t.w / 2 - 0.05), (top - 0.04) / 2, t.center[2] + sz * (t.d / 2 - 0.05)]));
    }
  }
  // couch behind the seat, with two cushions
  const cz = spec.seatZ + 0.35;
  parts.push(at(G.box(1.9, 0.42, 0.8, [0.45, 0.12, 0.1]), [0, 0.21, cz]));
  parts.push(at(G.box(1.9, 0.5, 0.18, [0.4, 0.1, 0.09]), [0, 0.67, cz + 0.32]));
  parts.push(at(G.box(0.18, 0.62, 0.8, [0.4, 0.1, 0.09]), [-0.95, 0.31, cz]));
  parts.push(at(G.box(0.18, 0.62, 0.8, [0.4, 0.1, 0.09]), [0.95, 0.31, cz]));
  for (const x of [-0.55, 0.55]) parts.push(at(G.box(0.4, 0.36, 0.12, [0.78, 0.66, 0.36]), [x, 0.6, cz + 0.2], rx(-0.25)));

  // Drawn in this order: the floor, the rug painted over it, then the rest of the room.
  const room = new Node('previewRoom', cached('room.floor', () => floor));
  room.add(new Node('rug', cached('room.rug', () => G.merge(rug)), { decal: true }));
  room.add(new Node('roomBody', cached('room.body', () => G.merge(parts))));
  room.add(moon);
  // The fire: flames that flicker (see animateRoom in preview.js), a glow, and its light.
  const fireAt = (x, y, z) => [fx0 + x, y, -d / 2 + z];
  const flames = [[0, 0.3, 0.085, [1, 0.42, 0.08]], [-0.11, 0.22, 0.07, [1, 0.55, 0.12]], [0.12, 0.24, 0.07, [1, 0.5, 0.1]], [0.02, 0.17, 0.055, [1, 0.85, 0.35]]];
  const fire = new Node('fire', cached('room.fire', () => G.merge(flames.map(([x, hh, r, col]) => at(G.cone(r, hh, 5, col), [x, 0, 0], ry(x * 3))))), { emissive: 1 });
  fire.pos = fireAt(0, 0.12, 0.13);
  const glow = new Node('fireGlow', cached('room.fireGlow', () => G.sprites([
    { p: fireAt(0, 0.3, 0.3), size: 0.42, col: [1, 0.4, 0.12], phase: 0, twinkle: 0.25 },
    { p: fireAt(0, 0.2, 0.26), size: 0.16, col: [1, 0.7, 0.3], phase: 1.7, twinkle: 0.4 },
  ])), { layer: 'add', sprite: true, alpha: 0.75 });
  const pool = new Node('firePool', cached('room.firePool', () => G.sprites([{ p: [0, 0, 0], size: 1.1, col: [1, 0.42, 0.14] }])), { layer: 'add', sprite: true, flat: true, alpha: 0.5 });
  pool.pos = fireAt(0, 0.012, 0.75);
  room.fx = new Node('roomFx');
  room.fx.add(fire, glow, pool);
  room.fx.parts = { fire, glow, pool };
  room.fireLight = { pos: fireAt(0, 0.4, 0.45), color: [1, 0.55, 0.22], intensity: 0.85, range: 3.0 };
  return room;
}
