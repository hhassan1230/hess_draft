// Turns the room's detected planes (or nothing) into a play layout:
// where the tree goes, which walls the nutcrackers come out of, where the
// string lights run. Pure functions, unit-tested in Node.
import { v3, q, m4, yawOf, wrapAngle, clamp } from './math.js';

const UP = [0, 1, 0];
const DEG = Math.PI / 180;

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
      const inset = Math.min(0.12, dl);
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
  if (label.includes('art') || label.includes('door') || label.includes('window') || label.includes('screen')) return false;
  return label.includes('wall');
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
      const y = clamp(Math.min(w.topY - 0.12, floorY + 2.35, ceilingY - 0.12), floorY + 1.6, floorY + 2.6);
      const a = v3.addScaled(v3.addScaled([w.center[0], y, w.center[2]], w.right, -w.width / 2 + 0.1), w.normal, 0.04);
      const b = v3.addScaled(v3.addScaled([w.center[0], y, w.center[2]], w.right, w.width / 2 - 0.1), w.normal, 0.04);
      lightRuns.push([a, b]);
    }
  }

  return {
    floorY,
    ceilingY,
    seat: { pos: v3.copy(head.pos), yaw: fy, forward: f, right: seatRight },
    table,
    walls,
    realWalls,
    spawns: spawns.map(({ pos, wall, a }) => ({ pos, wall, angle: a })),
    lightRuns,
  };
}
