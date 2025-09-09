import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import ScriptUpload from '../../components/ScriptUpload/ScriptUpload';
import { VoiceSelection } from '../../components/VoiceSelection';
import AudioControls from '../../components/AudioControls';
import AudioGeneration from '../../components/AudioGeneration';
import './CreateAudio.css';

// PUBLIC_INTERFACE
/**
 * Create Audio page for script upload, voice selection, and audio generation
 * Uses global context for state management
 */
const CreateAudio = () => {
  const { currentScript, selectedVoice, audioSettings, actions } = useApp();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState('script');

  const handleScriptChange = (scriptText) => {
    actions.setCurrentScript(scriptText);
  };

  const handleVoiceSelect = (voice) => {
    actions.setSelectedVoice(voice);
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
    actions.updateAudioSettings(newSettings);
  };

  // Utility function for script statistics
  const getScriptStats = () => {
    if (!currentScript) return { words: 0, estimatedDuration: 0, characters: 0 };
    
    const words = currentScript.trim().split(/\s+/).length;
    const characters = currentScript.length;
    const estimatedDuration = Math.ceil(words / 150); // Estimate 150 words per minute
    
    return { words, characters, estimatedDuration };
  };

  const handlePreviewGeneration = (previewData) => {
    console.log('Preview generated:', previewData);
    actions.addNotification({
      type: 'success',
      title: 'Preview Generated',
      message: 'Audio preview is ready to play'
    });
  };

  const handleGenerationComplete = (generation) => {
    console.log('Generation completed:', generation);
    
    // Update usage statistics
    const creditsUsed = Math.ceil(currentScript.split(/\s+/).length / 10); // Example: 1 credit per 10 words
    const audioMinutes = Math.ceil(currentScript.split(/\s+/).length / 150); // Estimate duration
    
    // Note: Usage tracking would be handled by the backend in a real implementation
    
    // Add project to the list - would be handled by backend in real implementation
    const newProject = {
      id: generation.id || `project_${Date.now()}`,
      title: `Audio Project - ${new Date().toLocaleDateString()}`,
      script: currentScript,
      voice: selectedVoice,
      settings: audioSettings,
      status: 'completed',
      createdAt: new Date().toISOString(),
      audioUrl: generation.audioUrl,
      duration: audioMinutes,
      creditsUsed
    };
    
    actions.addNotification({
      type: 'success',
      title: 'Audio Generated!',
      message: `Your audio project has been completed successfully. Used ${creditsUsed} credits.`
    });
  };

  const handleGenerateAudio = () => {
    // Check if user has enough credits
    const requiredCredits = Math.ceil(currentScript.split(/\s+/).length / 10);
    
    if (!user?.subscription?.usage) {
      actions.addNotification({
        type: 'error',
        title: 'Insufficient Credits',
        message: `You need ${requiredCredits} credits but don't have enough remaining.`
      });
      return;
    }
    
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
                    <span>Words: {getScriptStats().words}</span>
                    <span>Est. Duration: {getScriptStats().estimatedDuration} min</span>
                    <span>Characters: {getScriptStats().characters}</span>
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
                    <span>Words: {getScriptStats().words}</span>
                    <span>Est. Duration: {getScriptStats().estimatedDuration} minutes</span>
                    <span>Credits Required: {Math.ceil(getScriptStats().words / 10)}</span>
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
