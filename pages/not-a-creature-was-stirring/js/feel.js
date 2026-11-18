// Game feel: what makes an action land, after GMTK's "Secrets of Game Feel and Juice" (Mark Brown, 2015).
// Every action answers at once, the big hits freeze for a beat, particles stay where they fall, and the
// shake goes on things in the room, never on your view: in a headset a view you did not move makes people
// sick, and your real room cannot shake. The juice goes on the player's wins (a grab, a hang, a stare-down,
// the finale); the scares stay sharp. None of it changes how the game plays: it never touches game time and
// draws only on the cosmetic random stream. ?nojuice on the link (or on: false here) turns all of it off.
export const FEEL = {
  on: true,

  // Grabbing
  hoverGlow: 0.3, // an ornament a free hand could pinch right now lights up...
  hoverGrow: 0.12, // ...and grows this much
  hoverTime: 0.12, // s to light up or go dark
  pop: 0.3, // picked up: this much bigger at once, then it wobbles back
  popRate: 10,
  popWobble: 25,
  swing: 0.35, // rad of lean per m/s of hand speed: it swings from your fingers
  swingSpring: 90,
  swingDamp: 7,
  pull: 0.35, // near a free branch: drawn this share of the way toward it...
  pullMax: 0.015, // ...but never more than 1.5 cm

  // Hanging
  scale: [0, 2, 4, 7, 9], // C major pentatonic: the music box's key
  homeNote: 96, // C7 (MIDI): the night's last ornament lands on it
  chimeNote: 88, // the chime sound's own pitch (E6)
  land: 0.22, // squash as it lands on its branch
  jostle: 0.18, // rad: the ornaments hung beside it swing...
  jostleReach: 0.13, // ...this far around it
  treeFlare: 0.5, // the tree lights flare...
  treeFlareTime: 0.6, // ...and fade back over this long

  // Staring one down
  chips: [2, 12], // wood chips a second, from the first moment of a stare to the last
  strain: [2, 6], // wood strains a second, likewise (each one is a sound built on the main thread: kept few)
  strainPitch: [0.8, 1.5],
  freeze: 0.1, // s he holds still, lit up, as he breaks
  squash: 0.3, // and how flat he goes as he sinks
  restMax: 120, // splinters left lying on the floor for the rest of the night

  // A strike
  jolt: 0.2, // rad the hung ornaments swing
  gutter: 0.7, // how far the candle flames drop...
  gutterTime: 0.6, // ...and how long they take to burn again

  // The finale
  knock: 0.07, // m each chime knocks the Mouse King back toward his hole
  flash: 1.6, // what every light flashes to at a chime
  kingFreeze: 0.3, // s he holds still on the twelfth before he bursts

  // The win
  chase: 3.5, // s the string lights run a chase
  starTime: 3, // s the star throws sparkles...
  starEvery: 0.05, // ...one every this many seconds
  relight: [0.9, 0.45], // s: the candles that went out light again, the first this long after the win, then one every

  // The moments a player remembers
  hitFace: 0.4, // s his face stays right in front of yours after a strike, before it shatters
  hitFlash: 0.5, // the strike's red flash, lighter, so the face reads through it
  heart: [0.35, 0.9, 2.2], // a heartbeat from this closeness (0-1), this many beats a second there, this many at the closest
  brighten: true, // in the finale the room brightens with every chime the Mouse King is held

  // The stare is a fight: he strains against it (all in place: he never gains ground while watched)
  fightLean: 0.16, // rad he strains toward you by the end of a stare
  fightArm: 0.9, // rad his sword arm creeps up over a stare
  lurch: [0.5, 2.6], // lurches at you a second, from the first moment of a stare to the last
  lurchReach: 0.045, // m he lurches at you, and snaps back
  lurchTime: 0.18, // s there and back
  kingLurch: [0.4, 1.3], // the Mouse King's lunges at you a second while you hold his gaze, first chime to last
  kingReach: 0.12, // m he lunges, and snaps back
  kingLean: [0.04, 0.12], // rad he strains toward you, first chime to last
  lures: true, // the Mouse King tries to make you look away...
  lureChimes: [3, 6, 9], // ...at these chimes: his heads turn past your shoulder, then bells ring right there

  // Through your wall: plaster knocked off round the hole as a nutcracker breaks through, and more while he
  // pushes out (only while you do not look straight at him), left lying under the hole with the splinters
  breach: [3, 6], // pieces as he breaks through, pieces a second while he pushes out

  // His face gives way under a stare (after BioShock Infinite's Motorized Patriot), at these fractions of the
  // stare it takes to break him: the paint cracks; his left cheek and eye go (a red bulb in the socket); his nose
  // and moustache go
  face: [0.3, 0.55, 0.8],

  // Your heart in the dark: in the lights-out scare it beats as if one were closing in, from this closeness when the
  // lights die to this when they come back on its face (see heart above), then stops dead
  joltHeart: [0.55, 1],

  // Rumble, controllers only (hands have no motors): [intensity 0-1, ms]
  rumble: {
    pickup: [0.25, 25],
    hang: [0.5, 45],
    strain: [0.12, 15],
    banish: [0.85, 90],
    hit: [1, 220],
    chime: [0.35, 60],
    burst: [1, 320],
  },
};

// The chime for the n-th of a night's `count` ornaments, as a rate of the chime sound's own pitch: up the
// pentatonic scale, counted down from the home note, so the night's last ornament always lands on it.
export function hangRate(n, count) {
  const S = FEEL.scale;
  const i = n - count; // notes below the home note (0 for the last)
  const octave = Math.floor(i / S.length), degree = ((i % S.length) + S.length) % S.length;
  const note = FEEL.homeNote + 12 * octave + S[degree];
  return 2 ** ((note - FEEL.chimeNote) / 12);
}

// A kick that dies away: 1 at t = 0, wobbling back to 0.
export const wobble = (t, rate, freq) => Math.exp(-rate * t) * Math.cos(freq * t);
