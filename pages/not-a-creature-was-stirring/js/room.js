// Turns the room's detected planes (or nothing) into a play layout:
// where the tree goes, which walls the nutcrackers come out of, where the
// string lights run. Pure functions, unit-tested in Node.
import { v3, q, m4, yawOf, wrapAngle, clamp } from './math.js';

// How far in from the edge of a real table nearest you the tree's group stands: the toy, the ornament box and its
// shadow then stay on the table rather than hanging past its edge (test/table-fit.test.mjs).
const TABLE_INSET = 0.16;

const UP = [0, 1, 0];
const DEG = Math.PI / 180;
// The title on the wall fits inside a 70° view from the seat (Meta's VR Glasses): 30° either side of its middle.
export const TITLE_HALF_FOV = 30 * DEG;

// Yaw that turns a model's +Z (its front) toward direction d.
export const faceYaw = (d) => Math.atan2(d[0], d[2]);

// Build a plane in the WebXR convention (plane-space +Y is the normal, polygon on local XZ).
// Used by the preview room and tests.
export function makePlane({ center, normal, w, h, label = '' }) {
  const n = v3.norm(normal);
  let rot;
  if (Math.abs(n[1]) > 0.9) rot = n[1] > 0 ? q.identity() : q.fromAxisAngle([1, 0, 0], Math.PI);
  else rot = q.mul(q.fromYaw(faceYaw(n)), q.fromAxisAngle([1, 0, 0], Math.PI / 2));
  return {
    orientation: Math.abs(n[1]) > 0.9 ? 'horizontal' : 'vertical',
    label,
    matrix: m4.compose(center, rot, [1, 1, 1]),
    polygon: [{ x: -w / 2, z: -h / 2 }, { x: w / 2, z: -h / 2 }, { x: w / 2, z: h / 2 }, { x: -w / 2, z: h / 2 }],
  };
}

function analyze(pl) {
  if (!pl || !pl.matrix || !pl.polygon || pl.polygon.length < 3) return null;
  const corners = pl.polygon.map((p) => m4.point(pl.matrix, [p.x, 0, p.z]));
  const normal = v3.norm(m4.dir(pl.matrix, UP));
  const center = [0, 0, 0];
  for (const c of corners) { center[0] += c[0] / corners.length; center[1] += c[1] / corners.length; center[2] += c[2] / corners.length; }
  const horizontal = Math.abs(normal[1]) > 0.8;
  return { label: (pl.label || '').toLowerCase(), corners, normal, center, horizontal, up: normal[1] > 0.8 };
}

function nearestOnSegment2(px, pz, ax, az, bx, bz) {
  const dx = bx - ax, dz = bz - az;
  const L = dx * dx + dz * dz;
  const t = L > 0 ? clamp(((px - ax) * dx + (pz - az) * dz) / L, 0, 1) : 0;
  return [ax + dx * t, az + dz * t];
}

