import React, { useState } from 'react';
import ScriptUpload from '../../components/ScriptUpload/ScriptUpload';
import './CreateAudio.css';

// PUBLIC_INTERFACE
/**
 * Create Audio page for script upload, voice selection, and audio generation
 */
const CreateAudio = () => {
  const [currentScript, setCurrentScript] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleScriptChange = (scriptText) => {
    setCurrentScript(scriptText);
  };

  const handleFileUpload = (file) => {
    setUploadedFile(file);
  };

  return (
    <div className="create-audio">
      <div className="create-audio-header">
        <h1>Create Audio</h1>
        <p>Upload your script and generate professional-quality audio content</p>
      </div>
      
      <div className="create-audio-content">
        <ScriptUpload 
          onScriptChange={handleScriptChange}
          onFileUpload={handleFileUpload}
        />
        
        {currentScript && (
          <div className="next-steps">
            <h3>Next Steps</h3>
            <p>Script ready! Continue to voice selection and audio generation.</p>
            <div className="action-buttons">
              <button className="btn-primary">
                🗣️ Select Voice
              </button>
              <button className="btn-secondary">
                🎵 Add Background Music
              </button>
              <button className="btn-accent">
                🎙️ Generate Audio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateAudio;
