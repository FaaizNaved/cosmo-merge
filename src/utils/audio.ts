// Procedural Web Audio API Sound Synthesizer
class SoundController {
  private ctx: AudioContext | null = null;
  public soundEnabled: boolean = true;
  public musicEnabled: boolean = true;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Musical frequencies for tiers 0 to 11 (Pentatonic & Cosmic scale)
  private tierFrequencies = [
    523.25, // C5 (Stardust)
    587.33, // D5 (Moon)
    659.25, // E5 (Mercury)
    783.99, // G5 (Mars)
    880.00, // A5 (Earth)
    1046.50,// C6 (Neptune)
    1174.66,// D6 (Jupiter)
    1318.51,// E6 (Sun)
    1567.98,// G6 (Pulsar)
    1760.00,// A6 (Supernova)
    220.00, // A3 Sub-bass (Black Hole)
    110.00  // A2 Cosmic Singularity (Big Bang)
  ];

  playMerge(tier: number, combo: number = 1) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const baseFreq = this.tierFrequencies[Math.min(tier, this.tierFrequencies.length - 1)] || 440;
      // Slight pitch multiplier for combos
      const freq = baseFreq * (1 + (combo - 1) * 0.05);

      // Main chime oscillator (sine)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = tier >= 10 ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.12);

      // Harmony oscillator for rich sparkling chord
      const harmonyOsc = this.ctx.createOscillator();
      const harmonyGain = this.ctx.createGain();
      harmonyOsc.type = 'triangle';
      harmonyOsc.frequency.setValueAtTime(freq * 1.25, now); // Major third

      const masterVol = 0.25;
      gain.gain.setValueAtTime(masterVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (tier >= 9 ? 0.8 : 0.45));

      harmonyGain.gain.setValueAtTime(masterVol * 0.4, now);
      harmonyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      harmonyOsc.connect(harmonyGain);

      gain.connect(this.ctx.destination);
      harmonyGain.connect(this.ctx.destination);

      osc.start(now);
      harmonyOsc.start(now);

      osc.stop(now + 0.9);
      harmonyOsc.stop(now + 0.4);

      // Bass rumble for massive planets / black holes
      if (tier >= 7) {
        this.playDeepThud(tier >= 10);
      }

      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(tier >= 8 ? [20, 40, 30] : [12]);
      }
    } catch {
      // Audio context error fallback
    }
  }

  playDeepThud(isSuperEpic: boolean = false) {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isSuperEpic ? 75 : 120, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + (isSuperEpic ? 0.7 : 0.35));

      gain.gain.setValueAtTime(isSuperEpic ? 0.4 : 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (isSuperEpic ? 0.7 : 0.35));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + (isSuperEpic ? 0.75 : 0.4));
    } catch {
      // Ignore audio error
    }
  }

  playDrop() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.14);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore
    }
  }

  playPowerup(type: string) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (type === 'bomb') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.45);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      } else if (type === 'vortex') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(480, now + 0.3);
        osc.frequency.linearRampToValueAtTime(120, now + 0.6);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);

      if ('vibrate' in navigator) {
        navigator.vibrate([25, 50, 40]);
      }
    } catch {
      // Ignore
    }
  }

  playGameOver() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.6);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
    } catch {
      // Ignore
    }
  }

  playClick() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignore
    }
  }

  startAmbientPad() {
    if (!this.musicEnabled) return;
    this.initCtx();
    if (!this.ctx || this.ambientOsc) return;

    try {
      const now = this.ctx.currentTime;
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();

      this.ambientOsc.type = 'sine';
      this.ambientOsc.frequency.setValueAtTime(55, now); // A1 cosmic drone

      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.03, now + 2); // Soft ambient hum

      this.ambientOsc.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc.start(now);
    } catch {
      // Ignore
    }
  }

  stopAmbientPad() {
    if (this.ambientOsc && this.ambientGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.ambientGain.gain.linearRampToValueAtTime(0.001, now + 0.5);
        this.ambientOsc.stop(now + 0.6);
      } catch {
        // Ignore
      }
      this.ambientOsc = null;
      this.ambientGain = null;
    }
  }

  toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  toggleMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled) {
      this.startAmbientPad();
    } else {
      this.stopAmbientPad();
    }
    return this.musicEnabled;
  }
}

export const sounds = new SoundController();
