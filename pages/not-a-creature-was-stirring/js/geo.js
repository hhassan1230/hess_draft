// Flat-shaded, vertex-colored geometry builders. Every builder returns
// { pos, nrm, col, uv, count } with non-indexed triangles, so each face gets
// its own normal (the faceted low-poly look). Normals are oriented away from
// the shape's center, so winding mistakes never show up as dark faces.
import { v3, m4 } from './math.js';

class Builder {
  constructor() { this.p = []; this.n = []; this.c = []; this.u = null; }
  tri(a, b, c, col, center = null, uvs = null) {
    let n = v3.cross(v3.sub(b, a), v3.sub(c, a));
    const l = v3.len(n);
    if (l < 1e-12) return; // skip degenerate triangles
    n = v3.scale(n, 1 / l);
    if (center) {
      const fc = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, (a[2] + b[2] + c[2]) / 3];
      if (v3.dot(n, v3.sub(fc, center)) < 0) {
        [b, c] = [c, b];
        n = v3.neg(n);
        if (uvs) uvs = [uvs[0], uvs[2], uvs[1]];
      }
    }
    for (const v of [a, b, c]) { this.p.push(v[0], v[1], v[2]); this.n.push(n[0], n[1], n[2]); this.c.push(col[0], col[1], col[2]); }
    if (uvs) { this.u = this.u || []; for (const t of uvs) this.u.push(t[0], t[1]); }
  }
  quad(a, b, c, d, col, center = null) { this.tri(a, b, c, col, center); this.tri(a, c, d, col, center); }
  build() {
    return {
      pos: new Float32Array(this.p),
      nrm: new Float32Array(this.n),
      col: new Float32Array(this.c),
      uv: this.u ? new Float32Array(this.u) : null,
      count: this.p.length / 3,
    };
  }
}

// Axis-aligned box centered on the origin.
// open: faces to leave out, by letter: f (+z, front), b (-z), r (+x), l (-x), t (+y, top), u (-y). A face that
// something else covers exactly (the bricks on a fireplace pillar) is left out, or the two trade places on screen.
export function box(w, h, d, col, { open = '' } = {}) {
  const b = new Builder();
  const x = w / 2, y = h / 2, z = d / 2;
  const P = [[-x, -y, -z], [x, -y, -z], [x, y, -z], [-x, y, -z], [-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z]];
  const C = [0, 0, 0];
  const faces = [[4, 5, 6, 7], [1, 0, 3, 2], [5, 1, 2, 6], [0, 4, 7, 3], [7, 6, 2, 3], [0, 1, 5, 4]];
  faces.forEach((f, i) => { if (!open.includes('fbrltu'[i])) b.quad(P[f[0]], P[f[1]], P[f[2]], P[f[3]], col, C); });
  return b.build();
}

// Cylinder (or frustum) standing on the origin, from y = 0 to y = h.
export function cyl(rTop, rBot, h, segs, col, { caps = true, capCol = null } = {}) {
  const b = new Builder();
  const C = [0, h / 2, 0];
  for (let i = 0; i < segs; i++) {
    const a0 = (i / segs) * Math.PI * 2, a1 = ((i + 1) / segs) * Math.PI * 2;
    const b0 = [Math.cos(a0) * rBot, 0, Math.sin(a0) * rBot], b1 = [Math.cos(a1) * rBot, 0, Math.sin(a1) * rBot];
    const t0 = [Math.cos(a0) * rTop, h, Math.sin(a0) * rTop], t1 = [Math.cos(a1) * rTop, h, Math.sin(a1) * rTop];
    if (rTop > 0) b.quad(b0, b1, t1, t0, col, C); else b.tri(b0, b1, [0, h, 0], col, C);
    if (caps) {
      if (rTop > 0) b.tri([0, h, 0], t0, t1, capCol || col, [0, -1, 0]);
      if (rBot > 0) b.tri([0, 0, 0], b1, b0, capCol || col, [0, h + 1, 0]);
    }
  }
  return b.build();
}

export const cone = (r, h, segs, col) => cyl(0, r, h, segs, col);

