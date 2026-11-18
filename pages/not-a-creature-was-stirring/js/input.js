// Hands (or controllers) as the game sees them:
// { side, active, pos (pinch point), tip (index fingertip), pinching, kind, pinchDist (thumb to index, meters) }.
// Pinch uses hysteresis so tracking jitter doesn't drop what you hold.
import { m4 } from './math.js';

const PINCH_ON = 0.025;
const PINCH_OFF = 0.045;

const vec = (p) => [p.x, p.y, p.z];

// Where an input source points (its target ray): { origin, dir } in the reference space, or null.
function readRay(frame, src, refSpace) {
  const pose = src.targetRaySpace && frame.getPose(src.targetRaySpace, refSpace);
  if (!pose) return null;
  const m = pose.transform.matrix;
  const l = Math.hypot(m[8], m[9], m[10]) || 1;
  return { origin: [m[12], m[13], m[14]], dir: [-m[8] / l, -m[9] / l, -m[10] / l] };
}

export function readXRHands(frame, session, refSpace, state) {
  const out = [];
  for (const src of session.inputSources) {
    const side = src.handedness === 'left' ? 'left' : 'right';
    if (src.hand) {
      const tipJ = src.hand.get('index-finger-tip');
      const thumbJ = src.hand.get('thumb-tip');
      const tip = tipJ && frame.getJointPose(tipJ, refSpace);
      const thumb = thumbJ && frame.getJointPose(thumbJ, refSpace);
      if (!tip || !thumb) { out.push({ side, active: false, kind: 'hand' }); continue; }
      const a = vec(tip.transform.position), b = vec(thumb.transform.position);
      const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
      const was = state[side] && state[side].pinching;
      const pinching = was ? d < PINCH_OFF : d < PINCH_ON;
      state[side] = { pinching };
      out.push({ side, active: true, kind: 'hand', pinching, pinchDist: d, tip: a, pos: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], ray: readRay(frame, src, refSpace) });
    } else if (src.gripSpace) {
      const pose = frame.getPose(src.gripSpace, refSpace);
      if (!pose) { out.push({ side, active: false, kind: 'controller' }); continue; }
      const m = pose.transform.matrix;
      const btn = (i) => !!(src.gamepad && src.gamepad.buttons[i] && src.gamepad.buttons[i].pressed);
      out.push({ side, active: true, kind: 'controller', pinching: btn(0) || btn(1), pos: m4.point(m, [0, -0.015, -0.05]), tip: m4.point(m, [0, -0.015, -0.085]), ray: readRay(frame, src, refSpace) });
    }
  }
  return out;
}
