// Every sound is synthesized with Web Audio: no audio files to license or load.
// Sounds with a position are placed in 3D (HRTF) so you can hear where they are.
// The music box plays "Silent Night" (Franz Gruber, 1818, public domain).

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

// Silent Night, first verse: [midi note, beats] in 3/4.
const SILENT_NIGHT = [
  [67, 1.5], [69, 0.5], [67, 1], [64, 3], [67, 1.5], [69, 0.5], [67, 1], [64, 3],
  [74, 2], [74, 1], [71, 3], [72, 2], [72, 1], [67, 3],
  [69, 2], [69, 1], [72, 1.5], [71, 0.5], [69, 1], [67, 1.5], [69, 0.5], [67, 1], [64, 3],
  [69, 2], [69, 1], [72, 1.5], [71, 0.5], [69, 1], [67, 1.5], [69, 0.5], [67, 1], [64, 3],
  [74, 2], [74, 1], [77, 1.5], [74, 0.5], [71, 1], [72, 3], [76, 3],
  [72, 1.5], [67, 0.5], [64, 1], [67, 1.5], [65, 0.5], [62, 1], [60, 6],
];

// A wind-up box running down (music('winddown')): this many slower, softer notes, then silence.
const WIND_NOTES = 4;

// Waveshaper curve: linear up to `knee`, then easing toward `top` (never reaching it), symmetric.
export function softClip(knee = 0.7, top = 0.875, n = 2049) {
  const c = new Float32Array(n), room = top - knee;
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1, a = Math.abs(x);
    c[i] = Math.sign(x) * (a <= knee ? a : knee + room * Math.tanh((a - knee) / room));
  }
  return c;
}

export class Audio {
  constructor() {
    this.ctx = null;
    this.music = this.music.bind(this);
    this.musicState = 'off';
    this.intensity = 0;
  }

  unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AC) return;
    const ctx = (this.ctx = new AC());
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.knee.value = 6; comp.ratio.value = 8; comp.attack.value = 0.003; comp.release.value = 0.2;
    // A ceiling after the compressor: when the stinger, the roar and the lunge land together the mix
    // peaked within 0.2 dB of full scale. A compressor cannot hold a ceiling (it adds make-up gain), so
    // this is a soft clipper: untouched below 0.7, rounding off toward 0.89 (-1 dBFS) above it.
    const ceiling = ctx.createWaveShaper();
    ceiling.curve = softClip(0.7, 0.875);
    ceiling.oversample = 'none'; // oversampling filters overshoot the curve (measured -0.8 dBFS); the curve is smooth enough
    this.master = ctx.createGain(); this.master.gain.value = 0.9;
    this.master.connect(comp).connect(ceiling).connect(ctx.destination);
    this.sfx = ctx.createGain(); this.sfx.connect(this.master);
    this.musicBus = ctx.createGain(); this.musicBus.gain.value = 0.32; this.musicBus.target = 0.32; this.musicBus.connect(this.master);
    this.ambBus = ctx.createGain(); this.ambBus.gain.value = 0; this.ambBus.connect(this.master);
    const len = ctx.sampleRate * 2;
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    if (ctx.state === 'suspended') ctx.resume();
  }

  pause(p) {
    if (!this.ctx) return;
    if (p) this.ctx.suspend(); else this.ctx.resume();
  }

  setListener(pos, fwd, up = [0, 1, 0]) {
    const L = this.ctx && this.ctx.listener;
    if (!L) return;
    if (L.positionX) {
      const t = this.ctx.currentTime;
      L.positionX.setValueAtTime(pos[0], t); L.positionY.setValueAtTime(pos[1], t); L.positionZ.setValueAtTime(pos[2], t);
      L.forwardX.setValueAtTime(fwd[0], t); L.forwardY.setValueAtTime(fwd[1], t); L.forwardZ.setValueAtTime(fwd[2], t);
      L.upX.setValueAtTime(up[0], t); L.upY.setValueAtTime(up[1], t); L.upZ.setValueAtTime(up[2], t);
    } else {
      L.setPosition(pos[0], pos[1], pos[2]);
      L.setOrientation(fwd[0], fwd[1], fwd[2], up[0], up[1], up[2]);
    }
  }

  // Output node for one sound: a gain, optionally through a 3D panner.
  out(gain, pos) {
    const ctx = this.ctx;
    const g = ctx.createGain();
    g.gain.value = gain;
    if (pos) {
      const p = ctx.createPanner();
      p.panningModel = 'HRTF'; p.distanceModel = 'inverse'; p.refDistance = 0.6; p.rolloffFactor = 1.1; p.maxDistance = 20;
      if (p.positionX) { p.positionX.value = pos[0]; p.positionY.value = pos[1]; p.positionZ.value = pos[2]; }
      else p.setPosition(pos[0], pos[1], pos[2]);
      g.connect(p).connect(this.sfx);
    } else g.connect(this.sfx);
    return g;
  }

  env(param, t, peak, attack, decay, floor = 0.0001) {
    param.cancelScheduledValues(t);
    param.setValueAtTime(floor, t);
    param.linearRampToValueAtTime(peak, t + attack);
    param.exponentialRampToValueAtTime(floor, t + attack + decay);
  }

  osc(type, freq, t, dur, dest, peak = 1, attack = 0.002, glideTo = null) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
    const g = ctx.createGain();
    this.env(g.gain, t, peak, attack, dur);
    o.connect(g).connect(dest);
    o.start(t); o.stop(t + attack + dur + 0.05);
    return o;
  }

  noiseBurst(t, dur, dest, { type = 'bandpass', freq = 1000, q = 1, peak = 1, attack = 0.002, sweepTo = null } = {}) {
    const ctx = this.ctx;
    const s = ctx.createBufferSource();
    s.buffer = this.noise;
    s.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
    const g = ctx.createGain();
    this.env(g.gain, t, peak, attack, dur);
    s.connect(f).connect(g).connect(dest);
    s.start(t, Math.random()); s.stop(t + attack + dur + 0.05);
  }

  play(name, { pos = null, gain = 1, rate = 1, once = false } = {}) {
    if (!this.ctx || this.ctx.state === 'closed') return;
    const t = this.ctx.currentTime + 0.005;
    const r = Math.random;
    switch (name) {
      case 'clack': { // wooden jaw: two hard knocks (once: one, half the audio nodes, for the stare's lurches)
        const o = this.out(0.9 * gain, pos);
        for (const k of once ? [0] : [0, 0.07]) {
          this.osc('sine', 820 + r() * 80, t + k, 0.05, o, 0.8);
          this.osc('triangle', 1340 + r() * 120, t + k, 0.035, o, 0.4);
          this.noiseBurst(t + k, 0.02, o, { freq: 2600, q: 3, peak: 0.6 });
        }
        break;
      }
      case 'step': {
        const o = this.out(0.55 * gain, pos);
        this.osc('sine', 120 + r() * 20, t, 0.09, o, 0.9, 0.002, 60);
        this.noiseBurst(t, 0.05, o, { type: 'lowpass', freq: 500, peak: 0.5 });
        break;
      }
      case 'jingle': { // sleigh bells
        const o = this.out(0.35 * gain, pos);
        for (let i = 0; i < 7; i++) {
          const k = i * 0.05 + r() * 0.03, f = 2400 + r() * 1800;
          this.osc('sine', f, t + k, 0.14, o, 0.5);
          this.osc('sine', f * 2.73, t + k, 0.08, o, 0.2);
        }
        break;
      }
      case 'creak': { // the tell when you look away: was 32 dB under the music at 2.5 m
        const o = this.out(1.8 * gain, pos);
        const ctx = this.ctx;
        const s = ctx.createOscillator(); s.type = 'sawtooth'; s.frequency.setValueAtTime(85, t);
        s.frequency.linearRampToValueAtTime(110, t + 0.25); s.frequency.linearRampToValueAtTime(70, t + 0.55);
        const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 650; f.Q.value = 4.5;
        const g = ctx.createGain(); this.env(g.gain, t, 0.7, 0.05, 0.55);
        s.connect(f).connect(g).connect(o); s.start(t); s.stop(t + 0.7);
        break;
      }
      case 'lunge': {
        const o = this.out(0.8 * gain, pos);
        this.noiseBurst(t, 0.3, o, { freq: 400, q: 1.5, peak: 0.9, attack: 0.05, sweepTo: 2600 });
        break;
      }
      case 'stinger': { // the jump scare
        const o = this.out(0.95 * gain, null);
        this.noiseBurst(t, 0.3, o, { type: 'highpass', freq: 300, peak: 0.9 });
        for (const f of [233, 247, 311, 330, 466]) this.osc('sawtooth', f, t, 1.1, o, 0.28, 0.004, f * 0.94);
        this.osc('sine', 62, t, 0.7, o, 1, 0.005, 32);
        break;
      }
      case 'stab': { // caught one close: a short shriek of strings over a thump, the music ducking under it
        const o = this.out(0.85 * gain, pos);
        for (const f of [1397, 1440, 1480, 1976, 2030]) this.osc('sawtooth', f, t, 0.4, o, 0.2, 0.004, f * 0.96);
        this.noiseBurst(t, 0.1, o, { type: 'highpass', freq: 2500, peak: 0.3 });
        this.osc('sine', 98, t, 0.22, o, 0.4, 0.004, 55);
        // Back to the level the music was headed for, not one caught mid-fade.
        const m = this.musicBus.gain, to = this.musicBus.target ?? m.value;
        m.cancelScheduledValues(t); m.setValueAtTime(m.value, t);
        m.linearRampToValueAtTime(to * 0.4, t + 0.02); m.linearRampToValueAtTime(to * 0.4, t + 0.3); m.linearRampToValueAtTime(to, t + 0.8);
        break;
      }
      case 'banish': {
        const o = this.out(0.5 * gain, pos);
        this.noiseBurst(t, 0.6, o, { freq: 2200, q: 2, peak: 0.6, attack: 0.02, sweepTo: 220 });
        this.osc('sine', 320, t, 0.6, o, 0.5, 0.01, 70);
        break;
      }
      case 'chime': {
        const o = this.out(0.45 * gain, pos);
        const f = midi(88) * rate;
        this.osc('sine', f, t, 1.6, o, 0.6);
        this.osc('sine', f * 2.76, t, 0.9, o, 0.18);
        this.osc('sine', f * 5.4, t, 0.4, o, 0.07);
        break;
      }
      case 'pickup': this.osc('sine', 1900, t, 0.04, this.out(0.42 * gain, pos), 0.6); break; // was 22 dB under the music
      case 'drop': this.osc('sine', 300, t, 0.09, this.out(0.2 * gain, pos), 0.7, 0.002, 140); break;
      case 'click': this.osc('square', 1000, t, 0.025, this.out(0.4 * gain, null), 0.5); break; // was 23 dB under the music
      case 'pop': {
        const o = this.out(0.3 * gain, pos);
        this.noiseBurst(t, 0.015, o, { type: 'highpass', freq: 3000, peak: 0.8 });
        this.osc('sine', 2100, t, 0.06, o, 0.3);
        break;
      }
      case 'powerdown': {
        const o = this.out(0.45 * gain, null);
        this.osc('sawtooth', 220, t, 1.2, o, 0.35, 0.01, 38);
        this.noiseBurst(t, 0.25, o, { type: 'highpass', freq: 2500, peak: 0.4 });
        break;
      }
      case 'magic': {
        const o = this.out(0.3 * gain, pos);
        [84, 88, 91, 96, 100, 103].forEach((n, i) => this.osc('sine', midi(n), t + i * 0.07, 0.9, o, 0.45));
        break;
      }
      case 'rumble': this.noiseBurst(t, 2.6, this.out(0.8 * gain, null), { type: 'lowpass', freq: 110, peak: 1, attack: 0.9 }); break;
      case 'crack': {
        const o = this.out(0.75 * gain, pos);
        this.noiseBurst(t, 0.05, o, { type: 'highpass', freq: 1400, peak: 1 });
        this.noiseBurst(t + 0.01, 0.25, o, { type: 'lowpass', freq: 300, peak: 0.8 });
        break;
      }
      case 'roar': {
        const ctx = this.ctx;
        const o = this.out(0.85 * gain, pos);
        const car = ctx.createOscillator(); car.type = 'sawtooth'; car.frequency.setValueAtTime(190 * rate, t);
        car.frequency.exponentialRampToValueAtTime(95 * rate, t + 1.5);
        const mod = ctx.createOscillator(); mod.frequency.value = 37;
        const md = ctx.createGain(); md.gain.value = 70;
        mod.connect(md).connect(car.frequency);
        const g = ctx.createGain(); this.env(g.gain, t, 0.55, 0.06, 1.5);
        car.connect(g).connect(o);
        car.start(t); mod.start(t); car.stop(t + 1.7); mod.stop(t + 1.7);
        this.noiseBurst(t, 1.3, o, { freq: 900, q: 0.8, peak: 0.5, attack: 0.05 });
        for (let i = 0; i < 3; i++) this.osc('sine', 2600, t + 0.1 + i * 0.22, 0.12, o, 0.2, 0.005, 1700);
        break;
      }
      case 'growl': this.osc('sawtooth', 72 + r() * 10, t, 0.8, this.out(0.35 * gain, pos), 0.5, 0.08, 58); break;
      case 'clock': {
        const o = this.out(0.6 * gain, null);
        const f = midi(55);
        this.osc('sine', f, t, 3, o, 0.7);
        this.osc('sine', f * 2.4, t, 1.6, o, 0.25);
        this.osc('sine', f * 3.9, t, 0.9, o, 0.12);
        this.osc('triangle', f * 0.5, t, 2.2, o, 0.25);
        break;
      }
      case 'shriek': {
        const o = this.out(0.7 * gain, pos);
        this.osc('sawtooth', 1800, t, 1.4, o, 0.25, 0.01, 380);
        this.osc('square', 1210, t, 1.2, o, 0.1, 0.01, 300);
        this.noiseBurst(t, 1.2, o, { freq: 3000, q: 1, peak: 0.4, sweepTo: 500 });
        break;
      }
      case 'strain': { // wood under strain while you stare one down: faster and higher (rate) as he gives
        // Not placed in 3D: you are looking straight at him while it plays, and a panner on every tick cost the
        // frame more than it gave (the game scales it with his distance instead).
        const ctx = this.ctx;
        const o = this.out(1.0 * gain, null);
        const s = ctx.createOscillator(); s.type = 'sawtooth';
        s.frequency.setValueAtTime(150 * rate, t); s.frequency.linearRampToValueAtTime(190 * rate, t + 0.08);
        const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 800 * rate; f.Q.value = 2.2;
        const g = ctx.createGain(); this.env(g.gain, t, 0.9, 0.008, 0.09);
        s.connect(f).connect(g).connect(o); s.start(t); s.stop(t + 0.14);
        this.noiseBurst(t, 0.02, o, { freq: 2600 * rate, q: 3, peak: 0.9 });
        break;
      }
      case 'snap': { // stared down, he breaks: a hard crack of wood with a thump under it
        const o = this.out(0.9 * gain, pos);
        this.noiseBurst(t, 0.03, o, { type: 'highpass', freq: 1800, peak: 1 });
        this.noiseBurst(t + 0.005, 0.12, o, { freq: 900, q: 1.2, peak: 0.7 });
        this.osc('sine', 110, t, 0.22, o, 1, 0.002, 45);
        this.osc('triangle', 520, t, 0.06, o, 0.35, 0.001, 260);
        break;
      }
      case 'boom': { // the Mouse King bursts on the twelfth chime: a low boom under a bright shimmer
        const o = this.out(0.8 * gain, pos);
        this.osc('sine', 70, t, 1.4, o, 1, 0.004, 28);
        this.noiseBurst(t, 0.6, o, { type: 'lowpass', freq: 420, peak: 0.8, sweepTo: 90 });
        [96, 100, 103, 108].forEach((n, i) => this.osc('sine', midi(n), t + 0.04 + i * 0.05, 1.2, o, 0.18));
        break;
      }
      case 'heart': { // a heartbeat, in your chest: lub-dub, under the steps and creaks. An octave over the thump, so a headset's small speakers carry it
        const o = this.out(0.28 * gain, null);
        this.osc('sine', 62, t, 0.11, o, 1, 0.006, 38);
        this.osc('triangle', 124, t, 0.08, o, 0.5, 0.006, 80); // only on the lub: fewer audio nodes, same carry
        this.osc('sine', 55, t + 0.17, 0.12, o, 0.7, 0.006, 34);
        break;
      }
      case 'tock': { // caught mid-step: a hollow wooden block, freezing
        const o = this.out(1.4 * gain, pos);
        this.osc('sine', 980, t, 0.05, o, 0.8, 0.001, 620);
        this.osc('triangle', 1960, t, 0.025, o, 0.25, 0.001, 1200);
        this.noiseBurst(t, 0.012, o, { freq: 3200, q: 2, peak: 0.5 });
        break;
      }
      case 'tap': { // the snowman's nose on the glass: three taps, a glassy ring with a click on top
        const o = this.out(1.6 * gain, pos);
        for (const k of [0, 0.19, 0.36]) {
          const f = 2700 + r() * 300;
          this.osc('sine', f, t + k, 0.14, o, 0.55);
          this.osc('sine', f * 1.71, t + k, 0.07, o, 0.25);
          this.noiseBurst(t + k, 0.014, o, { type: 'highpass', freq: 3200, peak: 0.8 });
        }
        break;
      }
      case 'crunch': { // a heavy step in the snow outside
        const o = this.out(0.6 * gain, pos);
        for (const k of [0, 0.05, 0.11]) this.noiseBurst(t + k, 0.05 + r() * 0.03, o, { freq: 1100 + r() * 700, q: 0.9, peak: 0.55 });
        this.noiseBurst(t, 0.16, o, { type: 'lowpass', freq: 520, peak: 0.5 });
        break;
      }
      case 'gust': { // wind against the glass
        const o = this.out(0.5 * gain, pos);
        this.noiseBurst(t, 1.1, o, { freq: 380, q: 1.4, peak: 0.6, attack: 0.5, sweepTo: 950 });
        this.noiseBurst(t + 0.9, 1.2, o, { freq: 900, q: 1.4, peak: 0.45, attack: 0.2, sweepTo: 330 });
        break;
      }
      case 'win': {
        const o = this.out(0.3 * gain, null);
        [60, 64, 67, 72, 76].forEach((n, i) => this.osc('sine', midi(n), t + i * 0.12, 3, o, 0.4, 0.15));
        break;
      }
      case 'lose': {
        const o = this.out(0.35 * gain, null);
        [45, 48, 51, 54].forEach((n) => this.osc('triangle', midi(n), t, 3, o, 0.35, 0.3, midi(n) * 0.97));
        break;
      }
      default: break;
    }
  }

  // ------------------------------------------------------------ music box
  music(cmd, value) {
    if (!this.ctx) return;
    if (cmd === 'intensity') { this.intensity = value; return; }
    if (cmd === 'stop') { this.musicState = 'off'; this.fadeBus(this.musicBus, 0, 0.6); return; }
    if (cmd === 'winddown') { if (this.musicState === 'on') { this.musicState = 'winding'; this.windN = 0; } return; }
    if (cmd === 'start' || cmd === 'calm') {
      const wasOff = this.musicState === 'off';
      this.musicState = cmd === 'calm' ? 'calm' : 'on';
      this.fadeBus(this.musicBus, cmd === 'calm' ? 0.22 : 0.32, 0.5);
      if (!this.timer || wasOff) { // from the top of the tune, not from wherever it stopped
        this.noteIdx = 0;
        this.nextNoteT = this.ctx.currentTime + 0.3;
      }
      if (!this.timer) this.timer = setInterval(() => this.schedule(), 40);
    }
  }

  fadeBus(bus, to, sec) {
    const t = this.ctx.currentTime;
    bus.target = to; // where it is headed (the stab's duck comes back to it)
    bus.gain.cancelScheduledValues(t);
    bus.gain.setValueAtTime(bus.gain.value, t);
    bus.gain.linearRampToValueAtTime(to, t + sec);
  }

  schedule() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    if (this.musicState === 'off') return;
    const beat = this.musicState === 'calm' ? 0.62 : 0.78 + this.intensity * 0.25;
    // Never queue a note in the past: notes missed while the timer was starved (a background tab)
    // are skipped, not played all at once.
    if (this.nextNoteT < this.ctx.currentTime) this.nextNoteT = this.ctx.currentTime + 0.05;
    while (this.nextNoteT < this.ctx.currentTime + 0.15) {
      const [n, beats] = SILENT_NIGHT[this.noteIdx % SILENT_NIGHT.length];
      if (this.musicState === 'winding') {
        // Running down: each note softer and a little flat, each gap longer, then silence until 'start'.
        const k = ++this.windN;
        this.boxNote(midi(n + 24) * Math.pow(2, (-10 * k) / 1200), this.nextNoteT, 1 - 0.18 * k);
        this.nextNoteT += beat * (0.8 + 0.8 * k);
        this.noteIdx++;
        if (k >= WIND_NOTES) { this.musicState = 'off'; return; }
        continue;
      }
      const wob = this.musicState === 'calm' ? 0 : (Math.random() - 0.5) * (6 + this.intensity * 60);
      const f = midi(n + 24) * Math.pow(2, wob / 1200);
      this.boxNote(f, this.nextNoteT);
      if (this.intensity > 0.55 && Math.random() < 0.25) this.boxNote(f * Math.SQRT2, this.nextNoteT + 0.02, 0.25);
      this.nextNoteT += beats * beat;
      this.noteIdx++;
      if (this.noteIdx % SILENT_NIGHT.length === 0) this.nextNoteT += beat * 3;
    }
  }

  boxNote(f, t, level = 1) {
    const o = this.musicBus;
    this.osc('sine', f, t, 1.3, o, 0.5 * level, 0.002);
    this.osc('sine', f * 3.01, t, 0.35, o, 0.12 * level, 0.002);
    this.osc('sine', f * 4.2, t, 0.18, o, 0.05 * level, 0.002);
  }

  ambience(on) {
    if (!this.ctx) return;
    if (on && !this.ambNodes) {
      const ctx = this.ctx, t = ctx.currentTime;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 180;
      const a = ctx.createOscillator(); a.frequency.value = 55;
      const b = ctx.createOscillator(); b.frequency.value = 55.7;
      const ga = ctx.createGain(); ga.gain.value = 0.18;
      a.connect(ga); b.connect(ga); ga.connect(lp).connect(this.ambBus);
      a.start(t); b.start(t);
      this.ambNodes = [a, b];
      this.crackle = setInterval(() => this.crackleTick(), 120);
    }
    this.fadeBus(this.ambBus, on ? 0.22 : 0, 1.5);
  }

  // The fire: a pop half the time, every 120 ms (its own method so an offline render can drive it).
  crackleTick() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const tt = this.ctx.currentTime;
    if (Math.random() < 0.5) this.noiseBurst(tt, 0.012 + Math.random() * 0.02, this.ambBus, { type: 'highpass', freq: 1800, peak: 0.25 + Math.random() * 0.35 });
  }
}
