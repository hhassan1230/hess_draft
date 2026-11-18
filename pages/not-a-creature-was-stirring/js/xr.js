// The mixed reality session on Quest: passthrough, hands, the room's planes.
import { m4, q } from './math.js';
import { buildLayout } from './room.js';
import { readXRHands } from './input.js';
import { Panel } from './ui.js';
import { Node } from './scene.js';
import { debugLines } from './debug.js';
import { BUILD } from './build.js';
import { DepthCheck, probePoints } from './depth.js';
import { roomFrame, frameMoved, sameFrame } from './pin.js';

export async function isARSupported() {
  try { return !!(navigator.xr && (await navigator.xr.isSessionSupported('immersive-ar'))); } catch { return false; }
}

function readPlanes(frame, ref) {
  const set = frame.detectedPlanes;
  if (!set) return [];
  const out = [];
  set.forEach((plane) => {
    const pose = frame.getPose(plane.planeSpace, ref);
    if (!pose || !plane.polygon || plane.polygon.length < 3) return;
    out.push({
      orientation: plane.orientation,
      label: plane.semanticLabel || '',
      matrix: pose.transform.matrix,
      polygon: plane.polygon.map((p) => ({ x: p.x, z: p.z })),
    });
  });
  return out;
}

// Controller rumble for the moments that land (game feel, js/feel.js): each controller gets the strongest pulse
// this frame asked of it. Tracked hands have no motors, so only sources with a haptic actuator get anything.
export function sendRumble(session, pulses) {
  if (!pulses || !pulses.length) return;
  for (const src of session.inputSources) {
    const act = !src.hand && src.gamepad && src.gamepad.hapticActuators && src.gamepad.hapticActuators[0];
    if (!act) continue;
    const side = src.handedness === 'left' ? 'left' : 'right';
    let best = null;
    for (const p of pulses) if ((p.side == null || p.side === side) && (!best || p.intensity > best.intensity)) best = p;
    if (!best) continue;
    try {
      const r = typeof act.pulse === 'function' ? act.pulse(best.intensity, best.ms)
        : typeof act.playEffect === 'function' ? act.playEffect('dual-rumble', { duration: best.ms, strongMagnitude: best.intensity, weakMagnitude: best.intensity }) : null;
      if (r && typeof r.catch === 'function') r.catch(() => {});
    } catch { /* rumble is a nicety: never at the cost of the frame */ }
  }
}

export async function startXR(opts) {
  const session = await navigator.xr.requestSession('immersive-ar', {
    requiredFeatures: ['local-floor'],
    optionalFeatures: ['hand-tracking', 'plane-detection', 'anchors', 'hit-test', 'depth-sensing'],
    // Real-world occlusion (js/depth.js). Not 'unsigned-short': an integer texture cannot be read the same way.
    depthSensing: { usagePreference: ['gpu-optimized'], dataFormatPreference: ['float32', 'luminance-alpha'] },
  });
  try {
    return await runSession(session, opts);
  } catch (e) {
    // A session that opened but could not be set up leaves the headset on an empty view, and blocks the next try.
    try { await session.end(); } catch { /* already ending */ }
    throw e;
  }
}

