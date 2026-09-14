// Main Application Logic

class CarSpeakerSimulator {
    constructor() {
        this.audioProcessor = new AudioProcessor();
        this.currentAudioBuffer = null;
        this.isPlaying = false;
        this.startTime = 0;
        this.pausedTime = 0;
        this.animationId = null;
        this.currentFile = null;

        this.initializeUI();
        this.attachEventListeners();
    }

    // Initialize UI elements
    initializeUI() {
        this.elements = {
            uploadBtn: document.getElementById('uploadBtn'),
            audioFile: document.getElementById('audioFile'),
            uploadArea: document.getElementById('uploadArea'),
            fileInfo: document.getElementById('fileInfo'),
            speakerType: document.getElementById('speakerType'),
            bass: document.getElementById('bass'),
            bassValue: document.getElementById('bassValue'),
            treble: document.getElementById('treble'),
            trebleValue: document.getElementById('trebleValue'),
            volume: document.getElementById('volume'),
            volumeValue: document.getElementById('volumeValue'),
            spatialAudio: document.getElementById('spatialAudio'),
            playBtn: document.getElementById('playBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            stopBtn: document.getElementById('stopBtn'),
            progress: document.getElementById('progress'),
            progressBar: document.querySelector('.progress-bar'),
            currentTime: document.getElementById('currentTime'),
            duration: document.getElementById('duration'),
            visualizer: document.getElementById('visualizer'),
            presetBtns: document.querySelectorAll('.btn-preset')
        };
    }

    // Attach event listeners
    attachEventListeners() {
        // File upload
        this.elements.uploadBtn.addEventListener('click', () => {
            this.elements.audioFile.click();
        });

        this.elements.audioFile.addEventListener('change', (e) => this.handleFileSelect(e));

        // Drag and drop
        this.elements.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.elements.uploadArea.addEventListener('dragleave', () => this.handleDragLeave());
        this.elements.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

        // Controls
        this.elements.speakerType.addEventListener('change', (e) => {
            this.audioProcessor.changeSpeakerType(e.target.value);
        });

        this.elements.bass.addEventListener('input', (e) => {
            this.audioProcessor.setBass(e.target.value);
            this.elements.bassValue.textContent = e.target.value + '%';
        });

        this.elements.treble.addEventListener('input', (e) => {
            this.audioProcessor.setTreble(e.target.value);
            this.elements.trebleValue.textContent = e.target.value + '%';
        });

        this.elements.volume.addEventListener('input', (e) => {
            this.audioProcessor.setVolume(e.target.value);
            this.elements.volumeValue.textContent = e.target.value + '%';
        });

        this.elements.spatialAudio.addEventListener('change', (e) => {
            this.audioProcessor.setSpatialAudio(e.target.checked);
        });

        // Player controls
        this.elements.playBtn.addEventListener('click', () => this.play());
        this.elements.pauseBtn.addEventListener('click', () => this.pause());
        this.elements.stopBtn.addEventListener('click', () => this.stop());

        // Progress bar
        this.elements.progressBar.addEventListener('click', (e) => this.seek(e));

        // EQ Presets
        this.elements.presetBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.applyPreset(e.target.dataset.preset, e.target));
        });
    }

    // Handle file selection
    async handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            await this.loadAudio(files[0]);
        }
    }

    // Handle drag over
    handleDragOver(e) {
        e.preventDefault();
        this.elements.uploadArea.classList.add('dragover');
    }

    // Handle drag leave
    handleDragLeave() {
        this.elements.uploadArea.classList.remove('dragover');
    }

    // Handle drop
    async handleDrop(e) {
        e.preventDefault();
        this.elements.uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await this.loadAudio(files[0]);
        }
    }

    // Load audio file
    async loadAudio(file) {
        try {
            this.stop();
            this.currentFile = file;
            this.currentAudioBuffer = await this.audioProcessor.loadAudioFile(file);

            // Update UI
            this.elements.fileInfo.textContent = `✓ Loaded: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
            this.elements.fileInfo.classList.add('show');

            // Enable controls
            this.elements.playBtn.disabled = false;
            this.elements.pauseBtn.disabled = false;
            this.elements.stopBtn.disabled = false;

            // Update duration
            const duration = this.currentAudioBuffer.duration;
            this.elements.duration.textContent = AudioProcessor.formatTime(duration);

            // Reset progress
            this.elements.progress.style.width = '0%';
            this.elements.currentTime.textContent = '0:00';

            // Initialize visualizer
            this.initVisualizer();

        } catch (error) {
            alert('Error loading audio file: ' + error.message);
            console.error(error);
        }
    }

    // Play audio
    play() {
        if (!this.currentAudioBuffer) return;

        if (!this.isPlaying) {
            this.audioProcessor.playAudio(this.currentAudioBuffer);
            this.isPlaying = true;
            this.startTime = this.audioProcessor.audioContext.currentTime - this.pausedTime;
            this.updateProgress();
            this.elements.playBtn.disabled = true;
            this.elements.pauseBtn.disabled = false;
        }
    }

    // Pause audio
    pause() {
        if (this.isPlaying) {
            this.pausedTime = this.audioProcessor.getCurrentTime() - this.startTime;
            this.audioProcessor.pauseAudio();
            this.isPlaying = false;
            this.elements.playBtn.disabled = false;
            this.elements.pauseBtn.disabled = true;
            cancelAnimationFrame(this.animationId);
        }
    }

    // Stop audio
    stop() {
        this.audioProcessor.stopAudio();
        this.isPlaying = false;
        this.pausedTime = 0;
        this.startTime = 0;
        this.elements.progress.style.width = '0%';
        this.elements.currentTime.textContent = '0:00';
        this.elements.playBtn.disabled = !this.currentAudioBuffer;
        this.elements.pauseBtn.disabled = true;
        cancelAnimationFrame(this.animationId);
    }

    // Update progress
    updateProgress = () => {
        if (this.isPlaying && this.currentAudioBuffer) {
            const currentTime = this.audioProcessor.getCurrentTime() - this.startTime;
            const duration = this.currentAudioBuffer.duration;

            if (currentTime >= duration) {
                this.stop();
                return;
            }

            const progress = (currentTime / duration) * 100;
            this.elements.progress.style.width = progress + '%';
            this.elements.currentTime.textContent = AudioProcessor.formatTime(currentTime);

            this.animationId = requestAnimationFrame(this.updateProgress);
        }
    }

    // Seek to position
    seek(e) {
        if (!this.currentAudioBuffer) return;

        const rect = this.elements.progressBar.getBoundingClientRect();
        const percentage = (e.clientX - rect.left) / rect.width;
        this.pausedTime = percentage * this.currentAudioBuffer.duration;

        this.elements.progress.style.width = (percentage * 100) + '%';
        this.elements.currentTime.textContent = AudioProcessor.formatTime(this.pausedTime);

        if (this.isPlaying) {
            this.pause();
            this.play();
        }
    }

    // Apply EQ preset
    applyPreset(preset, button) {
        // Remove active state from all buttons
        this.elements.presetBtns.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        switch (preset) {
            case 'flat':
                this.elements.bass.value = 50;
                this.elements.treble.value = 50;
                this.audioProcessor.setBass(50);
                this.audioProcessor.setTreble(50);
                this.elements.bassValue.textContent = '50%';
                this.elements.trebleValue.textContent = '50%';
                break;
            case 'bass-boost':
                this.elements.bass.value = 75;
                this.elements.treble.value = 50;
                this.audioProcessor.setBass(75);
                this.audioProcessor.setTreble(50);
                this.elements.bassValue.textContent = '75%';
                this.elements.trebleValue.textContent = '50%';
                break;
            case 'treble-boost':
                this.elements.bass.value = 50;
                this.elements.treble.value = 75;
                this.audioProcessor.setBass(50);
                this.audioProcessor.setTreble(75);
                this.elements.bassValue.textContent = '50%';
                this.elements.trebleValue.textContent = '75%';
                break;
            case 'balanced':
                this.elements.bass.value = 55;
                this.elements.treble.value = 55;
                this.audioProcessor.setBass(55);
                this.audioProcessor.setTreble(55);
                this.elements.bassValue.textContent = '55%';
                this.elements.trebleValue.textContent = '55%';
                break;
            case 'heavy-bass':
                this.elements.bass.value = 90;
                this.elements.treble.value = 40;
                this.audioProcessor.setBass(90);
                this.audioProcessor.setTreble(40);
                this.elements.bassValue.textContent = '90%';
                this.elements.trebleValue.textContent = '40%';
                break;
        }
    }

    // Initialize visualizer
    initVisualizer() {
        const canvas = this.elements.visualizer;
        const ctx = canvas.getContext('2d');
        const analyser = this.audioProcessor.getAnalyser();

        const draw = () => {
            this.animationId = requestAnimationFrame(draw);

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(dataArray);

            // Clear canvas
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw bars
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;

            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            ctx.fillStyle = gradient;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height;

                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        draw();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CarSpeakerSimulator();
});