function insideXZ(corners, x, z) {
  let inside = false;
  for (let i = 0, j = corners.length - 1; i < corners.length; j = i++) {
    const xi = corners[i][0], zi = corners[i][2], xj = corners[j][0], zj = corners[j][2];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

function nearestOnPolygonXZ(corners, p) {
  let best = null, bd = Infinity;
  for (let i = 0; i < corners.length; i++) {
    const a = corners[i], b = corners[(i + 1) % corners.length];
    const n = nearestOnSegment2(p[0], p[2], a[0], a[2], b[0], b[2]);
    const d = Math.hypot(n[0] - p[0], n[1] - p[2]);
    if (d < bd) { bd = d; best = n; }
  }
  return best;
}

function tableFrame(spot, head, f, virtual) {
  let toward = v3.norm(v3.flat(v3.sub(head.pos, spot)));
  if (v3.len(toward) < 0.5) toward = v3.neg(f);
  const right = v3.norm(v3.cross(v3.neg(toward), UP)); // the player's right
  return { pos: spot, toward, right, yaw: faceYaw(toward), virtual, topY: spot[1] };
}

function pickTable(P, head, f, floorY) {
  let best = null;
  for (const p of P) {
    if (!p.up) continue;
    if (/(floor|ceiling|couch|sofa|bed|chair|seat)/.test(p.label)) continue;
    const hgt = p.center[1] - floorY;
    if (hgt < 0.25 || hgt > 1.15) continue;
    const toCenter = v3.norm(v3.flat(v3.sub(p.center, head.pos)));
    if (v3.dot(toCenter, f) < 0.2) continue;
    let spot;
    if (insideXZ(p.corners, head.pos[0], head.pos[2])) {
      spot = [head.pos[0] + f[0] * 0.4, p.center[1], head.pos[2] + f[2] * 0.4];
      if (!insideXZ(p.corners, spot[0], spot[2])) spot = [p.center[0], p.center[1], p.center[2]];
    } else {
      const near = nearestOnPolygonXZ(p.corners, head.pos);
      const dx = p.center[0] - near[0], dz = p.center[2] - near[1];
      const dl = Math.hypot(dx, dz);
      const inset = Math.min(TABLE_INSET, dl);
      spot = dl > 1e-6 ? [near[0] + (dx / dl) * inset, p.center[1], near[1] + (dz / dl) * inset] : [near[0], p.center[1], near[1]];
    }
    const reach = v3.dist(head.pos, spot);
    if (reach > 0.95) continue;
    const score = reach - (/(table|desk)/.test(p.label) ? 0.3 : 0);
    if (!best || score < best.score) best = { score, spot };
  }
  return best ? tableFrame(best.spot, head, f, false) : null;
}

function isWallLabel(label) {
  if (!label || label === 'other' || label === 'unknown') return null; // decide by size
  // Space Setup closes off an open-plan room with "invisible" walls (INVISIBLE_WALL_FACE): no wall stands there.
  if (label.includes('invisible')) return false;
  if (label.includes('art') || label.includes('door') || label.includes('window') || label.includes('screen')) return false;
  return label.includes('wall');
}

// The window the snowman looks in through (js/yard.js). The room scan's own window if it has a usable one: upright,
// big enough to see a snowman through, in this room, and not straight ahead (the player would see it whenever they
// look at the tree, and he only comes while no one is looking). Otherwise the game puts one on a wall, off to the
// side, clear of the floor and the ceiling. Of several, the one nearest 70° from where the player faces.
const WINDOW_W = 0.9, WINDOW_H = 0.95, WINDOW_SILL = 0.92; // a window the game puts up: size, and its bottom above the floor
function pickWindow(P, walls, head, f, floorY, ceilingY) {
  const fy = yawOf(f);
  const bearingOf = (p) => Math.abs(wrapAngle(yawOf(v3.sub(p, head.pos)) - fy)) / DEG;
  let best = null;
  const consider = (cand, score) => { if (!best || score < best.score) best = { ...cand, score }; };
  for (const p of P) {
    if (p.horizontal || !p.label.includes('window')) continue;
    let n = v3.norm(v3.flat(p.normal));
    if (v3.len(n) < 0.5) continue;
    n = v3.scale(n, v3.dot(n, v3.sub(head.pos, p.center)) < 0 ? -1 : 1); // facing the player
    const r = v3.norm(v3.cross(UP, n));
    let s0 = Infinity, s1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const c of p.corners) {
      const s = v3.dot(v3.sub(c, p.center), r);
      s0 = Math.min(s0, s); s1 = Math.max(s1, s);
      y0 = Math.min(y0, c[1]); y1 = Math.max(y1, c[1]);
    }
    const w = s1 - s0, h = y1 - y0;
    const mid = v3.addScaled(p.center, r, (s0 + s1) / 2);
    const center = [mid[0], (y0 + y1) / 2, mid[2]];
    const d = v3.distXZ(center, head.pos), b = bearingOf(center);
    if (w < 0.35 || h < 0.35 || d < 0.8 || d > 6 || b < 30) continue;
    consider({ center, normal: n, right: r, up: [0, 1, 0], w, h, bottomY: y0, real: true, wall: -1 }, Math.abs(b - 70) / 10 + Math.abs(d - 2.2) * 0.5);
  }
  if (best) { delete best.score; return best; }
  for (const arc of [[45, 110], [35, 150]]) {
    walls.forEach((wall, wi) => {
      const bottom = floorY + WINDOW_SILL, top = bottom + WINDOW_H;
      if (bottom < wall.bottomY + 0.1 || top > Math.min(wall.topY, ceilingY) - 0.1) return;
      const room = wall.width / 2 - WINDOW_W / 2 - 0.05;
      if (room < 0) return;
      for (let t = -1; t <= 1.0001; t += 0.125) {
        const center = v3.addScaled(wall.center, wall.right, t * room);
        center[1] = bottom + WINDOW_H / 2;
        const d = v3.distXZ(center, head.pos), b = bearingOf(center);
        if (b < arc[0] || b > arc[1] || d < 1.2 || d > 4.5) continue;
        consider({ center, normal: v3.copy(wall.normal), right: v3.copy(wall.right), up: [0, 1, 0], w: WINDOW_W, h: WINDOW_H, bottomY: bottom, real: false, wall: wi },
          Math.abs(b - 70) / 10 + Math.abs(d - 2.2) * 0.5);
      }
    });
    if (best) { delete best.score; return best; }
  }
  return null;
}

// The window the game puts up for the snowman (none in the room scan), as one more thing on the wall for the title to
// keep clear of: a scanned window is in the planes already.
function putUp(w) {
  if (!w || w.real) return [];
  const corner = (a, b) => v3.add(v3.addScaled(w.center, w.right, (a * w.w) / 2), [0, (b * w.h) / 2, 0]);
  return [{ label: 'window', normal: w.normal, center: w.center, corners: [corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)] }];
}

