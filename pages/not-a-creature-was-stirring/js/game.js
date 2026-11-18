// The game: one night of decorating while the nutcrackers close in.
// Pure logic + scene graph, no DOM or GPU, so a whole night can be played in
// Node tests. The renderer reads `scene` and `renderParams` every frame.
import { v3, q, m4, clamp, smooth, makeRng } from './math.js';
import { BUILD } from './build.js';
import { Node } from './scene.js';
import * as M from './models.js';
import { Panel } from './ui.js';
import { Nutcracker, MouseKing } from './creatures.js';
import { nightConfig } from './nights.js';
import { loadSave, writeSave, recordWin, unlockedNight } from './save.js';
import { isObserved } from './gaze.js';
import { faceYaw } from './room.js';
import { Batch } from './batch.js';
import { FEEL, hangRate, wobble } from './feel.js';
import { WallTitle } from './walltitle.js';
import { Snowman, STAGES } from './snowman.js';

// The title is spelled in bulbs on the wall you face, and the night's ends are gift tags on the tree.
// false brings back the floating title card and result card.
export const WALL_TITLE = true;
const TITLE_LINES = ['NOT A CREATURE', 'WAS STIRRING'];
const WIN_LINES = ['MERRY', 'CHRISTMAS'];
const TITLE_AT = 1.3; // s into the intro: the first word lights, as the lights run along the walls
const TITLE_GAP = 0.3; // s between words
const PRESS_DELAY = 0.3; // s: a poked tag swings away before the next night starts
const swingAngle = (t) => 0.5 * Math.exp(-t / 0.55) * Math.sin((2 * Math.PI * t) / 0.65); // rad, away from you first

const VIEW_MARGIN = 0.85; // anywhere in view freezes them
const FOCUS_MARGIN = 0.42; // looking straight at them stares them down
const GRAB_RADIUS = 0.075;
const SNAP_RADIUS = 0.1;
const LOST_GRACE = 0.35; // seconds a held ornament survives a hand-tracking dropout
const RETURN_TIME = 0.35;
const HINT_READ_DIST = 1.0; // m: a hint over a far nutcracker reads as it would at 1 m (letters about 1.2° tall)
// The toy on the table (see updateToy).
const TOY_SCALE = 0.2; // a 17 cm toy of the life-size nutcracker
const TOY_AT = [0.13, 0, 0.12]; // table-local: front right, clear of the box (left), the tree and the candles
// Presents under the tree (Christmas Megapack, js/props.js), table-local. One peeks out at the back left, in the
// gap between two of the lowest ornaments' spots, where the player sees it past the tree; a small one sits right
// behind it, found by leaning round. Clear of the ornament box, the candles and the toy, and on even the small
// virtual table (test/props.test.mjs). One mesh, one draw call.
export const PRESENTS = [
  { name: 'present1', pos: [-0.15, 0, -0.145], height: 0.065, yaw: 0.9 },
  { name: 'present7', pos: [0, 0, -0.215], height: 0.035, yaw: 0.3 },
];
const TOY_MOVES = 2;
const TOY_LOOK = 1.0; // s it must be seen before it may move again
const TOY_OUT = 0.3; // s out of sight before it moves, or leaves
const TOY_POKE = 0.045; // m from its middle: a fingertip there pokes it
const ALARM_AFTER = 4; // s into night 1's tutorial: a sleigh bell rings behind you
const ALARM_AGAIN = 7; // s later, a second bell if the first did not turn you round
const TUTORIAL_PATIENCE = 10; // s: the night starts on its own if no ornament is hung by then
const DUSK = 0.25; // the room dims as the lights come on, and stays so; below 0.3, where their eyes glow
const RIM = [0.32, 0.42, 0.72]; // moonlight on the edges of the nutcrackers, the Mouse King and the tree (renderer.js rim)
const SNOW = 160; // flakes falling in the room, until the first nutcracker sets off (see updateSnow)
// The lights-out scare (see updateJolt). Every player gets it, however well they play, and it costs nothing:
// the lights die, two red eyes open in the dark in front of you, and when the lights come back its face is
// right there. Then it sinks into the floor, as one stared down does. Night 1 has one, once enough ornaments
// are up and its first nutcracker has come and gone (nights.js blackoutAfter). On later nights the first
// lights-out does it, with a false relight first, so a judge playing nights 1 to 3 in one sitting does not
// see the same trick twice. While it plays nothing else moves and nothing new arrives.
const JOLT = {
  clear: 1.8, // m: none nearer than this, none waiting beside you or lunging, or it waits
  settle: 1.2, // s it must have been clear (night 1): your eyes are back on the tree
  dark: 0.92, // how dark the room goes
  fade: 14, // how fast the lights die and come back (the rate the darkness eases at; normally 2.5)
  eyes: 0.9, // s into the dark: two eyes open...
  near: 0.6, // ...at most this far from yours (inside the near field, so real furniture never hides them; see eyesRoom)...
  creep: 0.07, // ...and creep this much closer
  treeRadius: 0.165, // the tree's branches reach this far out from its trunk
  tableClear: 0.12, // m the eyes keep above the table top
  steps: [1.3, 1.7], // s: wooden steps under them
  wink: [0.75, 0.1], // s after they open, the eyes blink once, for this long
  blink: 1.9, // s: later nights: the eyes go out...
  lit: 2.4, // s: ...and the lights come back (night 1: on its face)
  falseLit: 0.9, // s of light with nothing there (later nights), then...
  flicker: 0.16, // ...the lights cut out for a moment, and its face is there when they come back
  face: 0.5, // m from your eyes at most...
  closest: 0.42, // ...and no nearer than the last-candle face
  pop: [0.12, 0.12], // it comes at you this much from where it was last seen, over this many seconds
  hold: 0.75, // s its face stays
  sink: 0.45, // s to sink into the floor
};
// Caught mid-step this close (m from you, across the floor), a nutcracker stings and its jaw drops (see stingIfClose).
const STING_NEAR = 1.2;
const STING_GAP = 6; // s: never two stings closer together than this
// The finale: the wall goes still for a beat, then the Mouse King bursts through it (see updateFinale).
const KING_BURST = {
  quiet: 1.3, // s after the first crack: no more debris or cracking...
  at: 4.6, // s into the finale: ...until he breaks through (the cracks start at 2.6)
  emerge: 0.4, // s to come out of the wall (was 2.5: he eased out)
  open: 0.15, // s for the hole to open as he breaks it
};
// The first hint names the input in the player's hands: tracked hands or Touch controllers,
// or a mouse or finger in the preview (the same words as the help line under it).
const GRAB_HINT = {
  hand: 'Pinch an ornament · hang it on the tree',
  controller: 'Trigger to grab an ornament · let go on the tree',
  pointer: 'Drag an ornament onto the tree',
};
const ORN_COLORS = [M.C.red, M.C.gold, M.C.blue, M.C.silver, [0.12, 0.62, 0.3], M.C.purple];
// The snowman outside the window (js/snowman.js, updateSnowman): where he stands at each of his three spots, on
// the line of sight from the player through the window, a little off its middle; metres behind the glass. At the
// glass he stands just far enough back for his carrot nose to clear it. His head is cocked further each time.
const SNOW_DEPTH = { far: 3.4, mid: 1.8 };
const SNOW_OFF = { far: 0.22, mid: 0.1, near: 0 }; // across the glass, as a share of its width, toward one side
const SNOW_TILT = { far: 0, mid: 0.12, near: 0.4 }; // radians
const SNOW_LEAN = { far: 0, mid: 0, near: 0.13 }; // radians: at the glass he leans in
const SNOW_NOSE = 0.54; // m from his neck to the tip of his nose (snowman's own size)
const YARD_FLAKES = 60; // snow falling outside, seen through the glass
const DEG = Math.PI / 180;
const rx = (a) => q.fromAxisAngle([1, 0, 0], a);
const rz = (a) => q.fromAxisAngle([0, 0, 1], a);
const backOut = (t) => { const s = 1.7; t -= 1; return t * t * ((s + 1) * t + s) + 1; };

const nullAudio = () => ({ play() {}, music() {}, setListener() {}, ambience() {}, pause() {} });

// On a screen (the preview) a panel that shows at all shows whole: one running off an edge is pulled in,
// and made smaller if it is wider or taller than the screen. One wholly off screen stays where it is, as
// in the headset. The panel already squares up to the screen, so its corners project as a rectangle and
// moving it along the camera's right and up axes keeps its depth.
const SCREEN_ROOM = 0.98; // of the half-screen: a sliver of margin at every edge
function fitOnScreen(panel, vp, quat) {
  const node = panel.node, p = node.pos;
  const clip = (a) => {
    const w = vp[3] * a[0] + vp[7] * a[1] + vp[11] * a[2] + vp[15];
    return [(vp[0] * a[0] + vp[4] * a[1] + vp[8] * a[2] + vp[12]) / w, (vp[1] * a[0] + vp[5] * a[1] + vp[9] * a[2] + vp[13]) / w, w];
  };
  const c = clip(p);
  if (c[2] <= 0) return; // behind the camera
  const right = q.rotate(quat, [1, 0, 0]), up = q.rotate(quat, [0, 1, 0]);
  const sx = clip(v3.add(p, right))[0] - c[0], sy = clip(v3.add(p, up))[1] - c[1]; // screen per metre at its depth
  const size = panel.grow || 1; // a hint over a far nutcracker is drawn larger (see the hint placement)
  const ex = (panel.w / 2) * size * sx, ey = (panel.h / 2) * size * sy; // half its size on screen, fully grown
  if (Math.abs(c[0]) >= 1 + ex || Math.abs(c[1]) >= 1 + ey) return;
  const k = Math.min(1, SCREEN_ROOM / ex, SCREEN_ROOM / ey);
  const lx = SCREEN_ROOM - ex * k, ly = SCREEN_ROOM - ey * k;
  const dx = clamp(c[0], -lx, lx) - c[0], dy = clamp(c[1], -ly, ly) - c[1];
  if (k < 1) node.scl = node.scl.map((s) => s * k);
  if (dx || dy) node.pos = v3.add(p, v3.add(v3.scale(right, dx / sx), v3.scale(up, dy / sy)));
  // Moved, it may now sit inside the scenery (the hint by the tray slides into the tree): draw it over the scene.
  if (k < 1 || dx || dy) node.over = true;
}

// Lays a one-metre node (along +Y, centred) from a to b.
function stretch(node, a, b) {
  const d = v3.sub(b, a), len = Math.max(1e-6, v3.len(d)), u = v3.scale(d, 1 / len);
  const axis = v3.cross([0, 1, 0], u), sl = v3.len(axis);
  node.rot = sl < 1e-6 ? (u[1] > 0 ? q.identity() : q.fromAxisAngle([1, 0, 0], Math.PI)) : q.fromAxisAngle(v3.scale(axis, 1 / sl), Math.acos(clamp(u[1], -1, 1)));
  node.pos = v3.lerp(a, b, 0.5);
  node.scl = [1, len, 1];
}

export class Game {
  constructor({ audio, storage = null, today = '1970-01-01', makeCanvas, seed = 1, night = null, mode = 'xr', judge = false, feel = FEEL.on, wallTitle = true, scares = true }) {
    this.audio = audio || nullAudio();
    this.cards = !WALL_TITLE; // the old floating cards
    this.bulbs = WALL_TITLE && wallTitle !== false; // the menu's backdrop has a title of its own
    this.wall = null;
    this.storage = storage;
    this.today = today;
    this.mode = mode;
    this.judge = !!judge; // the judges' link (?judge): a winner may go straight on to the next night
    this.feel = !!feel; // game feel (js/feel.js); off with ?nojuice
    this.haptics = []; // this frame's controller pulses, { side ('left' | 'right' | null for both), intensity, ms }: js/xr.js sends them
    this.scares = scares !== false; // the lights-out scare and the too-close sting (off for the menu's silent backdrop)
    this.rng = makeRng(seed);
    this.inputKind = mode === 'preview' ? 'pointer' : 'hand'; // what the player last used: 'hand' or 'controller' (kept across nights); the preview's mouse or finger is 'pointer'
    this.fxRng = makeRng((seed ^ 0x9e3779b9) >>> 0); // looks only (particles, flicker): never moves gameplay
    this.forcedNight = night;
    this.scene = new Node('root');
    this.layout = null;
    this.paused = false;
    this.t = 0;
    this.state = 'waiting';
    this.stateT = 0;
    this.renderParams = { darkness: 0, flash: [0, 0, 0, 0], ambient: 0.62, sun: 0.7, lights: [], rim: RIM };
    this.panels = {
      // The night's gift tag by the ornament box (the title itself is on the wall), or the old title card.
      title: this.cards ? new Panel(makeCanvas, { w: 0.44, h: 0.16, name: 'title' }) : new Panel(makeCanvas, { w: 0.2, h: 0.09, px: 720, name: 'title', shape: 'tag' }),
      hint: new Panel(makeCanvas, { w: 0.36, h: 0.085, px: 600, name: 'hint' }),
      // The night's end: tags hung from the tree, or the old result card.
      result: this.cards ? new Panel(makeCanvas, { w: 0.44, h: 0.24, name: 'result' }) : new Panel(makeCanvas, { w: 0.36, h: 0.26, px: 900, name: 'result', shape: 'tags' }),
    };
    this.creatures = [];
    this.nutcrackers = [];
    this.king = null;
    this.items = [];
    this.hands = {};
    this.head = [0, 1.2, 0];
    this.frame = null;
    M.warm(); // nothing is built mid-night: the first nutcracker and the Mouse King appear without a hitch
    // Debris, splinters and sparkles are drawn as one mesh per material (one draw call, not one per piece).
    // Made once per game, so a retry or the next night reuses their GPU buffers.
    this.fxBatches = { lit: new Batch('fxLit'), glow: new Batch('fxGlow', { layer: 'add', emissive: 1 }) };
    // Splinters left lying on the floor (game feel): one more mesh, rebuilt only when a piece comes to rest.
    this.restBatch = new Batch('fxRest');
    // The snow falling in the yard outside the window: one mesh, its flakes made once.
    this.yardSnow = new Batch('yardSnow', { layer: 'add', emissive: 1 });
    this.yardFlakes = Array.from({ length: YARD_FLAKES }, () => ({ node: M.snowflake(), born: -1 }));
    this.snowRng = makeRng((seed ^ 0x5a17e5) >>> 0); // the snowman's own dice: the night's are untouched
  }

  setLayout(layout) {
    this.layout = layout;
    this.head = v3.copy(layout.seat.pos);
    this.reset();
  }

  // Every model geometry built so far (all of play's, after M.warm): for renderer.prepare.
  geometries() { return M.cachedGeos(); }

  setPaused(p) {
    this.paused = !!p;
    this.audio.pause?.(this.paused);
  }

