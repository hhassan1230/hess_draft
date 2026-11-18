// The things that only move when you look away. Pure state machines:
// the game feeds them "observed or not" and a target, they return events
// ('emerged', 'step', 'clack', 'lunge', 'attack', ...) for sound and damage.
import { v3, smooth } from './math.js';
import { faceYaw } from './room.js';

export class Nutcracker {
  constructor({ spawn, cfg, emerged = false, id = 0 }) {
    this.id = id;
    this.cfg = { hop: 0.25, emergeTime: 1.0, lungeTime: 0.3, banishTime: 2.2, sinkTime: 0.7, giveUpTime: 10, loomTime: 0, loomClackEvery: 0.45, loomAfterSeen: 2.5, ...cfg };
    this.normal = v3.norm(spawn.normal || [0, 0, 1]);
    this.spawnPos = v3.copy(spawn.pos);
    this.wallPos = v3.addScaled(spawn.pos, this.normal, -0.18);
    this.state = emerged ? 'active' : 'emerging';
    this.e = emerged ? 1 : 0;
    this.pos = emerged ? v3.copy(this.spawnPos) : v3.copy(this.wallPos);
    this.yaw = faceYaw(this.normal);
    this.hopT = 0;
    this.hopPhase = 0;
    this.steps = 0;
    this.moving = false;
    this.observed = false;
    this.travel = 0; // meters walked, for the tutorial hint
    this.lungeT = 0;
    this.seenT = 0; // how long the player has been looking straight at it
    this.sinkT = 0;
    this.wasObserved = false;
    this.movedSinceSeen = false;
    this.periT = 0; // time spent frozen in the corner of the player's eye
    this.fromWall = false; // stared down before it finished stepping out: it goes back into the wall
    this.loomed = false; // its one wait beside the player (cfg.loomTime) is over
    this.loomStarted = false;
    this.loomSeen = false; // the player has seen it during the wait ('loomCaught' fires once)
    this.loomT = 0; // unseen seconds of the wait used so far
    this.loomClackT = 0;
  }

  // observed: anywhere in view (freezes it). focused: looked at directly (stares it down).
  update(dt, { observed, focused = observed, target, head = null, grace = false }) {
    const ev = [];
    this.observed = observed;
    if (this.state === 'dead') return ev;

    // Stepping out of the wall only stops while you look straight at it, so it can happen at the edge of your vision.
    // A straight look also counts as a stare: hold it and the wall takes the nutcracker back.
    if (this.state === 'emerging') {
      this.moving = !focused;
      if (focused) {
        this.seenT += dt;
        if (this.seenT >= this.cfg.banishTime) { this.state = 'banished'; this.sinkT = 0; this.fromWall = true; ev.push('banished'); }
      } else {
        this.seenT = Math.max(0, this.seenT - dt);
        this.e = Math.min(1, this.e + dt / this.cfg.emergeTime);
        this.pos = v3.lerp(this.wallPos, this.spawnPos, smooth(this.e));
        if (this.e >= 1) { this.state = 'active'; ev.push('emerged'); }
      }
      return ev;
    }

    if (this.state === 'banished') {
      this.sinkT += dt;
      if (this.sinkT >= this.cfg.sinkTime) this.state = 'dead';
      return ev;
    }

    if (this.state === 'lunging') {
      this.lungeT += dt;
      const t = smooth(this.lungeT / this.cfg.lungeTime);
      this.pos = v3.lerp(this.lungeFrom, this.lungeTo, t);
      if (this.lungeT >= this.cfg.lungeTime) { this.state = 'dead'; ev.push('attack'); }
      return ev;
    }

    // active (and the one wait beside the player)
    const toT = v3.sub(v3.flat(target), v3.flat(this.pos));
    const d = v3.len(toT);
    if (d > 1e-4) this.yaw = faceYaw(toT);

    // Waiting within reach, jaw clacking. Only unseen time uses the wait up: being seen freezes it like any
    // other, and looking away again sends it back to waiting, so a glimpse at the edge of view never turns
    // into a strike a moment later. After the first sight at least cfg.loomAfterSeen of the wait is left.
    if (this.state === 'looming') {
      this.moving = false;
      if (grace) {
        // Another one just struck: the wait is over, and nobody is looking, so no 'loomCaught'.
        this.loomed = true;
        this.state = 'active';
      } else if (observed) {
        this.state = 'active';
        if (!this.loomSeen) {
          this.loomSeen = true;
          this.loomT = Math.min(this.loomT, Math.max(0, this.cfg.loomTime - this.cfg.loomAfterSeen));
          ev.push('loomCaught');
        }
      } else {
        this.loomT += dt;
        this.loomClackT += dt;
        if (this.loomClackT >= this.cfg.loomClackEvery) { this.loomClackT -= this.cfg.loomClackEvery; ev.push('clack'); }
        if (this.loomT >= this.cfg.loomTime) { this.loomed = true; this.state = 'active'; }
        return ev;
      }
    }
    if (observed) {
      this.moving = false;
      if (!this.wasObserved && this.movedSinceSeen) ev.push('caught'); // the tell: caught mid-step
      this.wasObserved = true;
      this.movedSinceSeen = false;
      if (focused) {
        this.periT = 0;
        this.seenT += dt;
        if (this.seenT >= this.cfg.banishTime) { this.state = 'banished'; this.sinkT = 0; ev.push('banished'); }
      } else {
        this.seenT = Math.max(0, this.seenT - dt);
        this.periT += dt;
        // Stuck at the edge of your view for too long: it slinks off, so nothing waits there forever.
        if (this.periT >= this.cfg.giveUpTime) { this.state = 'banished'; this.sinkT = 0; ev.push('retreated'); }
      }
      return ev;
    }
    this.seenT = 0;
    this.periT = 0;
    if (this.wasObserved) ev.push('unfreeze'); // the creak the moment you look away
    this.wasObserved = false;

    if (d <= this.cfg.attackDist) {
      if (this.cfg.loomTime > 0 && !this.loomed) {
        this.state = 'looming';
        this.moving = false;
        if (!this.loomStarted) { this.loomStarted = true; this.loomT = 0; this.loomClackT = 0; ev.push('loom'); }
        return ev;
      }
      this.state = 'lunging';
      this.lungeT = 0;
      this.lungeFrom = v3.copy(this.pos);
      const aim = head || target;
      const back = v3.norm(v3.sub(this.pos, aim));
      this.lungeTo = v3.addScaled(aim, back, 0.22);
      this.lungeTo[1] -= 0.45; // its face, not its feet, ends up in front of yours
      ev.push('lunge');
      return ev;
    }

    this.moving = true;
    this.hopT += dt;
    while (this.hopT >= this.cfg.hop) {
      this.hopT -= this.cfg.hop;
      const step = Math.min(this.cfg.speed * this.cfg.hop, Math.max(0, d - this.cfg.attackDist * 0.95));
      const dir = v3.norm(toT);
      this.pos = v3.addScaled(this.pos, dir, step);
      this.travel += step;
      if (step > 0) this.movedSinceSeen = true;
      this.steps++;
      ev.push('step');
      if (this.steps % 3 === 0) ev.push('clack');
    }
    this.hopPhase = this.hopT / this.cfg.hop;
    return ev;
  }
}