// Low-poly sphere centered on the origin.
export function sphere(r, wSegs, hSegs, col) {
  const b = new Builder();
  const pt = (i, j) => {
    const th = (i / wSegs) * Math.PI * 2, ph = (j / hSegs) * Math.PI;
    return [Math.cos(th) * Math.sin(ph) * r, Math.cos(ph) * r, Math.sin(th) * Math.sin(ph) * r];
  };
  const C = [0, 0, 0];
  for (let j = 0; j < hSegs; j++) {
    for (let i = 0; i < wSegs; i++) {
      const a = pt(i, j), bb = pt(i + 1, j), c = pt(i + 1, j + 1), d = pt(i, j + 1);
      if (j === 0) b.tri(a, c, d, col, C);
      else if (j === hSegs - 1) b.tri(a, bb, c, col, C);
      else b.quad(a, bb, c, d, col, C);
    }
  }
  return b.build();
}

// A profile [[r, y, col?], ...] turned about the Y axis. Walk the profile with the
// solid on the left: out along the bottom, up the outside, in across the top (or
// down an inside wall and in across a floor, for a dish), and every face points
// out of the solid. A point's colour, if given, colours the band up to the next point.
export function lathe(profile, segs, col, { phase = 0 } = {}) {
  const b = new Builder();
  const at = (r, y, a) => [Math.cos(a) * r, y, Math.sin(a) * r];
  for (let j = 0; j < profile.length - 1; j++) {
    const [r0, y0, c0] = profile[j], [r1, y1] = profile[j + 1];
    const c = c0 || col;
    for (let i = 0; i < segs; i++) {
      const a0 = phase + (i / segs) * Math.PI * 2, a1 = phase + ((i + 1) / segs) * Math.PI * 2;
      const A = at(r0, y0, a0), B = at(r0, y0, a1), C = at(r1, y1, a1), D = at(r1, y1, a0);
      b.tri(A, D, C, c);
      b.tri(A, C, B, c);
    }
  }
  return b.build();
}

// A round tube along a path of points, with one radius or one per point. The ends
// are capped unless the path is closed into a ring.
export function tube(points, radii, sides, col, { closed = false } = {}) {
  const b = new Builder();
  const n = points.length;
  const rad = (i) => (Array.isArray(radii) ? radii[i] : radii);
  const tan = points.map((p, i) => {
    const prev = closed ? points[(i - 1 + n) % n] : points[Math.max(0, i - 1)];
    const next = closed ? points[(i + 1) % n] : points[Math.min(n - 1, i + 1)];
    return v3.norm(v3.sub(next, prev));
  });
  // A frame carried along the path, so the tube does not twist.
  let u = v3.norm(v3.cross(tan[0], Math.abs(tan[0][1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]));
  const rings = points.map((p, i) => {
    if (i > 0) u = v3.norm(v3.sub(u, v3.scale(tan[i], v3.dot(u, tan[i]))));
    const w = v3.cross(tan[i], u);
    return Array.from({ length: sides }, (_, k) => {
      const a = (k / sides) * Math.PI * 2;
      return v3.add(p, v3.add(v3.scale(u, Math.cos(a) * rad(i)), v3.scale(w, Math.sin(a) * rad(i))));
    });
  });
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const R0 = rings[i], R1 = rings[(i + 1) % n];
    const mid = v3.scale(v3.add(points[i], points[(i + 1) % n]), 0.5);
    for (let k = 0; k < sides; k++) b.quad(R0[k], R0[(k + 1) % sides], R1[(k + 1) % sides], R1[k], col, mid);
  }
  if (!closed) {
    for (const [i, away] of [[0, 1], [n - 1, n - 2]]) {
      for (let k = 0; k < sides; k++) b.tri(points[i], rings[i][k], rings[i][(k + 1) % sides], col, points[away]);
    }
  }
  return b.build();
}