  // ------------------------------------------------------------ setup
  reset(night = null) {
    const L = this.layout;
    this.save = loadSave(this.storage);
    this.night = night || this.forcedNight || unlockedNight(this.save, this.today);
    this.cfg = nightConfig(this.night);
    const root = new Node('root');
    this.scene = root;
    this.state = 'intro'; this.stateT = 0;
    this.hung = 0; this.attacks = 0; this.candlesLit = 3; this.candlesBurning = 3; this.graceUntil = 0;
    this.creatures = []; this.nutcrackers = []; this.king = null; this.kingNode = null; this.hole = null;
    this.items = []; this.fx = []; this.hands = {};
    this.darkness = 0; this.darkTarget = 0; this.flash = [0, 0, 0, 0];
    this.nextSpawnAt = Infinity; this.firstSpawn = true; this.spawned = 0;
    this.nextLightsOut = Infinity; this.lightsOutUntil = 0;
    this.shownLookHint = false; this.shownStareHint = false; this.hintUntil = Infinity; this.hintFor = null; this.hintOver = false;
    this.hintIsGrab = false;
    this.stungOnce = false;
    this.lastStingAt = -99;
    this.jolt = null; this.joltDone = false; this.joltArmed = false; this.joltClearT = 0; this.darkRate = 2.5;
    this.chimes = 0; this.nextChimeAt = Infinity; this.finale = null; this.nextGrowl = 0;
    this.lastPress = -9; this.pending = null; this.swing = null;
    // Game feel, per round (js/feel.js).
    this.rest = []; this.restDirty = false; this.restBatch.update([]);
    this.treeFlare = 0; this.chimeFlare = 0; this.gutterT = Infinity; this.kingKnockT = undefined;
    this.kingFrozenUntil = 0; this.kingBurstAt = 0; this.winT = -1; this.starAcc = 0;
    this.hitFace = null; this.heartPhase = 0; this.lure = null; this.lureSide = 1; this.kingLurchT = undefined;

    // The table group: +X is the player's right, +Z points at the player.
    const T = L.table;
    const table = new Node('table');
    table.pos = v3.copy(T.pos);
    table.rot = q.fromYaw(T.yaw);
    root.add(table);
    this.tableNode = table;
    if (T.virtual) table.add(M.sideTable(Math.max(0.2, T.pos[1] - L.floorY)));
    const tr = M.tree();
    tr.node.pos = [0, 0, -0.03];
    table.add(tr.node);
    this.tree = tr;
    const box = M.ornamentBox(this.cfg.ornaments);
    box.node.pos = [-0.2, 0, 0.06];
    table.add(box.node);
    this.box = box;
    this.candles = [];
    for (const [x, z, h] of [[0.17, 0.04, 0.09], [0.215, -0.02, 0.07], [0.15, -0.075, 0.11]]) {
      const c = M.candle(h);
      c.pos = [x, 0, z];
      table.add(c);
      this.candles.push({ node: c, lit: true, smoke: 0, puffT: 0 });
    }
    table.add(M.propGroup('presents', PRESENTS));
    this.candlePool = M.lightPool(0.26);
    this.candlePool.pos = [0.16, 0.002, -0.02];
    table.add(this.candlePool);
    // A toy nutcracker stands at the front of the table, facing the tree: the first nutcracker, before
    // it is one (see updateToy). Shares the life-size model's meshes, so nothing new goes to the GPU.
    const toyNode = M.nutcracker();
    toyNode.scl = [TOY_SCALE, TOY_SCALE, TOY_SCALE];
    toyNode.pos = [...TOY_AT];
    toyNode.rot = q.fromYaw(faceYaw(v3.sub(tr.node.pos, TOY_AT)));
    table.add(toyNode);
    this.toy = { node: toyNode, moves: 0, seenT: 0, outT: 0, ready: false, gone: false, wobble: 0, pokedAt: -9, touching: false, alarms: 0, alarmAt: 0 };
    this.startSnow(true);

    const sl = M.stringLights(L.lightRuns);
    sl.runs.forEach((r, i) => { r.on = false; r.phase = i * 1.7; });
    root.add(sl.node);
    this.lights = sl;
    // The title in bulbs on the wall you face, and MERRY CHRISTMAS for a win, built now with the room (both
    // dark): nothing is built at the win.
    this.wall = null;
    if (this.bulbs && L.title) {
      this.wall = { title: new WallTitle(TITLE_LINES, L.title, 'title'), win: new WallTitle(WIN_LINES, L.title, 'win') };
      root.add(this.wall.title.node, this.wall.win.node);
      this.wall.win.node.visible = false; // its dark red and green bulbs would show among the title's
      this.wall.title.lightUp(this.t + TITLE_AT, TITLE_GAP);
    }

    for (const p of Object.values(this.panels)) { p.hide(); root.add(p.node); }
    // The win's panel is painted now, while the room is read (and uploaded with the meshes), and only shown at
    // the win: painting it there took 5–9 ms of the night's busiest step, as the Mouse King falls.
    this.panels.result.draw(...this.winPanel());
    this.pinchHint = M.pinchHint();
    this.pinchHint.visible = false;
    this.snapMarker = M.snapMarker();
    this.snapMarker.visible = false;
    this.cursor = M.cursorDot();
    this.cursor.visible = false;
    this.fxRoot = new Node('fx');
    this.fxRoot.add(this.fxBatches.lit.node, this.fxBatches.glow.node);
    this.ribbon = M.ribbon();
    this.ribbon.visible = false;
    this.fxRoot.add(this.restBatch.node);
    root.add(this.pinchHint, this.snapMarker, this.cursor, this.fxRoot, this.ribbon);

    // World positions with the table at full size (it pops in during the intro).
    root.updateWorld();
    const tw = table.world;
    this.snapsWorld = tr.snaps.map((s) => m4.point(tr.node.world, s));
    this.snapUsed = this.snapsWorld.map(() => false);
    this.topWorld = m4.point(tr.node.world, tr.top);
    this.lookTarget = m4.point(tr.node.world, [0, 0.18, 0]);
    this.candleLightPos = m4.point(tw, [0.18, 0.14, -0.02]);
    this.titlePos = m4.point(tw, [0, 0.6, -0.12]);
    // The gift tags: the night's tag stands beside the ornament box; the result tags hang from a ribbon tied to
    // the tree's left side, over the box (empty by the end of a won night).
    const boxW = Math.max(0.14, Math.ceil(this.cfg.ornaments / 2) * 0.06 + 0.02);
    // In line with the box's front. On the table the game brings (no room scan) it stands back by the box's middle:
    // turned to face you, its near end swings toward you, and from the front line it stood past that table's front
    // edge (test/table-fit.test.mjs). That table is always just under your head, so the hint over the box stays
    // above the tag; from the seat at a real table, further off, the hint would cover it there (and a phone's view
    // of the preview's table would lose a corner of it: test/panel-layout.mjs).
    this.tagPos = m4.point(tw, [-0.2 - boxW / 2 - 0.11, 0.045, T.virtual ? 0.05 : 0.115]);
    this.hangFrom = m4.point(tw, [-0.06, 0.3, -0.03]);
    this.hangAt = m4.point(tw, [-0.3, 0.34, 0.07]);
    this.hintPos = m4.point(tw, [-0.29, 0.22, 0.07]);

    // Ornaments hung on earlier nights stay on the tree (back side first).
    const pre = Math.max(0, Math.min(this.save.hung, this.snapsWorld.length - this.cfg.ornaments));
    for (let i = 0; i < pre; i++) {
      const si = this.snapsWorld.length - 1 - i;
      const o = M.ornament(ORN_COLORS[(i + 3) % ORN_COLORS.length]);
      o.pos = v3.copy(this.snapsWorld[si]);
      root.add(o);
      this.snapUsed[si] = true;
    }
    const inBox = this.cfg.ornaments - this.cfg.stolen;
    for (let i = 0; i < this.cfg.ornaments; i++) {
      const home = m4.point(box.node.world, box.slots[i]);
      const node = M.ornament(ORN_COLORS[i % ORN_COLORS.length]);
      node.pos = v3.copy(home);
      node.visible = false;
      root.add(node);
      this.items.push({ node, home, state: i < inBox ? 'box' : 'stolen', isStar: false, carrier: null });
    }
    const star = M.star();
    star.visible = false;
    const starHalo = new Node('starHalo', M.cached('starHalo', () => M.haloGeo()), { layer: 'add', sprite: true, alpha: 0 });
    star.add(starHalo);
    root.add(star);
    this.starItem = { node: star, halo: starHalo, home: m4.point(box.node.world, [0, 0.075, 0]), state: 'hidden', isStar: true };
    this.items.push(this.starItem);

    // The window and the yard outside it, where the snowman comes (updateSnowman).
    this.snowman = new Snowman();
    this.snowNextAt = Infinity; this.snowQuietT = 0; this.snowSpots = null; this.snowView = { seen: false, inView: false };
    this.window = L.window || null;
    this.yard = null; this.snowmanNode = null; this.windowGlass = null; this.smudgeT = Infinity;
    if (this.window) this.buildYard(root);

    table.scl = [0.01, 0.01, 0.01];
    root.updateWorld();
    this.showTitle();
    this.audio.music('start');
    this.audio.ambience(true);
  }

  // ------------------------------------------------------------ the window and the yard
  // In the window's own space (x along it, y up, z into the room, its middle at 0). The yard and everything in it
  // carry the window as a portal: the renderer draws them only where they are seen through the glass.
  buildYard(root) {
    const W = this.window;
    const place = (n) => { n.pos = v3.copy(W.center); n.rot = q.fromYaw(faceYaw(W.normal)); return n; };
    const yard = place(new Node('yard'));
    const geo = M.yardGeo(W.w, W.h);
    this.yardGround = geo.ground;
    const sky = new Node('yardSky', geo.sky, { emissive: 1 });
    const land = new Node('yardLand', geo.land, { emissive: 0.5, rim: 0.25 });
    const moon = M.moon();
    // The moon, far out, where the player sees it through the top of the glass from where they sit.
    moon.pos = this.yardSight([W.w * 0.24, W.h * 0.3], 17.2);
    moon.rot = q.fromYaw(faceYaw(v3.sub(this.toYard(this.head), moon.pos)));
    const man = M.snowman();
    man.visible = false;
    man.pos = [0, geo.ground, -8]; // out in the yard until he comes (never on the room's side of the glass)
    yard.add(sky, land, moon, this.yardSnow.node, man);
    const portal = { p: v3.copy(W.center), n: v3.copy(W.normal), r: v3.copy(W.right), u: v3.copy(W.up), hw: W.w / 2, hh: W.h / 2 };
    yard.traverse((n) => { n.portal = portal; });
    root.add(yard);
    // On the room's side of the glass: frost, and a frame if the window is one the game put up.
    const gg = M.windowGlass(W.w, W.h, !W.real);
    const glass = place(new Node('windowGlass'));
    glass.add(new Node('frost', gg.frost, { layer: 'blend', alpha: 0.35, emissive: 0.6 }));
    if (gg.frame) glass.add(new Node('windowFrame', gg.frame));
    this.smudge = new Node('smudge', M.cached('smudge', () => M.smudgeGeo()), { layer: 'blend', alpha: 0, emissive: 0.7 });
    this.smudge.visible = false;
    glass.add(this.smudge);
    root.add(glass);
    this.yard = yard; this.snowmanNode = man; this.windowGlass = glass; this.moonNode = moon;
    for (const f of this.yardFlakes) f.born = -1;
  }

  // World to the window's space, and a point on the line of sight from the player's eye through the glass at
  // (x, y) (window space), `depth` metres behind the glass.
  toYard(p) {
    const W = this.window, d = v3.sub(p, W.center);
    return [v3.dot(d, W.right), d[1], v3.dot(d, W.normal)];
  }
  yardSight(glassAt, depth, eye = this.head) {
    const H = this.toYard(eye), Hz = Math.max(0.2, H[2]);
    const s = (Hz + depth) / Hz;
    return [H[0] + (glassAt[0] - H[0]) * s, H[1] + (glassAt[1] - H[1]) * s, -depth];
  }

  // Is a world point on screen (within margin) and seen through the glass from the eye?
  throughGlass(p, vps, margin) {
    if (!isObserved(p, vps, margin)) return false;
    const W = this.window, eye = this.head, d = v3.sub(p, eye), den = v3.dot(d, W.normal);
    if (Math.abs(den) < 1e-9) return false;
    const t = v3.dot(v3.sub(W.center, eye), W.normal) / den;
    if (t <= 0 || t >= 1) return false;
    const rel = v3.sub(v3.addScaled(eye, d, t), W.center);
    return Math.abs(v3.dot(rel, W.right)) <= W.w / 2 + 0.03 && Math.abs(v3.dot(rel, W.up)) <= W.h / 2 + 0.03;
  }

  // His spot for a stage (window space), turned to face the player's head now, head cocked.
  snowPose(stage) {
    const W = this.window, sp = this.snowSpots[stage];
    const H = this.toYard(this.head);
    const pos = [...sp];
    const yaw = faceYaw(v3.flat(v3.sub(H, pos)));
    return { pos, yaw, tilt: SNOW_TILT[stage] * this.snowTilt, lean: SNOW_LEAN[stage] };
  }
  // World points to test whether he can be seen, for a pose (models.js SNOWMAN_PROBES).
  snowPosePoints(pose) {
    const S = M.SNOWMAN_SCALE;
    const root = m4.mul(this.yard.world, m4.compose(pose.pos, q.mul(q.fromYaw(pose.yaw), rx(pose.lean)), [S, S, S]));
    const head = m4.mul(root, m4.compose([0, M.SNOWMAN_NECK, 0], rz(pose.tilt), [1, 1, 1]));
    return [...M.SNOWMAN_PROBES.body.map((p) => m4.point(root, p)), ...M.SNOWMAN_PROBES.head.map((p) => m4.point(head, p))];
  }
  snowmanPoints() {
    const n = this.snowmanNode;
    return [...M.SNOWMAN_PROBES.body.map((p) => m4.point(n.world, p)), ...M.SNOWMAN_PROBES.head.map((p) => m4.point(n.parts.head.world, p))];
  }
  snowmanHeadPos() { return m4.point(this.snowmanNode.parts.head.world, [0, 0.23, 0]); }

  // This visit's three spots, on the line of sight from where the player is now, to one side of the glass.
  planVisit() {
    const W = this.window, side = this.snowRng() < 0.5 ? -1 : 1, ground = this.yardGround;
    this.snowTilt = this.snowRng() < 0.5 ? -1 : 1;
    const spot = (stage, depth) => {
      const p = this.yardSight([side * SNOW_OFF[stage] * W.w, 0], depth);
      p[1] = ground + M.yardDrift(p[0], p[2]) - 0.02;
      return p;
    };
    this.snowSpots = { far: spot('far', SNOW_DEPTH.far), mid: spot('mid', SNOW_DEPTH.mid) };
    // At the glass: back just far enough for his nose (turned toward the player, his head cocked, leaning in) to
    // clear it by 4 cm. Found by trying a spot and moving back by what the nose still lacks.
    this.yard.updateWorld(this.yard.parent ? this.yard.parent.world : null);
    let depth = SNOW_NOSE * M.SNOWMAN_SCALE + 0.05;
    for (let i = 0; i < 4; i++) {
      this.snowSpots.near = spot('near', depth);
      const tip = this.snowPosePoints(this.snowPose('near'))[M.SNOWMAN_PROBES.body.length + 2];
      depth += 0.04 - v3.dot(v3.sub(this.window.center, tip), this.window.normal);
    }
    this.snowSpots.near = spot('near', depth);
  }

  // The snowman's visit, each frame (js/snowman.js): what the player can see of him, and what he does about it.
  updateSnowman(dt) {
    const S = this.snowman;
    if (!this.window || !this.frame) return;
    const vps = this.frame.viewProjs || [];
    const playing = this.state === 'play' || this.state === 'star';
    // The finale, a scare or the end of the night: he goes (the first moment no one can see him), and stays gone.
    if (!playing && this.state !== 'intro' && this.state !== 'tutorial' && !S.away) S.sendAway();
    const live = this.creatures.some((c) => c.agent.state !== 'dead');
    this.snowQuietT = playing && !live ? this.snowQuietT + dt : 0;
    const cfg = this.cfg;
    let may = playing && this.spawned > 0 && S.visits < cfg.snowmanVisits && this.t >= this.snowNextAt;
    if (cfg.snowmanCalmOnly) may = may && this.snowQuietT >= cfg.snowmanQuiet;
    if (this.jolt) may = false; // the lights-out scare is its own: he holds still through it
    if (may && S.stage === 'away' && !this.snowSpots) this.planVisit();
    const here = S.stage !== 'away';
    const next = S.stage === 'away' ? 'far' : S.stage === 'near' ? null : STAGES[STAGES.indexOf(S.stage) + 1];
    const pts = here ? this.snowmanPoints() : null;
    const seen = here && pts.some((p) => this.throughGlass(p, vps, VIEW_MARGIN));
    const inView = here && pts.some((p) => this.throughGlass(p, vps, 1.0));
    const nextInView = !!next && !!this.snowSpots && this.snowPosePoints(this.snowPose(next)).some((p) => this.throughGlass(p, vps, 1.0));
    this.snowView = { seen, inView };
    // He tempts you while they are on their way, not as one strikes: with one close (as the lights-out scare
    // judges it) he holds still, and so does everything he does.
    const close = this.creatures.some((c) => {
      const st = c.agent.state;
      return st === 'looming' || st === 'lunging' || (st !== 'banished' && st !== 'dead' && v3.distXZ(c.agent.pos, this.head) < JOLT.clear);
    });
    const calm = (!cfg.snowmanCalmOnly || !live) && !this.jolt && !close;
    for (const e of S.update(dt, { seen, inView, nextInView, calm, mayArrive: may })) this.onSnowman(e);
  }

  applySnowPose(stage) {
    const n = this.snowmanNode, pose = this.snowPose(stage);
    n.pos = pose.pos;
    n.rot = q.mul(q.fromYaw(pose.yaw), rx(pose.lean));
    n.parts.head.rot = rz(pose.tilt);
    n.parts.eyes.visible = stage === 'near'; // embers in his eyes, at the glass
    n.visible = true;
    n.updateWorld(this.yard.world);
  }

  onSnowman(e) {
    const S = this.snowman, W = this.window;
    switch (e) {
      case 'arrive':
      case 'move':
        this.applySnowPose(S.stage);
        // Snow crunching under him, out there; and as he first comes, a gust against the glass.
        this.audio.play('crunch', { pos: W.center, gain: S.stage === 'near' ? 0.7 : 0.45 });
        if (e === 'arrive') this.audio.play('gust', { pos: W.center, gain: 0.6 });
        break;
      case 'seen': // a music-box note gone sour, lower each time he is closer
        this.audio.play('chime', { pos: W.center, rate: [0.89, 0.84, 0.75][STAGES.indexOf(S.stage)] || 0.8, gain: 0.5 });
        break;
      case 'tap': {
        // His nose on the glass.
        const tip = m4.point(this.snowmanNode.parts.head.world, M.SNOWMAN_PROBES.head[2]);
        const onGlass = v3.addScaled(tip, W.normal, v3.dot(v3.sub(W.center, tip), W.normal));
        this.audio.play('tap', { pos: onGlass });
        break;
      }
      case 'leave': {
        const n = this.snowmanNode;
        if (n.visible && this.snowSpots && v3.dist(n.pos, this.snowSpots.near) < 1e-6) {
          // He was at the glass: a fogged patch where his nose was, fading.
          const tip = this.toYard(m4.point(n.parts.head.world, M.SNOWMAN_PROBES.head[2]));
          this.smudge.pos = [tip[0], tip[1], 0.006];
          this.smudge.visible = true;
          this.smudgeT = 0;
        }
        n.visible = false;
        this.snowSpots = null;
        this.snowNextAt = this.t + this.cfg.snowmanGap;
        break;
      }
      default: break;
    }
  }

