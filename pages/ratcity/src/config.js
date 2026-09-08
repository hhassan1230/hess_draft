/* ============================================================================
   RAT CITY — src/config.js
   Every tunable number in the game lives here. The sim reads from CONFIG and
   nothing else, so balance passes never touch logic. Numbers come from the GDD
   v1.0 (Aug 29, 2026); anything marked TEMP is a prototype guess awaiting
   playtest and is not a locked design decision.
   ========================================================================== */

const CONFIG = {
  VIEW: { W: 390, H: 844 }, // design viewport, logical px, fixed portrait

  // World units: x = left/right on screen, z = far (top of screen, negative)
  // to near (bottom of screen, positive). y = up.
  BOARD: {
    halfW: 4.0,     // visible half-width of the board
    edge: 4.35,     // |x| at which a dragged bag counts as escaped
    spawnZ: -9.0,   // sewer line at the top of the screen
    gutterZ: 3.55,  // tokens roll here and stop
    curbZ: 3.2,     // black curb line
  },

  // Three fixed bag piles across the curb (GDD §3)
  // where dawn bags wait until the player places them (bait placement — fun pass #1)
  HAND: { x: 0, z: 4.15 },
  PILE_CAP: 6,                 // a curb pile only stacks so high — wealth past this must spread or be binned
  RECOVER: { radius: 0.95 },   // tap a dragging rat to make it drop the bag (fun pass #3; boss excluded)

  PILES: [
    { id: 'stoop',   label: 'stoop',   x: -2.55, z: 2.35 },
    { id: 'center',  label: 'curb',    x:  0.0,  z: 2.65 },
    { id: 'hydrant', label: 'hydrant', x:  2.55, z: 2.35 },
  ],

  // Four fixed build slots, mirrored spacing (GDD §4)
  SLOTS: [
    { id: 'stoopRail',   label: 'stoop rail',  x: -2.95, z:  0.35 },
    { id: 'hydrant',     label: 'hydrant',     x:  2.95, z:  0.35 },
    { id: 'lamppost',    label: 'lamppost',    x: -1.65, z: -3.3  },
    { id: 'scaffolding', label: 'scaffolding', x:  1.65, z: -3.3  },
  ],

  // Rat entries. `from` = first night this entry is open (GDD §5)
  SPAWNS: [
    { id: 'leftGrate',  x: -3.0, z: -9.0, from: 1 },
    { id: 'rightAlley', x:  3.1, z: -9.3, from: 1 },
    { id: 'manhole',    x:  0.0, z: -7.9, from: 6 }, // rattles during night 5
  ],

  ECON: {
    startBags: 4,
    dawnBags: 3,
    sellRate: 0.5,     // rounded down
    centerBias: 0.45,  // TEMP — playtest question #1
  },

  TOWERS: {
    cat:  { cost: 2, l2: 4, radius: 2.2, l2Radius: 3.3, dmg: 1, period: 0.8 },
    trap: { cost: 1, l2: 2, radius: 0.8, dmg: 2, cooldown: 8, l2Cooldown: 4, rearmCost: 1 },
    bin:  { cost: 3, l2: 4, cap: 4, l2Cap: 7 },
  },
  UNLOCKS: { cat: 1, trap: 2, bin: 4 },
  CAT_NAMES: ['Mango', 'Cheeto', 'Biscuit', 'Ash'],

  RATS: {
    scout: { hp: 1,  speed: 2.5,  carry: 1, grabTime: 0.55, target: 'nearest', size: 1.0 },
    fat:   { hp: 3,  speed: 1.35, carry: 2, grabTime: 1.0,  target: 'richest', size: 1.5, tokenOnHit: 0.3 },
    boss:  { hp: 60, speed: 0.8,  carry: 3, grabTime: 2.0,  target: 'richest', size: 2.6,
             enrageAt: 0.5, enrageSpeed: 1.6, tokenPerHp: 10, returnDelay: 4,
             stalk: 12, stalkAgain: 6 }, // beat 1: stalks the pile before grabbing (TEMP durations)
  },
  DRAG_FACTOR: 0.4,   // dragging speed as a fraction of walk speed
  FLEE_FACTOR: 1.3,

  // Night-by-night curve (GDD §7). Index = night number.
  // `fat` is how many of `base` are fat rats (TEMP composition — playtest).
  NIGHTS: [
    null,
    { len: 20, base: 3,  fat: 0, beat: 'near-miss' },
    { len: 22, base: 4,  fat: 0 },
    { len: 26, base: 5,  fat: 1 },
    { len: 30, base: 6,  fat: 1 },
    { len: 34, base: 7,  fat: 2, rattle: true },
    { len: 38, base: 9,  fat: 2 },
    { len: 42, base: 11, fat: 3 },
    { len: 50, base: 13, fat: 4 },
    { len: 35, base: 4,  fat: 1, quiet: true },
    { len: 90, base: 0,  fat: 0, boss: true },
  ],
  TRUCK_NIGHTS: [3, 6, 9],

  INFEST: { perBag: 12, marked: 50, storm: 100, markedMult: 1.25 },

  TOKENS: {
    onBagHit: 0.3, onDeath: 0.15, cap: 10, life: 4.0,
    tapRadius: 0.85, bossBurst: 12,
    scale: [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26], // pentatonic semitone ladder
  },

  TIMING: {
    silence: 3.0,      // seconds of near-silence after NIGHTFALL before rats
    spawnWindow: 0.62,  // spawns land in the first 70% of the night
    pulseSize: 3,
    pulseGap: 0.28,    // seconds between rats inside a pulse
    resolveCap: 20,    // seconds past nightLen before the night is forced to end
    quietBeat: 1.3,    // held beat after wave clear
    truckDur: 3.8,
    bagsLand: 0.8,
    stormDur: 2.6,
  },
  BOSS_PULSES: { first: 9, every: 15, scouts: 3, extraAt: 5 },
  VICTORY_BONUS: 20,
  TAP: { slot: 0.95, pile: 0.95 },
  SIM_HZ: 60,
};

