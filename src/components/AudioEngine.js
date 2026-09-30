// Web Audio API ambient soundscape generator
// Generates a cinematic, subtle low-frequency rumble and alpine atmospheric hum
// Pitch and filter modulate gently with user interaction without requiring any external audio files.

class CinematicAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.filter = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.noiseNode = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Low pass filter
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(140, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(2, this.ctx.currentTime);
    this.filter.connect(this.masterGain);

    // Deep Sub Drone Oscillator (48Hz)
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(48, this.ctx.currentTime);

    const gain1 = this.ctx.createGain();
    gain1.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.droneOsc1.connect(gain1);
    gain1.connect(this.filter);

    // Harmonic Engine Tone (72Hz, sawtooth through heavy filter)
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'sawtooth';
    this.droneOsc2.frequency.setValueAtTime(72, this.ctx.currentTime);

    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.08, this.ctx.currentTime);
    this.droneOsc2.connect(gain2);
    gain2.connect(this.filter);

    // Ambient Wind / Atmosphere (Pinkish noise)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.1;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    this.noiseNode.connect(noiseGain);
    noiseGain.connect(this.filter);

    this.droneOsc1.start();
    this.droneOsc2.start();
    this.noiseNode.start();
  }

  toggle() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (!this.isPlaying) {
      this.isPlaying = true;
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(0.4, now + 1.2);
    } else {
      this.isPlaying = false;
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(0, now + 0.8);
    }
    return this.isPlaying;
  }

  // Modulate sound slightly based on scroll speed / action
  modulate(speed = 0) {
    if (!this.isPlaying || !this.ctx || !this.filter) return;
    const targetFreq = Math.min(380, 130 + speed * 120);
    const now = this.ctx.currentTime;
    this.filter.frequency.setTargetAtTime(targetFreq, now, 0.2);
  }
}

export const audioEngine = new CinematicAudioEngine();