  // The snow outside: flakes born on the line of sight through the glass, falling past it.
  updateYardSnow(dt) {
    if (!this.window || !this.yard) return [];
    const W = this.window, ground = this.yardGround, out = [];
    for (const f of this.yardFlakes) {
      if (f.born < 0 || f.node.pos[1] < ground || this.t - f.born > f.life) {
        const depth = 0.25 + 5.5 * this.fxRng() ** 1.5;
        const p = this.yardSight([(this.fxRng() - 0.5) * W.w * 1.2, (this.fxRng() - 0.2) * W.h], depth);
        p[1] += f.born < 0 ? 0 : 0.6 + 0.6 * this.fxRng();
        f.node.pos = p; f.x = p[0]; f.z = p[2];
        f.speed = 0.18 + 0.14 * this.fxRng(); f.phase = this.fxRng() * 6.3; f.life = 7 + 4 * this.fxRng();
        const k = 1.3 + 0.45 * depth;
        f.node.scl = [k, k, k];
        f.born = this.t;
      }
      const y = f.node.pos[1] - f.speed * dt;
      f.node.pos = [f.x + 0.05 * Math.sin(this.t * 0.8 + f.phase), y, f.z + 0.04 * Math.cos(this.t * 0.6 + f.phase)];
      f.node.rot = q.fromYaw(this.t * 0.5 + f.phase);
      out.push(f.node);
    }
    return out;
  }

  showTitle() {
    if (!this.cards) {
      // The gift tag on the ornament box: the title itself is on the wall.
      // The goal in two lines, a third larger than it fits on one: it is what the night asks of you.
      const lines = [
        { t: `Night ${this.night}`, size: 54 },
        { t: 'hang every ornament', size: 40, weight: 'normal', color: '#8a1a22' },
        { t: 'before midnight', size: 40, weight: 'normal', color: '#8a1a22' },
      ];
      if (!this.layout.realWalls) lines.push({ t: 'No room scan · playing around your seat', size: 22, weight: 'normal', color: '#6b5a44' });
      this.panels.title.show(lines, [], { corner: BUILD.label });
      return;
    }
    const lines = [
      { t: 'Not a Creature', size: 58 },
      { t: 'Was Stirring', size: 58 },
      { t: `Night ${this.night} · hang every ornament before midnight`, size: 25, weight: 'normal', color: '#e8c27a' },
    ];
    if (!this.layout.realWalls) lines.push({ t: 'No room scan found · playing around your seat', size: 20, weight: 'normal', color: '#b9a98c' });
    this.panels.title.show(lines, [], { corner: BUILD.label });
  }

  showHint(text, seconds = 4) {
    this.panels.hint.show([{ t: text, size: 34 }]);
    this.hintIsGrab = false;
    this.hintUntil = this.t + seconds;
    this.hintFor = null; // by the tree, unless the caller ties it to a creature afterwards
    this.hintOver = false;
  }

  // ------------------------------------------------------------ queries (also used by tests and debug)
  tablePos() { return this.lookTarget; }
  toyPos() { return m4.point(this.toy.node.world, [0, 0.43, 0]); } // its middle
  pokeables() { return this.toy && !this.toy.gone && this.toy.node.visible ? [this.toyPos()] : []; }
  grabbables() {
    return this.items
      .filter((it) => (it.state === 'box' || it.state === 'returning') && it.node.visible && (!it.isStar || this.state === 'star'))
      .map((it) => ({ pos: it.node.pos, state: it.state, star: it.isStar }));
  }
  targets() {
    if (this.state === 'star') return [this.topWorld];
    return this.snapsWorld.filter((_, i) => !this.snapUsed[i]);
  }
  candlePositions() { return this.candles.map((c) => c.node.worldPos()); }
  heldCount() { return this.items.filter((it) => it.state === 'held').length; }
  carriedCount() { return this.items.filter((it) => it.state === 'carried').length; }
  debugSpawn(emerged = true) { return this.spawnNutcracker(emerged); }
  debugInfo() {
    return {
      state: this.state, night: this.night, hung: this.hung, of: this.cfg?.ornaments, candles: this.candlesLit,
      creatures: this.creatures.length, darkness: +this.darkness.toFixed(2), table: this.layout?.table.virtual ? 'virtual' : 'real',
      walls: this.layout?.walls.length, realWalls: this.layout?.realWalls,
      window: this.window ? (this.window.real ? 'real' : 'put up') : 'none', snowman: this.snowman?.stage,
    };
  }

  // ------------------------------------------------------------ frame
  update(dt, frame) {
    this.haptics.length = 0; // only this frame's pulses
    if (!this.layout || this.paused) return;
    dt = Math.min(Math.max(dt, 0), 0.05);
    this.frameDt = dt;
    this.t += dt;
    this.stateT += dt;
    // A poked tag has swung away: now the press happens (Play again, Try again, the next night).
    if (this.pending && this.t >= this.pending.at) { const { id } = this.pending; this.pending = null; this.press(id, { quiet: true }); }
    this.frame = frame;
    if (frame.head) {
      this.head = frame.head.pos;
      const up = frame.head.quat ? q.rotate(frame.head.quat, [0, 1, 0]) : [0, 1, 0];
      this.audio.setListener(frame.head.pos, frame.head.forward, up);
    }
    this.scene.updateWorld();
    this.updateHands(dt, frame.hands || []);
    this.updateToy(dt);
    this.updateSnow(dt);
    switch (this.state) {
      case 'intro': if (this.stateT >= 1.0) this.darkTarget = DUSK; if (this.stateT >= 3.6) this.enterTutorial(); break;
      case 'tutorial': if (this.stateT >= TUTORIAL_PATIENCE) this.startNight(); break;
      case 'scare': if (this.stateT >= 1.9) this.lose(); break;
      case 'play': case 'star': this.updateThreats(dt); break;
      case 'finale': this.updateFinale(dt); break;
      default: break;
    }
    if (this.jolt) this.updateJolt(dt);
    if (this.state === 'play' || this.state === 'star' || this.state === 'finale') this.updateCreatures(dt);
    this.updateSnowman(dt);
    this.updateItems(dt);
    this.updateFx(dt);
    this.animate(dt);
    this.syncBatches();
    this.scene.updateWorld();
  }

  // The particle batches take this frame's pieces, wherever they are now.
  syncBatches() {
    const lit = [], glow = [];
    for (const p of this.fx) if (p.batch === 'lit') lit.push(p.node); else if (p.batch === 'glow') glow.push(p.node);
    for (const f of this.snow) glow.push(f.node);
    this.fxBatches.lit.update(lit);
    this.fxBatches.glow.update(glow);
    if (this.restDirty) { this.restDirty = false; this.restBatch.update(this.rest); }
    // The snow outside falls only while some of the window could be on screen: unseen, it would be rebuilt and
    // uploaded every frame for nothing.
    if (this.window && this.windowInView()) this.yardSnow.update(this.updateYardSnow(this.frameDt || 0));
  }

  // Could any of the window be on screen? (its middle, corners and edges, with a margin for the eye's other side)
  windowInView() {
    const W = this.window, vps = (this.frame && this.frame.viewProjs) || [];
    for (const [a, b] of [[0, 0], [-1, -1], [1, -1], [1, 1], [-1, 1], [0, -1], [0, 1], [-1, 0], [1, 0]]) {
      const p = v3.add(v3.add(W.center, v3.scale(W.right, (a * W.w) / 2)), v3.scale(W.up, (b * W.h) / 2));
      if (isObserved(p, vps, 1.15)) return true;
    }
    return false;
  }

  enterTutorial() {
    this.state = 'tutorial'; this.stateT = 0;
    this.showGrabHint();
    this.hintUntil = Infinity;
  }

  showGrabHint() {
    this.grabHintKind = this.inputKind;
    this.hintIsGrab = true;
    this.panels.hint.show([{ t: GRAB_HINT[this.inputKind] || GRAB_HINT.hand, size: 32 }]);
  }

  // ------------------------------------------------------------ hands
  updateHands(dt, hands) {
    const seen = new Set();
    this.cursor.visible = false;
    for (const h of hands) {
      if (!h || !h.side) continue;
      seen.add(h.side);
      if (h.active && (h.kind === 'hand' || h.kind === 'controller')) this.inputKind = h.kind;
      this.updateHand(dt, h);
    }
    // Picked up the controllers (or put them down) mid-tutorial: the hint follows.
    if (this.hintIsGrab && this.grabHintKind !== this.inputKind) this.showGrabHint();
    for (const side of Object.keys(this.hands)) if (!seen.has(side)) this.updateHand(dt, { side, active: false, pinching: false });
  }

  updateHand(dt, h) {
    const s = this.hands[h.side] || (this.hands[h.side] = { pinching: false, item: null, lostT: 0, depth: {} });
    s.active = !!h.active;
    const resetGen = this.state;
    if (!h.active) {
      if (s.item) {
        s.lostT += dt;
        s.lost = true;
        if (s.lostT > LOST_GRACE) { this.returnItem(s.item); s.item = null; s.pinching = false; s.lost = false; }
      } else { s.pinching = false; s.lost = false; }
      return;
    }
    s.lostT = 0;
    s.lost = false;
    if (this.feel) this.trackHand(s, h.pos, dt);
    const pinching = !!h.pinching;
    const start = pinching && !s.pinching;
    s.pinching = pinching;
    s.pos = h.pos;
    s.tip = h.tip || h.pos;
    s.ray = h.ray || null;
    this.checkButtons(s, start);
    if (this.state !== resetGen && this.state === 'intro') return; // a button restarted the night
    if (s.item) {
      if (pinching) s.item.node.pos = v3.add(h.pos, [0, s.item.isStar ? -0.01 : -0.026, 0]);
      else { this.releaseItem(s.item, h.pos); if (s.item.state === 'hung') this.rumble('hang', h.side); s.item = null; }
    } else if (start && this.canGrab()) {
      const it = this.nearestGrabbable(h.pos);
      if (it) {
        it.state = 'held';
        s.item = it;
        this.audio.play('pickup', { pos: h.pos });
        this.feelGrab(it, h.side);
        if (this.panels.title.node.visible) this.panels.title.hide();
      } else if (this.feel) this.burst(h.pos, 2, 'sparkle'); // a pinch in empty air still answers: the headset saw it
    }
  }

  canGrab() { return this.state === 'tutorial' || this.state === 'play' || this.state === 'star'; }

  nearestGrabbable(p) {
    let best = null, bd = Infinity;
    for (const it of this.items) {
      if (!(it.state === 'box' || it.state === 'returning') || !it.node.visible) continue;
      if (it.isStar && this.state !== 'star') continue;
      const d = v3.dist(it.node.pos, p);
      if (d < (it.isStar ? GRAB_RADIUS * 1.25 : GRAB_RADIUS) && d < bd) { bd = d; best = it; }
    }
    return best;
  }

  nearestFreeSnap(p) {
    let best = -1, bd = SNAP_RADIUS;
    this.snapsWorld.forEach((s, i) => {
      if (this.snapUsed[i]) return;
      const d = v3.dist(s, p);
      if (d < bd) { bd = d; best = i; }
    });
    return best;
  }

  releaseItem(it, p) {
    if (it.isStar) {
      if (v3.dist(p, this.topWorld) <= SNAP_RADIUS * 1.2) this.hangStar();
      else this.returnItem(it);
      return;
    }
    const si = this.nearestFreeSnap(p);
    if (si >= 0) this.hang(it, si);
    else this.returnItem(it);
  }

  returnItem(it) {
    it.state = 'returning';
    it.from = v3.copy(it.node.pos);
    it.rt = 0;
    this.audio.play('drop', { pos: it.node.pos });
  }

  hang(it, si) {
    it.state = 'hung';
    // It glides the last few centimetres from your fingers onto the branch, then swings from its
    // hook and settles (see updateItems). It swings across the tree's face, around the line out from the trunk.
    it.hangFrom = v3.copy(it.node.pos);
    it.hangTo = v3.copy(this.snapsWorld[si]);
    it.ht = 0;
    const out = v3.flat(v3.sub(it.hangTo, this.tree.node.worldPos()));
    it.swingAxis = v3.len(out) > 1e-4 ? v3.norm(out) : [1, 0, 0];
    this.snapUsed[si] = true;
    this.hung++;
    this.audio.play('chime', { pos: it.node.pos, rate: this.feel ? hangRate(this.hung, this.cfg.ornaments) : 1 + this.hung * 0.04 });
    this.burst(it.node.pos, 6, 'sparkle');
    if (this.feel) this.feelHang(it);
    if (this.state === 'tutorial') this.startNight();
    else if (this.hung === 1 && this.hintIsGrab) { this.panels.hint.hide(); this.hintIsGrab = false; }
    if (this.hung >= this.cfg.ornaments) this.enterStar();
  }

  // The nutcrackers set off: on the first ornament hung, or when none is hung by TUTORIAL_PATIENCE (the
  // first scare must not wait on a pinch). Until an ornament is hung, the pinch hint and the dots stay.
  startNight() {
    this.state = 'play'; this.stateT = 0;
    this.nextSpawnAt = this.t + this.cfg.firstSpawnDelay;
    if (this.cfg.lightsOut) this.nextLightsOut = this.t + 18;
    this.panels.title.hide();
    if (this.hung > 0) { this.panels.hint.hide(); this.hintIsGrab = false; }
  }

  // ------------------------------------------------------------ the toy on the table
  // The first nutcracker, before it is one. Like them it moves only when you are not looking: the rule of
  // the night, taught by a toy before anything can hurt you. It turns to face you, then steps toward you,
  // each time only after you have had a good look at it since it last moved. On night 1 a sleigh bell
  // behind you, once you have seen it, makes you look away (a false alarm, and a second one if the first
  // does not turn you round). Poke it and it rocks and clacks its jaw at you. When the first life-size
  // nutcracker sets off, the toy leaves the table the moment no one is watching it.
  updateToy(dt) {
    const toy = this.toy;
    if (!toy || toy.gone || !this.frame) return;
    toy.wobble = Math.max(0, toy.wobble - dt * 1.6);
    const vps = this.frame.viewProjs || [];
    const mid = this.toyPos(), top = m4.point(toy.node.world, [0, 0.8, 0]);
    const seen = isObserved(mid, vps, VIEW_MARGIN) || isObserved(top, vps, VIEW_MARGIN);
    toy.outT = seen ? 0 : toy.outT + dt;
    if (seen) { toy.seenT += dt; if (toy.seenT >= TOY_LOOK) toy.ready = true; }
    if (seen && toy.unseenMove) { toy.unseenMove = false; this.audio.play('chime', { pos: mid, rate: 0.89, gain: 0.45 }); } // a music-box note gone sour
    const touching = Object.values(this.hands).some((s) => s.active && s.tip && v3.dist(s.tip, mid) < TOY_POKE);
    if (touching && !toy.touching && this.t - toy.pokedAt > 0.4) {
      toy.pokedAt = this.t;
      toy.wobble = 1;
      this.audio.play('clack', { pos: mid });
    }
    toy.touching = touching;
    if (toy.innocent) { // back after a win: one last turn, to face the tree as if nothing happened
      if (toy.ready && toy.outT >= TOY_OUT) { toy.node.rot = q.fromYaw(faceYaw(v3.sub(this.tree.node.pos, toy.node.pos))); toy.innocent = false; toy.done = true; }
      return;
    }
    if (toy.done) return;
    if (this.creatures.length > 0) {
      if (toy.outT > 0) {
        toy.gone = true; toy.node.visible = false;
        this.audio.play('step', { pos: mid, gain: 0.8 }); // a little wooden hop off the table
      }
      return;
    }
    if (this.night === 1 && this.state === 'tutorial' && toy.moves === 0 && toy.ready && toy.alarms < 2
      && this.stateT >= (toy.alarms === 0 ? ALARM_AFTER : toy.alarmAt + ALARM_AGAIN)) {
      const f = this.frame.head && this.frame.head.forward ? v3.flat(this.frame.head.forward) : v3.flat(this.layout.seat.forward);
      const back = v3.len(f) > 1e-3 ? v3.scale(v3.norm(f), -1.8) : [0, 0, 1.8];
      const side = toy.alarms === 0 ? 0.5 : -0.5; // the second bell from the other shoulder
      this.audio.play('jingle', { pos: v3.add(this.head, [back[0] - back[2] * side / 1.8, -0.15, back[2] + back[0] * side / 1.8]), gain: 0.55 });
      toy.alarms++;
      toy.alarmAt = this.stateT;
    }
    const canMove = this.state === 'tutorial' || this.state === 'play' || this.state === 'star';
    if (canMove && toy.ready && toy.outT >= TOY_OUT && toy.moves < TOY_MOVES) this.toyMove();
  }

  // ------------------------------------------------------------ snow
  // Snow falls softly in the room while the night is still cosy: in a ring around the seat (not in your
  // face, not far through the walls), from near the ceiling to the floor. When the first nutcracker sets
  // off it stops in mid-air, hangs there a moment, and fades.
  startSnow(stops) {
    this.snow = [];
    this.snowHeldT = -1;
    this.snowStops = stops; // the first nutcracker stops it; after a win it falls on
    // The flakes are made once and fall again after a win: 160 new ones there were up to 4 ms of the win's step.
    if (!this.flakes) this.flakes = Array.from({ length: SNOW }, () => ({ node: M.snowflake() }));
    for (const f of this.flakes) {
      f.speed = 0.1 + 0.08 * this.fxRng(); f.sway = 0.03 + 0.04 * this.fxRng(); f.phase = this.fxRng() * 6.3; f.size = 0.9 + 0.7 * this.fxRng();
      this.placeFlake(f, this.layout.floorY + 0.1 + this.fxRng() * 2.3);
      this.snow.push(f);
    }
  }

