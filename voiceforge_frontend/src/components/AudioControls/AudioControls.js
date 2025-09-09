import React, { useState, useRef, useCallback, useEffect } from 'react';
import './AudioControls.css';

// PUBLIC_INTERFACE
/**
 * Comprehensive Audio Controls component for emotion, pace, background music,
 * voice effects, and real-time preview functionality
 */
const AudioControls = ({ 
  onSettingsChange, 
  initialSettings = {}, 
  selectedVoice = null,
  scriptText = '',
  onPreview
}) => {
  const [settings, setSettings] = useState({
    speed: 1.0,
    pitch: 1.0,
    volume: 1.0,
    emotion: 'neutral',
    emotionIntensity: 0.5,
    pace: 'normal',
    backgroundMusic: null,
    musicVolume: 0.3,
    voiceEffects: {
      addPauses: true,
      breathingSounds: false,
      emphasis: false,
      whisper: false
    },
    ...initialSettings
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [previewText, setPreviewText] = useState('');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [previewAudioUrl, setPreviewAudioUrl] = useState(null);
  
  const audioRef = useRef(null);
  const previewTimeoutRef = useRef(null);

  // Emotion presets
  const emotions = [
    { id: 'neutral', label: 'Neutral', icon: '😐' },
    { id: 'happy', label: 'Happy', icon: '😊' },
    { id: 'sad', label: 'Sad', icon: '😢' },
    { id: 'excited', label: 'Excited', icon: '🎉' },
    { id: 'calm', label: 'Calm', icon: '😌' },
    { id: 'serious', label: 'Serious', icon: '🧐' },
    { id: 'friendly', label: 'Friendly', icon: '😄' },
    { id: 'professional', label: 'Professional', icon: '💼' }
  ];

  // Background music options
  const backgroundMusicOptions = [
    { id: null, name: 'None', icon: '🔇' },
    { id: 'ambient', name: 'Ambient', icon: '🌊' },
    { id: 'corporate', name: 'Corporate', icon: '🏢' },
    { id: 'upbeat', name: 'Upbeat', icon: '🎵' },
    { id: 'calm', name: 'Calm', icon: '🧘' },
    { id: 'dramatic', name: 'Dramatic', icon: '🎭' },
    { id: 'tech', name: 'Tech', icon: '💻' },
    { id: 'nature', name: 'Nature', icon: '🌲' }
  ];

  // Preset configurations
  const presets = {
    default: 'Default',
    podcast: 'Podcast',
    commercial: 'Commercial',
    audiobook: 'Audiobook',
    presentation: 'Presentation',
    meditation: 'Meditation',
    children: 'Children\'s Content'
  };

  // Update parent component when settings change
  useEffect(() => {
    if (onSettingsChange) {
      onSettingsChange(settings);
    }
  }, [settings, onSettingsChange]);

  // Initialize preview text from script
  useEffect(() => {
    if (scriptText && !previewText) {
      const preview = scriptText.substring(0, 200);
      setPreviewText(preview + (scriptText.length > 200 ? '...' : ''));
    }
  }, [scriptText, previewText]);

  const handleSettingChange = useCallback((key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const handleNestedSettingChange = useCallback((category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  }, []);

  const handleEmotionSelect = useCallback((emotionId) => {
    handleSettingChange('emotion', emotionId);
  }, [handleSettingChange]);

  const handleBackgroundMusicSelect = useCallback((musicId) => {
    handleSettingChange('backgroundMusic', musicId);
  }, [handleSettingChange]);

  const handleVoiceEffectToggle = useCallback((effectKey) => {
    handleNestedSettingChange('voiceEffects', effectKey, !settings.voiceEffects[effectKey]);
  }, [settings.voiceEffects, handleNestedSettingChange]);

  const handlePresetChange = useCallback((presetKey) => {
    const presetSettings = {
      default: {
        speed: 1.0, pitch: 1.0, volume: 1.0, emotion: 'neutral',
        emotionIntensity: 0.5, backgroundMusic: null, musicVolume: 0.3
      },
      podcast: {
        speed: 1.1, pitch: 1.0, volume: 0.9, emotion: 'friendly',
        emotionIntensity: 0.6, backgroundMusic: 'ambient', musicVolume: 0.2
      },
      commercial: {
        speed: 1.2, pitch: 1.1, volume: 1.0, emotion: 'excited',
        emotionIntensity: 0.8, backgroundMusic: 'upbeat', musicVolume: 0.4
      },
      audiobook: {
        speed: 0.9, pitch: 1.0, volume: 0.8, emotion: 'calm',
        emotionIntensity: 0.4, backgroundMusic: null, musicVolume: 0.1
      },
      presentation: {
        speed: 1.0, pitch: 1.0, volume: 0.9, emotion: 'professional',
        emotionIntensity: 0.6, backgroundMusic: 'corporate', musicVolume: 0.2
      },
      meditation: {
        speed: 0.8, pitch: 0.9, volume: 0.7, emotion: 'calm',
        emotionIntensity: 0.3, backgroundMusic: 'nature', musicVolume: 0.3
      },
      children: {
        speed: 1.1, pitch: 1.2, volume: 1.0, emotion: 'happy',
        emotionIntensity: 0.7, backgroundMusic: 'upbeat', musicVolume: 0.3
      }
    };

    if (presetSettings[presetKey]) {
      setSettings(prev => ({
        ...prev,
        ...presetSettings[presetKey]
      }));
    }
  }, []);

  const generatePreview = useCallback(async () => {
    if (!previewText.trim() || !selectedVoice) {
      alert('Please enter preview text and select a voice first.');
      return;
    }

    setIsGeneratingPreview(true);
    
    try {
      // Simulate API call for preview generation
      // In production, this would call the backend API
      const previewData = {
        text: previewText,
        voice: selectedVoice,
        settings: settings
      };

      console.log('Generating preview with:', previewData);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock audio URL (in production, this would come from the API)
      const mockAudioUrl = '/api/preview/audio-sample.mp3';
      setPreviewAudioUrl(mockAudioUrl);

      if (onPreview) {
        onPreview(previewData);
      }
    } catch (error) {
      console.error('Preview generation failed:', error);
      alert('Failed to generate preview. Please try again.');
    } finally {
      setIsGeneratingPreview(false);
    }
  }, [previewText, selectedVoice, settings, onPreview]);

  const handlePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !previewAudioUrl) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, previewAudioUrl]);

  const resetToDefaults = useCallback(() => {
    handlePresetChange('default');
  }, [handlePresetChange]);

  const saveAsPreset = useCallback(() => {
    // TODO: Implement preset saving to localStorage or backend
    const presetName = prompt('Enter a name for this preset:');
    if (presetName) {
      localStorage.setItem(`audio-preset-${presetName}`, JSON.stringify(settings));
      alert(`Preset "${presetName}" saved successfully!`);
    }
  }, [settings]);

  const formatValue = (value, type) => {
    switch (type) {
      case 'speed':
      case 'pitch':
        return `${value.toFixed(1)}x`;
      case 'volume':
      case 'intensity':
        return `${Math.round(value * 100)}%`;
      default:
        return value.toString();
    }
  };

  const formatTime = (time) => {
    if (!time || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="audio-controls">
      <div className="audio-controls-header">
        <h3>🎛️ Audio Controls</h3>
        <div className="preset-selector">
          <label>Preset:</label>
          <select 
            className="preset-select"
            onChange={(e) => handlePresetChange(e.target.value)}
            defaultValue="default"
          >
            {Object.entries(presets).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="controls-grid">
        {/* Voice Parameters */}
        <div className="control-section">
          <div className="section-header">
            <span className="section-icon">🗣️</span>
            <h4 className="section-title">Voice Parameters</h4>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>Speed</span>
              <span className="control-value">{formatValue(settings.speed, 'speed')}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.speed}
              onChange={(e) => handleSettingChange('speed', parseFloat(e.target.value))}
              className="control-slider"
            />
            <div className="slider-ticks">
              <span>0.5x</span>
              <span>1.0x</span>
              <span>2.0x</span>
            </div>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>Pitch</span>
              <span className="control-value">{formatValue(settings.pitch, 'pitch')}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.pitch}
              onChange={(e) => handleSettingChange('pitch', parseFloat(e.target.value))}
              className="control-slider"
            />
            <div className="slider-ticks">
              <span>Low</span>
              <span>Normal</span>
              <span>High</span>
            </div>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>Volume</span>
              <span className="control-value">{formatValue(settings.volume, 'volume')}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={settings.volume}
              onChange={(e) => handleSettingChange('volume', parseFloat(e.target.value))}
              className="control-slider"
            />
          </div>
        </div>

        {/* Emotion Controls */}
        <div className="control-section">
          <div className="section-header">
            <span className="section-icon">😊</span>
            <h4 className="section-title">Emotion & Expression</h4>
          </div>

          <div className="emotion-buttons">
            {emotions.map((emotion) => (
              <button
                key={emotion.id}
                className={`emotion-btn ${settings.emotion === emotion.id ? 'active' : ''}`}
                onClick={() => handleEmotionSelect(emotion.id)}
              >
                <span className="emotion-icon">{emotion.icon}</span>
                <span>{emotion.label}</span>
              </button>
            ))}
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>Intensity</span>
              <span className="control-value">{formatValue(settings.emotionIntensity, 'intensity')}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={settings.emotionIntensity}
              onChange={(e) => handleSettingChange('emotionIntensity', parseFloat(e.target.value))}
              className="control-slider"
            />
            <div className="slider-ticks">
              <span>Subtle</span>
              <span>Moderate</span>
              <span>Strong</span>
            </div>
          </div>
        </div>

        {/* Background Music */}
        <div className="control-section">
          <div className="section-header">
            <span className="section-icon">🎵</span>
            <h4 className="section-title">Background Music</h4>
          </div>

          <div className="music-selector">
            <div className="music-options">
              {backgroundMusicOptions.map((music) => (
                <div
                  key={music.id || 'none'}
                  className={`music-option ${settings.backgroundMusic === music.id ? 'selected' : ''}`}
                  onClick={() => handleBackgroundMusicSelect(music.id)}
                >
                  <span className="music-icon">{music.icon}</span>
                  <span className="music-name">{music.name}</span>
                </div>
              ))}
            </div>

            {settings.backgroundMusic && (
              <div className="music-volume-control">
                <div className="control-group">
                  <div className="control-label">
                    <span>Music Volume</span>
                    <span className="control-value">{formatValue(settings.musicVolume, 'volume')}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.1"
                    value={settings.musicVolume}
                    onChange={(e) => handleSettingChange('musicVolume', parseFloat(e.target.value))}
                    className="control-slider"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Voice Effects */}
        <div className="control-section">
          <div className="section-header">
            <span className="section-icon">✨</span>
            <h4 className="section-title">Voice Effects</h4>
          </div>

          <div className="voice-effects">
            {Object.entries(settings.voiceEffects).map(([key, value]) => (
              <label
                key={key}
                className={`effect-toggle ${value ? 'active' : ''}`}
                onClick={() => handleVoiceEffectToggle(key)}
              >
                <span className="effect-checkbox">
                  {value ? '✓' : ''}
                </span>
                <span>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Preview */}
      <div className="preview-section">
        <div className="preview-header">
          <h4 className="preview-title">
            🎧 Real-time Preview
          </h4>
          <div className="preview-controls">
            <button
              className="preview-btn"
              onClick={() => setPreviewText(scriptText.substring(0, 200))}
              disabled={!scriptText}
            >
              📝 Use Script
            </button>
            <button
              className={`preview-btn primary`}
              onClick={generatePreview}
              disabled={!previewText.trim() || !selectedVoice || isGeneratingPreview}
            >
              {isGeneratingPreview ? '⏳ Generating...' : '🎤 Generate Preview'}
            </button>
          </div>
        </div>

        <textarea
          className="preview-text"
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          placeholder="Enter text to preview with current settings..."
          rows={3}
        />

        {isGeneratingPreview && (
          <div className="preview-status">
            <span className="status-icon">⏳</span>
            <span>Generating preview with current settings...</span>
          </div>
        )}

        {previewAudioUrl && (
          <div className="preview-player">
            <audio
              ref={audioRef}
              src={previewAudioUrl}
              onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
              onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
              onEnded={() => setIsPlaying(false)}
            />
            
            <div className="player-controls">
              <button
                className="play-pause-btn"
                onClick={handlePlayPause}
                disabled={!previewAudioUrl}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <div className="time-display">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="controls-actions">
        <div className="actions-left">
          <button className="btn-reset" onClick={resetToDefaults}>
            🔄 Reset to Defaults
          </button>
        </div>
        <div className="actions-right">
          <button className="btn-save-preset" onClick={saveAsPreset}>
            💾 Save as Preset
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioControls;