export class MouseKing {
  constructor({ pos, normal, cfg }) {
    this.cfg = { emergeTime: 2.5, lungeTime: 0.35, retreatTime: 1.0, ...cfg };
    this.normal = v3.norm(normal);
    this.hole = v3.copy(pos);
    this.inside = v3.addScaled(pos, this.normal, -0.45);
    this.home = v3.addScaled(pos, this.normal, this.cfg.homeOffset ?? 0.3);
    this.pos = v3.copy(this.inside);
    this.state = 'emerging';
    this.t = 0;
    this.yaw = faceYaw(this.normal);
    this.tremble = 0;
  }

  update(dt, { observed, target }) {
    const ev = [];
    this.t += dt;
    this.tremble = 0;
    switch (this.state) {
      case 'emerging': {
        const k = smooth(this.t / this.cfg.emergeTime);
        this.pos = v3.lerp(this.inside, this.home, k);
        if (this.t >= this.cfg.emergeTime) { this.state = 'stalking'; this.t = 0; ev.push('emerged'); }
        break;
      }
      case 'stalking': {
        const to = v3.sub(target, this.pos);
        const d = v3.len(to);
        if (d > 1e-4) this.yaw = faceYaw(to);
        if (observed) { this.tremble = 1; break; }
        if (d <= this.cfg.attackDist) {
          this.state = 'lunging'; this.t = 0;
          this.from = v3.copy(this.pos);
          this.to = v3.addScaled(target, v3.norm(v3.neg(to)), 0.3);
          ev.push('lunge');
          break;
        }
        const step = Math.min(this.cfg.speed * dt, d - this.cfg.attackDist * 0.98);
        this.pos = v3.addScaled(this.pos, v3.norm(to), Math.max(0, step));
        ev.push('advance');
        break;
      }
      case 'lunging': {
        this.pos = v3.lerp(this.from, this.to, smooth(this.t / this.cfg.lungeTime));
        if (this.t >= this.cfg.lungeTime) { this.state = 'retreating'; this.t = 0; this.from = v3.copy(this.pos); ev.push('attack'); }
        break;
      }
      case 'retreating': {
        this.pos = v3.lerp(this.from, this.home, smooth(this.t / this.cfg.retreatTime));
        if (this.t >= this.cfg.retreatTime) { this.state = 'stalking'; this.t = 0; }
        break;
      }
      case 'dying': {
        if (this.t >= 1.6) { this.state = 'gone'; ev.push('gone'); }
        break;
      }
      default:
        break;
    }
    return ev;
  }

  defeat() { this.state = 'dying'; this.t = 0; }
}