  placeFlake(f, y) {
    const seat = this.layout.seat.pos, a = this.fxRng() * Math.PI * 2, r = 0.55 + 1.1 * Math.sqrt(this.fxRng());
    f.x = seat[0] + Math.cos(a) * r; f.z = seat[2] + Math.sin(a) * r;
    f.node.pos = [f.x, y, f.z];
    f.node.scl = [f.size, f.size, f.size];
  }

  updateSnow(dt) {
    if (!this.snow.length) return;
    if (this.snowStops && this.snowHeldT < 0 && this.creatures.length > 0) this.snowHeldT = 0;
    if (this.snowHeldT >= 0) {
      this.snowHeldT += dt;
      const k = clamp(1 - (this.snowHeldT - 1.2) / 1.6, 0, 1);
      for (const f of this.snow) f.node.scl = [f.size * k, f.size * k, f.size * k];
      if (k === 0) this.snow = [];
      return;
    }
    const floor = this.layout.floorY, T = this.t;
    for (const f of this.snow) {
      let y = f.node.pos[1] - f.speed * dt;
      if (y < floor) { this.placeFlake(f, floor + 2.3 + this.fxRng() * 0.1); y = f.node.pos[1]; }
      const sx = f.sway * Math.sin(T * 0.9 + f.phase), sz = f.sway * Math.cos(T * 0.7 + f.phase * 1.3);
      f.node.pos = [f.x + sx, y, f.z + sz];
      f.node.rot = q.fromYaw(T * 0.6 + f.phase);
    }
  }

  // After a win the toy is back on the table, facing you, as if it had never left. Look away and back
  // and it faces the tree again: the night's last wink.
  toyReturns() {
    const toy = this.toy;
    if (!toy) return;
    const n = toy.node;
    n.visible = true;
    n.pos = [...TOY_AT];
    const headHere = q.rotate(q.fromYaw(-this.layout.table.yaw), v3.sub(this.head, this.tableNode.pos));
    n.rot = q.fromYaw(faceYaw(v3.flat(v3.sub(headHere, n.pos))));
    Object.assign(toy, { gone: false, moves: 0, seenT: 0, outT: 0, ready: false, wobble: 0, innocent: true, done: false });
  }

  toyMove() {
    const toy = this.toy, n = toy.node;
    const toTable = q.fromYaw(-this.layout.table.yaw);
    const headHere = q.rotate(toTable, v3.sub(this.head, this.tableNode.pos)); // the head, table-local
    if (toy.moves === 1) { // the second time it steps toward you, staying on the table
      const step = v3.scale(v3.norm(v3.flat(v3.sub(headHere, n.pos))), 0.05);
      n.pos = [clamp(n.pos[0] + step[0], -0.3, 0.3), 0, clamp(n.pos[2] + step[2], -0.2, 0.2)];
    }
    n.rot = q.fromYaw(faceYaw(v3.flat(v3.sub(headHere, n.pos))));
    toy.moves++;
    toy.ready = false;
    toy.seenT = 0;
    toy.unseenMove = true;
    n.updateWorld(this.tableNode.world);
    this.audio.play('creak', { pos: m4.point(n.world, [0, 0.43, 0]), gain: 0.9 });
  }

  enterStar() {
    this.state = 'star'; this.stateT = 0;
    const s = this.starItem;
    s.state = 'box';
    s.node.visible = true;
    s.node.pos = v3.copy(s.home);
    this.showHint('Now the star, on top of the tree', 5);
    this.audio.play('magic', { pos: s.home });
  }

  hangStar() {
    const s = this.starItem;
    s.state = 'hung';
    s.node.pos = v3.add(this.topWorld, [0, 0.03, 0]);
    s.node.rot = q.fromYaw(faceYaw(v3.sub(this.head, s.node.pos)));
    this.burst(s.node.pos, 18, 'sparkle');
    this.startFinale();
  }

  checkButtons(s, start) {
    for (const [name, p] of Object.entries(this.panels)) {
      const hit = p.hit(s.tip);
      const prev = s.depth[name];
      s.depth[name] = hit ? hit.depth : undefined;
      if (!hit) continue;
      const poke = prev !== undefined && prev > 0.004 && hit.depth <= 0 && hit.depth > -0.08;
      const pinch = start && Math.abs(hit.depth) < 0.07;
      if ((poke || pinch) && this.t - this.lastPress > 0.6) {
        this.lastPress = this.t;
        this.pressSoon(hit.id);
        return;
      }
    }
    // Out of reach: point at a button and pinch, as in the Quest's own menus. A dot shows where.
    if (!s.ray) return;
    for (const p of Object.values(this.panels)) {
      const hit = p.rayHit(s.ray.origin, s.ray.dir);
      if (!hit) continue;
      this.cursor.visible = true;
      this.cursor.pos = hit.point;
      if (start && this.t - this.lastPress > 0.6) {
        this.lastPress = this.t;
        this.pressSoon(hit.id);
      }
      return;
    }
  }

  // A hand on a tag: it clicks and swings away at once, and the press follows when the swing has carried it off.
  pressSoon(id) {
    if (this.cards) { this.press(id); return; }
    if (this.pending) return;
    this.audio.play('click');
    this.pending = { id, at: this.t + PRESS_DELAY };
    this.swing = { t0: this.t };
  }

  press(id, { quiet = false } = {}) {
    if (!quiet) this.audio.play('click');
    if (id === 'again') this.reset(this.night); // the night you were on, not a recomputed one
    else if (id === 'next') this.reset(this.night + 1);
  }

  // ------------------------------------------------------------ threats
  updateThreats(dt) {
    const live = this.creatures.filter((c) => c.agent.state !== 'dead').length;
    const stuck = live === 0 && !this.items.some((it) => it.state === 'box' || it.state === 'returning' || it.state === 'flying' || it.state === 'held');
    if (stuck && this.items.some((it) => it.state === 'stolen')) this.nextSpawnAt = Math.min(this.nextSpawnAt, this.t + 1.5);
    if (this.t >= this.nextSpawnAt && live < this.cfg.maxActive) {
      this.spawnNutcracker(this.firstSpawn);
      this.firstSpawn = false;
      this.nextSpawnAt = this.t + this.cfg.spawnEvery * (0.8 + 0.4 * this.rng());
    }
    if (this.cfg.lightsOut && this.t >= this.nextLightsOut) {
      this.nextLightsOut = this.t + 20 + this.rng() * 10;
      // The night's first lights-out, with nothing near: the scare (see JOLT). Otherwise a plain one, and
      // the scare comes on its own once nothing is near (below), not at the next lights-out 20-30 s later.
      if (this.scares && !this.joltDone && this.joltClear()) this.startJolt('double');
      else { this.lightsOutUntil = this.t + 4.5; this.audio.play('powerdown'); this.joltArmed = true; }
    }
    // Night 1's one lights-out (once enough ornaments are up), or a later night's that the first lights-out
    // could not be: as soon as nothing has been near for a moment.
    const due = this.cfg.blackoutAfter ? this.hung >= this.cfg.blackoutAfter : this.joltArmed;
    if (this.scares && !this.joltDone && due) {
      this.joltClearT = this.joltClear() ? this.joltClearT + dt : 0;
      if (this.joltClearT >= JOLT.settle) this.startJolt(this.cfg.blackoutAfter ? 'classic' : 'double');
    }
    this.darkTarget = this.t < this.lightsOutUntil ? 0.85 : DUSK;
  }

  // ------------------------------------------------------------ the lights-out scare
  // Nothing near: the night's first nutcracker has come and gone, none is within JOLT.clear, waiting
  // beside you or lunging, and the moment of grace after a hit is over.
  joltClear() {
    if (this.state !== 'play' || this.t < this.graceUntil || this.jolt) return false;
    if (this.t < this.lightsOutUntil + 3) return false; // not during a plain lights-out, nor straight after one
    if (this.spawned === 0 || this.creatures.some((c) => c.first)) return false;
    return !this.creatures.some((c) => {
      const s = c.agent.state;
      return s === 'looming' || s === 'lunging' || (s !== 'banished' && s !== 'dead' && v3.distXZ(c.agent.pos, this.head) < JOLT.clear);
    });
  }

  // 'classic' (night 1): eyes in the dark, then the lights come back on its face. 'double' (later nights):
  // the eyes go out, the lights come back on nothing, then cut out for a moment, and its face is there.
  startJolt(variant) {
    if (this.jolt) return;
    const node = M.nutcracker();
    node.traverse((x) => { if (x.name === 'shadow') x.visible = false; x.baseRim = x.rim; x.baseSpec = x.spec; });
    node.updateWorld();
    const eyeLocal = m4.point(node.parts.head.world, [0, 0.118, 0.085]);
    node.visible = false;
    node.parts.pupils.emissive = 1;
    node.parts.pupils.tint = [4.5, 0.5, 0.5];
    this.scene.add(node);
    const face = variant === 'classic' ? JOLT.lit : JOLT.lit + JOLT.falseLit + JOLT.flicker;
    const T = { face, sink: face + JOLT.hold, end: face + JOLT.hold + JOLT.sink };
    this.jolt = { variant, phase: 'dark', dark: true, t: 0, node, eyeLocal, T, g: null, at: null };
    this.joltDone = true;
    // Nothing else moves while it plays, and nothing new arrives: it costs no candle.
    this.graceUntil = Math.max(this.graceUntil, this.t + T.end + 0.1);
    this.nextSpawnAt = Math.max(this.nextSpawnAt, this.t + T.end + 1.5);
    this.darkRate = JOLT.fade;
    this.audio.play('powerdown');
    this.audio.music('stop');
    if (this.feel) this.gutterT = 0; // the candle flames bow, as in a draft
  }

  joltPhase(t) {
    const J = this.jolt, classic = J.variant === 'classic';
    if (t < JOLT.eyes) return 'dark';
    if (t < (classic ? JOLT.lit : JOLT.blink)) return 'eyes';
    if (t < JOLT.lit) return 'gone';
    if (!classic && t < JOLT.lit + JOLT.falseLit) return 'lit';
    if (t < J.T.face) return 'flicker';
    if (t < J.T.sink) return 'face';
    if (t < J.T.end) return 'sink';
    return 'end';
  }

  updateJolt(dt) {
    const J = this.jolt;
    if (this.state !== 'play' && this.state !== 'star') { this.endJolt(); return; }
    const was = J.t;
    J.t += dt;
    const t = J.t, n = J.node, P = n.parts;
    const phase = this.joltPhase(t);
    if (phase === 'end') { this.endJolt(); return; }
    const entered = phase !== J.phase;
    J.phase = phase;
    J.dark = phase === 'dark' || phase === 'eyes' || phase === 'gone' || phase === 'flicker';
    this.darkTarget = J.dark ? JOLT.dark : DUSK;
    // The lights snap back on, or cut out for a moment: no easing.
    if (entered && (phase === 'lit' || phase === 'face')) this.darkness = DUSK;
    if (entered && phase === 'flicker') this.darkness = JOLT.dark;
    const shade = (k) => n.traverse((x) => {
      if (x === P.pupils || x.name === 'shadow') return;
      x.tint = [k, k, k];
      x.rim = (x.baseRim || 0) * (k > 0.5 ? 1 : 0); // no moonlit edges or glints in the dark: only the eyes show
      x.spec = (x.baseSpec || 0) * (k > 0.5 ? 1 : 0);
    });
    const crossed = (k) => was < k && t >= k;
    if (phase === 'eyes') {
      if (entered) {
        J.g = this.gazeDir();
        J.room = this.eyesRoom(J.g);
        n.visible = true;
        shade(0.03);
        P.jaw.rot = q.identity();
      }
      const k = smooth((t - JOLT.eyes) / ((J.variant === 'classic' ? JOLT.lit : JOLT.blink) - JOLT.eyes));
      n.scl = [1, 1, 1];
      J.near = J.room - JOLT.creep * k;
      this.faceOn(n, J.eyeLocal, J.g, J.near);
      const w = t - JOLT.eyes - JOLT.wink[0];
      P.pupils.visible = !(w >= 0 && w < JOLT.wink[1]); // it blinks
      P.head.rot = rz(0.25 * k); // its head tilts as it comes
      const eyes = v3.addScaled(this.head, J.g.dir, J.room);
      if (entered) this.audio.play('creak', { pos: eyes, gain: 0.8 });
      for (const s of JOLT.steps) if (crossed(s)) this.audio.play('step', { pos: [eyes[0], this.layout.floorY, eyes[2]], gain: 1.2 });
    } else if (phase === 'gone') {
      n.visible = false; // the eyes go out
    } else if (phase === 'lit') {
      n.visible = false;
      if (entered) this.audio.play('pop', { gain: 0.8 });
    } else if (phase === 'flicker') {
      if (entered) { J.g = this.gazeDir(); J.room = this.eyesRoom(J.g); n.visible = true; shade(0.03); P.head.rot = q.identity(); P.pupils.visible = true; }
      n.scl = [1, 1, 1];
      J.near = Math.min(JOLT.face + JOLT.pop[0], J.room);
      this.faceOn(n, J.eyeLocal, J.g, J.near);
    } else if (phase === 'face') {
      const tf = t - J.T.face;
      if (entered) {
        if (J.variant === 'classic' || !J.g) { J.g = this.gazeDir(); J.room = this.eyesRoom(J.g); }
        // From where it was last seen (its eyes in the dark on night 1, its face in the flicker later), nearer.
        J.from = J.variant === 'classic' ? J.room - JOLT.creep : Math.min(JOLT.face + JOLT.pop[0], J.room);
        J.faceAt = clamp(J.from - JOLT.pop[0], JOLT.closest, JOLT.face);
        n.visible = true;
        shade(1);
        const at = v3.addScaled(this.head, J.g.dir, J.faceAt);
        this.audio.play('stinger', { gain: 0.9 });
        this.audio.play('clack', { pos: at });
        this.audio.play('pop', { gain: 0.8 });
        this.rumble('hit'); // controllers jolt in your hands (game feel; tracked hands have no motors)
        if (this.feel) for (const o of this.items) if (o.state === 'hung' && !o.isStar && o.swingAxis) this.kick(o, FEEL.jolt); // the tree shudders
        P.pupils.visible = true;
      }
      n.scl = [1, 1, 1];
      J.near = J.faceAt + Math.max(0, J.from - J.faceAt) * (1 - smooth(Math.min(1, tf / JOLT.pop[1])));
      this.faceOn(n, J.eyeLocal, J.g, J.near);
      P.jaw.rot = rx(0.35 + 0.35 * Math.abs(Math.sin(tf * 24)));
      P.head.rot = rz(0.05 * Math.sin(tf * 37));
      J.at = v3.copy(n.pos);
    } else if (phase === 'sink') {
      const k = smooth((t - J.T.sink) / JOLT.sink);
      if (entered) this.audio.play('banish', { pos: v3.addScaled(this.head, J.g.dir, J.faceAt) });
      const s = Math.max(0.01, 1 - 0.7 * k);
      n.scl = [s, s, s];
      n.pos = [J.at[0] + Math.sin(this.t * 60) * 0.01, J.at[1] - 0.6 * k, J.at[2]];
    }
  }

  endJolt() {
    const J = this.jolt;
    if (!J) return;
    J.node.parent?.remove(J.node);
    this.jolt = null;
    this.darkRate = 2.5;
    if (this.state === 'play' || this.state === 'star') this.audio.music('start');
  }

  // How far along `g` the lights-out figure can stand and still be seen: no further than JOLT.near (real-world
  // occlusion never hides anything that close), in front of the tree when the gaze passes it, and above the
  // table top when the gaze comes down to it. Its eyes opened 1 m along your gaze once: behind the tree.
  eyesRoom(g) {
    let d = JOLT.near;
    const toTree = v3.sub(this.lookTarget, this.head);
    const along = v3.dot(toTree, g.dir), miss = Math.sqrt(Math.max(0, v3.dot(toTree, toTree) - along * along));
    if (along > 0 && miss < JOLT.treeRadius + 0.1) d = Math.min(d, along - JOLT.treeRadius - 0.06);
    const top = this.tableNode.pos[1] + JOLT.tableClear;
    if (g.dir[1] < -1e-3 && this.head[1] > top) {
      const s = (top - this.head[1]) / g.dir[1];
      if (v3.distXZ(v3.addScaled(this.head, g.dir, s), this.tableNode.pos) < 0.6) d = Math.min(d, s);
    }
    return Math.max(0.38, d);
  }

  // Where the player is looking, with the pitch held between -50° and +45° so that a player looking at the
  // floor or the ceiling still gets in view what is put there.
  gazeDir() {
    const f = v3.norm(this.frame && this.frame.head ? this.frame.head.forward : [0, 0, -1]);
    const fl = v3.len(v3.flat(f)) > 1e-3 ? v3.norm(v3.flat(f)) : [0, 0, -1];
    const pitch = clamp(Math.asin(clamp(f[1], -1, 1)), -50 * DEG, 45 * DEG);
    return { fl, pitch, dir: [fl[0] * Math.cos(pitch), Math.sin(pitch), fl[2] * Math.cos(pitch)] };
  }

