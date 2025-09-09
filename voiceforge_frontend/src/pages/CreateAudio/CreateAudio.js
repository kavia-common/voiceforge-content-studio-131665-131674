import React, { useState } from 'react';
import ScriptUpload from '../../components/ScriptUpload/ScriptUpload';
import { VoiceSelection } from '../../components/VoiceSelection';
import AudioControls from '../../components/AudioControls';
import AudioGeneration from '../../components/AudioGeneration';
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
    }
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

  const handleAudioSettingsChange = (newSettings) => {
    setAudioSettings(newSettings);
  };

  const handlePreviewGeneration = (previewData) => {
    console.log('Preview generated:', previewData);
  };

  const handleGenerationComplete = (generation) => {
    console.log('Generation completed:', generation);
    alert(`Audio generation completed! File: ${generation.id}`);
  };

  const handleGenerateAudio = () => {
    // This will be handled by the AudioGeneration component
    setCurrentStep('generate');
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
              <p>Fine-tune your audio settings and generate professional content</p>
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
            </div>

            {/* Advanced Audio Controls */}
            <AudioControls
              onSettingsChange={handleAudioSettingsChange}
              initialSettings={audioSettings}
              selectedVoice={selectedVoice}
              scriptText={currentScript}
              onPreview={handlePreviewGeneration}
            />

            {/* Audio Generation Component */}
            <AudioGeneration
              onGenerationComplete={handleGenerationComplete}
              selectedVoice={selectedVoice}
              audioSettings={audioSettings}
              scriptText={currentScript}
            />

            <div className="step-actions">
              <div className="action-buttons">
                <button 
                  className="btn-secondary"
                  onClick={handlePreviousStep}
                >
                  ← Back to Voice Selection
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
