// The ?debug readout shown inside the headset: what the room scan found, where
// the tree was put, and how far apart thumb and index are on each hand.
// Pure text building, so it is tested in Node.
export const MAX_LINE = 46; // characters that fit across the panel

const fit = (s) => (s.length <= MAX_LINE ? s : `${s.slice(0, MAX_LINE - 1)}…`);

// planes: [{ label, orientation }] as read when the room was laid out. granted: false when the headset
// refused plane detection. live: how many planes the headset reports right now; shown as then→now when it
// differs, which is how planes that arrived too late for the layout show up.
export function planeSummary(planes = [], { granted, live = null } = {}) {
  const count = Number.isFinite(live) && live !== planes.length ? `${planes.length}→${live}` : `${planes.length}`;
  if (!planes.length) return `planes ${count}: ${granted === false ? 'plane detection off' : 'no room scan'}`;
  const counts = new Map();
  for (const p of planes) {
    // Quest's 'window frame' and 'door frame' read as window and door, so a room with one still fits the line.
    const label = String((p && p.label) || '').trim().toLowerCase().replace(/\s+/g, '-').replace(/[-_]frame$/, '');
    const key = label || `${(p && p.orientation) || 'plane'}?`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const parts = [...counts]
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .map(([key, n]) => (n > 1 ? `${key}×${n}` : key));
  return fit(`planes ${count}: ${parts.join(' ')}`);
}

// hands: what input.js returns. granted: false when the headset refused hand tracking.
export function handReadout(hands = [], { granted } = {}) {
  if (granted === false) return 'hand tracking off';
  const one = (side, letter) => {
    const h = hands.find((x) => x && x.side === side);
    if (!h || !h.active) return `${letter} –`;
    if (h.kind === 'controller') return `${letter} controller`;
    const cm = Number.isFinite(h.pinchDist) ? `${(h.pinchDist * 100).toFixed(1)}cm` : '?';
    return `${letter} ${cm}${h.pinching ? ' pinch' : ''}`;
  };
  return `${one('left', 'L')} · ${one('right', 'R')}`;
}

// features: { planes, hands } as granted by the session (true, false, or undefined when unknown).
// depth: the room-occlusion check's state (js/depth.js), when depth sensing was granted.
// pin: the spatial anchor's state (js/pin.js), on the pinned link (?pin).
export function debugLines({ fps = 0, draws = 0, state = '', planes = [], live = null, layout = null, hands = [], features = {}, build = '', depth = '', pin = '' } = {}) {
  // The snowman's window: the room scan's own, one the game put up on a wall, or none.
  const win = !layout || layout.window === undefined ? '' : ` · window ${layout.window ? (layout.window.real ? 'scan' : 'game') : 'none'}`;
  const room = layout
    ? `table ${layout.table && layout.table.virtual ? 'virtual' : 'real'} · walls ${layout.walls ? layout.walls.length : 0} ${layout.realWalls ? 'real' : 'virtual'}${win}`
    : 'table – · walls –';
  // Depth and the pin go after the hands: the room's line is full with the window on it.
  return [
    fit(`${(fps || 0).toFixed(0)} fps · ${draws} draws · ${state}${build ? ` · ${build}` : ''}`),
    planeSummary(planes, { granted: features.planes, live }),
    fit(room),
    fit(handReadout(hands, { granted: features.hands }) + (depth ? ` · depth ${depth}` : '') + (pin ? ` · pin ${pin}` : '')),
  ];
}