  // Puts a nutcracker's eyes `dist` from the player's along `g` (a gazeDir), turned to them. eyeLocal: the
  // point between its eyes in its own frame, at rest.
  faceOn(node, eyeLocal, g, dist) {
    const eyes = v3.addScaled(this.head, g.dir, dist);
    node.rot = q.mul(q.fromYaw(faceYaw(v3.neg(g.fl))), rx(g.pitch));
    node.pos = v3.sub(eyes, q.rotate(node.rot, v3.scale(eyeLocal, node.scl[0])));
  }

  spawnNutcracker(emerged) {
    const L = this.layout;
    const vps = this.frame ? this.frame.viewProjs : [];
    const live = this.creatures.filter((c) => c.agent.state !== 'dead');
    const cands = L.spawns.map((s) => ({
      s,
      inView: [0.42, 0.74].some((h) => isObserved(v3.add(s.pos, [0, h, 0]), vps, 1.0)),
      crowd: live.reduce((m, c) => Math.min(m, v3.distXZ(c.agent.pos, s.pos)), 9),
    }));
    // Seated players: keep arrivals in a front-and-sides arc; later nights widen it toward behind.
    const inArc = cands.filter((c) => c.s.angle >= 55 * DEG && c.s.angle <= this.cfg.maxSpawnAngle * DEG + 1e-6);
    const arc = inArc.length ? inArc : cands;
    let pick;
    if (this.spawned === 0) {
      // The first one teaches the rule by reaching arm's reach unseen. Walking straight at you its bearing
      // never changes, but near you and low down it can come into the bottom corner of your view, so it
      // must start where its stopping point is out of view now; of those, the one nearest beside you.
      const look = v3.norm(v3.flat(this.frame && this.frame.head ? this.frame.head.forward : this.layout.seat.forward));
      const stop = (c) => v3.addScaled([this.head[0], c.s.pos[1], this.head[2]], v3.norm(v3.flat(v3.sub(c.s.pos, this.head))), this.cfg.attackDist);
      const hidden = (c) => ![0.42, 0.74].some((h) => isObserved(v3.add(stop(c), [0, h, 0]), vps, 1.0));
      const bearing = (c) => Math.acos(clamp(v3.dot(v3.norm(v3.flat(v3.sub(c.s.pos, this.head))), look), -1, 1));
      const pool = cands.filter(hidden);
      pick = (pool.length ? pool : arc).slice().sort((a, b) => Math.abs(bearing(a) - 80 * DEG) - Math.abs(bearing(b) - 80 * DEG))[0];
    } else {
      const ok = arc.filter((c) => !c.inView && c.crowd > 0.7);
      const pool = ok.length ? ok : arc;
      pick = pool[Math.floor(this.rng() * pool.length)];
    }
    const wall = L.walls[pick.s.wall];
    const normal = wall ? wall.normal : v3.norm(v3.flat(v3.sub(this.head, pick.s.pos)));
    const agent = new Nutcracker({
      spawn: { pos: pick.s.pos, normal },
      // Night 1: the very first one waits beside you before it can strike (see nights.js firstLoom).
      cfg: { speed: this.cfg.speed, attackDist: this.cfg.attackDist, banishTime: this.cfg.banishTime, loomTime: this.spawned === 0 ? this.cfg.firstLoom : 0 },
      emerged,
      id: ++this.spawned,
    });
    const node = M.nutcracker();
    node.pos = v3.copy(agent.pos);
    node.rot = q.fromYaw(agent.yaw);
    this.scene.add(node);
    const c = { agent, node, jawT: 0, legA: 0, blot: null, carry: null };
    // The night's first: as he sets off the music box runs down (and the snow stops); once he is gone it plays again.
    if (agent.id === 1) { c.first = true; this.audio.music('winddown'); this.wall?.title.dieOut(this.t + 0.3, 0.22); }
    if (agent.id === 1) this.snowNextAt = this.t + (this.cfg.snowmanCalmOnly ? 0 : this.cfg.snowmanFirst); // the snowman may come after this
    const loot = this.items.find((it) => it.state === 'stolen');
    if (loot) { loot.state = 'carried'; loot.carrier = agent; loot.node.visible = true; loot.node.scl = [1.7, 1.7, 1.7]; c.carry = loot; }
    if (!emerged) {
      const blot = M.wallBlot();
      blot.pos = v3.addScaled(agent.wallPos, normal, 0.01);
      blot.rot = q.fromYaw(faceYaw(normal));
      this.scene.add(blot);
      c.blot = blot;
      if (this.feel) for (let i = 0; i < FEEL.breach[0]; i++) this.burst(this.breachPoint(agent), 1, 'plaster', normal, true); // the wall gives
    }
    this.creatures.push(c);
    this.nutcrackers = this.creatures.map((x) => x.agent);
    this.audio.play('jingle', { pos: v3.add(pick.s.pos, [0, 0.6, 0]) });
    return agent;
  }

  updateCreatures(dt) {
    const vps = this.frame.viewProjs;
    const grace = this.t < this.graceUntil;
    for (const c of this.creatures) {
      const a = c.agent;
      if (a.state === 'dead') continue;
      const p1 = v3.add(a.pos, [0, 0.42, 0]), p2 = v3.add(a.pos, [0, 0.74, 0]);
      const observed = grace || isObserved(p1, vps, VIEW_MARGIN) || isObserved(p2, vps, VIEW_MARGIN);
      const focused = !grace && (isObserved(p1, vps, FOCUS_MARGIN) || isObserved(p2, vps, FOCUS_MARGIN));
      c.seen = observed && !grace;
      c.focused = focused;
      for (const e of a.update(dt, { observed, focused, target: this.head, head: this.head, grace })) this.onCreatureEvent(c, e);
      if (observed && !grace && a.travel > 0.2 && !this.shownLookHint && a.state === 'active') {
        this.shownLookHint = true;
        this.showHint('They only move when you look away', 4.5);
      }
    }
    this.creatures = this.creatures.filter((c) => {
      if (c.agent.state !== 'dead') return true;
      c.node.parent?.remove(c.node);
      c.blot?.parent?.remove(c.blot);
      if (c.first && (this.state === 'play' || this.state === 'star')) this.audio.music('start'); // not over a scare
      return false;
    });
    this.nutcrackers = this.creatures.map((c) => c.agent);

    if (this.king && this.state === 'finale') {
      const k = this.king;
      const pts = [k.pos, v3.add(k.pos, [0, -0.35, 0])];
      const observed = grace || pts.some((p) => isObserved(p, vps, VIEW_MARGIN));
      for (const e of k.update(dt, { observed, target: this.head })) {
        if (e === 'attack') this.damage();
        else if (e === 'lunge') this.audio.play('roar', { pos: k.pos, rate: 1.3 });
        else if (e === 'advance' && this.t > this.nextGrowl) { this.nextGrowl = this.t + 1.6; this.audio.play('growl', { pos: k.pos }); }
      }
    }
  }

  onCreatureEvent(c, e) {
    const a = c.agent;
    const at = v3.add(a.pos, [0, 0.6, 0]);
    switch (e) {
      case 'step': this.audio.play('step', { pos: a.pos }); break;
      case 'unfreeze': this.audio.play('creak', { pos: at, gain: 0.7 }); break;
      case 'caught': c.caughtT = 1; if (this.feel) this.audio.play('tock', { pos: at }); this.stingIfClose(c); break;
      case 'loomCaught':
        c.caughtT = 1;
        if (!this.stungOnce) { this.stungOnce = true; this.lastStingAt = this.t; this.audio.play('stinger', { gain: 0.7 }); } // the first meeting
        this.shownLookHint = true;
        this.showHint("Don't look away · stare it down", 5);
        this.hintFor = c; // drawn where the player is looking: see the hint placement in animate()
        break;
      case 'retreated':
        this.audio.play('creak', { pos: at, gain: 0.5, rate: 0.8 });
        if (c.carry) { c.carry.state = 'stolen'; c.carry.carrier = null; c.carry.node.visible = false; c.carry.node.scl = [1, 1, 1]; c.carry = null; }
        break;
      case 'clack': c.jawT = 1; this.audio.play('clack', { pos: at }); break;
      case 'emerged': this.audio.play('creak', { pos: at }); break;
      case 'lunge': this.audio.play('lunge', { pos: at }); if (this.feel) c.lungeT = 0; break;
      case 'attack':
        this.striker = c; // game feel: the face you see is his (feelHit)
        this.damage();
        this.striker = null;
        this.burst(at, 14, 'splinter');
        c.node.visible = false;
        if (c.carry) { c.carry.state = 'stolen'; c.carry.carrier = null; c.carry.node.visible = false; c.carry = null; }
        break;
      case 'banished':
        this.audio.play('banish', { pos: at });
        if (this.feel) this.feelBreak(c, at);
        if (c.carry) {
          const it = c.carry;
          it.state = 'flying'; it.carrier = null; it.from = v3.copy(it.node.pos); it.rt = 0;
          c.carry = null;
          this.audio.play('magic', { pos: it.from, gain: 0.6 });
        }
        if (!this.shownStareHint) { this.shownStareHint = true; this.showHint('Stare them down to win back the ornaments', 4.5); }
        break;
      default: break;
    }
  }

  // Caught mid-step within STING_NEAR of you: a sting, and its jaw drops. Once a nutcracker, never two within
  // STING_GAP, none while night 1's first is still to meet you (its own sting comes then), and none while
  // everything is frozen after a hit (c.seen is false then: nobody really looked).
  stingIfClose(c) {
    const a = c.agent;
    if (!this.scares || !c.seen || c.stung || this.t - this.lastStingAt < STING_GAP) return;
    if (v3.distXZ(a.pos, this.head) >= STING_NEAR) return;
    if (this.creatures.some((x) => x.agent.cfg.loomTime > 0 && !x.agent.loomSeen && x.agent.state !== 'banished' && x.agent.state !== 'dead')) return;
    c.stung = true;
    c.gapeT = 1;
    this.lastStingAt = this.t;
    this.audio.play('stab');
  }

  damage() {
    this.attacks++;
    const lit = this.candles.filter((c) => c.lit);
    if (lit.length) {
      const c = lit[lit.length - 1];
      c.lit = false;
      c.node.flame.visible = false;
      c.node.glow.visible = false;
      c.smoke = 1.3; // seconds of smoke from the wick
      c.puffT = 0;
    }
    this.candlesLit = this.candles.filter((c) => c.lit).length;
    this.flash = [0.5, 0, 0.02, 0.9];
    this.audio.play('stinger');
    this.graceUntil = this.t + 2.5;
    if (this.feel) this.feelHit();
    if (!this.shownLookHint) { this.shownLookHint = true; this.showHint('They only move when you look away', 4.5); }
    if (this.candlesLit <= 0) this.startScare();
  }

  // The last candle: the lights die and a nutcracker's face is right in front of yours.
  startScare() {
    this.state = 'scare'; this.stateT = 0;
    this.darkTarget = 0.96;
    this.panels.hint.hide();
    this.endJolt();
    const face = this.faceInFront(0.42);
    this.scareNode = face;
    this.flash = [0.55, 0, 0.02, 0.95];
    this.audio.music('stop');
    this.audio.play('stinger', { gain: 1 });
    this.audio.play('roar', { pos: v3.add(face.pos, [0, 0.6, 0]), rate: 0.7 });
  }

  // A nutcracker's face right where the player is looking, `dist` from their eyes and turned to them (see
  // gazeDir: a player looking at the floor or the ceiling still gets it in view), eyes glowing. Used by the
  // last-candle scare and (game feel) every strike.
  faceInFront(dist) {
    const face = M.nutcracker();
    face.updateWorld();
    const eyeLocal = m4.point(face.parts.head.world, [0, 0.118, 0.085]);
    this.faceOn(face, eyeLocal, this.gazeDir(), dist);
    face.parts.pupils.emissive = 1;
    face.parts.pupils.tint = [4.5, 0.5, 0.5];
    face.traverse((x) => { if (x.name === 'shadow') x.visible = false; });
    this.scene.add(face);
    return face;
  }

  // ------------------------------------------------------------ finale
  startFinale() {
    this.state = 'finale'; this.stateT = 0;
    this.endJolt();
    for (const c of this.creatures) {
      this.burst(v3.add(c.agent.pos, [0, 0.5, 0]), 12, 'splinter', null, true); // kept on the floor (game feel)
      c.node.parent?.remove(c.node);
      c.blot?.parent?.remove(c.blot);
    }
    this.creatures = []; this.nutcrackers = [];
    this.audio.music('stop');
    this.audio.play('magic', { pos: this.topWorld });
    this.flash = [0.9, 0.75, 0.45, 0.5];
    this.finale = { phase: 0, crackT: 0, nextDebris: 0 };
    this.panels.hint.hide();
    if (this.wall) {
      // The wall cracks: the dead bulbs burst and come down, rather than hang in front of the hole.
      this.wall.title.node.visible = false;
      for (const w of this.wall.title.words) {
        const a = w.center, half = w.text.length * 3 * this.wall.title.pitch; // about half the word's width
        for (const k of [-1, 0, 1]) this.burst(v3.addScaled(a, this.layout.title.right, k * half * 0.66), 3, 'sparkle');
      }
      this.audio.play('pop', { pos: this.wall.title.node.pos, gain: 0.6 });
    }
    const h = this.pickHole();
    this.holePos = h.p;
    this.holeNormal = h.n;
    this.holeDist = h.d;
  }

  // The wall cracks where the player can see it: they are looking at the tree when the star goes on.
  // In view beats everything; then the middle of the view; a wall over 1.2 m away beats a nearer one.
  pickHole() {
    const L = this.layout, head = this.head;
    const toTree = v3.flat(v3.sub(this.topWorld, head));
    const look = v3.len(toTree) > 0.05 ? v3.norm(toTree) : L.seat.forward;
    let best = null;
    for (const w of L.walls) {
      let p = v3.copy(w.center);
      const denom = v3.dot(look, w.normal);
      if (denom < -0.2) p = v3.addScaled(head, look, v3.dot(v3.sub(w.center, head), w.normal) / denom);
      let s = v3.dot(v3.sub(p, w.center), w.right);
      s = w.width < 1.3 ? 0 : clamp(s, -w.width / 2 + 0.65, w.width / 2 - 0.65);
      p = v3.addScaled(w.center, w.right, s);
      p[1] = clamp(head[1] + 0.1, w.bottomY + 0.8, Math.max(w.bottomY + 0.8, w.topY - 0.55));
      const to = v3.flat(v3.sub(p, head));
      const d = v3.len(to);
      const cos = d > 1e-3 ? v3.dot(v3.scale(to, 1 / d), look) : -1;
      const score = cos + (cos > Math.cos(40 * DEG) ? 2 : 0) + (d >= 1.2 ? 0.5 : 0);
      if (!best || score > best.score) best = { p: v3.addScaled(p, w.normal, 0.004), n: w.normal, score, d };
    }
    return best;
  }