export function buildLayout(planes, head) {
  const P = (planes || []).map(analyze).filter(Boolean);
  let f = v3.norm(v3.flat(head.forward || [0, 0, -1]));
  if (v3.len(f) < 0.5) f = [0, 0, -1];
  const seatRight = v3.cross(f, UP);

  // Floor and ceiling heights.
  let floorY = 0;
  const floors = P.filter((p) => p.up && p.label.includes('floor'));
  const lows = P.filter((p) => p.up && p.center[1] < 0.25);
  if (floors.length) floorY = Math.min(...floors.map((p) => p.center[1]));
  else if (lows.length) floorY = Math.min(...lows.map((p) => p.center[1]));
  const ceilings = P.filter((p) => p.horizontal && p.label.includes('ceiling'));
  const ceilingY = ceilings.length ? Math.max(...ceilings.map((p) => p.center[1])) : floorY + 2.4;

  // Where the tree sits: a real table within reach, else a small virtual side table.
  const table = pickTable(P, head, f, floorY)
    || tableFrame([head.pos[0] + f[0] * 0.45, clamp(head.pos[1] - 0.45, 0.35, 1.0), head.pos[2] + f[2] * 0.45], head, f, true);

  // Walls, with normals turned to face the player.
  const walls = [];
  for (const p of P) {
    if (p.horizontal) continue;
    let n = v3.norm(v3.flat(p.normal));
    if (v3.len(n) < 0.5) continue;
    if (v3.dot(n, v3.sub(head.pos, p.center)) < 0) n = v3.neg(n);
    const r = v3.norm(v3.cross(UP, n));
    let s0 = Infinity, s1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const c of p.corners) {
      const s = v3.dot(v3.sub(c, p.center), r);
      s0 = Math.min(s0, s); s1 = Math.max(s1, s);
      y0 = Math.min(y0, c[1]); y1 = Math.max(y1, c[1]);
    }
    const width = s1 - s0, height = y1 - y0;
    const byLabel = isWallLabel(p.label);
    if (byLabel === false || (byLabel === null && (width < 1.0 || height < 1.2))) continue;
    const mid = v3.addScaled(p.center, r, (s0 + s1) / 2);
    walls.push({ center: [mid[0], (y0 + y1) / 2, mid[2]], normal: n, right: r, width, bottomY: y0, topY: y1, virtual: false });
  }
  const realWalls = walls.length > 0;
  if (!realWalls) {
    for (const dir of [f, v3.neg(f), seatRight, v3.neg(seatRight)]) {
      const c = v3.addScaled([head.pos[0], floorY + 1.2, head.pos[2]], dir, 2.6);
      const n = v3.neg(dir);
      walls.push({ center: c, normal: n, right: v3.norm(v3.cross(UP, n)), width: 4, bottomY: floorY, topY: floorY + 2.4, virtual: true });
    }
  }

  // Spawn points along wall bases: not too close, not straight ahead, not directly behind.
  const fy = yawOf(f);
  const cands = [];
  walls.forEach((w, wi) => {
    for (const t of [0.12, 0.27, 0.42, 0.57, 0.72, 0.87]) {
      const base = v3.addScaled(w.center, w.right, -w.width / 2 + w.width * t);
      const pos = v3.addScaled([base[0], floorY, base[2]], w.normal, 0.18);
      pos[1] = floorY;
      const d = v3.distXZ(pos, head.pos);
      const a = Math.abs(wrapAngle(yawOf(v3.sub(pos, head.pos)) - fy));
      cands.push({ pos, wall: wi, d, a });
    }
  });
  let spawns = cands.filter((c) => c.d >= 1.4 && c.a >= 35 * DEG && c.a <= 150 * DEG);
  // Beside and behind must be possible too: with your back near a wall in a small room, every spawn 1.4 m
  // away is in front of you, so every arrival is seen at once and none ever reaches you. Then closer
  // spots out to the sides and behind join in (still beyond striking distance).
  if (spawns.filter((c) => c.a >= 75 * DEG).length < 2) spawns = spawns.concat(cands.filter((c) => c.d >= 0.95 && c.d < 1.4 && c.a >= 75 * DEG && c.a <= 150 * DEG));
  if (spawns.length < 2) spawns = cands.filter((c) => c.d >= 1.4 && c.a >= 35 * DEG);
  if (spawns.length < 2) spawns = cands.filter((c) => c.d >= 1.0 && c.a >= 35 * DEG);
  if (spawns.length < 2) {
    spawns = [60, -60, 100, -100, 135, -135].map((deg) => {
      const dir = q.rotate(q.fromYaw(deg * DEG), f);
      return { pos: [head.pos[0] + dir[0] * 1.6, floorY, head.pos[2] + dir[2] * 1.6], wall: -1, d: 1.6, a: Math.abs(deg) * DEG };
    });
  }

  // String lights run along the top of each real wall.
  const lightRuns = [];
  if (realWalls) {
    for (const w of walls) {
      if (w.width < 0.6) continue;
      const y = runY(w, floorY, ceilingY);
      const a = v3.addScaled(v3.addScaled([w.center[0], y, w.center[2]], w.right, -w.width / 2 + 0.1), w.normal, 0.04);
      const b = v3.addScaled(v3.addScaled([w.center[0], y, w.center[2]], w.right, w.width / 2 - 0.1), w.normal, 0.04);
      lightRuns.push([a, b]);
    }
  }

  const window = pickWindow(P, walls, head, f, floorY, ceilingY);

  return {
    floorY,
    ceilingY,
    title: titlePlace(walls, realWalls, head.pos, f, floorY, ceilingY, P.filter((p) => !p.horizontal && isWallLabel(p.label) === false).concat(putUp(window))),
    seat: { pos: v3.copy(head.pos), yaw: fy, forward: f, right: seatRight },
    window,
    table,
    walls,
    realWalls,
    spawns: spawns.map(({ pos, wall, a }) => ({ pos, wall, angle: a })),
    lightRuns,
  };
}

