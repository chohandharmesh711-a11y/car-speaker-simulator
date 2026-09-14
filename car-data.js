// Car acoustic profiles with real-world measurements and configurations

const CAR_PROFILES = {
    swift: {
        name: 'Maruti Swift',
        type: 'Hatchback',
        cabinVolume: 2.8, // cubic meters
        baseFrequency: 85, // Hz - fundamental resonance
        bassResponse: 0.6, // relative boost
        midResponse: 1.0,
        trebleResponse: 1.1,
        reverbTime: 0.35, // seconds
        speakers: {
            frontLeft: { x: -0.6, y: 0.8, z: 1.2, power: 1.0 },
            frontRight: { x: 0.6, y: 0.8, z: 1.2, power: 1.0 },
            rearLeft: { x: -0.5, y: -1.2, z: 0.9, power: 0.7 },
            rearRight: { x: 0.5, y: -1.2, z: 0.9, power: 0.7 },
            subwoofer: { x: 0, y: -1.5, z: 0.3, power: 0.5 }
        },
        seats: {
            frontLeft: { x: -0.3, y: 0.5, z: 1.0 },
            frontRight: { x: 0.3, y: 0.5, z: 1.0 },
            rearLeft: { x: -0.3, y: -0.8, z: 0.8 },
            rearRight: { x: 0.3, y: -0.8, z: 0.8 },
            center: { x: 0, y: 0, z: 1.0 }
        }
    },
    alto: {
        name: 'Maruti Alto',
        type: 'Economy Hatchback',
        cabinVolume: 2.3,
        baseFrequency: 95,
        bassResponse: 0.4,
        midResponse: 0.95,
        trebleResponse: 1.2,
        reverbTime: 0.28,
        speakers: {
            frontLeft: { x: -0.5, y: 0.75, z: 1.1, power: 0.8 },
            frontRight: { x: 0.5, y: 0.75, z: 1.1, power: 0.8 },
            rearLeft: { x: -0.4, y: -1.0, z: 0.85, power: 0.5 },
            rearRight: { x: 0.4, y: -1.0, z: 0.85, power: 0.5 },
            subwoofer: { x: 0, y: -1.3, z: 0.2, power: 0.3 }
        },
        seats: {
            frontLeft: { x: -0.25, y: 0.4, z: 0.95 },
            frontRight: { x: 0.25, y: 0.4, z: 0.95 },
            rearLeft: { x: -0.25, y: -0.6, z: 0.75 },
            rearRight: { x: 0.25, y: -0.6, z: 0.75 },
            center: { x: 0, y: 0, z: 0.95 }
        }
    },
    nexon: {
        name: 'Tata Nexon',
        type: 'Compact SUV',
        cabinVolume: 3.2,
        baseFrequency: 75,
        bassResponse: 0.85,
        midResponse: 1.05,
        trebleResponse: 1.0,
        reverbTime: 0.42,
        speakers: {
            frontLeft: { x: -0.7, y: 0.85, z: 1.3, power: 1.1 },
            frontRight: { x: 0.7, y: 0.85, z: 1.3, power: 1.1 },
            rearLeft: { x: -0.6, y: -1.3, z: 1.0, power: 0.8 },
            rearRight: { x: 0.6, y: -1.3, z: 1.0, power: 0.8 },
            subwoofer: { x: 0, y: -1.6, z: 0.35, power: 0.7 }
        },
        seats: {
            frontLeft: { x: -0.35, y: 0.55, z: 1.05 },
            frontRight: { x: 0.35, y: 0.55, z: 1.05 },
            rearLeft: { x: -0.35, y: -0.9, z: 0.85 },
            rearRight: { x: 0.35, y: -0.9, z: 0.85 },
            center: { x: 0, y: 0, z: 1.05 }
        }
    },
    creta: {
        name: 'Hyundai Creta',
        type: 'Mid-size SUV',
        cabinVolume: 3.8,
        baseFrequency: 70,
        bassResponse: 1.0,
        midResponse: 1.1,
        trebleResponse: 0.95,
        reverbTime: 0.48,
        speakers: {
            frontLeft: { x: -0.75, y: 0.9, z: 1.4, power: 1.2 },
            frontRight: { x: 0.75, y: 0.9, z: 1.4, power: 1.2 },
            rearLeft: { x: -0.65, y: -1.5, z: 1.05, power: 0.9 },
            rearRight: { x: 0.65, y: -1.5, z: 1.05, power: 0.9 },
            subwoofer: { x: 0, y: -1.8, z: 0.4, power: 0.85 }
        },
        seats: {
            frontLeft: { x: -0.4, y: 0.6, z: 1.1 },
            frontRight: { x: 0.4, y: 0.6, z: 1.1 },
            rearLeft: { x: -0.4, y: -1.0, z: 0.9 },
            rearRight: { x: 0.4, y: -1.0, z: 0.9 },
            center: { x: 0, y: 0, z: 1.1 }
        }
    },
    xuv700: {
        name: 'Mahindra XUV700',
        type: 'Luxury SUV',
        cabinVolume: 4.2,
        baseFrequency: 65,
        bassResponse: 1.15,
        midResponse: 1.15,
        trebleResponse: 1.05,
        reverbTime: 0.52,
        speakers: {
            frontLeft: { x: -0.8, y: 0.95, z: 1.45, power: 1.3 },
            frontRight: { x: 0.8, y: 0.95, z: 1.45, power: 1.3 },
            rearLeft: { x: -0.7, y: -1.6, z: 1.1, power: 1.0 },
            rearRight: { x: 0.7, y: -1.6, z: 1.1, power: 1.0 },
            subwoofer: { x: 0, y: -1.9, z: 0.45, power: 1.0 }
        },
        seats: {
            frontLeft: { x: -0.4, y: 0.65, z: 1.15 },
            frontRight: { x: 0.4, y: 0.65, z: 1.15 },
            rearLeft: { x: -0.4, y: -1.1, z: 0.95 },
            rearRight: { x: 0.4, y: -1.1, z: 0.95 },
            center: { x: 0, y: 0, z: 1.15 }
        }
    },
    slavia: {
        name: 'Skoda Slavia',
        type: 'Premium Sedan',
        cabinVolume: 3.5,
        baseFrequency: 72,
        bassResponse: 0.95,
        midResponse: 1.12,
        trebleResponse: 1.08,
        reverbTime: 0.45,
        speakers: {
            frontLeft: { x: -0.7, y: 0.88, z: 1.35, power: 1.15 },
            frontRight: { x: 0.7, y: 0.88, z: 1.35, power: 1.15 },
            rearLeft: { x: -0.6, y: -1.4, z: 0.95, power: 0.85 },
            rearRight: { x: 0.6, y: -1.4, z: 0.95, power: 0.85 },
            subwoofer: { x: 0, y: -1.7, z: 0.38, power: 0.75 }
        },
        seats: {
            frontLeft: { x: -0.38, y: 0.58, z: 1.08 },
            frontRight: { x: 0.38, y: 0.58, z: 1.08 },
            rearLeft: { x: -0.38, y: -0.95, z: 0.88 },
            rearRight: { x: 0.38, y: -0.95, z: 0.88 },
            center: { x: 0, y: 0, z: 1.08 }
        }
    },
    ertiga: {
        name: 'Maruti Ertiga',
        type: '7-Seater MPV',
        cabinVolume: 4.5,
        baseFrequency: 68,
        bassResponse: 1.05,
        midResponse: 1.08,
        trebleResponse: 0.98,
        reverbTime: 0.55,
        speakers: {
            frontLeft: { x: -0.75, y: 0.9, z: 1.4, power: 1.2 },
            frontRight: { x: 0.75, y: 0.9, z: 1.4, power: 1.2 },
            rearLeft: { x: -0.65, y: -1.5, z: 1.05, power: 0.95 },
            rearRight: { x: 0.65, y: -1.5, z: 1.05, power: 0.95 },
            subwoofer: { x: 0, y: -1.85, z: 0.42, power: 0.9 }
        },
        seats: {
            frontLeft: { x: -0.4, y: 0.6, z: 1.1 },
            frontRight: { x: 0.4, y: 0.6, z: 1.1 },
            rearLeft: { x: -0.4, y: -1.0, z: 0.9 },
            rearRight: { x: 0.4, y: -1.0, z: 0.9 },
            center: { x: 0, y: 0, z: 1.1 }
        }
    }
};

// Calculate distance-based attenuation for each speaker to listener position
function calculateSpeakerOutput(carProfile, seatPosition) {
    const seat = carProfile.seats[seatPosition];
    const output = {};

    for (let [speakerName, speaker] of Object.entries(carProfile.speakers)) {
        // Calculate 3D distance
        const dx = speaker.x - seat.x;
        const dy = speaker.y - seat.y;
        const dz = speaker.z - seat.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Inverse square law attenuation
        const attenuation = 1 / (1 + distance * distance);

        // Combined output
        output[speakerName] = {
            distance: distance,
            attenuation: attenuation,
            power: speaker.power * attenuation
        };
    }

    return output;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CAR_PROFILES, calculateSpeakerOutput };
}