// Real-world occlusion from WebXR depth sensing (Quest 3 and 3S, Android XR): a nutcracker that walks behind
// your real couch is hidden by it, and so is anything behind your own hand.
//
// The depth arrives as a GPU texture, one layer per eye, and how to read it differs between browsers and
// versions: Quest stores projected depth (0..1 between its own near and far planes), the spec describes
// metres, and the two disagree on which way up the texture is. There is no headset here to check them on,
// so the game checks itself. It knows where the table and the walls are from the room scan, so it measures
// the depth at those points under every reading of the texture, and turns occlusion on only when one
// reading agrees with the room, several times running. If none does, or the depth never comes, occlusion
// stays off and the game plays exactly as before.
import { v3, m4 } from './math.js';

// The ways to read the texture. decode 0: projected depth between the texture's near and far; 1: metres
// (the raw value times rawValueToMeters). flip: the texture's rows run top to bottom.
export const READINGS = [
  { id: 'projected', decode: 0, flip: false },
  { id: 'projected, flipped', decode: 0, flip: true },
  { id: 'metres', decode: 1, flip: false },
  { id: 'metres, flipped', decode: 1, flip: true },
];

export const CHECK = {
  every: 0.4, // s between checks while finding the reading
  agree: 3, // checks in a row one reading must pass to turn occlusion on
  tries: 15, // checks before giving up (6 s)
  recheck: 3, // s between checks once on
  strikes: 3, // failed rechecks in a row that turn it off again
  close: 0.1, // a probe agrees when the measured depth is within 10% of the room's
  minAgree: 3, // probes that must agree
  share: 0.4, // and at least this share of the probes that measured anything
  near: 0.6, // m: nothing closer than this is ever hidden (hands, the table and what is on it)
};

// Points the room scan says are real surfaces, in view of one eye, with the depth the room says each should
// measure (distance along the view axis) and where it falls in the eye's view (u, v from the bottom left).
export function probePoints(layout, view) {
  const pts = [];
  const T = layout.table;
  if (T && !T.virtual) {
    const f = v3.norm(v3.flat(v3.sub(T.pos, layout.seat.pos)));
    const r = v3.cross(f, [0, 1, 0]);
    for (const [a, b] of [[0, 0], [0.1, 0], [0.1, 0.1], [0.1, -0.1], [0.2, 0]]) pts.push(v3.addScaled(v3.addScaled(T.pos, f, a), r, b));
  }
  for (const w of layout.walls || []) {
    if (w.virtual) continue;
    const y = Math.min(w.topY - 0.2, Math.max(w.bottomY + 0.9, layout.seat.pos[1]));
    for (const s of [-0.3, 0, 0.3]) pts.push(v3.addScaled([w.center[0], y, w.center[2]], w.right, s * w.width));
  }
  const out = [];
  for (const p of pts) {
    const c = m4.point4(view.viewProj, p);
    if (c[3] < CHECK.near) continue;
    const x = c[0] / c[3], y = c[1] / c[3];
    if (Math.abs(x) > 0.9 || Math.abs(y) > 0.9) continue;
    out.push({ u: (x + 1) / 2, v: (y + 1) / 2, expect: c[3] });
  }
  return out.slice(0, 16);
}

// Does one reading agree with the room? measured[i] is the depth (m) read at probes[i], 0 if none.
export function agrees(probes, measured) {
  let valid = 0, close = 0;
  probes.forEach((p, i) => {
    const m = measured[i];
    if (!(m > 0.05)) return;
    valid++;
    if (Math.abs(m - p.expect) / p.expect < CHECK.close) close++;
  });
  return close >= CHECK.minAgree && close >= CHECK.share * valid;
}

// The check over time. step(dt, probe) with probe(reading) -> { probes, measured } (or null: no depth this
// frame). state: 'waiting' (no depth yet), 'checking', 'on' (reading = the one that agrees), 'off'.
export class DepthCheck {
  constructor() {
    this.state = 'waiting';
    this.reading = null;
    this.t = 0;
    this.tries = 0;
    this.run = new Map(); // reading index -> checks passed in a row
    this.strikes = 0;
    this.why = '';
  }

  step(dt, probe) {
    if (this.state === 'off') return;
    this.t -= dt;
    if (this.t > 0) return;
    if (this.state === 'on') {
      this.t = CHECK.recheck;
      const r = probe(this.reading);
      if (!r || !r.probes.length) return;
      this.strikes = agrees(r.probes, r.measured) ? 0 : this.strikes + 1;
      if (this.strikes >= CHECK.strikes) this.stop('the depth stopped agreeing with the room');
      return;
    }
    this.t = CHECK.every;
    let any = false, enough = false;
    READINGS.forEach((reading, i) => {
      const r = probe(reading);
      if (!r) return;
      any = true;
      if (r.probes.length < CHECK.minAgree) return;
      enough = true;
      const n = agrees(r.probes, r.measured) ? (this.run.get(i) || 0) + 1 : 0;
      this.run.set(i, n);
      if (n >= CHECK.agree && this.state !== 'on') { this.state = 'on'; this.reading = reading; }
    });
    if (this.state === 'on') return;
    if (any) this.state = 'checking';
    if (enough || any) this.tries++;
    if (this.tries >= CHECK.tries) this.stop(enough ? 'no reading of the depth agreed with the room' : 'too little of the room scan in view');
  }

  stop(why) { this.state = 'off'; this.reading = null; this.why = why; }
}