// How high a wall's run of string lights hangs.
const runY = (w, floorY, ceilingY) => clamp(Math.min(w.topY - 0.12, floorY + 2.35, ceilingY - 0.12), floorY + 1.6, floorY + 2.6);

// Where the title goes: on the wall straight ahead of the seat; if that wall is slanted too far to read, or too
// little of it shows, on the nearest wall that can take it turning up to 30° to either side; else hung in the air
// ahead (no room scan, or an open room). Returns the frame and the room it may use; walltitle.js sizes the letters to fit:
// center: on the wall (0.03 m out, toward the seat), at the preferred height, about 12° above the eyes;
// maxW: its full width fits inside TITLE_HALF_FOV either side, and on the wall with 10 cm to spare;
// minY..maxY: above the eyes (so it reads over the tree), 10 cm under the wall's lights and the ceiling;
// sMin..sMax: how far its edges may reach along `right` from the centre before leaving the wall or the view.
const AHEAD = 2.6;
// A wall turned more than this far from facing the seat doesn't take the title: read that slantwise, the letters
// squash to half their width and its near end runs out of the view.
const MAX_SLANT = 60 * DEG;
// The narrowest stretch of wall worth turning away from straight ahead for: the whole title at its smallest letters
// (walltitle.js: 75 columns of 8/7 cm).
const MIN_SPAN = 0.86;
const TURNS = [0, 5, -5, 10, -10, 15, -15, 20, -20, 25, -25, 30, -30].map((d) => d * DEG);

