// Pinned to the room (?pin). A spatial anchor made at the table, once the room scan has placed it, carries the
// scene's frame with the real room: when the headset recenters (hold the Meta button) or relocates itself, the
// tree stays on your real table and the nutcrackers keep to your real walls. Without it, a recenter brings the
// scene round to face you, as Meta's store rule asks of apps, and lifts the tree off the table.
// Every pose is read in the room's frame: the anchor's pose now, less the point where it was made (made unturned).
import { q, v3 } from './math.js';

export function roomFrame(now, madeAt) {
  return { pos: v3.sub(now.pos, q.rotate(now.quat, madeAt)), quat: now.quat };
}

// How far the room's frame has moved from the reference space: metres, and degrees of turn about up (anchors
// stay level).
export function frameMoved(f) {
  const yaw = (2 * Math.atan2(f.quat[1], f.quat[3]) * 180) / Math.PI;
  const deg = Math.abs(((yaw % 360) + 540) % 360 - 180);
  return { m: +v3.len(f.pos).toFixed(4), deg: +deg.toFixed(3) };
}

// Two frames closer than tracking noise (2 mm, about a fifth of a degree) are the same: no new space for them.
export function sameFrame(a, b) {
  const dot = Math.abs(a.quat[0] * b.quat[0] + a.quat[1] * b.quat[1] + a.quat[2] * b.quat[2] + a.quat[3] * b.quat[3]);
  return v3.dist(a.pos, b.pos) < 0.002 && dot > 0.999998;
}
