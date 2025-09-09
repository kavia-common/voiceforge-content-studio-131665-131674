import React, { useState, useRef, useEffect } from 'react';
import './VoicePreview.css';

// PUBLIC_INTERFACE
/**
 * Voice Preview modal component for playing voice samples and detailed voice information
 */
const VoicePreview = ({ voice, onClose, onSelect, isFavorite, onToggleFavorite }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const formatTime = (time) => {
    if (!time || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatAccent = (accent) => {
    return accent.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        ⭐
      </span>
    ));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="voice-preview-overlay" onClick={handleBackdropClick}>
      <div className="voice-preview-modal">
        <div className="voice-preview-header">
          <div className="voice-info">
            <div className="voice-avatar">
              <span className="avatar-icon">
                {voice.gender === 'male' ? '👨' : '👩'}
              </span>
              {voice.isCloned && (
                <div className="cloned-badge" title="Custom Cloned Voice">
                  🧬
                </div>
              )}
            </div>
            <div className="voice-details">
              <h2 className="voice-name">{voice.name}</h2>
              <div className="voice-meta">
                <span className="voice-gender">{voice.gender}</span>
                <span className="voice-accent">{formatAccent(voice.accent)}</span>
                <span className="voice-age">{voice.age}</span>
                <span className="voice-language">{voice.language}</span>
              </div>
            </div>
          </div>
          <div className="voice-actions">
            <button
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={() => onToggleFavorite(voice.id)}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
            {voice.isPremium && (
              <div className="premium-badge" title="Premium Voice">
                👑
              </div>
            )}
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="voice-preview-body">
          <div className="voice-description">
            <p>{voice.description}</p>
          </div>

          <div className="voice-stats-detailed">
            <div className="stat-item">
              <span className="stat-label">Rating:</span>
              <div className="rating-display">
                <div className="stars">
                  {renderStars(voice.rating)}
                </div>
                <span className="rating-text">({voice.rating}/5)</span>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-label">Category:</span>
              <span className="stat-value">{voice.category}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Popularity:</span>
              <span className="stat-value">{voice.popularity.toLocaleString()} uses</span>
            </div>
          </div>

          <div className="voice-tags-detailed">
            {voice.tags.map((tag, index) => (
              <span key={index} className="voice-tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="audio-player">
            <audio
              ref={audioRef}
              src={voice.sampleUrl}
              preload="metadata"
            />
            
            <div className="player-controls">
              <button
                className="play-pause-btn"
                onClick={handlePlayPause}
                disabled={!duration}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              
              <div className="progress-container">
                <div 
                  className="progress-bar"
                  onClick={handleSeek}
                >
                  <div 
                    className="progress-fill"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  ></div>
                  <div 
                    className="progress-handle"
                    style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  ></div>
                </div>
                <div className="time-display">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>

            <div className="audio-controls">
              <div className="volume-control">
                <span className="volume-icon">🔊</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>
              
              <div className="speed-control">
                <span className="speed-label">Speed:</span>
                <div className="speed-buttons">
                  {[0.5, 0.75, 1, 1.25, 1.5].map(rate => (
                    <button
                      key={rate}
                      className={`speed-btn ${playbackRate === rate ? 'active' : ''}`}
                      onClick={() => handlePlaybackRateChange(rate)}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="voice-preview-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button 
            className="btn-primary"
            onClick={() => onSelect(voice)}
          >
            Select This Voice
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoicePreview;
