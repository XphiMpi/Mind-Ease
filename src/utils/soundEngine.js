// src/utils/soundEngine.js
// Procedural Web Audio API sound generator for Calm Corner

class CalmAudioEngine {
  constructor() {
    this.ctx = null;
    this.ambientSource = null;
    this.ambientGain = null;
    this.lfo = null;
    this.isPlayingAmbient = false;
    this.currentSoundType = "none"; // 'none', 'chime', 'rain', 'waves'
    this.volume = 0.5;
    this.activeNodes = [];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Soft meditation chime (Tibetan singing bowl tone)
  playChime(pitch = 260) {
    this.init();
    if (!this.ctx || this.ctx.state !== "running") return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(pitch, now);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(pitch * 2.76, now);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.25 * this.volume, now + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 3.6);
      osc2.stop(now + 3.6);

      this.activeNodes.push(osc1, osc2, gainNode);
    } catch (e) {
      console.warn("Audio chime error:", e);
    }
  }

  // Start continuous ambient noise (Rain or Ocean Waves)
  startAmbient(type = "rain") {
    this.init();
    if (!this.ctx || this.ctx.state !== "running") return;
    this.stopAllImmediate();

    try {
      this.currentSoundType = type;
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(
        1,
        bufferSize,
        this.ctx.sampleRate,
      );
      const output = noiseBuffer.getChannelData(0);

      // Generate soft pink noise
      let b0 = 0,
        b1 = 0,
        b2 = 0,
        b3 = 0,
        b4 = 0,
        b5 = 0,
        b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.ambientGain.gain.linearRampToValueAtTime(
        0.3 * this.volume,
        this.ctx.currentTime + 1.2,
      );

      if (type === "rain") {
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      } else if (type === "waves") {
        filter.frequency.setValueAtTime(400, this.ctx.currentTime);
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
        this.lfo = lfo;
      }

      whiteNoise.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      whiteNoise.start();
      this.ambientSource = whiteNoise;
      this.isPlayingAmbient = true;
    } catch (e) {
      console.warn("Ambient audio error:", e);
    }
  }

  // 100% Guaranteed Immediate Stop of All Audio
  stopAllImmediate() {
    this.isPlayingAmbient = false;
    this.currentSoundType = "none";

    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.cancelScheduledValues(0);
        this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.ambientGain.disconnect();
      } catch (e) {}
      this.ambientGain = null;
    }

    if (this.ambientSource) {
      try {
        this.ambientSource.stop();
        this.ambientSource.disconnect();
      } catch (e) {}
      this.ambientSource = null;
    }

    if (this.lfo) {
      try {
        this.lfo.stop();
        this.lfo.disconnect();
      } catch (e) {}
      this.lfo = null;
    }

    this.activeNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];

    // Suspend audio context so zero audio can play outside
    if (this.ctx && this.ctx.state === "running") {
      try {
        this.ctx.suspend();
      } catch (e) {}
    }
  }

  stopAmbient() {
    this.stopAllImmediate();
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && this.ctx && this.ctx.state === "running") {
      try {
        this.ambientGain.gain.setValueAtTime(
          0.3 * this.volume,
          this.ctx.currentTime,
        );
      } catch (e) {}
    }
  }
}

export const calmAudio = new CalmAudioEngine();