  updateFinale(dt) {
    const F = this.finale, T = this.stateT;
    if (F.phase === 0 && T > 1.2) {
      F.phase = 1;
      this.darkTarget = 0.78;
      this.audio.play('rumble');
    }
    if (F.phase === 1 && T > 2.6) {
      F.phase = 2;
      this.hole = M.wallHole(7);
      this.hole.pos = v3.copy(this.holePos);
      this.hole.rot = q.fromYaw(faceYaw(this.holeNormal));
      this.hole.parts.cracks.scl = [0.01, 0.01, 1];
      this.hole.parts.hole.scl = [0.01, 0.01, 1];
      this.hole.parts.inner.scl = [0.01, 0.01, 1];
      this.hole.parts.shade.scl = [0.01, 0.01, 1];
      this.scene.add(this.hole);
      this.audio.play('crack', { pos: this.holePos });
    }
    if (F.phase >= 2 && this.hole) {
      F.crackT += dt;
      // The cracks spread; the hole only opens when he breaks through it.
      const k = smooth(F.crackT / 1.6), kh = F.burstT === undefined ? 0 : smooth(F.burstT / KING_BURST.open);
      if (F.burstT !== undefined) F.burstT += dt;
      this.hole.parts.cracks.scl = [Math.max(0.01, k), Math.max(0.01, k), 1];
      for (const part of [this.hole.parts.hole, this.hole.parts.inner, this.hole.parts.shade]) part.scl = [Math.max(0.01, kh), Math.max(0.01, kh), 1];
      if (F.crackT < KING_BURST.quiet && this.t > F.nextDebris) { // then the wall goes still for a beat
        F.nextDebris = this.t + 0.15;
        this.burst(v3.addScaled(this.holePos, this.holeNormal, 0.05), 3, 'debris', this.holeNormal);
        if (this.fxRng() < 0.4) this.audio.play('crack', { pos: this.holePos, gain: 0.6 });
      }
    }
    if (F.phase === 2 && T > KING_BURST.at) {
      F.phase = 3;
      F.burstT = 0;
      // A wall close in front (a desk against it): he leans out of the hole instead of stepping into your table.
      const homeOffset = clamp((this.holeDist || 2) - 1.0, 0.08, 0.3);
      this.king = new MouseKing({ pos: this.holePos, normal: this.holeNormal, cfg: { speed: this.cfg.kingSpeed, attackDist: this.cfg.kingAttackDist, homeOffset, emergeTime: KING_BURST.emerge } });
      this.kingNode = M.mouseKing();
      this.kingNode.pos = v3.copy(this.king.pos);
      this.scene.add(this.kingNode);
      this.audio.play('roar', { pos: this.holePos });
      this.audio.play('stinger', { gain: 0.85 });
      this.rumble('hit');
      this.flash = [0.95, 0.7, 0.45, 0.45]; // plaster dust
      this.burst(v3.addScaled(this.holePos, this.holeNormal, 0.08), 28, 'debris', this.holeNormal);
    }
    if (F.phase === 3 && this.king.state !== 'emerging' && this.nextChimeAt === Infinity) {
      this.nextChimeAt = this.t + 0.8;
      this.showHint('Hold his gaze until midnight', 5);
    }
    if (this.lure) this.updateLure(dt);
    if (F.phase === 3 && this.t >= this.nextChimeAt) {
      this.chimes++;
      this.audio.play('clock', { gain: 0.6 + this.chimes * 0.03 });
      if (this.feel) {
        this.chimeFlare = 1; this.kingKnockT = 0; this.rumble('chime');
        this.kingLurchT = undefined; this.kingLurchAfter = this.t + 0.4; // the chime knocks him back: no lunge through it
        if (FEEL.brighten) this.darkTarget = 0.78 * (1 - this.chimes / this.cfg.chimes); // each chime wins back some light
        if (FEEL.lures && FEEL.lureChimes.includes(this.chimes)) this.startLure();
      }
      this.nextChimeAt = this.t + this.cfg.chimeEvery;
      if (this.chimes >= this.cfg.chimes) {
        F.phase = 4;
        this.king.defeat();
        this.audio.play('shriek', { pos: this.king.pos });
        // With the feel on he holds still, lit up, for a beat before he bursts (feelKingBurst).
        if (this.feel) this.kingFrozenUntil = this.kingBurstAt = this.t + FEEL.kingFreeze;
        else this.burst(this.king.pos, 30, 'sparkle');
        this.nextChimeAt = Infinity;
        F.winAt = this.t + 2.4;
      }
    }
    if (F.phase === 4) {
      this.darkTarget = 0;
      if (this.kingBurstAt && this.t >= this.kingBurstAt) this.feelKingBurst();
      if (this.t >= F.winAt) this.win();
    }
  }

  win() {
    this.state = 'win'; this.stateT = 0;
    this.toyReturns();
    this.startSnow(false);
    this.save = recordWin(this.save, this.night, this.today, this.hung);
    this.save.plays = (this.save.plays || 0) + 1;
    writeSave(this.storage, this.save);
    this.panels.hint.hide();
    this.panels.result.show(...this.winPanel()); // painted when the room was dressed: only shown now
    if (this.wall) {
      this.wall.title.node.visible = false; // the dead title makes way
      this.wall.win.node.visible = true;
      this.wall.win.lightUp(this.t + 0.35, 0.35);
    }
    this.audio.play('win');
    this.audio.music('calm');
    if (this.feel) { this.winT = 0; this.starAcc = 0; }
  }

  winPanel() {
    const next = this.night + 1;
    const buttons = [{ id: 'again', label: 'Play again' }];
    if (this.judge) buttons.push({ id: 'next', label: `Night ${next}` });
    return [[
      { t: 'Merry Christmas', size: this.cards ? 56 : 72, color: this.cards ? undefined : '#8a1a22' },
      { t: `You survived night ${this.night}`, size: this.cards ? 30 : 40, weight: 'normal' },
      { t: this.judge ? `Judges' link: night ${next} is open now` : `Night ${next} opens tomorrow`, size: this.cards ? 24 : 32, weight: 'normal', color: this.cards ? '#e8c27a' : '#6b5a44' },
    ], buttons, { corner: BUILD.label }];
  }

  lose() {
    this.state = 'lose'; this.stateT = 0;
    this.darkTarget = 0.55;
    this.wall?.title.dieOut(this.t, 0.08); // out already, in any night that got this far
    if (this.scareNode) { this.scareNode.parent?.remove(this.scareNode); this.scareNode = null; }
    this.panels.hint.hide();
    this.panels.result.show([
      { t: 'The candles went out', size: this.cards ? 48 : 64, color: this.cards ? undefined : '#8a1a22' },
      { t: `Night ${this.night} · ${this.hung} of ${this.cfg.ornaments} ornaments hung`, size: this.cards ? 26 : 36, weight: 'normal', color: this.cards ? '#e8c27a' : '#6b5a44' },
    ], [{ id: 'again', label: 'Try again' }], { corner: BUILD.label });
    this.audio.music('stop');
    this.audio.play('lose');
  }

  // ------------------------------------------------------------ items and fx
  updateItems(dt) {
    for (const it of this.items) {
      if (it.state === 'flying') {
        it.rt += dt;
        const k = smooth(it.rt / 0.9);
        it.node.pos = v3.add(v3.lerp(it.from, it.home, k), [0, Math.sin(k * Math.PI) * 0.35, 0]);
        if (this.fxRng() < 0.3) this.burst(it.node.pos, 1, 'sparkle');
        const s = 1.7 - 0.7 * k;
        it.node.scl = [s, s, s];
        if (it.rt >= 0.9) { it.state = 'box'; it.node.pos = v3.copy(it.home); it.node.scl = [1, 1, 1]; this.audio.play('chime', { pos: it.home, rate: 0.8 }); }
        continue;
      }
      if (it.state === 'hung' && it.ht !== undefined) {
        it.ht += dt;
        const base = v3.lerp(it.hangFrom, it.hangTo, smooth(Math.min(1, it.ht / 0.12)));
        const rot = q.fromAxisAngle(it.swingAxis, 0.45 * Math.exp(-2.2 * it.ht) * Math.sin(it.ht * 11));
        const hook = 0.034; // above the bauble's centre
        it.node.pos = v3.add(v3.add(base, [0, hook, 0]), q.rotate(rot, [0, -hook, 0]));
        it.node.rot = rot;
        if (it.ht > 3) { it.node.pos = v3.copy(it.hangTo); it.node.rot = q.identity(); it.ht = undefined; }
        continue;
      }
      if (it.state !== 'returning') continue;
      it.rt += dt;
      it.node.pos = v3.lerp(it.from, it.home, smooth(it.rt / RETURN_TIME));
      if (it.rt >= RETURN_TIME) { it.state = 'box'; it.node.pos = v3.copy(it.home); }
    }
  }

  // keep: splinters that stay where they fall, for the rest of the round (game feel: see layRest).
  burst(pos, n, kind, dir = null, keep = false) {
    for (let i = 0; i < n; i++) {
      let node, vel, life, grav = 2.2, size = 1;
      const rnd = this.fxRng, r = () => rnd() * 2 - 1;
      if (kind === 'splinter') { node = M.splinter(rnd); vel = [r() * 1.2, 0.8 + rnd() * 1.4, r() * 1.2]; life = 2.2; grav = 4.5; }
      else if (kind === 'chip') { node = M.splinter(rnd); vel = [r() * 0.7, 0.4 + rnd() * 0.8, r() * 0.7]; life = 0.9; grav = 4.5; size = 0.45; } // a stare chipping him
      else if (kind === 'debris') { node = M.debrisChunk(rnd); const d = dir || [0, 0, 1]; vel = v3.add(v3.scale(d, 0.8 + rnd() * 1.2), [r() * 0.6, rnd() * 0.9, r() * 0.6]); life = 2.4; grav = 4.5; }
      else if (kind === 'plaster') { node = M.debrisChunk(rnd); const d = dir || [0, 0, 1]; vel = v3.add(v3.scale(d, 0.15 + rnd() * 0.45), [r() * 0.25, rnd() * 0.35, r() * 0.25]); life = 1.8; grav = 4.5; size = 0.5; } // off a nutcracker's hole (game feel)
      else if (kind === 'face') { node = M.faceShard(rnd); const d = dir || [0, 0, 1]; vel = v3.add(v3.scale(d, 0.25 + rnd() * 0.45), [r() * 0.3, 0.15 + rnd() * 0.45, r() * 0.3]); life = 1.8; grav = 4.5; size = 0.7; } // his face giving way (game feel)
      else if (kind === 'smoke') { node = M.smokePuff(); vel = [r() * 0.012, 0.06 + rnd() * 0.04, r() * 0.012]; life = 1.4 + rnd() * 0.5; grav = -0.03; }
      else { node = M.sparkle(); vel = [r() * 0.35, 0.1 + rnd() * 0.4, r() * 0.35]; life = 0.9 + rnd() * 0.5; grav = -0.05; }
      node.pos = v3.copy(pos);
      const batch = kind === 'smoke' ? null : kind === 'sparkle' ? 'glow' : 'lit';
      if (!batch) this.fxRoot.add(node); // smoke fades piece by piece, so it stays a node of its own
      this.fx.push({ node, vel, life, max: life, grav, spin: [r() * 9, r() * 9, r() * 9], rot: [0, 0, 0], kind, batch, size, keep: keep && this.feel });
    }
  }

  updateFx(dt) {
    const floor = this.layout.floorY + 0.01;
    this.fx = this.fx.filter((p) => {
      p.life -= dt;
      if (p.life <= 0) {
        if (!p.batch) this.fxRoot.remove(p.node);
        else if (p.keep && p.node.pos[1] < floor + 0.02) this.layRest(p.node);
        return false;
      }
      p.vel[1] -= p.grav * dt;
      p.node.pos = v3.addScaled(p.node.pos, p.vel, dt);
      if (p.node.pos[1] < floor && p.kind !== 'sparkle') { p.node.pos[1] = floor; p.vel = [p.vel[0] * 0.5, Math.abs(p.vel[1]) * 0.25, p.vel[2] * 0.5]; p.spin = v3.scale(p.spin, 0.5); }
      p.rot = v3.addScaled(p.rot, p.spin, dt);
      p.node.rot = q.fromYPR(p.rot[1], p.rot[0], p.rot[2]);
      const k = p.life / p.max; // 1 when born, 0 when gone
      if (p.kind === 'smoke') {
        // Spreads and thins as it rises, with a slow sideways curl.
        const s = 1 + 3 * (1 - k);
        p.node.scl = [s, s, s];
        p.node.alpha = 0.42 * k * Math.min(1, (1 - k) * 8);
        p.vel[0] += Math.sin(this.t * 2.3 + p.max * 9) * 0.02 * dt;
      } else {
        const s = p.kind === 'sparkle' ? Math.max(0.01, k) : p.size;
        p.node.scl = [s, s, s];
      }
      return true;
    });
  }

  // ------------------------------------------------------------ game feel (js/feel.js)
  // Looks, sound and rumble only: nothing here moves the game's state or its clock, and the randomness comes
  // from the cosmetic stream (fxRng). Each is switched off with this.feel (?nojuice).

  // A pulse for the controllers in this frame (js/xr.js sends it; tracked hands have no motors).
  rumble(kind, side = null) {
    if (!this.feel) return;
    const [intensity, ms] = FEEL.rumble[kind];
    this.haptics.push({ side, intensity, ms });
  }

  // How fast a hand is moving, smoothed a little (a held ornament swings from it).
  trackHand(s, pos, dt) {
    if (!s.pos || !(dt > 0)) return;
    const v = v3.scale(v3.sub(pos, s.pos), 1 / dt), l = v3.len(v);
    const raw = l > 4 ? v3.scale(v, 4 / l) : v; // a hand found again after a dropout is not a throw
    s.vel = s.vel ? v3.lerp(s.vel, raw, 0.5) : raw;
  }

  feelGrab(it, side) {
    if (!this.feel) return;
    it.popT = 0;
    it.tilt = [0, 0]; it.tiltV = [0, 0];
    this.rumble('pickup', side);
  }

  // One lands on its branch: the ornaments hung beside it swing, and the tree lights flare.
  feelHang(it) {
    this.treeFlare = 1;
    for (const o of this.items) {
      if (o === it || o.state !== 'hung' || o.isStar || !o.swingAxis) continue;
      const d = v3.dist(o.hangTo, it.hangTo);
      if (d < FEEL.jostleReach) this.kick(o, FEEL.jostle * (1 - (0.5 * d) / FEEL.jostleReach));
    }
  }

  kick(it, amp) { it.kickAmp = amp; it.kickT = 0; }

  // A strike: the ornaments on the tree jolt, the flames that are left gutter, embers fly from the wick that
  // went out, and both controllers rumble hard. The red flash and the sting are the game's own.
  feelHit() {
    for (const o of this.items) if (o.state === 'hung' && !o.isStar && o.swingAxis) this.kick(o, FEEL.jolt);
    this.gutterT = 0;
    const out = this.candles.find((c) => !c.lit && c.smoke > 1.2);
    if (out) this.burst(out.node.flame.worldPos(), 5, 'sparkle');
    this.rumble('hit');
    // You were not looking, so you never saw it come: its face snaps into view, jaw going, then shatters
    // (feelTick). Not on the last candle: that is the scare's own, bigger moment.
    if (this.candlesLit > 0) {
      if (this.hitFace) this.hitFace.node.parent?.remove(this.hitFace.node);
      this.hitFace = { node: this.faceInFront(0.48), t: 0 };
      const dmg = (this.striker && this.striker.faceDmg) || 0;
      if (dmg) { M.setFace(this.hitFace.node, dmg); this.hitFace.node.parts.bulb.emissive = 1; this.hitFace.node.parts.bulb.tint = [4.5, 0.45, 0.4]; }
      this.flash = [0.5, 0, 0.02, FEEL.hitFlash];
    }
  }

  // Stared down: a crack, splinters that stay where they fall, and a beat where he holds still, lit up
  // (animateNutcracker), before he sinks.
  feelBreak(c, at) {
    c.breakT = 0;
    this.audio.play('snap', { pos: at });
    this.burst(at, 12, 'splinter', null, true);
    this.rumble('banish');
  }

  // A point on the rim of the hole a nutcracker comes through (the shape of M.wallBlot), just off the wall.
  breachPoint(a) {
    const n = a.normal, th = this.fxRng() * 2 * Math.PI;
    return v3.add(v3.addScaled(a.wallPos, n, 0.03), [n[2] * 0.2 * Math.cos(th), 0.48 + 0.5 * Math.sin(th), -n[0] * 0.2 * Math.cos(th)]);
  }

  // Pushing out of the wall, which he only does while you do not look straight at him: plaster falls from round
  // the hole, and stays on the floor under it.
  feelBreach(c, a, dt) {
    if (a.state !== 'emerging' || c.focused) return;
    c.plasterAcc = (c.plasterAcc ?? 0) + dt * FEEL.breach[1];
    for (; c.plasterAcc >= 1; c.plasterAcc -= 1) this.burst(this.breachPoint(a), 1, 'plaster', a.normal, true);
  }

  // While you stare one down: wood chips fly off him and the wood strains, faster and higher as he gives.
  feelStare(c, a, stare, dt) {
    const staring = c.focused && (a.state === 'active' || a.state === 'emerging') && a.seenT > 0;
    if (!staring) { c.strainPhase = 0.75; return; } // the first strain comes almost at once
    const k = clamp(stare, 0, 1), mix = ([lo, hi]) => lo + (hi - lo) * k;
    c.strainPhase = (c.strainPhase ?? 0.75) + dt * mix(FEEL.strain);
    if (c.strainPhase >= 1) {
      c.strainPhase -= 1;
      const near = clamp(1.5 / Math.max(0.3, v3.distXZ(a.pos, this.head)), 0.5, 1.2); // quieter the further off he is
      this.audio.play('strain', { pos: v3.add(a.pos, [0, 0.65, 0]), rate: mix(FEEL.strainPitch), gain: (0.6 + 0.4 * k) * near });
      this.rumble('strain');
    }
    if (this.fxRng() < dt * mix(FEEL.chips)) this.burst(v3.add(a.pos, [0, 0.45 + 0.4 * this.fxRng(), 0]), 1, 'chip');
  }

  // The twelfth chime's beat is over: the Mouse King bursts.
  feelKingBurst() {
    this.kingBurstAt = 0;
    const p = this.king.pos;
    this.burst(p, 30, 'sparkle');
    this.audio.play('boom', { pos: p });
    this.flash = [0.95, 0.8, 0.5, 0.35];
    this.chimeFlare = 1.4;
    this.rumble('burst');
  }

  // A splinter comes to rest: it stays on the floor for the rest of the round (never through a wall).
  layRest(node) {
    for (const w of this.layout.walls) {
      const off = v3.sub(node.pos, w.center), d = v3.dot(off, w.normal);
      if (d < 0.03 && Math.abs(v3.dot(off, w.right)) < w.width / 2 + 0.3) node.pos = v3.addScaled(node.pos, w.normal, 0.03 - d);
    }
    this.rest.push(node);
    if (this.rest.length > FEEL.restMax) this.rest.splice(0, this.rest.length - FEEL.restMax);
    this.restDirty = true;
  }

  // A string light's brightness: every light flashes at a chime, and after a win a chase runs along them.
  feelLight(i, e) {
    let out = Math.max(e, FEEL.flash * this.chimeFlare);
    if (this.winT >= 0 && this.winT < FEEL.chase) {
      const pulse = Math.max(0, Math.cos(2 * Math.PI * (this.winT * 1.6 - i / this.lights.runs.length))) ** 4;
      const k = clamp((FEEL.chase - this.winT) / 0.6, 0, 1); // the chase hands back to the twinkle
      out = (1 - k) * out + k * (0.15 + 1.25 * pulse);
    }
    return out;
  }

