// The Christmas Megapack props (BRAiNBOX, bought for this game: Unity Asset Store standard EULA, for use inside
// the game only), turned into the game's flat-shaded format by tools/import-fbx.py and kept in js/props-data.js.
// Each is stored standing on y = 0, centred, a metre tall: place it with a node's position and scale.
import { PROPS } from './props-data.js';

const bytes = (b64) => {
  const s = atob(b64);
  const a = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
  return a;
};

export const PROP_NAMES = Object.keys(PROPS);

// { pos, nrm, col, uv, count }: corners de-quantised into the stored box, one normal and one colour per triangle.
export function decodeProp(name) {
  const p = PROPS[name];
  if (!p) throw new Error(`no prop called ${name}`);
  const q = new Int16Array(bytes(p.pos).buffer), n = new Int8Array(bytes(p.nrm).buffer), c = bytes(p.col);
  const count = p.tris * 3;
  const pos = new Float32Array(count * 3), nrm = new Float32Array(count * 3), col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    for (let k = 0; k < 3; k++) pos[i * 3 + k] = p.lo[k] + ((q[i * 3 + k] + 32768) / 65535) * (p.hi[k] - p.lo[k]);
  }
  for (let t = 0; t < p.tris; t++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        nrm[(t * 3 + j) * 3 + k] = n[t * 3 + k] / 127;
        col[(t * 3 + j) * 3 + k] = c[t * 3 + k] / 255;
      }
    }
  }
  return { pos, nrm, col, uv: null, count };
}
