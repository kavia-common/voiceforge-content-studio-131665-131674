import React, { useState, useCallback } from 'react';
import { VoiceSelection, VoiceCloning } from '../../components/VoiceSelection';
import './VoiceLibrary.css';

// PUBLIC_INTERFACE
/**
 * Voice Library page for browsing and selecting from 200+ available voices
 * Includes advanced voice selection, favorites management, and voice cloning functionality
 */
const VoiceLibrary = () => {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse', 'favorites', 'cloning'
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [clonedVoices, setClonedVoices] = useState([]);

  const handleVoiceSelect = useCallback((voice) => {
    setSelectedVoice(voice);
    // TODO: Integrate with backend API to save selected voice
    console.log('Voice selected:', voice);
  }, []);

  const handleVoiceCloned = useCallback((newClone) => {
    setClonedVoices(prev => [...prev, newClone]);
    // TODO: Integrate with backend API to save cloned voice
    console.log('Voice cloned:', newClone);
  }, []);

  const tabs = [
    {
      id: 'browse',
      label: 'Browse Voices',
      icon: '🗣️',
      description: 'Explore 200+ AI voices'
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: '❤️',
      description: 'Your saved voices'
    },
    {
      id: 'cloning',
      label: 'Voice Cloning',
      icon: '🧬',
      description: 'Create custom voices'
    }
  ];

  return (
    <div className="voice-library">
      <div className="voice-library-header">
        <div className="header-content">
          <h1>Voice Library</h1>
          <p>Discover and create the perfect voice for your content</p>
        </div>
        
        {selectedVoice && (
          <div className="selected-voice-indicator">
            <div className="selected-voice-info">
              <span className="selected-label">Selected Voice:</span>
              <span className="selected-name">{selectedVoice.name}</span>
              <span className="selected-meta">
                {selectedVoice.gender} • {selectedVoice.accent}
              </span>
            </div>
            <button 
              className="clear-selection-btn"
              onClick={() => setSelectedVoice(null)}
              title="Clear selection"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="voice-library-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`library-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <div className="tab-content">
              <span className="tab-label">{tab.label}</span>
              <span className="tab-description">{tab.description}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="voice-library-content">
        {activeTab === 'browse' && (
          <VoiceSelection
            onVoiceSelect={handleVoiceSelect}
            selectedVoice={selectedVoice}
            showFavoritesOnly={false}
          />
        )}

        {activeTab === 'favorites' && (
          <VoiceSelection
            onVoiceSelect={handleVoiceSelect}
            selectedVoice={selectedVoice}
            showFavoritesOnly={true}
          />
        )}

        {activeTab === 'cloning' && (
          <VoiceCloning
            onVoiceCloned={handleVoiceCloned}
            existingClones={clonedVoices}
          />
        )}
      </div>

      {selectedVoice && (
        <div className="voice-library-footer">
          <div className="footer-content">
            <div className="selection-summary">
              <span className="summary-text">
                Ready to use <strong>{selectedVoice.name}</strong> for audio generation
              </span>
            </div>
            <div className="footer-actions">
              <button 
                className="btn-secondary"
                onClick={() => setSelectedVoice(null)}
              >
                Change Voice
              </button>
              <button 
                className="btn-primary"
                onClick={() => {
                  // TODO: Navigate to Create Audio page with selected voice
                  console.log('Proceeding with voice:', selectedVoice);
                }}
              >
                Continue to Create Audio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceLibrary;