  feelTick(dt) {
    const hf = this.hitFace;
    if (hf) {
      const P = hf.node.parts;
      P.jaw.rot = rx(0.55 * Math.abs(Math.sin(hf.t * 26)));
      P.head.rot = rz(0.06 * Math.sin(hf.t * 41));
      const s = 0.88 + 0.12 * Math.min(1, hf.t / 0.06); // snaps in
      hf.node.scl = [s, s, s];
      hf.t += dt;
      if (hf.t >= FEEL.hitFace) {
        const at = m4.point(hf.node.parts.head.world, [0, 0.1, 0.05]);
        this.burst(at, 12, 'splinter');
        this.audio.play('snap', { pos: at, gain: 0.7 });
        hf.node.parent?.remove(hf.node);
        this.hitFace = null;
      }
    }
    this.treeFlare = Math.max(0, this.treeFlare - dt / FEEL.treeFlareTime);
    this.chimeFlare *= Math.exp(-6 * dt);
    if (this.winT < 0) return;
    this.winT += dt;
    if (this.winT < FEEL.starTime && this.starItem.state === 'hung') {
      for (this.starAcc += dt; this.starAcc >= FEEL.starEvery; this.starAcc -= FEEL.starEvery) this.burst(v3.add(this.topWorld, [0, 0.03, 0]), 1, 'sparkle');
    }
    // The candles that went out light again, one after another: looks only (the night keeps its count).
    let k = 0;
    for (const c of this.candles) {
      if (c.lit) continue;
      if (!c.relit && this.winT >= FEEL.relight[0] + k * FEEL.relight[1]) {
        c.relit = true; c.smoke = 0;
        c.node.flame.visible = true; c.node.glow.visible = true;
        const at = c.node.flame.worldPos();
        this.burst(at, 4, 'sparkle');
        this.audio.play('pop', { pos: at, gain: 0.5 });
      }
      k++;
    }
  }

  // While you stare one down he fights it: strains toward you, his sword arm creeps up, and he lurches at you
  // and snaps back, more often as the stare builds, eyes flaring and jaw snapping; at the very end he shakes
  // hard. All of it in place: he never gains ground while watched.
  feelFight(c, a, stare, dt) {
    const P = c.node.parts;
    const staring = c.focused && (a.state === 'active' || a.state === 'emerging') && a.seenT > 0;
    c.fight = clamp((c.fight || 0) + (staring ? dt * 4 : -dt * 3), 0, 1); // eases in, and lets go as you look away
    if (!c.fight && c.lurchT === undefined) return;
    const k = clamp(stare, 0, 1) * smooth(c.fight);
    P.rig.rot = q.mul(P.rig.rot, rx(FEEL.fightLean * k));
    P.armL.rot = q.mul(P.armL.rot, rx(-FEEL.fightArm * k));
    if (k > 0.85) P.head.rot = q.mul(P.head.rot, rz(0.18 * Math.sin(this.t * 63)));
    if (c.lurchT === undefined && staring && this.fxRng() < dt * (FEEL.lurch[0] + (FEEL.lurch[1] - FEEL.lurch[0]) * k)) {
      c.lurchT = 0;
      this.audio.play('clack', { pos: v3.add(a.pos, [0, 0.6, 0]), gain: 0.8, once: true });
      this.rumble('strain');
    }
    if (c.lurchT !== undefined) {
      const p = Math.sin((Math.PI * c.lurchT) / FEEL.lurchTime);
      c.node.pos = v3.addScaled(c.node.pos, v3.norm(v3.flat(v3.sub(this.head, a.pos))), FEEL.lurchReach * Math.max(0, p));
      P.jaw.rot = rx(0.6 * Math.max(0, p));
      if (p > 0.3) { P.pupils.emissive = 1; P.pupils.tint = [4.5, 0.5, 0.5]; }
      c.lurchT += dt;
      if (c.lurchT >= FEEL.lurchTime) c.lurchT = undefined;
    }
  }

  // His painted face gives way under a stare (after BioShock Infinite's Motorized Patriot, whose face fell away
  // to the machine under it): the paint cracks, then his left cheek and eye break off to a dark socket with a
  // brass gear and a red bulb for an eye, then his nose and moustache. Looks only: the stare takes as long as
  // ever. A face that broke stays broken, so one you nearly beat comes back with the bulb glowing.
  feelFace(c, a, stare, dt) {
    const P = c.node.parts;
    const staring = c.focused && (a.state === 'active' || a.state === 'emerging') && a.seenT > 0;
    const want = FEEL.face.filter((f) => stare >= f).length;
    if (staring && want > (c.faceDmg || 0)) this.breakFace(c, a, want);
    if ((c.faceDmg || 0) >= 2 && a.state === 'banished') { P.bulb.baseEmissive = 0; P.bulb.tint = [1, 1, 1]; } // it dies as he breaks
    else if ((c.faceDmg || 0) >= 2) {
      c.bulbT = (c.bulbT || 0) + dt;
      const k = 0.62 + 0.38 * Math.max(0, Math.sin(c.bulbT * 23) * Math.sin(c.bulbT * 6.1 + 1)) + (this.fxRng() < 0.08 ? -0.25 : 0);
      P.bulb.emissive = 1;
      P.bulb.tint = [4.5 * k, 0.45 * k, 0.4 * k];
    }
  }

  breakFace(c, a, level) {
    const from = c.faceDmg || 0;
    c.faceDmg = level;
    M.setFace(c.node, level);
    const toYou = v3.norm(v3.flat(v3.sub(this.head, a.pos)));
    const at = v3.addScaled(v3.add(a.pos, [0, 0.56, 0]), toYou, 0.07);
    for (let l = from + 1; l <= level; l++) {
      if (l === 1) { this.burst(at, 2, 'face', toYou, true); this.audio.play('snap', { pos: at, gain: 0.3 }); continue; }
      this.burst(at, 5, 'face', toYou, true);
      this.burst(at, 3, 'sparkle');
      this.audio.play('snap', { pos: at, gain: 0.55 });
      this.rumble('strain');
    }
  }

  // Held by your gaze, the Mouse King fights it as they all do: he strains toward you and lunges and snaps back,
  // growling, more as the chimes go on. Not while he tries a trick (his heads must read), never as he dies, and
  // all of it in place: he never gains ground while held.
  kingFight(dt) {
    const k = this.king, n = this.kingNode;
    const held = k.state === 'stalking' && k.tremble > 0;
    const c = clamp(this.chimes / this.cfg.chimes, 0, 1), mix = ([lo, hi]) => lo + (hi - lo) * c;
    if (held) n.rot = q.mul(n.rot, rx(mix(FEEL.kingLean)));
    if (this.kingLurchT === undefined && held && !this.lure && this.t >= (this.kingLurchAfter || 0) && this.fxRng() < dt * mix(FEEL.kingLurch)) {
      this.kingLurchT = 0;
      this.audio.play('growl', { pos: k.pos, gain: 0.9 });
      this.rumble('strain');
    }
    if (this.kingLurchT !== undefined) {
      const p = Math.max(0, Math.sin((Math.PI * this.kingLurchT) / 0.22));
      n.pos = v3.addScaled(n.pos, v3.norm(v3.flat(v3.sub(this.head, k.pos))), FEEL.kingReach * p);
      this.kingLurchT += dt;
      if (this.kingLurchT >= 0.22 || k.state !== 'stalking') this.kingLurchT = undefined;
    }
  }

  // The Mouse King tries to make you look away: his heads turn to look past your shoulder, then sleigh bells (the
  // night's sign of a nutcracker coming) ring right there behind you. Look and he advances, as ever.
  startLure() {
    const toKing = v3.norm(v3.flat(v3.sub(this.king.pos, this.head)));
    this.lureSide = -this.lureSide; // the other shoulder each time
    const ang = this.lureSide * 130 * DEG, cs = Math.cos(ang), sn = Math.sin(ang);
    const dir = [toKing[0] * cs - toKing[2] * sn, 0, toKing[0] * sn + toKing[2] * cs];
    this.lure = { t: 0, pos: v3.add(this.head, [dir[0] * 1.6, -0.45, dir[2] * 1.6]), n: this.chimes, rang: false };
  }

  updateLure(dt) {
    const L = this.lure;
    L.t += dt;
    if (!L.rang && L.t >= 0.45) {
      L.rang = true;
      this.audio.play('jingle', { pos: L.pos, gain: 0.85 });
      if (L.n >= 6) this.audio.play('step', { pos: L.pos });
      if (L.n >= 9) this.audio.play('clack', { pos: v3.add(L.pos, [0, 0.4, 0]) });
    }
    if (L.t >= 1.6 || this.state !== 'finale') this.lure = null;
  }

  lureHeads(heads) {
    const L = this.lure, k = this.king;
    let yaw = 0;
    if (L && k && L.t < 1.4) {
      const fwd = v3.flat(v3.sub(this.head, k.pos)), to = v3.flat(v3.sub(L.pos, k.pos));
      let d = Math.atan2(to[0], to[2]) - Math.atan2(fwd[0], fwd[2]);
      d = Math.atan2(Math.sin(d), Math.cos(d));
      const ramp = Math.min(1, L.t / 0.15) * Math.min(1, (1.4 - L.t) / 0.25);
      yaw = clamp(1.6 * d, -0.8, 0.8) * ramp;
    }
    for (const h of heads) {
      if (!h.baseRot) h.baseRot = [...h.rot];
      h.rot = yaw ? q.mul(q.fromYaw(yaw), h.baseRot) : h.baseRot;
      h.lureYaw = Math.abs(yaw);
    }
  }

  // Your heart, as one closes in: from FEEL.heart[0] closeness, faster the closer it gets. In your chest, not in the room.
  heartbeat(threat, dt) {
    const [from, slow, fast] = FEEL.heart;
    const live = this.state === 'play' || this.state === 'star';
    if (!live || threat < from) { this.heartPhase = 0.6; return; } // the first beat comes soon after it starts
    const k = (threat - from) / (1 - from);
    this.heartPhase += dt * (slow + (fast - slow) * k);
    if (this.heartPhase >= 1) { this.heartPhase -= 1; this.audio.play('heart', { gain: 0.55 + 0.45 * k }); }
  }

  // The lights-out scare (startJolt): in the dark your heart races as its eyes come closer, as if one were at arm's
  // length by the time the lights come back, and stops dead when its face is there.
  joltThreat() {
    const J = this.jolt;
    if (!J || !(J.dark || J.phase === 'lit')) return 0;
    const [from, to] = FEEL.joltHeart;
    return Math.min(to, from + ((to - from) * J.t) / JOLT.lit);
  }

  // Lights a whole figure up (the beat it freezes as it breaks); 0 puts each part back as it was.
  lightUp(node, amount, skip = null) {
    if (!amount && !node.litUp) return;
    node.litUp = amount > 0;
    node.traverse((x) => {
      if (!x.geo || x === skip || x.name === 'shadow') return;
      if (x.baseEmissive === undefined) x.baseEmissive = x.emissive;
      x.emissive = Math.max(x.baseEmissive, amount);
    });
  }

  // Ornaments answer the hands: lit up and a little bigger when a free hand could pinch one, a pop when it is
  // picked up, a swing from the fingers and a pull toward a free branch while held, a squash as it lands, and
  // a swing when the tree is jostled.
  feelItems(dt) {
    const reach = this.reach || (this.reach = new Set()); // reused: this runs every frame
    reach.clear();
    if (this.canGrab()) {
      for (const s of Object.values(this.hands)) {
        if (!s.active || s.item || !s.pos) continue;
        const it = this.nearestGrabbable(s.pos);
        if (it) reach.add(it);
      }
    }
    for (const it of this.items) {
      const st = it.state;
      if (st !== 'box' && st !== 'returning' && st !== 'held' && st !== 'hung') continue;
      it.hover = clamp((it.hover || 0) + (reach.has(it) ? dt : -dt) / FEEL.hoverTime, 0, 1);
      const h = smooth(it.hover);
      if (h > 0) it.node.emissive = Math.max(it.node.emissive, FEEL.hoverGlow * h);
      let s = 1 + FEEL.hoverGrow * h;
      if (it.popT !== undefined) {
        s *= 1 + FEEL.pop * wobble(it.popT, FEEL.popRate, FEEL.popWobble);
        it.popT += dt;
        if (it.popT > 0.8) it.popT = undefined;
      }
      const land = st === 'hung' && it.ht !== undefined && it.ht >= 0.12 && it.ht < 0.92 ? FEEL.land * wobble(it.ht - 0.12, 9, 24) : 0;
      const c = it.node.scl;
      if (s !== 1 || land !== 0 || c[0] !== 1 || c[1] !== 1 || c[2] !== 1) it.node.scl = [s * (1 + 0.5 * land), s * (1 - land), s * (1 + 0.5 * land)];
      if (st === 'held') this.feelHeld(it, dt);
      else if (it.tilt) { it.tilt = null; it.tiltV = null; if (st !== 'hung') it.node.rot = q.identity(); }
      if (st === 'hung' && it.kickT !== undefined) {
        it.kickT += dt;
        const done = it.kickT > 2.2;
        if (it.ht === undefined) { // settled on its branch: it swings from its hook again
          const rot = done ? q.identity() : q.fromAxisAngle(it.swingAxis, it.kickAmp * Math.exp(-3 * it.kickT) * Math.sin(11 * it.kickT));
          const hook = 0.034;
          it.node.pos = done ? v3.copy(it.hangTo) : v3.add(v3.add(it.hangTo, [0, hook, 0]), q.rotate(rot, [0, -hook, 0]));
          it.node.rot = rot;
        }
        if (done) it.kickT = undefined;
      }
    }
  }

  // Held: it hangs from the fingers and swings behind the hand's motion, and near where it would hang it is
  // drawn a little toward it. Looks only: letting go still uses the hand's own position.
  feelHeld(it, dt) {
    const s = Object.values(this.hands).find((x) => x.item === it);
    if (!s || !s.pos || s.lost) return;
    if (!it.tilt) { it.tilt = [0, 0]; it.tiltV = [0, 0]; }
    if (!it.isStar) {
      const v = s.vel || [0, 0, 0];
      const want = [FEEL.swing * v[2], -FEEL.swing * v[0]]; // about x, about z: it leans back from where the hand is going
      for (let k = 0; k < 2; k++) {
        it.tiltV[k] += (FEEL.swingSpring * (want[k] - it.tilt[k]) - FEEL.swingDamp * it.tiltV[k]) * dt;
        it.tilt[k] = clamp(it.tilt[k] + it.tiltV[k] * dt, -0.7, 0.7);
      }
    }
    const rot = q.mul(rz(it.tilt[1]), rx(it.tilt[0]));
    let p = v3.add(s.pos, q.rotate(rot, [0, it.isStar ? -0.01 : -0.026, 0]));
    let to = null;
    if (it.isStar) { if (v3.dist(s.pos, this.topWorld) <= SNAP_RADIUS * 1.2) to = this.topWorld; }
    else { const si = this.nearestFreeSnap(s.pos); if (si >= 0) to = this.snapsWorld[si]; }
    if (to) {
      const d = v3.sub(to, p), l = v3.len(d);
      if (l > 1e-6) p = v3.addScaled(p, d, Math.min(FEEL.pullMax, l * FEEL.pull) / l);
    }
    it.node.pos = p;
    it.node.rot = rot;
  }

