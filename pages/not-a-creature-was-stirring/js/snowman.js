// The snowman outside the window. Like the nutcrackers he only moves while no one can see him, but he never
// comes in: each time you look away he is a little closer to the glass, and once he is there he taps on it.
// Seen there, he is gone the next time you look away. A pure state machine: the game tells him what the player
// can see (and whether he may come, and move on), he returns what happens; the game moves the model and plays
// the sounds. Events: 'arrive', 'seen' (first sight at a stage), 'move' (one stage closer), 'tap', 'leave'.
export const SNOW = {
  look: 0.5, // s he must be looked at, at one spot, before he will move on from it
  out: 0.4, // s with none of him on screen before he moves (or goes)
  patience: [9, 7], // s at the far and middle spots, unseen, before he comes closer anyway
  tapEvery: 5, // s between taps on the glass while nobody looks
  taps: 3, // taps at most, then he goes
};
export const STAGES = ['far', 'mid', 'near'];

export class Snowman {
  constructor() {
    this.stage = 'away';
    this.visits = 0;
    this.away = false; // sent away for good (the finale): he goes at the first chance and comes no more
    this.resetStage();
  }

  resetStage() {
    this.seenT = 0; // looked at, at this spot
    this.sighted = false; // 'seen' already reported at this spot
    this.outT = 0; // none of him on screen, since he was last looked at
    this.waitT = 0; // calm and unseen at this spot (his patience)
    this.tapT = 0;
    this.tapped = 0;
  }

  sendAway() { this.away = true; }

  // ctx: { seen, inView, nextInView, calm, mayArrive } (see test/snowman.test.mjs)
  update(dt, { seen = false, inView = seen, nextInView = false, calm = true, mayArrive = false } = {}) {
    const ev = [];
    if (this.stage === 'away') {
      if (mayArrive && !this.away && !nextInView) {
        this.stage = 'far';
        this.visits++;
        this.resetStage();
        ev.push('arrive');
      }
      return ev;
    }
    if (seen) {
      if (!this.sighted) { this.sighted = true; ev.push('seen'); }
      this.seenT += dt;
    }
    this.outT = inView ? 0 : this.outT + dt;
    if (this.away) {
      if (!inView) { this.stage = 'away'; ev.push('leave'); }
      return ev;
    }
    if (!calm || inView) return ev;
    const ready = this.seenT >= SNOW.look && this.outT >= SNOW.out;
    if (this.stage === 'near') {
      if (ready) { this.stage = 'away'; ev.push('leave'); return ev; }
      this.tapT += dt;
      if (this.tapT >= SNOW.tapEvery) {
        this.tapT = 0;
        if (this.tapped >= SNOW.taps) { this.stage = 'away'; ev.push('leave'); return ev; }
        this.tapped++;
        ev.push('tap');
      }
      return ev;
    }
    this.waitT += dt;
    if ((ready || (this.seenT < SNOW.look && this.waitT >= SNOW.patience[STAGES.indexOf(this.stage)])) && !nextInView) {
      this.stage = STAGES[STAGES.indexOf(this.stage) + 1];
      this.resetStage();
      ev.push('move');
      if (this.stage === 'near') { this.tapped = 1; ev.push('tap'); } // at the glass he taps straight away
    }
    return ev;
  }
}