async function runSession(session, { gl, renderer, game, makeCanvas, debug = false, pin = false, onEnd = () => {}, hooks = null }) {
  // The context is created xrCompatible already; this call is belt and braces.
  try { await gl.makeXRCompatible(); } catch (e) { console.warn('makeXRCompatible:', e); }
  const layer = new XRWebGLLayer(session, gl, { antialias: true, alpha: true, depth: true, framebufferScaleFactor: 1.0 });
  try { if ('fixedFoveation' in layer) layer.fixedFoveation = 0.5; } catch { /* optional */ }
  const NEAR = 0.05, FAR = 60;
  session.updateRenderState({ baseLayer: layer, depthNear: NEAR, depthFar: FAR });
  const ref = await session.requestReferenceSpace('local-floor');
  try {
    if (session.updateTargetFrameRate && session.supportedFrameRates && [...session.supportedFrameRates].includes(72)) {
      Promise.resolve(session.updateTargetFrameRate(72)).catch(() => {});
    }
  } catch { /* optional */ }

  session.addEventListener('visibilitychange', () => game.setPaused(session.visibilityState !== 'visible'));
  let sessionOver = false;
  // Pinned to the room (?pin, js/pin.js): once the room is read, a spatial anchor at the table; from then on every
  // pose is read in the room's own frame, which the anchor carries along when the headset recenters.
  let room = ref, anchor = null, anchorAt = null, roomNow = null, pinState = pin ? 'waiting' : '', pinMoved = { m: 0, deg: 0 };
  const pinToRoom = (frame) => {
    if (typeof XRRigidTransform === 'undefined' || !frame.createAnchor) { pinState = 'off'; return; }
    const p = game.tablePos();
    anchorAt = p;
    frame.createAnchor(new XRRigidTransform({ x: p[0], y: p[1], z: p[2] }), ref).then(
      (a) => { if (sessionOver) { if (a.delete) a.delete(); } else { anchor = a; pinState = 'on'; } },
      (e) => { pinState = 'off'; console.warn('spatial anchor refused:', (e && e.message) || e); });
  };
  const followAnchor = (frame) => {
    const ap = frame.getPose(anchor.anchorSpace, ref);
    if (!ap) return; // lost for a moment: keep the last frame
    const P = ap.transform.position, O = ap.transform.orientation;
    const f = roomFrame({ pos: [P.x, P.y, P.z], quat: [O.x, O.y, O.z, O.w] }, anchorAt);
    if (roomNow && sameFrame(f, roomNow)) return;
    roomNow = f;
    room = ref.getOffsetReferenceSpace(new XRRigidTransform({ x: f.pos[0], y: f.pos[1], z: f.pos[2] }, { x: f.quat[0], y: f.quat[1], z: f.quat[2], w: f.quat[3] }));
    pinMoved = frameMoved(f);
  };
  session.addEventListener('end', () => {
    // This visit's panels are never drawn again. Nothing here may stand between the player and the menu.
    sessionOver = true;
    try { if (anchor && anchor.delete) anchor.delete(); } catch (e) { console.warn('anchor:', e); }
    try { renderer.release([game.scene, overlay]); } catch (e) { console.warn('release:', e); }
    onEnd();
  });

  // Shown until the room layout is ready, and for any error inside the headset.
  const boot = new Panel(makeCanvas, { w: 0.5, h: 0.14, name: 'boot' });
  boot.show([{ t: 'Reading your room…', size: 48 }, { t: 'Stay seated', size: 28, weight: 'normal', color: '#e8c27a' }]);
  const errPanel = new Panel(makeCanvas, { w: 0.6, h: 0.3, name: 'error' });
  const dbgPanel = new Panel(makeCanvas, { w: 0.46, h: 0.13, px: 900, name: 'debug' }); // 46 monospace characters across
  const overlay = new Node('overlay');
  overlay.add(boot.node, errPanel.node, dbgPanel.node);
  errPanel.hide(); dbgPanel.hide();
  let error = null;

  const pinchState = {};
  // For the ?debug readout only: what the headset granted (read on first use), what the room scan held
  // when the room was laid out, the hands last read. None of it is touched without ?debug.
  let features = null, planesSeen = [], lastHands = [];
  let last = null, startT = null, firstPlanesT = null, layoutDone = false, prepared = null;

  let fpsFrames = 0, fpsT = 0, fps = 0;
  // Room depth for occlusion: only with GPU depth, and only once the check agrees with the room.
  const depthCheck = new DepthCheck();
  let binding = null, depthGranted = false, depthErrors = 0;
  try {
    depthGranted = !!(session.enabledFeatures && [...session.enabledFeatures].includes('depth-sensing'))
      && session.depthUsage === 'gpu-optimized' && session.depthDataFormat !== 'unsigned-short';
  } catch { depthGranted = false; }
  if (hooks) hooks.depth = depthCheck;
  const readDepth = (v) => {
    const d = binding.getDepthInformation(v);
    if (!d || !d.texture || d.textureType !== 'texture-array') return null;
    const layerIndex = d.imageIndex ?? (v.eye === 'right' ? 1 : 0);
    return { tex: d.texture, layer: layerIndex, near: d.depthNear || NEAR, far: d.depthFar || FAR, raw: d.rawValueToMeters || 1, ourNear: NEAR, ourFar: FAR };
  };

  const placeInFront = (node, head, dist, down) => {
    const f = head.forward;
    const len = Math.hypot(f[0], f[2]) || 1;
    node.pos = [head.pos[0] + (f[0] / len) * dist, head.pos[1] - down, head.pos[2] + (f[2] / len) * dist];
    node.rot = q.fromYaw(Math.atan2(-f[0], -f[2]));
  };

  function onFrame(t, frame) {
    session.requestAnimationFrame(onFrame);
    if (anchor) { try { followAnchor(frame); } catch (e) { anchor = null; pinState = 'off'; console.warn('spatial anchor lost:', (e && e.message) || e); } }
    if (hooks && pin) hooks.pin = { state: pinState, moved: pinMoved };
    const pose = frame.getViewerPose(room);
    if (!pose) return;
    const dt = last == null ? 0 : (t - last) / 1000;
    last = t;
    if (startT == null) startT = t;
    fpsFrames++; fpsT += dt;
    if (fpsT >= 0.5) { fps = fpsFrames / fpsT; fpsFrames = 0; fpsT = 0; }

    const P = pose.transform.position, O = pose.transform.orientation;
    const quat = [O.x, O.y, O.z, O.w];
    const head = { pos: [P.x, P.y, P.z], quat, forward: q.rotate(quat, [0, 0, -1]) };
    const views = pose.views.map((v) => {
      const vp = layer.getViewport(v);
      const tp = v.transform.position;
      return { viewProj: m4.mul(v.projectionMatrix, v.transform.inverse.matrix), viewport: [vp.x, vp.y, vp.width, vp.height], camPos: [tp.x, tp.y, tp.z] };
    });

    try {
      if (!error) {
        if (!layoutDone) {
          const planes = readPlanes(frame, ref);
          const waited = (t - startT) / 1000;
          if (planes.length && firstPlanesT == null) firstPlanesT = t;
          const settled = firstPlanesT != null && (t - firstPlanesT) / 1000 > 0.6;
          if (settled || waited > 3) {
            game.setLayout(buildLayout(planes, head));
            renderer.prepare([game.scene, overlay], game.geometries());
            prepared = game.scene;
            layoutDone = true;
            if (pin) pinToRoom(frame);
            boot.hide();
            if (debug) planesSeen = planes.map(({ label, orientation }) => ({ label, orientation }));
            if (hooks) hooks.planes = planes.length;
          } else placeInFront(boot.node, head, 0.7, 0.05);
        }
        if (layoutDone) {
          const hands = readXRHands(frame, session, room, pinchState);
          lastHands = hands;
          if (hooks) hooks.hands = hands;
          game.update(dt, { head, viewProjs: views.map((v) => v.viewProj), hands });
          sendRumble(session, game.haptics);
          if (depthGranted && depthCheck.state !== 'off') {
            // Never at the cost of the frame: a failure here only leaves occlusion off.
            let depth = null;
            try {
              binding = binding || new XRWebGLBinding(session, gl);
              depth = pose.views.map(readDepth);
              depthCheck.step(dt, (reading) => {
                if (!depth[0]) return null;
                const probes = probePoints(game.layout, views[0]);
                return { probes, measured: probes.length ? renderer.probeDepth(depth[0], reading, probes) : [] };
              });
              depthErrors = 0;
            } catch (e) {
              // A frame or two without depth (as the sensor starts) is normal; a second of it ends the try.
              depth = null;
              if (++depthErrors > 72) depthCheck.stop(`depth failed: ${(e && e.message) || e}`);
            }
            if (depthCheck.state === 'on' && depth) views.forEach((v, i) => { if (depth[i]) v.depth = { ...depth[i], reading: depthCheck.reading }; });
          }
        }
      }
    } catch (e) {
      error = e;
      console.error(e);
      errPanel.show([{ t: 'Something broke', size: 44 }, { t: String(e && e.message || e).slice(0, 70), size: 22, weight: 'normal' }, { t: 'Take a screenshot and send it over', size: 22, weight: 'normal', color: '#e8c27a' }]);
    }
    if (error) placeInFront(errPanel.node, head, 0.7, 0.05);
    if (debug) {
      if (fpsFrames === 0) {
        // The readout must never cost a frame: if it fails, the panel says so and the game goes on.
        let lines;
        try {
          if (!features) {
            features = {};
            const granted = session.enabledFeatures ? [...session.enabledFeatures] : null;
            if (granted) features = { planes: granted.includes('plane-detection'), hands: granted.includes('hand-tracking') };
          }
          const live = frame.detectedPlanes ? frame.detectedPlanes.size : null;
          lines = debugLines({ fps, draws: renderer.stats.draws, state: game.state, planes: planesSeen, live, layout: game.layout, hands: lastHands, features, build: BUILD.hash, depth: depthGranted ? depthCheck.state : '', pin: pinState });
        } catch (e) {
          lines = ['debug readout failed', String((e && e.message) || e).slice(0, 46)];
        }
        dbgPanel.show(lines.map((t) => ({ t, size: 30, weight: 'normal', font: 'monospace' })));
        if (hooks) hooks.debugLines = lines;
      }
      // Above the eye line, so it never covers the tree: glance up to read it.
      placeInFront(dbgPanel.node, head, 0.7, -0.25);
    }
    overlay.updateWorld();

    // A new round (Play again, the judges' next night) is a new scene: its panels go up with the button press.
    if (layoutDone && !error && game.scene !== prepared) { renderer.prepare([game.scene]); prepared = game.scene; }
    gl.bindFramebuffer(gl.FRAMEBUFFER, layer.framebuffer);
    renderer.render([error ? null : game.scene, overlay], views, game.renderParams, { clearColor: [0, 0, 0, 0] });
    if (hooks) { hooks.frames = (hooks.frames || 0) + 1; hooks.views = views.length; hooks.draws = renderer.stats.draws; hooks.fps = fps; }
  }
  session.requestAnimationFrame(onFrame);
  return session;
}
