class AudioEngine {
    constructor() {
        this.context = null;
        this.masterVolume = 0.7;
        this.musicVolume = 0.8;
        this.sfxVolume = 1.0;
        this.currentMusic = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.gain.value = this.masterVolume;
            this.masterGain.connect(this.context.destination);
            this.initialized = true;
            console.log('Audio Engine initialized');
        } catch (error) {
            console.error('Failed to initialize Audio Engine:', error);
        }
    }

    // Procedurally generate the title theme (32-bit Zelda style)
    playTitleTheme() {
        if (!this.initialized) return;

        const now = this.context.currentTime;
        
        // Create oscillators for different layers
        this.createBassLine(now);
        this.createMelody(now);
        this.createPad(now);
    }

    createBassLine(startTime) {
        const bass = this.context.createOscillator();
        const bassGain = this.context.createGain();
        
        bass.type = 'triangle';
        bass.frequency.value = 55; // A1
        
        bassGain.gain.value = 0.3;
        
        bass.connect(bassGain);
        bassGain.connect(this.masterGain);
        
        // Simple bass pattern
        const pattern = [55, 55, 82.5, 55, 73.5, 55, 82.5, 55]; // A, A, E, A, D, A, E, A
        const duration = 0.5;
        
        pattern.forEach((freq, i) => {
            bass.frequency.setValueAtTime(freq, startTime + i * duration);
        });
        
        bass.start(startTime);
        bass.stop(startTime + pattern.length * duration);
    }

    createMelody(startTime) {
        const melody = this.context.createOscillator();
        const melodyGain = this.context.createGain();
        
        melody.type = 'square';
        
        melodyGain.gain.value = 0.15;
        
        melody.connect(melodyGain);
        melodyGain.connect(this.masterGain);
        
        // Heroic melody inspired by Zelda theme
        const notes = [
            440, 440, 440, 554, 659, 659, 659, 587, // A A A C# E E E D
            523, 523, 587, 523, 440, 440, 0, 0      // C C D C A A rest rest
        ];
        const duration = 0.25;
        
        notes.forEach((freq, i) => {
            if (freq > 0) {
                melody.frequency.setValueAtTime(freq, startTime + 1 + i * duration);
            }
        });
        
        melody.start(startTime + 1);
        melody.stop(startTime + 1 + notes.length * duration);
    }

    createPad(startTime) {
        const pad = this.context.createOscillator();
        const padGain = this.context.createGain();
        
        pad.type = 'sawtooth';
        pad.frequency.value = 220; // A3
        
        padGain.gain.setValueAtTime(0, startTime);
        padGain.gain.linearRampToValueAtTime(0.05, startTime + 2);
        padGain.gain.linearRampToValueAtTime(0, startTime + 8);
        
        pad.connect(padGain);
        padGain.connect(this.masterGain);
        
        pad.start(startTime);
        pad.stop(startTime + 8);
    }

    stopAll() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }
}

// Global audio instance
const audioEngine = new AudioEngine();
