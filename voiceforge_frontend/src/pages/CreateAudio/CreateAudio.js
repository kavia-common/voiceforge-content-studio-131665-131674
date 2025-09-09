import React, { useState } from 'react';
import ScriptUpload from '../../components/ScriptUpload/ScriptUpload';
import { VoiceSelection } from '../../components/VoiceSelection';
import './CreateAudio.css';

// PUBLIC_INTERFACE
/**
 * Create Audio page for script upload, voice selection, and audio generation
 */
const CreateAudio = () => {
  const [currentScript, setCurrentScript] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [currentStep, setCurrentStep] = useState('script'); // 'script', 'voice', 'generate'
  const [audioSettings, setAudioSettings] = useState({
    speed: 1,
    pitch: 1,
    volume: 1,
    addPauses: true,
    backgroundMusic: null
  });

  const handleScriptChange = (scriptText) => {
    setCurrentScript(scriptText);
  };

  const handleVoiceSelect = (voice) => {
    setSelectedVoice(voice);
  };

  const handleNextStep = (step) => {
    setCurrentStep(step);
  };

  const handlePreviousStep = () => {
    if (currentStep === 'voice') {
      setCurrentStep('script');
    } else if (currentStep === 'generate') {
      setCurrentStep('voice');
    }
  };

  const handleGenerateAudio = () => {
    // TODO: Integrate with backend API for audio generation
    console.log('Generating audio with:', {
      script: currentScript,
      voice: selectedVoice,
      settings: audioSettings
    });
    alert('Audio generation started! (This would integrate with the backend API)');
  };

  const steps = [
    { id: 'script', label: 'Script', icon: '📝' },
    { id: 'voice', label: 'Voice', icon: '🗣️' },
    { id: 'generate', label: 'Generate', icon: '🎙️' }
  ];

  return (
    <div className="create-audio">
      <div className="create-audio-header">
        <h1>Create Audio</h1>
        <p>Upload your script and generate professional-quality audio content</p>
        
        <div className="progress-steps">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`step ${currentStep === step.id ? 'active' : ''} ${
                steps.findIndex(s => s.id === currentStep) > index ? 'completed' : ''
              }`}
            >
              <div className="step-icon">{step.icon}</div>
              <span className="step-label">{step.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="create-audio-content">
        {currentStep === 'script' && (
          <>
            <ScriptUpload 
              onScriptChange={handleScriptChange}
            />
            
            {currentScript && (
              <div className="step-actions">
                <div className="step-summary">
                  <h3>Script Ready!</h3>
                  <p>Your script is loaded and ready. Continue to select a voice.</p>
                  <div className="script-stats">
                    <span>Words: {currentScript.split(/\s+/).filter(word => word.length > 0).length}</span>
                    <span>Est. Duration: {Math.ceil(currentScript.split(/\s+/).length / 150)} min</span>
                  </div>
                </div>
                <div className="action-buttons">
                  <button 
                    className="btn-primary"
                    onClick={() => handleNextStep('voice')}
                  >
                    Continue to Voice Selection 🗣️
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {currentStep === 'voice' && (
          <div className="voice-selection-step">
            <div className="step-header">
              <h2>Select Your Voice</h2>
              <p>Choose from 200+ AI voices to bring your script to life</p>
            </div>
            
            <VoiceSelection
              onVoiceSelect={handleVoiceSelect}
              selectedVoice={selectedVoice}
              showFavoritesOnly={false}
            />
            
            {selectedVoice && (
              <div className="step-actions">
                <div className="step-summary">
                  <h3>Voice Selected!</h3>
                  <p>You've selected <strong>{selectedVoice.name}</strong> - {selectedVoice.description}</p>
                </div>
                <div className="action-buttons">
                  <button 
                    className="btn-secondary"
                    onClick={handlePreviousStep}
                  >
                    ← Back to Script
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => handleNextStep('generate')}
                  >
                    Continue to Generate 🎙️
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 'generate' && (
          <div className="generate-step">
            <div className="step-header">
              <h2>Generate Audio</h2>
              <p>Review your settings and generate your audio content</p>
            </div>
            
            <div className="generation-summary">
              <div className="summary-section">
                <h3>Script Summary</h3>
                <div className="summary-card">
                  <div className="summary-details">
                    <span>Words: {currentScript.split(/\s+/).filter(word => word.length > 0).length}</span>
                    <span>Est. Duration: {Math.ceil(currentScript.split(/\s+/).length / 150)} minutes</span>
                  </div>
                  <div className="summary-preview">
                    {currentScript.substring(0, 150)}
                    {currentScript.length > 150 && '...'}
                  </div>
                </div>
              </div>

              <div className="summary-section">
                <h3>Selected Voice</h3>
                <div className="summary-card voice-summary">
                  <div className="voice-avatar">
                    {selectedVoice?.gender === 'male' ? '👨' : '👩'}
                  </div>
                  <div className="voice-details">
                    <div className="voice-name">{selectedVoice?.name}</div>
                    <div className="voice-meta">
                      {selectedVoice?.gender} • {selectedVoice?.accent} • {selectedVoice?.age}
                    </div>
                  </div>
                </div>
              </div>

              <div className="summary-section">
                <h3>Audio Settings</h3>
                <div className="audio-controls">
                  <div className="control-group">
                    <label>Speed</label>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2" 
                      step="0.1"
                      value={audioSettings.speed}
                      onChange={(e) => setAudioSettings(prev => ({...prev, speed: parseFloat(e.target.value)}))}
                    />
                    <span>{audioSettings.speed}x</span>
                  </div>
                  <div className="control-group">
                    <label>Pitch</label>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2" 
                      step="0.1"
                      value={audioSettings.pitch}
                      onChange={(e) => setAudioSettings(prev => ({...prev, pitch: parseFloat(e.target.value)}))}
                    />
                    <span>{audioSettings.pitch}x</span>
                  </div>
                  <div className="control-group">
                    <label>Volume</label>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1" 
                      step="0.1"
                      value={audioSettings.volume}
                      onChange={(e) => setAudioSettings(prev => ({...prev, volume: parseFloat(e.target.value)}))}
                    />
                    <span>{Math.round(audioSettings.volume * 100)}%</span>
                  </div>
                  <div className="control-group checkbox">
                    <label>
                      <input 
                        type="checkbox"
                        checked={audioSettings.addPauses}
                        onChange={(e) => setAudioSettings(prev => ({...prev, addPauses: e.target.checked}))}
                      />
                      Add natural pauses
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="step-actions">
              <div className="action-buttons">
                <button 
                  className="btn-secondary"
                  onClick={handlePreviousStep}
                >
                  ← Back to Voice Selection
                </button>
                <button 
                  className="btn-primary generate-btn"
                  onClick={handleGenerateAudio}
                >
                  🎙️ Generate Audio
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateAudio;
