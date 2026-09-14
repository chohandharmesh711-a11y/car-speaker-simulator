// Audio Processor - Advanced car speaker simulation with DSP

class AudioProcessor {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.sourceNode = null;
        this.bassFilter = null;
        this.trebleFilter = null;
        this.gainNode = null;
        this.convolver = null;
        this.stereoPanner = null;
        this.initialized = false;
    }

    // Initialize Web Audio API
    async init() {
        if (this.initialized) return;

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create nodes
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = 0.7;

        // Bass filter (Low shelf)
        this.bassFilter = this.audioContext.createBiquadFilter();
        this.bassFilter.type = 'lowshelf';
        this.bassFilter.frequency.value = 200;
        this.bassFilter.gain.value = 0;

        // Treble filter (High shelf)
        this.trebleFilter = this.audioContext.createBiquadFilter();
        this.trebleFilter.type = 'highshelf';
        this.trebleFilter.frequency.value = 3000;
        this.trebleFilter.gain.value = 0;

        // Convolver for impulse response
        this.convolver = this.audioContext.createConvolver();

        // Stereo panning
        this.stereoPanner = this.audioContext.createStereoPanner();

        // Analyser for visualization
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;

        // Connect nodes: source -> convolver -> bass -> treble -> panner -> gain -> analyser -> destination
        this.convolver.connect(this.bassFilter);
        this.bassFilter.connect(this.trebleFilter);
        this.trebleFilter.connect(this.stereoPanner);
        this.stereoPanner.connect(this.gainNode);
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        // Load impulse response
        await this.loadImpulseResponse('compact');

        this.initialized = true;
    }

    // Load impulse response based on speaker type
    async loadImpulseResponse(speakerType) {
        try {
            // Create synthetic impulse response for different car types
            const irData = this.generateImpulseResponse(speakerType);
            this.convolver.buffer = irData;
        } catch (error) {
            console.error('Error loading impulse response:', error);
        }
    }

    // Generate synthetic impulse response based on car type
    generateImpulseResponse(speakerType) {
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * 2; // 2 seconds
        const impulseBuffer = this.audioContext.createBuffer(1, length, sampleRate);
        const data = impulseBuffer.getChannelData(0);

        // Generate different acoustic signatures for different car types
        let decay = 0.5;
        let reflections = [];

        switch (speakerType) {
            case 'compact':
                decay = 0.4;
                reflections = [0.1, 0.3, 0.5, 0.7];
                break;
            case 'sedan':
                decay = 0.55;
                reflections = [0.08, 0.25, 0.45, 0.65, 0.85];
                break;
            case 'suv':
                decay = 0.65;
                reflections = [0.05, 0.2, 0.4, 0.6, 0.75, 0.9];
                break;
            case 'luxury':
                decay = 0.7;
                reflections = [0.02, 0.15, 0.35, 0.55, 0.7, 0.85, 0.95];
                break;
        }

        // Create initial impulse
        data[0] = 1.0;

        // Add reflections and decay
        reflections.forEach(reflectionTime => {
            const reflectionSample = Math.floor(reflectionTime * length);
            if (reflectionSample < length) {
                data[reflectionSample] = Math.random() * 0.3 * Math.pow(decay, reflectionTime);
            }
        });

        // Apply exponential decay
        for (let i = 1; i < length; i++) {
            if (data[i] === 0) {
                data[i] = (Math.random() - 0.5) * 0.02 * Math.pow(decay, i / length);
            }
        }

        return impulseBuffer;
    }

    // Set bass level (-40 to 40 dB)
    setBass(value) {
        if (this.bassFilter) {
            this.bassFilter.gain.value = (value - 50) * 0.8; // -40 to 40
        }
    }

    // Set treble level (-40 to 40 dB)
    setTreble(value) {
        if (this.trebleFilter) {
            this.trebleFilter.gain.value = (value - 50) * 0.8; // -40 to 40
        }
    }

    // Set master volume (0 to 1)
    setVolume(value) {
        if (this.gainNode) {
            this.gainNode.gain.value = value / 100;
        }
    }

    // Set spatial audio panning (-1 to 1)
    setSpatialAudio(enabled) {
        if (this.stereoPanner) {
            if (enabled) {
                this.stereoPanner.pan.value = (Math.random() - 0.5) * 0.3; // Subtle panning
            } else {
                this.stereoPanner.pan.value = 0;
            }
        }
    }

    // Load audio file
    async loadAudioFile(file) {
        try {
            await this.init();
            const arrayBuffer = await file.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            return audioBuffer;
        } catch (error) {
            console.error('Error loading audio file:', error);
            throw error;
        }
    }

    // Play audio
    playAudio(audioBuffer) {
        if (!this.sourceNode) {
            this.sourceNode = this.audioContext.createBufferSource();
            this.sourceNode.buffer = audioBuffer;
            this.sourceNode.connect(this.convolver);
        }
        this.sourceNode.start(0);
        return this.audioContext.currentTime;
    }

    // Stop audio
    stopAudio() {
        if (this.sourceNode) {
            try {
                this.sourceNode.stop();
            } catch (e) {
                console.log('Source already stopped');
            }
            this.sourceNode = null;
        }
    }

    // Pause audio (resume from current position)
    pauseAudio() {
        this.stopAudio();
    }

    // Change speaker type
    changeSpeakerType(type) {
        this.loadImpulseResponse(type);
    }

    // Get analyser node for visualization
    getAnalyser() {
        return this.analyser;
    }

    // Get current time
    getCurrentTime() {
        return this.audioContext ? this.audioContext.currentTime : 0;
    }

    // Utility: Format time to MM:SS
    static formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioProcessor;
}