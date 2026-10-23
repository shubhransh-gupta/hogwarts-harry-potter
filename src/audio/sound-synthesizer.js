// Web Audio API Procedural Sound & Music Synthesizer
// Zero external files, ultra-lightweight, authentic Harry Potter ambiance & spells

class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.currentTrackIndex = 0;
    this.isPlayingMusic = false;
    this.musicTimer = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;

    this.tracks = [
      { id: 'hedwig', title: 'Hedwig’s Himalayan Theme', tempo: 155 },
      { id: 'lucknow', title: 'Platform 9¾ Lucknow Departure', tempo: 130 },
      { id: 'nocturne', title: 'Doon Valley Castle Nocturne', tempo: 105 }
    ];
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.musicGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);

    this.startMusic();
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime, 0.05);
    }
    return !this.isMuted;
  }

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
    this.playCurrentMusic();
    return this.tracks[this.currentTrackIndex];
  }

  getTrackInfo() {
    return this.tracks[this.currentTrackIndex];
  }

  // --- Music Generation ---
  startMusic() {
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;
    this.playCurrentMusic();
  }

  playCurrentMusic() {
    if (!this.ctx || this.isMuted) return;
    this.resume();

    const track = this.tracks[this.currentTrackIndex];
    if (track.id === 'hedwig') {
      this.playHedwigTheme();
    } else if (track.id === 'lucknow') {
      this.playLucknowTheme();
    } else {
      this.playNocturneTheme();
    }
  }

  // Celesta-style note synthesizer
  playCelesta(freq, time, duration = 0.8, volume = 0.25) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Celesta has pure sine with subtle bell harmonics
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    // Overtone harmonic
    const overtone = this.ctx.createOscillator();
    const overGain = this.ctx.createGain();
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2.02, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    overGain.gain.setValueAtTime(0, time);
    overGain.gain.linearRampToValueAtTime(volume * 0.25, time + 0.01);
    overGain.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.6);

    osc.connect(gain);
    overtone.connect(overGain);
    gain.connect(this.musicGain);
    overGain.connect(this.musicGain);

    osc.start(time);
    overtone.start(time);
    osc.stop(time + duration);
    overtone.stop(time + duration);
  }

  playStrings(freq, time, duration = 2.0, volume = 0.12) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 1.006, time); // slight chorus detune

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(700, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.4);
    gain.gain.setTargetAtTime(0.0001, time + duration - 0.4, 0.2);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc2.start(time);
    osc.stop(time + duration);
    osc2.stop(time + duration);
  }

  // Iconic Hedwig's Theme Melody sequence
  playHedwigTheme() {
    const now = this.ctx.currentTime + 0.1;
    // Frequencies (Hz)
    const notes = {
      B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
      Fs4: 369.99, G4: 392.00, A4: 440.00, As4: 466.16, B4: 493.88,
      C5: 523.25, D5: 587.33, Ds5: 622.25, E5: 659.25, F5: 698.46,
      Fs5: 739.99, G5: 783.99, A5: 880.00, B5: 987.77
    };

    // Melody: Note, duration (beats)
    const phrase = [
      [notes.B4, 1.0], [notes.E5, 1.5], [notes.G5, 0.5], [notes.Fs5, 1.0],
      [notes.E5, 2.0], [notes.B5, 1.0], [notes.A5, 2.8],
      [notes.Fs5, 2.8],
      [notes.E5, 1.5], [notes.G5, 0.5], [notes.Fs5, 1.0], [notes.Ds5, 2.0],
      [notes.F5, 1.0], [notes.B4, 3.0],
      // Second measure
      [notes.B4, 1.0], [notes.E5, 1.5], [notes.G5, 0.5], [notes.Fs5, 1.0],
      [notes.E5, 2.0], [notes.B5, 1.0], [notes.D5, 2.0], [notes.Db5, 1.0],
      [notes.C5, 2.0], [notes.As4, 1.0], [notes.G5, 1.5], [notes.E5, 0.5],
      [notes.G5, 1.0], [notes.E5, 3.2]
    ];

    const beatLen = 0.42; // Seconds per beat
    let t = now;

    // Pad chords underneath
    const bassChords = [
      { root: notes.E4 / 2, time: 0, dur: 7 },
      { root: notes.B3 / 2, time: 7.2, dur: 6 },
      { root: notes.E4 / 2, time: 13.5, dur: 7 },
      { root: notes.C4 / 2, time: 21, dur: 8 }
    ];

    bassChords.forEach(c => {
      this.playStrings(c.root, now + c.time * beatLen, c.dur * beatLen, 0.08);
      this.playStrings(c.root * 1.5, now + c.time * beatLen, c.dur * beatLen, 0.05);
    });

    phrase.forEach(([freq, dur]) => {
      this.playCelesta(freq, t, dur * beatLen * 0.95, 0.22);
      t += dur * beatLen;
    });

    // Schedule next loop
    const totalDuration = (t - now) + 2.0;
    this.musicTimer = setTimeout(() => {
      if (this.tracks[this.currentTrackIndex].id === 'hedwig') {
        this.playHedwigTheme();
      }
    }, totalDuration * 1000);
  }

  // Lucknow Station Express Train departure waltz
  playLucknowTheme() {
    const now = this.ctx.currentTime + 0.1;
    const baseFreqs = [220, 261.63, 329.63, 392.00, 440, 523.25];
    const beatLen = 0.35;
    let t = now;

    for (let bar = 0; bar < 8; bar++) {
      const root = baseFreqs[bar % baseFreqs.length];
      this.playStrings(root / 2, t, beatLen * 3, 0.1);
      this.playCelesta(root * 1.25, t, beatLen * 0.8, 0.18);
      this.playCelesta(root * 1.5, t + beatLen, beatLen * 0.8, 0.15);
      this.playCelesta(root * 2.0, t + beatLen * 2, beatLen * 0.8, 0.2);
      t += beatLen * 3;
    }

    this.musicTimer = setTimeout(() => {
      if (this.tracks[this.currentTrackIndex].id === 'lucknow') {
        this.playLucknowTheme();
      }
    }, (t - now + 1.0) * 1000);
  }

  // Atmospheric Himalayan Nocturne
  playNocturneTheme() {
    const now = this.ctx.currentTime + 0.1;
    const scales = [196, 246.94, 293.66, 369.99, 440, 493.88];
    const beatLen = 0.55;
    let t = now;

    for (let i = 0; i < 12; i++) {
      const note = scales[i % scales.length];
      this.playStrings(note / 2, t, beatLen * 4, 0.09);
      this.playCelesta(note * 2, t + 0.2, beatLen * 1.5, 0.18);
      t += beatLen * 2;
    }

    this.musicTimer = setTimeout(() => {
      if (this.tracks[this.currentTrackIndex].id === 'nocturne') {
        this.playNocturneTheme();
      }
    }, (t - now + 1.0) * 1000);
  }

  // --- Sound Effects (SFX) ---

  // Lumos Spell: Pure glowing chime and warm hum
  playSpellLumos(active = true) {
    if (!this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    if (active) {
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.4);
    } else {
      osc.frequency.setValueAtTime(1046.5, now);
      osc.frequency.exponentialRampToValueAtTime(330, now + 0.35);
    }

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (active ? 0.6 : 0.4));

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.65);
  }

  // Expecto Patronum: Majestic silver celestial surge
  playSpellPatronus() {
    if (!this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;

    [440, 554.37, 659.25, 880, 1108.73, 1318.51].forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.05);
      osc.frequency.exponentialRampToValueAtTime(f * 1.25, now + 0.8);

      gain.gain.setValueAtTime(0, now + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.05 + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.05);
      osc.stop(now + 1.7);
    });
  }

  // Wingardium Leviosa: Swirling shimmering levitation ring
  playSpellLeviosa() {
    if (!this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(900, now + 0.5);
    osc.frequency.linearRampToValueAtTime(750, now + 0.9);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 1.15);
  }

  // Incendio: Crackling flame whoosh
  playSpellIncendio() {
    if (!this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;
    
    // Low whoosh
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.45);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(220, now + 0.45);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.55);
  }

  // Alohomora: Golden metallic tumblers unlocking
  playSpellAlohomora() {
    if (!this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;

    [1200, 1600, 2400].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const hitTime = now + idx * 0.12;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, hitTime);

      gain.gain.setValueAtTime(0, hitTime);
      gain.gain.linearRampToValueAtTime(0.25, hitTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(hitTime);
      osc.stop(hitTime + 0.2);
    });
  }

  // Hogwarts Express Classic Steam Whistle
  playTrainWhistle() {
    if (!this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;

    // Dual-tone steam whistle chord (D5 & F#5)
    [587.33, 739.99].forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.02, now + 0.3);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 1.2);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.15);
      gain.gain.setValueAtTime(0.2, now + 1.0);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 1.55);
    });
  }

  // Teleport / Respawn Woosh
  playTeleport() {
    if (!this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.7);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.8);
  }

  // Snitch Flutter Sound
  playSnitchFlutter() {
    if (!this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(2200, now + 0.12);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.16);
  }
}

export const soundSynth = new SoundSynthesizer();