// The first real wall along `dir` from the seat, and whether it can take the title.
function wallOnLine(walls, seat, dir) {
  let first = null;
  walls.forEach((w, i) => {
    const den = v3.dot(dir, w.normal);
    if (den > -1e-6) return; // runs alongside the line, or faces away
    const t = v3.dot(v3.sub(w.center, seat), w.normal) / den;
    if (t < 0.05) return;
    const s = v3.dot(v3.sub(v3.addScaled(seat, dir, t), w.center), w.right);
    if (Math.abs(s) > w.width / 2) return;
    // A wall closer than 0.4 m is too close to read a title on, but it still hides what is behind it.
    if (!first || t < first.t) first = { i, w, t, s, fit: t >= 0.4 && den <= -Math.cos(MAX_SLANT) };
  });
  return first;
}

// The title's wall, aim and reach for one line from the seat: `hit` a wall that can take it (wallOnLine), or null
// to hang it in the air, `dist` along `aim`.
function titleFrame(walls, realWalls, seat, aim, hit, dist, floorY, ceilingY) {
  let w, wall, sMin, sMax, top;
  if (hit) {
    ({ w } = hit); wall = hit.i;
    sMin = -(hit.s + w.width / 2) + 0.1;
    sMax = w.width / 2 - hit.s - 0.1;
    top = Math.min(runY(w, floorY, ceilingY) - 0.1, ceilingY - 0.1, w.topY - 0.05);
  } else {
    // Hung in the air where a wall would be (a stand-in wall of the layout's own if it has one there).
    const n = v3.neg(aim);
    wall = walls.findIndex((x) => x.virtual && v3.dot(x.normal, n) > 0.999);
    w = { center: v3.addScaled([seat[0], floorY + 1.2, seat[2]], aim, dist), normal: n, right: v3.norm(v3.cross(UP, n)), width: Infinity };
    sMin = -Infinity; sMax = Infinity;
    top = Math.min(floorY + 2.3, ceilingY - 0.1);
  }
  const onWall = v3.addScaled(seat, aim, dist);
  // How far round either side the title may reach and still be seen whole: to TITLE_HALF_FOV off its line, while the
  // wall is still seen within MAX_SLANT of face on, and on a real wall only as far as the same wall stays the first
  // thing in view (a corner of the room jutting in cuts it short); in the air, only while every real wall stays behind
  // it. In 1° steps. The bulbs hang 3 cm off the wall: the reach is measured in their plane.
  const bulbs = v3.dot(v3.sub(onWall, seat), w.normal) + 0.03; // signed: the plane lies against the normal
  const reach = (dir) => bulbs / v3.dot(dir, w.normal); // along dir to the bulbs' plane
  const sAt = (dir) => v3.dot(v3.sub(v3.addScaled(seat, dir, reach(dir)), onWall), w.right);
  const turned = (deg) => q.rotate(q.fromYaw(deg * DEG), aim);
  const steps = Math.round(TITLE_HALF_FOV / DEG);
  for (const side of [-1, 1]) {
    let k = 0;
    for (; k < steps; k++) {
      const dir = turned(side * (k + 1));
      if (v3.dot(dir, w.normal) > -Math.cos(MAX_SLANT)) break; // past here the wall is seen too slantwise to read
      const seen = realWalls ? wallOnLine(walls, seat, dir) : null;
      if (hit ? !seen || seen.i !== hit.i : seen && seen.t < reach(dir) + 0.1) break;
    }
    // Which way along the wall this side runs: on a slanted wall even the line itself meets the bulbs' plane a little
    // off the title's centre, so the turn is measured from there.
    const sEdge = sAt(turned(side * k));
    if (sAt(turned(side)) < sAt(aim)) sMin = Math.max(sMin, sEdge); else sMax = Math.min(sMax, sEdge);
  }
  return { w, wall, dist, aim, onWall, sMin, sMax, top, onRealWall: !!hit };
}

