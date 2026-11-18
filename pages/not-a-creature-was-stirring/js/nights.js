// Difficulty per night. A new night unlocks each calendar day (see save.js).
// box: ornaments waiting in the box. stolen: carried in by nutcrackers, won back by staring them down.
const BASE = [
  { box: 3, stolen: 4, maxActive: 2, spawnEvery: 8, speed: 0.3, lightsOut: false, kingSpeed: 0.22 },
  { box: 3, stolen: 5, maxActive: 3, spawnEvery: 7, speed: 0.38, lightsOut: true, kingSpeed: 0.26 },
  { box: 3, stolen: 6, maxActive: 3, spawnEvery: 6.5, speed: 0.45, lightsOut: true, kingSpeed: 0.3 },
];

export function nightConfig(n) {
  n = Math.max(1, Math.floor(n || 1));
  const b = BASE[Math.min(n, BASE.length) - 1];
  const extra = Math.max(0, n - BASE.length);
  return {
    night: n,
    ornaments: b.box + Math.min(b.stolen + extra, 10),
    stolen: Math.min(b.stolen + extra, 10),
    maxActive: Math.min(b.maxActive + Math.floor(extra / 2), 5),
    spawnEvery: Math.max(b.spawnEvery - extra * 0.4, 4.5),
    firstSpawnDelay: 2.5, // seconds after the first ornament is hung
    firstLoom: n === 1 ? 5 : 0, // night 1: seconds the first nutcracker waits beside you before it can strike
    blackoutAfter: n === 1 ? 3 : 0, // night 1: its one lights-out scare comes once this many ornaments are up (later nights: the first lights-out; see JOLT in game.js)
    speed: b.speed + extra * 0.04,
    attackDist: 0.75,
    maxSpawnAngle: [110, 130, 150][Math.min(n, 3) - 1], // degrees from where you face: front and sides first, behind you later
    banishTime: 2.0 + (Math.min(n, BASE.length) - 1) * 0.35 + extra * 0.1, // seconds of staring to send one back
    lightsOut: b.lightsOut,
    kingSpeed: b.kingSpeed + extra * 0.02,
    kingAttackDist: 1.0,
    chimes: 12,
    chimeEvery: 1.15,
    // The snowman at the window (js/snowman.js). Night 1 he comes once, only while it is quiet (the first nutcracker
    // has come and gone, none is on its way), and holds still while one is. From night 2 he comes more often, from a
    // little after the first nutcracker sets off, and taps on the glass whatever else is in the room: a lure.
    snowmanVisits: Math.min(n, 3),
    snowmanCalmOnly: n === 1,
    snowmanQuiet: 2.5, // night 1: seconds of quiet before he comes
    snowmanFirst: 8, // from night 2: seconds after the first nutcracker sets off
    snowmanGap: 16, // seconds after he goes before he may come again
  };
}