// One tier of a fir, standing on y = 0 with its point at y = h: a ring of `tips` branch tips that
// droop below the base (at radius r), with notches between (at notch * r), and a darker underside.
// Each branch bows outward a little at mid-length and is darker toward the trunk, so the tier reads
// as layered branches rather than a smooth cone. Angles run as sin for x, cos for z.
export function fir(r, h, tips, { droop = 0.22, notch = 0.62, phase = 0, col, inCol = col, underCol = col, jitter = null } = {}) {
  const b = new Builder();
  const apex = [0, h, 0], under = [0, h * 0.22, 0];
  const rim = [], mid = [];
  for (let i = 0; i < tips * 2; i++) {
    const a = phase + (i / (tips * 2)) * Math.PI * 2;
    const tip = i % 2 === 0;
    const rr = tip ? r : r * notch;
    const y = tip ? -droop * h : 0.08 * h;
    rim.push([Math.sin(a) * rr, y, Math.cos(a) * rr]);
    const mr = rr * 0.5 + r * 0.05, my = (h + y) / 2 + 0.04 * h; // half way out, bowed outward and up
    mid.push([Math.sin(a) * mr, my, Math.cos(a) * mr]);
  }
  const n = rim.length, axisUp = [0, h * 3, 0], axis = [0, h * 0.4, 0];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const k = jitter ? jitter(Math.floor((i + 1) / 2) % tips) : 1; // one shade per branch (the two faces around a tip)
    const shade = (c) => c.map((x) => Math.min(1, x * k));
    b.tri(apex, mid[i], mid[j], shade(inCol), axis);
    b.tri(mid[i], rim[i], rim[j], shade(col), axis);
    b.tri(mid[i], rim[j], mid[j], shade(col), axis);
    b.tri(under, rim[j], rim[i], underCol, axisUp);
  }
  return b.build();
}

// A w x h rectangle in the XY plane facing +Z, centered on the origin, cut into nx x ny cells
// (ix from left, iy from the bottom), each coloured by colOf(ix, iy). Small cells let the
// per-vertex lights show a pool of light on a wall or floor; the colours make stripes or planks.
export function grid(w, h, nx, ny, colOf) {
  const b = new Builder();
  for (let iy = 0; iy < ny; iy++) {
    for (let ix = 0; ix < nx; ix++) {
      const x0 = -w / 2 + (ix / nx) * w, x1 = -w / 2 + ((ix + 1) / nx) * w;
      const y0 = -h / 2 + (iy / ny) * h, y1 = -h / 2 + ((iy + 1) / ny) * h;
      b.quad([x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0], colOf(ix, iy), [0, 0, -1]);
    }
  }
  return b.build();
}