export function titlePlace(walls, realWalls, seat, f, floorY, ceilingY, things = []) {
  // Straight ahead if a wall there can take the whole title. If the wall ahead is slanted too far, or too little of it
  // shows, the smallest turn (at most 30°) that finds one that can; else the first that could take it at all,
  // however narrow; else in the air ahead, short of any real wall there. With no wall ahead at all (an open room)
  // it hangs in the air ahead rather than turn to a wall off to the side.
  let pick = null, narrow = null;
  if (realWalls && wallOnLine(walls, seat, f)) {
    for (const turn of TURNS) {
      const dir = q.rotate(q.fromYaw(turn), f);
      const hit = wallOnLine(walls, seat, dir);
      if (!hit || !hit.fit) continue;
      const fr = titleFrame(walls, realWalls, seat, dir, hit, hit.t, floorY, ceilingY);
      if (fr.sMax - fr.sMin >= MIN_SPAN) { pick = fr; break; }
      if (!narrow) narrow = fr;
    }
  }
  if (!pick) pick = narrow;
  if (!pick) {
    const ahead = realWalls ? wallOnLine(walls, seat, f) : null;
    const t = ahead ? ahead.t : Infinity;
    pick = titleFrame(walls, realWalls, seat, f, null, Math.min(AHEAD, Math.max(0.9, 0.6 * t), Math.max(0.3, t - 0.1)), floorY, ceilingY);
  }
  const { w, wall, dist, onWall, sMin, sMax, top } = pick;
  const eyeY = seat[1];
  const minY = eyeY + 0.03, maxY = Math.max(minY, top);
  // Windows, doors, a TV, wall art: the room scan labels them, and the title keeps clear of those on its wall.
  // Each is a rectangle in the wall's terms: s along `right` from the title's centre, y up.
  const avoid = [];
  if (pick.onRealWall) {
    for (const t of things) {
      if (Math.abs(v3.dot(t.normal, w.normal)) < 0.8) continue;
      if (Math.abs(v3.dot(v3.sub(t.center, onWall), w.normal)) > 0.3) continue; // not on this wall
      let s0 = Infinity, s1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const c of t.corners) {
        const s = v3.dot(v3.sub(c, onWall), w.right);
        s0 = Math.min(s0, s); s1 = Math.max(s1, s); y0 = Math.min(y0, c[1]); y1 = Math.max(y1, c[1]);
      }
      avoid.push({ s0, s1, y0, y1, label: t.label });
    }
  }
  const center = v3.addScaled([onWall[0], clamp(eyeY + dist * Math.tan(12 * DEG), minY, maxY), onWall[2]], w.normal, 0.03);
  return {
    center, normal: v3.copy(w.normal), right: v3.copy(w.right), dist, wall,
    maxW: Math.max(0, sMax - sMin), minY, maxY, sMin, sMax, avoid,
  };
}
