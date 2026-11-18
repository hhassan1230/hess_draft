// Many small moving copies of cached meshes (wall debris, splinters, sparkles) drawn as one mesh:
// one draw call per kind instead of one per piece. At the finale's peak the pieces were half of all
// draw calls. Rebuilt on the CPU each frame: each piece's vertices moved, turned and scaled into place.
import { Node } from './scene.js';

export class Batch {
  constructor(name, mat = {}) {
    // dynamic: the renderer uploads it again whenever version changes.
    this.geo = { pos: new Float32Array(0), nrm: new Float32Array(0), col: new Float32Array(0), count: 0, dynamic: true, version: 0 };
    this.node = new Node(name, this.geo, mat);
    this.node.visible = false;
  }

  // pieces: Nodes with a geo and pos/rot/scl in this batch node's space (scale must be uniform).
  update(pieces) {
    const g = this.geo;
    let count = 0;
    for (const p of pieces) count += p.geo.count;
    if (g.pos.length < count * 3) {
      const cap = Math.max(count, 64) * 3 * 2;
      g.pos = new Float32Array(cap); g.nrm = new Float32Array(cap); g.col = new Float32Array(cap);
    }
    // No allocation per vertex (this runs every frame while particles fly): each piece's rotation
    // becomes a 3x3 matrix once, and the vertices are written straight into the batch.
    const P = g.pos, N = g.nrm, C = g.col;
    let o = 0;
    for (const p of pieces) {
      const s = p.geo, k = p.scl[0], t = p.pos, [x, y, z, w] = p.rot;
      const m00 = 1 - 2 * (y * y + z * z), m01 = 2 * (x * y - w * z), m02 = 2 * (x * z + w * y);
      const m10 = 2 * (x * y + w * z), m11 = 1 - 2 * (x * x + z * z), m12 = 2 * (y * z - w * x);
      const m20 = 2 * (x * z - w * y), m21 = 2 * (y * z + w * x), m22 = 1 - 2 * (x * x + y * y);
      const sp = s.pos, sn = s.nrm, sc = s.col;
      for (let i = 0, n = s.count * 3; i < n; i += 3, o += 3) {
        const px = sp[i] * k, py = sp[i + 1] * k, pz = sp[i + 2] * k;
        P[o] = m00 * px + m01 * py + m02 * pz + t[0];
        P[o + 1] = m10 * px + m11 * py + m12 * pz + t[1];
        P[o + 2] = m20 * px + m21 * py + m22 * pz + t[2];
        const nx = sn[i], ny = sn[i + 1], nz = sn[i + 2];
        N[o] = m00 * nx + m01 * ny + m02 * nz;
        N[o + 1] = m10 * nx + m11 * ny + m12 * nz;
        N[o + 2] = m20 * nx + m21 * ny + m22 * nz;
        C[o] = sc[i]; C[o + 1] = sc[i + 1]; C[o + 2] = sc[i + 2];
      }
    }
    g.count = count;
    g.version++;
    this.node.visible = count > 0;
  }
}