// Five design tokens (GDD §9). Danger red is for danger only.
const PALETTE = {
  bagYellow: '#F2C14E',
  ratPlum: '#6B4E71',
  ratPlumDeep: '#4A3350',
  towerTeal: '#2A9D8F',
  towerTealL2: '#3FC4B3',
  boneWhite: '#F4F1EA',
  boneShade: '#E4DFD3',
  dangerRed: '#E63946',
  ink: '#151313',
};

// Voice (GDD §11). LOCKED lines are verbatim from the GDD.
// TEMP lines are placeholders so the build speaks; replace before submit.
const COPY = {
  title: 'The rats want what you want: more.',                        // LOCKED
  tokens: 'Exact fare for a train that no longer runs.',               // LOCKED
  marked: "the first bag was enough. it's never enough now.",          // LOCKED
  theft: (name) => `They got past ${name}.`,                            // LOCKED format
  teachTrash: 'more trash, more rats.',                                 // LOCKED
  teachTap: 'TAP.',                                                     // LOCKED
  teachCat: 'place a cat first.',                                       // TEMP (night-1 nudge, shown once)
  teachPlace: 'your trash. tap a pile.',                                // TEMP (bait placement, day 1)
  teachDropFirst: 'drop your trash first.',                             // TEMP (nightfall pressed with bags in hand)
  recovered: 'dropped it.',                                             // TEMP (tap-recovered a dragged bag)
  binNote: 'bins are safe. trucks don\'t look inside.',                 // TEMP (first stash, once)
  pileFull: 'pile\'s full.',                                            // TEMP (placement refused, once per run)
  binLeft: 'left in the bin. safe. worthless.',                         // TEMP (score card, if bags died binned)
  theftNoCat: 'nobody home.',                                           // TEMP
  nearMiss: (name) => `${name}. at the edge.`,                          // TEMP
  nightfall: 'NIGHTFALL',
  storm: 'RAT STORM',
  victory: 'you kept it.',                                              // TEMP
  loss: 'they took the block.',                                         // TEMP
  restart: 'again',
  truck: 'DSNY',
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, PALETTE, COPY };
}
