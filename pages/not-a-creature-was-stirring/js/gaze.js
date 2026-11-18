// Is a world point inside what the player can see right now?
// viewProjs: one projection*view matrix per eye. margin: fraction of the
// view (in normalized device coordinates) that counts as "looking at it".
import { m4 } from './math.js';

export function isObserved(point, viewProjs, margin = 0.85) {
  for (const vp of viewProjs) {
    const c = m4.point4(vp, point);
    if (c[3] <= 0.01) continue; // behind the eye
    const x = c[0] / c[3], y = c[1] / c[3];
    if (Math.abs(x) < margin && Math.abs(y) < margin) return true;
  }
  return false;
}

// True if any of the points is in view.
export const anyObserved = (points, viewProjs, margin) => points.some((p) => isObserved(p, viewProjs, margin));
