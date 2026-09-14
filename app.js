// Main Application Logic - Indian Car Audio Simulator

class IndianCarAudioSimulator {
    constructor() {
        this.audioProcessor = new CarAudioProcessor();
        this.currentAudioBuffer = null;
        this.isPlaying = false;
        this.startTime = 0;
        this.pausedTime = 0;
        this.animationId = null;
        this.selectedCar = null;
        this.selectedSeat = null;

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
            carCards: document.querySelectorAll('.car-card'),
            seats: document.querySelectorAll('.seat, .seat-center'),
            playBtn: document.getElementById('playBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            stopBtn: document.getElementById('stopBtn'),
            progress: document.getElementById('progress'),
            progressBar: document.querySelector('.progress-bar'),
            currentTime: document.getElementById('currentTime'),
            duration: document.getElementById('duration'),
            visualizer: document.getElementById('visualizer'),
            carInfo: document.getElementById('carInfo'),
            seatInfo: document.getElementById('seatInfo'),
            seatLabel: document.getElementById('seat-label')
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

        // Car selection
        this.elements.carCards.forEach(card => {
            card.addEventListener('click', (e) => this.selectCar(e.currentTarget.dataset.car, e.currentTarget));
        });

        // Seat selection
        this.elements.seats.forEach(seat => {
            seat.addEventListener('click', (e) => {
                const seatPosition = e.currentTarget.dataset.seat;
                this.selectSeat(seatPosition, e.currentTarget);
            });
        });

        // Player controls
        this.elements.playBtn.addEventListener('click', () => this.play());
        this.elements.pauseBtn.addEventListener('click', () => this.pause());
        this.elements.stopBtn.addEventListener('click', () => this.stop());

        // Progress bar
        this.elements.progressBar.addEventListener('click', (e) => this.seek(e));
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
            this.currentAudioBuffer = await this.audioProcessor.loadAudioFile(file);

            // Update UI
            this.elements.fileInfo.textContent = `✓ Loaded: ${file.name}`;
            this.elements.fileInfo.classList.add('show');

            // Enable controls
            this.elements.playBtn.disabled = false;
            this.elements.pauseBtn.disabled = false;
            this.elements.stopBtn.disabled = false;

            // Update duration
            const duration = this.currentAudioBuffer.duration;
            this.elements.duration.textContent = CarAudioProcessor.formatTime(duration);

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

    // Select car
    selectCar(carName, element) {
        // Remove active state from all cars
        this.elements.carCards.forEach(card => card.classList.remove('active'));
        element.classList.add('active');

        this.selectedCar = carName;
        const carProfile = CAR_PROFILES[carName];
        this.elements.carInfo.textContent = `🚗 ${carProfile.name} - ${carProfile.type}`;

        // If playing, restart with new car profile
        if (this.isPlaying && this.selectedSeat) {
            this.stop();
            this.play();
        }
    }

    // Select seat
    selectSeat(seatPosition, element) {
        // Remove active state from all seats
        this.elements.seats.forEach(seat => seat.classList.remove('active'));
        element.classList.add('active');

        this.selectedSeat = seatPosition;

        const seatLabels = {
            'front-left': '👤 Front Left (Driver)',
            'front-right': '👤 Front Right (Passenger)',
            'rear-left': '👤 Rear Left',
            'rear-right': '👤 Rear Right',
            'center': '👤 Center'
        };

        this.elements.seatLabel.textContent = seatLabels[seatPosition] || 'Seat selected';
        this.elements.seatInfo.textContent = seatLabels[seatPosition];

        // If playing, restart with new seat position
        if (this.isPlaying && this.selectedCar) {
            this.stop();
            this.play();
        }
    }

    // Play audio
    play() {
        if (!this.currentAudioBuffer || !this.selectedCar || !this.selectedSeat) {
            alert('Please select a car, seat, and upload a song first!');
            return;
        }

        if (!this.isPlaying) {
            this.audioProcessor.playAudio(this.currentAudioBuffer, this.selectedCar, this.selectedSeat);
            this.isPlaying = true;
            this.startTime = this.audioProcessor.getCurrentTime() - this.pausedTime;
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
            this.elements.currentTime.textContent = CarAudioProcessor.formatTime(currentTime);

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
        this.elements.currentTime.textContent = CarAudioProcessor.formatTime(this.pausedTime);

        if (this.isPlaying) {
            this.pause();
            this.play();
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

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new IndianCarAudioSimulator();
});