  // ------------------------------------------------------------ animation
  animate(dt) {
    const T = this.t, head = this.head;
    if (this.state === 'intro') {
      const k = clamp((this.stateT - 0.2) / 0.7, 0, 1);
      const s = k < 1 ? Math.max(0.01, backOut(k)) : 1;
      this.tableNode.scl = [s, s, s];
      for (const it of this.items) if (!it.isStar && it.state === 'box') it.node.visible = this.stateT > 0.9;
      this.lights.runs.forEach((r, i) => {
        if (!r.on && this.stateT > 1.0 + i * 0.4) { r.on = true; this.audio.play('pop', { gain: 0.5 }); }
      });
      if (this.stateT > 0.35 && !this.titleSeen) this.titleSeen = true;
    } else {
      this.tableNode.scl = [1, 1, 1];
      for (const r of this.lights.runs) r.on = true;
    }

    if (this.wall) {
      for (const title of [this.wall.title, this.wall.win]) {
        for (const e of title.update(T)) this.audio.play('pop', { pos: e.at, gain: e.type === 'on' ? 0.45 : 0.25 });
      }
    }
    const dark = this.darkness;
    const dead = this.jolt && this.jolt.dark; // the lights-out scare: every bulb is out, no flicker
    this.lights.runs.forEach((r, i) => {
      if (!r.on || dead) { r.emissive = 0.03; r.glow.alpha = 0; return; }
      r.emissive = dark > 0.45 ? (this.fxRng() < 0.04 ? 0.8 : 0.04) : 0.8 + 0.2 * Math.sin(T * 2.6 + r.phase);
      if (this.feel) r.emissive = this.feelLight(i, r.emissive);
      r.glow.alpha = clamp((r.emissive - 0.05) * 0.75, 0, 1);
    });
    const full = this.state === 'finale' || this.state === 'win';
    this.tree.lights.emissive = full ? 1 : 0.25 + 0.65 * (this.hung / this.cfg.ornaments) + 0.08 * Math.sin(T * 5);
    if (this.feel) this.tree.lights.emissive += FEEL.treeFlare * this.treeFlare + 0.6 * this.chimeFlare;
    if (dead) this.tree.lights.emissive = 0.03;

    this.tree.glows.alpha = clamp((this.tree.lights.emissive - 0.15) * 0.85, 0, 1);

    let flick = 0;
    // A strike makes the flames that are left gutter and come back (game feel).
    const gut = this.gutterT < FEEL.gutterTime ? FEEL.gutter * (1 - this.gutterT / FEEL.gutterTime) ** 2 : 0;
    this.gutterT += dt;
    let burning = 0;
    this.candles.forEach((c, i) => {
      if (c.lit || c.relit) { // relit: lit again after a win (game feel); the night still counts it as out
        const f = 1 + 0.16 * Math.sin(T * 19 + i * 2.1) + 0.08 * Math.sin(T * 33 + i);
        c.node.flame.scl = [1 - (f - 1) * 0.4, f * (1 - gut), 1 - (f - 1) * 0.4];
        c.node.glow.alpha = (0.62 + 0.9 * (f - 1)) * (1 - gut);
        flick += f * (1 - gut);
        burning++;
      } else if (c.smoke > 0) {
        c.smoke -= dt;
        c.puffT -= dt;
        if (c.puffT <= 0) { c.puffT = 0.07; this.burst(c.node.flame.worldPos(), 1, 'smoke'); }
      }
    });
    const lit = burning;
    this.candlesBurning = burning;
    this.candlePool.visible = lit > 0;
    this.candlePool.alpha = lit > 0 ? (0.07 + 0.075 * lit) * (flick / lit) : 0;

    if (this.toy && !this.toy.gone) {
      const P = this.toy.node.parts, w = this.toy.wobble;
      P.rig.rot = rz(0.3 * w * Math.sin((this.t - this.toy.pokedAt) * 22));
      P.jaw.rot = rx(0.7 * Math.min(1, w * 2));
    }
    // Glowing first ornament and the pinch hint, during the tutorial.
    for (const it of this.items) if (!it.isStar && it.state !== 'held') it.node.emissive = 0;
    const first = this.state === 'tutorial' || (this.state === 'play' && this.hung === 0) ? this.items.find((it) => it.state === 'box' && !it.isStar) : null;
    if (first) {
      first.node.emissive = 0.35 + 0.3 * Math.sin(T * 6);
      this.pinchHint.visible = this.inputKind === 'hand'; // the fingertip dots only make sense for hands
      const ph = (T % 1.4) / 1.4;
      const open = ph < 0.45 ? 1 : ph < 0.7 ? 1 - smooth((ph - 0.45) / 0.25) : 0.15;
      const c = v3.add(first.node.pos, [0, 0.06, 0.01]);
      this.pinchHint.pos = c;
      this.pinchHint.parts.a.pos = [0, -0.018 * open, 0.01];
      this.pinchHint.parts.b.pos = [0, 0.018 * open, -0.004];
    } else this.pinchHint.visible = false;

    const st = this.starItem;
    if (st.state === 'box') {
      st.node.pos = v3.add(st.home, [0, 0.012 * Math.sin(T * 2.2), 0]);
      st.node.rot = q.fromYaw(T * 1.4);
      st.node.emissive = 0.6 + 0.4 * Math.sin(T * 4);
      st.halo.alpha = 0.22;
    } else if (st.state === 'hung') {
      st.node.emissive = 1;
      st.halo.alpha = 0.5 + 0.1 * Math.sin(T * 3);
    }

    // Glow where a held ornament would hang.
    let marker = null;
    for (const s of Object.values(this.hands)) {
      if (!s.item || !s.pos) continue;
      if (s.item.isStar) { if (v3.dist(s.pos, this.topWorld) <= SNAP_RADIUS * 1.2) marker = this.topWorld; }
      else { const si = this.nearestFreeSnap(s.pos); if (si >= 0) marker = this.snapsWorld[si]; }
      s.item.node.emissive = s.lost ? (Math.sin(T * 40) > 0 ? 0.9 : 0) : marker ? 0.25 : 0;
    }
    this.snapMarker.visible = !!marker;
    if (marker) {
      this.snapMarker.pos = marker;
      const p = 1 + 0.25 * Math.sin(T * 10);
      this.snapMarker.scl = [p, p, p];
    }
    if (this.feel) this.feelItems(dt);

    // Panels fade and grow in over a quarter second when they appear.
    for (const p of Object.values(this.panels)) {
      if (!p.node.visible) continue;
      p.appear = Math.min(1, (p.appear ?? 1) + dt / 0.25);
      const k = smooth(p.appear), s = 0.9 + 0.1 * k;
      p.node.alpha = k;
      p.node.scl = [s, s, s];
    }

    // Panels face the player. In the headset they turn toward your head (you turn to read one). On a screen
    // the camera stays put, so they square up to the screen itself: one off to the side, turned toward the
    // camera's position, would lean with the perspective.
    const screen = this.mode === 'preview' && this.frame && this.frame.head && this.frame.head.quat;
    const view = screen && this.frame.viewProjs && this.frame.viewProjs[0];
    const face = (panel, pos) => {
      const node = panel.node;
      node.pos = pos;
      node.over = false;
      if (screen) { node.rot = [...screen]; if (view) fitOnScreen(panel, view, screen); return; }
      const d = v3.norm(v3.sub(head, pos));
      node.rot = q.mul(q.fromYaw(Math.atan2(d[0], d[2])), q.fromAxisAngle([1, 0, 0], -Math.asin(clamp(d[1], -1, 1))));
    };
    face(this.panels.title, this.cards ? this.titlePos : this.tagPos);
    if (this.cards) face(this.panels.result, this.titlePos);
    else {
      // The result tags hang from their ribbon, their top edge at hangAt; a poke swings them away and back.
      const R = this.panels.result, node = R.node;
      face(R, v3.add(this.hangAt, [0, -R.h / 2, 0]));
      const sw = this.swing ? swingAngle(this.t - this.swing.t0) : 0;
      const half = (R.h * node.scl[1]) / 2;
      if (sw) {
        const top = v3.add(node.pos, q.rotate(node.rot, [0, half, 0]));
        node.rot = q.mul(node.rot, rx(sw));
        node.pos = v3.add(top, q.rotate(node.rot, [0, -half, 0]));
      }
      this.ribbon.visible = node.visible;
      if (node.visible) stretch(this.ribbon, this.hangFrom, v3.add(node.pos, q.rotate(node.rot, [0, half, 0])));
    }
    // A hint about one nutcracker goes where the player is looking. Looked at directly: over its head, or
    // reading it would mean looking away. Only glimpsed at the edge of view: by the tree, where the eyes are.
    // Once over its head it stays there for as long as the nutcracker is in view at all.
    let hintAt = this.hintPos, grow = 1;
    const hc = this.panels.hint.node.visible ? this.hintFor : null; // put away (a scare, the end), it is about no one
    if (!hc) this.hintOver = false;
    if (hc) {
      const there = hc.agent.state === 'active' || hc.agent.state === 'looming';
      this.hintOver = there && (hc.focused || (this.hintOver && hc.seen));
      if (this.hintOver) {
        // Over a nutcracker across the room it never reads smaller than it does at HINT_READ_DIST: it grows
        // with the distance, upward, so it never comes down over the head the player is staring at.
        hintAt = v3.add(hc.agent.pos, [0, 1.0, 0]);
        grow = Math.max(1, v3.dist(hintAt, head) / HINT_READ_DIST);
        hintAt = v3.add(hintAt, [0, ((grow - 1) * this.panels.hint.h) / 2, 0]);
      }
    }
    this.panels.hint.grow = grow;
    if (grow > 1) this.panels.hint.node.scl = this.panels.hint.node.scl.map((s) => s * grow);
    face(this.panels.hint, hintAt);
    // Over a nutcracker it is drawn over the scene: grown to read across the room, it reaches into the
    // preview's walls as he steps out of one, and anything in front of him (the tree) would hide the words.
    if (this.hintOver) this.panels.hint.node.over = true;
    if (this.t > this.hintUntil && this.state !== 'tutorial') {
      this.panels.hint.hide(); this.hintUntil = Infinity; this.hintFor = null; this.hintOver = false; this.hintIsGrab = false;
      if (this.state === 'play' && this.hung === 0) this.showGrabHint();
    }

    for (const c of this.creatures) this.animateNutcracker(c, dt);
    if (this.scareNode) {
      const P = this.scareNode.parts;
      P.jaw.rot = rx(0.5 * Math.abs(Math.sin(this.stateT * 22)));
      P.head.rot = rz(0.05 * Math.sin(this.stateT * 37));
    }
    if (this.king && this.kingNode) this.animateKing(dt);
    if (this.feel) this.feelTick(dt);

    // The patch his nose fogged on the glass fades.
    if (this.smudge && this.smudge.visible) {
      this.smudgeT += dt;
      this.smudge.alpha = 0.5 * clamp(1 - this.smudgeT / 9, 0, 1);
      if (this.smudgeT >= 9) this.smudge.visible = false;
    }

    // Render parameters.
    this.darkness += (this.darkTarget - this.darkness) * Math.min(1, dt * this.darkRate);
    this.flash[3] = Math.max(0, this.flash[3] - dt * 1.5);
    const rp = this.renderParams;
    rp.darkness = this.darkness;
    rp.time = this.t;
    rp.flash = this.flash;
    rp.ambient = 0.62 * (1 - 0.6 * this.darkness);
    rp.sun = 0.7 * (1 - 0.85 * this.darkness);
    const lights = [];
    if (this.candlesBurning > 0) lights.push({ pos: this.candleLightPos, color: [1, 0.62, 0.3], intensity: 0.35 + 0.25 * (this.candlesBurning / 3) + 0.05 * Math.sin(T * 17), range: 1.2 });
    if (st.state === 'hung') lights.push({ pos: this.topWorld, color: [1, 0.85, 0.5], intensity: 0.9, range: 1.5 });
    if (this.king && this.king.state !== 'gone') lights.push({ pos: v3.addScaled(this.king.pos, this.holeNormal, 0.3), color: [1, 0.12, 0.06], intensity: 0.9, range: 2.0 });
    rp.lights = lights.slice(0, 4);

    let threat = 0;
    for (const c of this.creatures) threat = Math.max(threat, clamp(1 - (v3.distXZ(c.agent.pos, head) - 0.6) / 2, 0, 1));
    this.audio.music('intensity', threat);
    if (this.feel) this.heartbeat(Math.max(threat, this.joltThreat()), dt);
  }

  animateNutcracker(c, dt) {
    const a = c.agent, n = c.node, P = n.parts;
    n.pos = v3.copy(a.pos);
    n.rot = q.fromYaw(a.yaw);
    if (c.carry) c.carry.node.pos = v3.add(a.pos, q.rotate(n.rot, [0.12, 0.22 + (P.rig.pos[1] || 0), 0.07]));
    if (a.moving && a.state === 'active') {
      c.legA = Math.sin(a.hopPhase * Math.PI * 2) * 0.5;
      P.rig.pos = [0, Math.abs(Math.sin(a.hopPhase * Math.PI)) * 0.03, 0];
    }
    P.legL.rot = rx(c.legA); P.legR.rot = rx(-c.legA);
    P.armL.rot = rx(-c.legA * 0.7); P.armR.rot = rx(c.legA * 0.7);
    c.jawT = Math.max(0, c.jawT - dt * 5);
    c.gapeT = Math.max(0, (c.gapeT || 0) - dt * 1.1); // caught too close: its jaw drops and hangs open (stingIfClose)
    P.jaw.rot = rx(Math.max(0.6 * Math.sin(c.jawT * Math.PI), 0.7 * smooth(Math.min(1, c.gapeT * 1.6))));
    if (c.lungeT !== undefined) { // game feel: he throws up his arms and his jaw drops as he lunges
      const e = Math.min(1, c.lungeT / 0.12);
      c.lungeT += dt;
      P.armL.rot = rx(-1.4 * e); P.armR.rot = rx(-1.4 * e); P.jaw.rot = rx(0.65 * e);
    }
    // Trembles while being stared down: the feedback that staring works.
    const stare = a.cfg.banishTime ? clamp(a.seenT / a.cfg.banishTime, 0, 1) : 0;
    const shake = this.feel ? 1.5 : 1; // game feel: harder as the stare builds
    c.caughtT = Math.max(0, (c.caughtT || 0) - dt * 2.5);
    P.head.rot = q.mul(rz(stare * 0.08 * shake * Math.sin(this.t * 45) + 0.22 * smooth(c.caughtT)), rx(-0.12 * smooth(c.caughtT)));
    P.rig.rot = rz(stare * 0.03 * shake * Math.sin(this.t * 38 + 1));
    if (this.feel) this.feelStare(c, a, stare, dt);
    const glow = this.darkness > 0.3 || this.state === 'lose';
    P.pupils.emissive = glow ? 1 : 0;
    P.pupils.tint = glow ? [4.5, 0.5, 0.5] : [1, 1, 1];
    if (this.feel) this.feelFight(c, a, stare, dt);
    if (this.feel) this.feelBreach(c, a, dt);
    if (this.feel) this.feelFace(c, a, stare, dt);
    const tint = a.state === 'emerging' || a.fromWall ? 0.25 + 0.75 * a.e : 1;
    n.traverse((x) => { if (x !== P.pupils && x !== P.bulb && x.name !== 'shadow') x.tint = [tint, tint, tint]; });
    // Game feel: as he breaks he holds still for a beat, lit up (FEEL.freeze), then sinks squashed. A retreat
    // (he gave up at the edge of your view) is not your win: it sinks at once, as it always did.
    const broke = a.state === 'banished' && c.breakT !== undefined;
    const held = broke && c.breakT < FEEL.freeze;
    if (broke) this.lightUp(n, held ? 1 - 0.4 * (c.breakT / FEEL.freeze) : 0, P.pupils);
    if (a.state === 'banished') {
      const k = smooth(broke ? (a.sinkT - FEEL.freeze) / (a.cfg.sinkTime - FEEL.freeze) : a.sinkT / a.cfg.sinkTime);
      // Stared down before it was out: the wall takes it back. Otherwise it sinks into the floor.
      const p = a.fromWall ? v3.lerp(a.pos, a.wallPos, k) : [a.pos[0], a.pos[1] - k * 0.55, a.pos[2]];
      n.pos = held ? v3.copy(a.pos) : [p[0] + Math.sin(this.t * 60) * 0.01, p[1], p[2]];
      const s = 1 - k * 0.5;
      const sq = broke ? FEEL.squash * Math.sin(Math.PI * k) : 0;
      n.scl = [s * (1 + 0.5 * sq), s * (1 - sq), s * (1 + 0.5 * sq)];
      if (broke) c.breakT += dt;
    }
    if (c.blot) {
      const k = a.state === 'emerging' ? 1 : Math.max(0, (c.blotK ?? 1) - dt * 1.5);
      c.blotK = k;
      c.blot.scl = [Math.max(0.01, k), Math.max(0.01, k), 1];
      if (k <= 0) { c.blot.parent?.remove(c.blot); c.blot = null; }
    }
  }

  animateKing(dt) {
    const k = this.king, n = this.kingNode, P = n.parts;
    n.pos = v3.copy(k.pos);
    n.rot = q.fromYaw(k.yaw);
    // Game feel: on the twelfth chime he holds still, lit up, for a beat (FEEL.kingFreeze); then he bursts
    // (feelKingBurst) and spins away in the time that is left.
    const frozen = this.feel && k.state === 'dying' && this.t < this.kingFrozenUntil;
    if (this.feel) this.lightUp(n, frozen ? 0.8 : 0);
    if (frozen) { n.scl = [1, 1, 1]; return; }
    const sh = this.feel ? 0.02 + 0.003 * this.chimes : 0.02; // game feel: he shakes harder with every chime
    if (k.tremble) n.pos = v3.add(n.pos, [(this.fxRng() - 0.5) * sh, (this.fxRng() - 0.5) * sh, (this.fxRng() - 0.5) * sh]);
    if (this.feel && this.kingKnockT !== undefined) { // each chime knocks him back toward his hole
      n.pos = v3.addScaled(n.pos, this.holeNormal, -FEEL.knock * Math.exp(-8 * this.kingKnockT));
      this.kingKnockT += dt;
    }
    P.heads.forEach((h, i) => { h.pos[1] = [0, -0.06, -0.06][i] + 0.015 * Math.sin(this.t * 3 + i * 2); });
    if (this.feel) { this.lureHeads(P.heads); this.kingFight(dt); }
    for (const e of P.eyes) e.tint = [1 + 0.5 * Math.sin(this.t * 8), 1, 1];
    if (k.state === 'dying') {
      const t = this.feel ? (Math.max(0, k.t - FEEL.kingFreeze) * 1.6) / (1.6 - FEEL.kingFreeze) : k.t;
      const s = Math.max(0.01, 1 - smooth(t / 1.6));
      n.scl = [s, s, s];
      n.rot = q.fromYaw(k.yaw + t * 6);
    }
    if (k.state === 'gone') n.visible = false;
  }
}
