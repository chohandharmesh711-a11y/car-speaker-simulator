# Car Speaker Simulator 🎵🚗

A web-based acoustic simulator that lets you hear how your songs sound through different car speaker systems.

## Features

✨ **Multiple Speaker Types**
- Compact Car - Smaller, tighter acoustic space
- Sedan - Mid-range speaker simulation
- SUV - Larger cabin with extended bass response
- Luxury Car - Premium acoustic treatment and spatial imaging

🎚️ **Advanced Audio Controls**
- **Bass Control** - Adjust low-frequency response (0-100%)
- **Treble Control** - Adjust high-frequency response (0-100%)
- **Master Volume** - Control overall playback volume
- **Spatial Audio** - Enable subtle stereo panning for immersive sound

🎛️ **EQ Presets**
- Flat - Neutral frequency response
- Bass Boost - Enhanced bass for bass-heavy music
- Treble Boost - Enhanced treble for vocals and clarity
- Balanced - Well-rounded frequency response
- Heavy Bass - Maximum bass response (car subwoofer simulation)

🎵 **Full Player Controls**
- Play, Pause, and Stop functionality
- Real-time progress tracking
- Seek to any position in the track
- Time display (current/total duration)

📊 **Real-Time Visualizer**
- Frequency spectrum analyzer
- Visual feedback of audio processing
- Animated frequency bars

## How It Works

### Audio Processing Pipeline

1. **Audio File Upload** → Your song is loaded into the Web Audio API
2. **Impulse Response (IR) Convolution** → Simulates the acoustic characteristics of different car interiors
3. **Bass Filter** → Low-shelf EQ for adjustable bass response
4. **Treble Filter** → High-shelf EQ for adjustable treble response
5. **Spatial Panning** → Subtle stereo effects for immersion
6. **Master Gain** → Final volume control
7. **Visualization** → Real-time frequency spectrum display

### Impulse Response Generation

Each car type has a unique acoustic signature generated synthetically:
- **Compact**: Short reverb decay, minimal reflections - tight, focused sound
- **Sedan**: Medium reverb decay, moderate reflections - balanced acoustic space
- **SUV**: Longer reverb decay, more reflections - spacious, boomy character
- **Luxury**: Longest reverb decay, most reflections - premium, concert-hall quality

## Technical Stack

- **Web Audio API** - Real-time audio processing
- **Biquad Filters** - EQ processing (low-shelf, high-shelf)
- **Convolver Node** - Impulse response simulation
- **Analyser Node** - Real-time frequency analysis
- **Canvas API** - Visualizer rendering
- **Vanilla JavaScript** - No external dependencies

## File Structure

```
car-speaker-simulator/
├── index.html           # Main HTML interface
├── styles.css          # Styling and responsive design
├── audio-processor.js  # Web Audio API abstraction layer
├── app.js              # Main application logic
└── README.md           # Documentation
```

## How to Use

1. **Open the Application**
   - Open `index.html` in a modern web browser
   - No server or installation required

2. **Upload Your Song**
   - Click "Choose File" or drag-and-drop an audio file
   - Supported formats: MP3, WAV, FLAC, OGG, AAC
   - File is processed entirely in your browser

3. **Select Speaker Type**
   - Choose from Compact, Sedan, SUV, or Luxury car simulation

4. **Adjust Audio Settings**
   - Use Bass/Treble sliders to customize the sound
   - Adjust Master Volume to desired level
   - Enable Spatial Audio for immersive stereo effect

5. **Apply EQ Presets** (Optional)
   - Quick-select preset profiles for common listening preferences

6. **Play and Listen**
   - Click Play to start playback
   - Use visualizer to see frequency content
   - Use progress bar to seek to different parts

## Browser Compatibility

- Chrome/Chromium 14+
- Firefox 25+
- Safari 6+
- Edge 12+
- Opera 15+

**Note:** Web Audio API requires a modern browser with security context (HTTPS or localhost)

## Audio Quality Notes

- Impulse responses are synthetically generated for real-time performance
- Real car IRs would provide more authentic acoustics
- The simulator uses standard DSP filters (not convolution with real recordings)
- Spatial audio uses subtle panning (±15%) for realistic car speaker imaging

## Privacy & Security

✅ **100% Local Processing**
- No audio files are uploaded to any server
- All processing happens in your browser
- No tracking or data collection
- Your music files never leave your device

## Future Enhancements

- [ ] Upload custom impulse response files
- [ ] Multiple subwoofer configurations
- [ ] Microphone positioning simulation
- [ ] Frequency response graph display
- [ ] Save/load custom presets
- [ ] Export processed audio
- [ ] Vehicle exterior noise simulation
- [ ] A/B comparison mode

## Troubleshooting

**No sound output?**
- Check browser console for errors
- Ensure system volume is turned up
- Check that browser has microphone/audio permissions
- Try a different audio file format

**Poor audio quality?**
- Close other audio applications
- Reduce system load (close unnecessary tabs)
- The simulator uses real-time DSP, not pre-recorded IRs

**File won't upload?**
- Ensure file is valid audio format
- Check file size (browser limits apply)
- Try Firefox if Chrome has issues

## License

This project is provided as-is for educational and personal use.

## Credits

Developed as an acoustic simulation learning project.

---

**Enjoy exploring how your music sounds in different car environments!** 🎵🚗