// Faceted star in the XY plane, bulging to +/- depth on Z (a gem-like 3D star).
export function star(outerR, innerR, depth, points, col) {
  const b = new Builder();
  const rim = [];
  for (let i = 0; i < points * 2; i++) {
    const a = Math.PI / 2 + (i / (points * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? outerR : innerR;
    rim.push([Math.cos(a) * r, Math.sin(a) * r, 0]);
  }
  const front = [0, 0, depth], back = [0, 0, -depth];
  for (let i = 0; i < rim.length; i++) {
    const a = rim[i], c = rim[(i + 1) % rim.length];
    b.tri(front, a, c, col, [0, 0, 0]);
    b.tri(back, c, a, col, [0, 0, 0]);
  }
  return b.build();
}

// Flat disc lying on the XZ plane, facing +Y (blob shadows, glows).
export function disc(r, segs, col) {
  const b = new Builder();
  for (let i = 0; i < segs; i++) {
    const a0 = (i / segs) * Math.PI * 2, a1 = ((i + 1) / segs) * Math.PI * 2;
    b.tri([0, 0, 0], [Math.cos(a1) * r, 0, Math.sin(a1) * r], [Math.cos(a0) * r, 0, Math.sin(a0) * r], col, [0, -1, 0]);
  }
  return b.build();
}

// A convex outline of [x, z] points stood up as a slab: top at y = 0, underside at y = -height.
export function prism(outline, height, col) {
  const b = new Builder();
  let cx = 0, cz = 0;
  for (const p of outline) { cx += p[0]; cz += p[1]; }
  cx /= outline.length; cz /= outline.length;
  const mid = [cx, -height / 2, cz];
  for (let i = 0; i < outline.length; i++) {
    const a = outline[i], c = outline[(i + 1) % outline.length];
    b.tri([cx, 0, cz], [a[0], 0, a[1]], [c[0], 0, c[1]], col, [cx, -1, cz]);
    b.tri([cx, -height, cz], [a[0], -height, a[1]], [c[0], -height, c[1]], col, [cx, 1, cz]);
    b.quad([a[0], 0, a[1]], [c[0], 0, c[1]], [c[0], -height, c[1]], [a[0], -height, a[1]], col, mid);
  }
  return b.build();
}

// Textured quad in the XY plane facing +Z, centered on the origin. uv (0,0) is top-left.
export function quad(w, h, col = [1, 1, 1]) {
  const b = new Builder();
  const x = w / 2, y = h / 2;
  b.tri([-x, -y, 0], [x, -y, 0], [x, y, 0], col, null, [[0, 1], [1, 1], [1, 0]]);
  b.tri([-x, -y, 0], [x, y, 0], [-x, y, 0], col, null, [[0, 1], [1, 0], [0, 0]]);
  return b.build();
}

// Flat polygon (list of [x, y] points, convex or star-shaped around its centroid) in the XY plane facing +Z.
export function poly(points, col) {
  const b = new Builder();
  let cx = 0, cy = 0;
  for (const p of points) { cx += p[0]; cy += p[1]; }
  cx /= points.length; cy /= points.length;
  for (let i = 0; i < points.length; i++) {
    const a = points[i], c = points[(i + 1) % points.length];
    b.tri([cx, cy, 0], [a[0], a[1], 0], [c[0], c[1], 0], col, [cx, cy, -1]);
  }
  return b.build();
}

export function xform(g, m) {
  const pos = new Float32Array(g.pos.length), nrm = new Float32Array(g.nrm.length);
  for (let i = 0; i < g.count; i++) {
    const p = m4.point(m, [g.pos[i * 3], g.pos[i * 3 + 1], g.pos[i * 3 + 2]]);
    const n = v3.norm(m4.dir(m, [g.nrm[i * 3], g.nrm[i * 3 + 1], g.nrm[i * 3 + 2]]));
    pos.set(p, i * 3); nrm.set(n, i * 3);
  }
  return { pos, nrm, col: g.col.slice(), uv: g.uv ? g.uv.slice() : null, count: g.count };
}

export function merge(list) {
  const count = list.reduce((s, g) => s + g.count, 0);
  const pos = new Float32Array(count * 3), nrm = new Float32Array(count * 3), col = new Float32Array(count * 3);
  const hasUv = list.every((g) => g.uv);
  const uv = hasUv ? new Float32Array(count * 2) : null;
  let o = 0;
  for (const g of list) {
    pos.set(g.pos, o * 3); nrm.set(g.nrm, o * 3); col.set(g.col, o * 3);
    if (uv) uv.set(g.uv, o * 2);
    o += g.count;
  }
  return { pos, nrm, col, uv, count };
}

export function recolor(g, col) {
  const out = { ...g, col: new Float32Array(g.count * 3) };
  for (let i = 0; i < g.count; i++) out.col.set(col, i * 3);
  return out;
}

// Shorthand: geometry placed with a translation / rotation / scale.
export const at = (g, pos, rot = [0, 0, 0, 1], scl = [1, 1, 1]) => xform(g, m4.compose(pos, rot, scl));

// Soft glow sprites, many in one draw: [{ p, size, col, phase = 0, twinkle = 0 }].
// Not ordinary geometry: every corner keeps its sprite's centre in pos and
// carries (corner x, corner y, size) in nrm and (phase, twinkle) in uv. The
// renderer's sprite program turns each one to face the eye (or lays it flat)
// and fades it from the centre out.
export function sprites(list) {
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, -1], [1, 1], [-1, 1]];
  const count = list.length * 6;
  const pos = new Float32Array(count * 3), nrm = new Float32Array(count * 3), col = new Float32Array(count * 3), uv = new Float32Array(count * 2);
  list.forEach((s, i) => {
    corners.forEach(([cx, cy], k) => {
      const v = i * 6 + k;
      pos.set(s.p, v * 3);
      nrm.set([cx, cy, s.size], v * 3);
      col.set(s.col, v * 3);
      uv.set([s.phase || 0, s.twinkle || 0], v * 2);
    });
  });
  return { pos, nrm, col, uv, count };
}
