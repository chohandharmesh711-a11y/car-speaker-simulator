// Advanced Audio Processor with Car-Specific Acoustic Profiles

class CarAudioProcessor {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.sourceNode = null;
        this.dryGain = null;
        this.wetGain = null;
        this.convolver = null;
        this.bassFilter = null;
        this.midFilter = null;
        this.trebleFilter = null;
        this.mainGain = null;
        this.stereoPanner = null;
        this.initialized = false;
        this.currentCarProfile = null;
        this.currentSeat = null;
    }

    // Initialize Web Audio API
    async init() {
        if (this.initialized) return;

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create main gain node
        this.mainGain = this.audioContext.createGain();
        this.mainGain.gain.value = 1.0;

        // Dry/Wet mix for convolver
        this.dryGain = this.audioContext.createGain();
        this.dryGain.gain.value = 0.3;
        
        this.wetGain = this.audioContext.createGain();
        this.wetGain.gain.value = 0.7;

        // Convolver for impulse response (cabin acoustics)
        this.convolver = this.audioContext.createConvolver();

        // Bass filter (Low shelf at car's fundamental resonance frequency)
        this.bassFilter = this.audioContext.createBiquadFilter();
        this.bassFilter.type = 'lowshelf';
        this.bassFilter.frequency.value = 100;
        this.bassFilter.Q.value = 0.7;
        this.bassFilter.gain.value = 0;

        // Mid filter (Peaking filter)
        this.midFilter = this.audioContext.createBiquadFilter();
        this.midFilter.type = 'peaking';
        this.midFilter.frequency.value = 1000;
        this.midFilter.Q.value = 1.0;
        this.midFilter.gain.value = 0;

        // Treble filter (High shelf)
        this.trebleFilter = this.audioContext.createBiquadFilter();
        this.trebleFilter.type = 'highshelf';
        this.trebleFilter.frequency.value = 5000;
        this.trebleFilter.Q.value = 0.7;
        this.trebleFilter.gain.value = 0;

        // Stereo panner for speaker positioning
        this.stereoPanner = this.audioContext.createStereoPanner();

        // Analyser for visualization
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;

        // Audio graph:
        // Source -> [Dry path + Wet path (Convolver)] -> EQ filters -> Panner -> Main Gain -> Analyser -> Output
        
        this.convolver.connect(this.bassFilter);
        this.bassFilter.connect(this.midFilter);
        this.midFilter.connect(this.trebleFilter);
        this.trebleFilter.connect(this.stereoPanner);
        this.stereoPanner.connect(this.mainGain);
        this.mainGain.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        // Load default impulse response
        await this.loadImpulseResponse('swift', 'front-left');

        this.initialized = true;
    }

    // Load impulse response for specific car
    async loadImpulseResponse(carName, seatPosition) {
        try {
            this.currentCarProfile = CAR_PROFILES[carName];
            this.currentSeat = seatPosition;
            
            if (!this.currentCarProfile) {
                console.error('Car profile not found:', carName);
                return;
            }

            // Generate synthetic IR based on car cabin characteristics
            const irData = this.generateCarImpulseResponse(this.currentCarProfile);
            this.convolver.buffer = irData;

            // Apply car-specific frequency adjustments
            this.applyCarFrequencyProfile(this.currentCarProfile);

        } catch (error) {
            console.error('Error loading impulse response:', error);
        }
    }

    // Generate impulse response based on car cabin acoustics
    generateCarImpulseResponse(carProfile) {
        const sampleRate = this.audioContext.sampleRate;
        const length = Math.floor(sampleRate * carProfile.reverbTime * 2); // 2x reverb time for tail
        const impulseBuffer = this.audioContext.createBuffer(2, length, sampleRate); // Stereo
        const leftChannel = impulseBuffer.getChannelData(0);
        const rightChannel = impulseBuffer.getChannelData(1);

        // Initial impulse
        leftChannel[0] = 1.0;
        rightChannel[0] = 0.9;

        // Generate reflections based on cabin volume and geometry
        const numReflections = Math.floor(carProfile.cabinVolume / 0.5); // More reflections for larger cabins
        const decayRate = carProfile.reverbTime;

        for (let i = 0; i < numReflections; i++) {
            const reflectionTime = (i + 1) * (length / numReflections);
            const reflectionIdx = Math.floor(reflectionTime);

            if (reflectionIdx < length) {
                // Simulate multiple reflections with decreasing amplitude
                const amplitude = Math.pow(decayRate, (i + 1) / numReflections);
                const randomPhase = Math.random() * 2 * Math.PI;

                leftChannel[reflectionIdx] += amplitude * 0.3 * Math.cos(randomPhase);
                rightChannel[reflectionIdx] += amplitude * 0.3 * Math.sin(randomPhase);
            }
        }

        // Apply exponential decay envelope
        const decayEnvelope = (t) => Math.pow(decayRate, t / length);

        for (let i = 1; i < length; i++) {
            const envelope = decayEnvelope(i);
            if (leftChannel[i] === 0) {
                leftChannel[i] = (Math.random() - 0.5) * 0.05 * envelope;
            }
            if (rightChannel[i] === 0) {
                rightChannel[i] = (Math.random() - 0.5) * 0.05 * envelope;
            }
        }

        return impulseBuffer;
    }

    // Apply car-specific frequency profile
    applyCarFrequencyProfile(carProfile) {
        // Bass boost based on cabin volume and subwoofer configuration
        const bassGain = (carProfile.bassResponse - 1.0) * 12; // Convert to dB
        this.bassFilter.frequency.value = carProfile.baseFrequency;
        this.bassFilter.gain.value = bassGain;

        // Mid adjustment
        const midGain = (carProfile.midResponse - 1.0) * 6;
        this.midFilter.gain.value = midGain;

        // Treble adjustment
        const trebleGain = (carProfile.trebleResponse - 1.0) * 8;
        this.trebleFilter.gain.value = trebleGain;
    }

    // Apply speaker positioning to audio (seat-based panning and delay)
    applySeatPositioning(carProfile, seatPosition) {
        const seatData = carProfile.seats[seatPosition];
        
        if (!seatData) {
            console.error('Seat position not found:', seatPosition);
            return;
        }

        // Calculate stereo panning based on seat position
        let panValue = 0;

        if (seatPosition === 'frontLeft') {
            panValue = -0.4; // Left side
        } else if (seatPosition === 'frontRight') {
            panValue = 0.4; // Right side
        } else if (seatPosition === 'rearLeft') {
            panValue = -0.3; // Slight left
        } else if (seatPosition === 'rearRight') {
            panValue = 0.3; // Slight right
        } else if (seatPosition === 'center') {
            panValue = 0; // Center
        }

        this.stereoPanner.pan.value = panValue;

        // Calculate speaker outputs based on distance
        const speakerOutputs = calculateSpeakerOutput(carProfile, seatPosition);
        
        console.log('Speaker Outputs for', seatPosition, ':', speakerOutputs);

        return speakerOutputs;
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

    // Play audio with car-specific processing
    playAudio(audioBuffer, carName, seatPosition) {
        // Load car profile first
        this.loadImpulseResponse(carName, seatPosition);
        this.applySeatPositioning(this.currentCarProfile, seatPosition);

        if (!this.sourceNode) {
            this.sourceNode = this.audioContext.createBufferSource();
            this.sourceNode.buffer = audioBuffer;
            
            // Connect through convolver
            this.sourceNode.connect(this.dryGain);
            this.sourceNode.connect(this.convolver);
            this.dryGain.connect(this.mainGain);
            this.wetGain.connect(this.mainGain);
            this.convolver.connect(this.wetGain);
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

    // Pause audio
    pauseAudio() {
        this.stopAudio();
    }

    // Get analyser node for visualization
    getAnalyser() {
        return this.analyser;
    }

    // Get current time
    getCurrentTime() {
        return this.audioContext ? this.audioContext.currentTime : 0;
    }

    // Get car info
    getCarInfo() {
        if (!this.currentCarProfile) return null;
        return {
            name: this.currentCarProfile.name,
            type: this.currentCarProfile.type,
            cabinVolume: this.currentCarProfile.cabinVolume,
            reverbTime: this.currentCarProfile.reverbTime
        };
    }

    // Utility: Format time to MM:SS
    static formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CarAudioProcessor;
}
