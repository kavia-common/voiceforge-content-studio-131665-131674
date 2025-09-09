import React from 'react';
import './VoiceCard.css';

// PUBLIC_INTERFACE
/**
 * Voice Card component for displaying individual voice information
 * Supports grid and list view modes with preview and favorite functionality
 */
const VoiceCard = ({
  voice,
  isSelected,
  isFavorite,
  onSelect,
  onPreview,
  onToggleFavorite,
  viewMode = 'grid'
}) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(voice);
    }
  };

  const handlePreview = (e) => {
    e.stopPropagation();
    if (onPreview) {
      onPreview(voice);
    }
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(voice.id);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        ⭐
      </span>
    ));
  };

  const formatAccent = (accent) => {
    return accent.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div 
      className={`voice-card ${viewMode} ${isSelected ? 'selected' : ''}`}
      onClick={handleSelect}
    >
      <div className="voice-card-header">
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
            <h3 className="voice-name">{voice.name}</h3>
            <div className="voice-meta">
              <span className="voice-gender">{voice.gender}</span>
              <span className="voice-accent">{formatAccent(voice.accent)}</span>
              <span className="voice-age">{voice.age}</span>
            </div>
          </div>
        </div>
        <div className="voice-actions">
          <button
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleToggleFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
          {voice.isPremium && (
            <div className="premium-badge" title="Premium Voice">
              👑
            </div>
          )}
        </div>
      </div>

      <div className="voice-card-body">
        <p className="voice-description">{voice.description}</p>
        
        <div className="voice-tags">
          {voice.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="voice-tag">
              {tag}
            </span>
          ))}
          {voice.tags.length > 3 && (
            <span className="voice-tag more">
              +{voice.tags.length - 3}
            </span>
          )}
        </div>

        <div className="voice-stats">
          <div className="voice-rating">
            <div className="stars">
              {renderStars(voice.rating)}
            </div>
            <span className="rating-text">({voice.rating}/5)</span>
          </div>
          <div className="voice-language">
            <span className="language-icon">🌐</span>
            <span>{voice.language}</span>
          </div>
        </div>
      </div>

      <div className="voice-card-footer">
        <button 
          className="preview-btn"
          onClick={handlePreview}
          title="Preview voice"
        >
          <span className="preview-icon">▶️</span>
          Preview ({voice.duration}s)
        </button>
        <button 
          className={`select-btn ${isSelected ? 'selected' : ''}`}
          onClick={handleSelect}
        >
          {isSelected ? '✓ Selected' : 'Select Voice'}
        </button>
      </div>
    </div>
  );
};

export default VoiceCard;
