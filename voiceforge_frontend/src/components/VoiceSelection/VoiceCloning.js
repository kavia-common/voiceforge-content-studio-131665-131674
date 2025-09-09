import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './VoiceCloning.css';

// PUBLIC_INTERFACE
/**
 * Voice Cloning component for managing custom voice creation workflow
 * Supports file upload, recording, feedback collection, and cloning status tracking
 */
const VoiceCloning = ({ onVoiceCloned, existingClones = [] }) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'record', 'manage'
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceName, setVoiceName] = useState('');
  const [voiceDescription, setVoiceDescription] = useState('');
  const [cloningStatus, setCloningStatus] = useState(null);
  const [cloningProgress, setCloningProgress] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);

  // File validation for voice cloning
  const validateAudioFile = useCallback((file) => {
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/m4a'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedTypes.includes(file.type)) {
      return 'Please upload WAV, MP3, or M4A audio files only.';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 50MB.';
    }

    return null;
  }, []);

  // Handle file uploads for voice cloning
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      alert('Some files were rejected. Please check file types and sizes.');
      return;
    }

    const validFiles = acceptedFiles.filter(file => {
      const error = validateAudioFile(file);
      if (error) {
        alert(error);
        return false;
      }
      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      duration: null, // Will be calculated
      status: 'ready'
    }))]);
  }, [validateAudioFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.wav', '.mp3', '.m4a']
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024
  });

  // Recording functionality
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio({
          blob: audioBlob,
          url: audioUrl,
          duration: recordingTime
        });
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
    }
  };

  const deleteRecording = () => {
    if (recordedAudio) {
      URL.revokeObjectURL(recordedAudio.url);
      setRecordedAudio(null);
      setRecordingTime(0);
    }
  };

  // Remove uploaded file
  const removeUploadedFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Start voice cloning process
  const startCloning = async () => {
    if (!voiceName.trim()) {
      alert('Please enter a name for your voice clone.');
      return;
    }

    if (uploadedFiles.length === 0 && !recordedAudio) {
      alert('Please upload audio files or record audio samples.');
      return;
    }

    setCloningStatus('processing');
    setCloningProgress(0);

    // Simulate cloning process with progress updates
    const progressInterval = setInterval(() => {
      setCloningProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setCloningStatus('completed');
          
          // Create a new cloned voice
          const newClone = {
            id: `clone_${Date.now()}`,
            name: voiceName,
            description: voiceDescription || `Custom cloned voice: ${voiceName}`,
            status: 'ready',
            createdAt: new Date(),
            audioSamples: uploadedFiles.length + (recordedAudio ? 1 : 0),
            quality: 'high' // Simulated quality assessment
          };

          if (onVoiceCloned) {
            onVoiceCloned(newClone);
          }

          // Reset form
          setVoiceName('');
          setVoiceDescription('');
          setUploadedFiles([]);
          setRecordedAudio(null);
          
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 500);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="voice-cloning">
      <div className="voice-cloning-header">
        <h2>Voice Cloning Studio</h2>
        <p>Create custom AI voices from your audio samples</p>
      </div>

      <div className="cloning-tabs">
        <button
          className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📁 Upload Samples
        </button>
        <button
          className={`tab ${activeTab === 'record' ? 'active' : ''}`}
          onClick={() => setActiveTab('record')}
        >
          🎙️ Record Audio
        </button>
        <button
          className={`tab ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          🧬 Manage Clones
        </button>
      </div>

      <div className="cloning-content">
        {activeTab === 'upload' && (
          <div className="upload-tab">
            <div className="upload-instructions">
              <h3>Upload Audio Samples</h3>
              <p>Upload high-quality audio files (WAV, MP3, M4A) for voice cloning. 
                 For best results, provide 5-10 minutes of clear, diverse speech samples.</p>
            </div>

            <div {...getRootProps()} className={`upload-dropzone ${isDragActive ? 'active' : ''}`}>
              <input {...getInputProps()} />
              <div className="dropzone-content">
                <div className="upload-icon">🎵</div>
                {isDragActive ? (
                  <p>Drop audio files here...</p>
                ) : (
                  <>
                    <p>Drag & drop audio files here, or click to browse</p>
                    <p className="file-types">Supports: WAV, MP3, M4A (max 50MB each)</p>
                  </>
                )}
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="uploaded-files">
                <h4>Uploaded Files ({uploadedFiles.length})</h4>
                {uploadedFiles.map((fileInfo) => (
                  <div key={fileInfo.id} className="uploaded-file">
                    <div className="file-info">
                      <span className="file-icon">🎵</span>
                      <div className="file-details">
                        <span className="file-name">{fileInfo.name}</span>
                        <span className="file-size">{formatFileSize(fileInfo.size)}</span>
                      </div>
                    </div>
                    <button 
                      className="remove-file-btn"
                      onClick={() => removeUploadedFile(fileInfo.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'record' && (
          <div className="record-tab">
            <div className="recording-instructions">
              <h3>Record Audio Samples</h3>
              <p>Record clear speech samples directly in your browser. 
                 Try to speak naturally and include varied expressions.</p>
            </div>

            <div className="recording-studio">
              <div className="recording-controls">
                {!isRecording ? (
                  <button 
                    className="record-btn start"
                    onClick={startRecording}
                  >
                    🎙️ Start Recording
                  </button>
                ) : (
                  <button 
                    className="record-btn stop"
                    onClick={stopRecording}
                  >
                    ⏹️ Stop Recording
                  </button>
                )}
                
                <div className="recording-time">
                  {isRecording && <span className="recording-indicator">🔴</span>}
                  <span className="time-display">{formatTime(recordingTime)}</span>
                </div>
              </div>

              {recordedAudio && (
                <div className="recorded-audio">
                  <h4>Recorded Sample</h4>
                  <div className="audio-preview">
                    <audio controls src={recordedAudio.url}></audio>
                    <div className="audio-info">
                      <span>Duration: {formatTime(recordedAudio.duration)}</span>
                      <button 
                        className="delete-recording-btn"
                        onClick={deleteRecording}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="manage-tab">
            <div className="existing-clones">
              <h3>Your Voice Clones</h3>
              {existingClones.length === 0 ? (
                <div className="no-clones">
                  <div className="no-clones-icon">🧬</div>
                  <p>No voice clones created yet</p>
                  <p>Switch to Upload or Record tabs to create your first clone</p>
                </div>
              ) : (
                <div className="clones-grid">
                  {existingClones.map((clone) => (
                    <div key={clone.id} className="clone-card">
                      <div className="clone-header">
                        <h4>{clone.name}</h4>
                        <span className={`status ${clone.status}`}>
                          {clone.status === 'ready' ? '✅' : '⏳'} {clone.status}
                        </span>
                      </div>
                      <p className="clone-description">{clone.description}</p>
                      <div className="clone-stats">
                        <span>Samples: {clone.audioSamples}</span>
                        <span>Quality: {clone.quality}</span>
                      </div>
                      <div className="clone-actions">
                        <button className="btn-preview">Preview</button>
                        <button className="btn-use">Use Voice</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {(activeTab === 'upload' || activeTab === 'record') && (
        <div className="cloning-form">
          <div className="voice-details">
            <h3>Voice Details</h3>
            <div className="form-group">
              <label htmlFor="voiceName">Voice Name *</label>
              <input
                type="text"
                id="voiceName"
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                placeholder="Enter a name for your voice clone"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="voiceDescription">Description (Optional)</label>
              <textarea
                id="voiceDescription"
                value={voiceDescription}
                onChange={(e) => setVoiceDescription(e.target.value)}
                placeholder="Describe the voice characteristics or intended use"
                className="form-textarea"
                rows={3}
              />
            </div>
          </div>

          {cloningStatus && (
            <div className="cloning-status">
              {cloningStatus === 'processing' && (
                <div className="processing-status">
                  <h4>Creating Voice Clone...</h4>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${cloningProgress}%` }}
                    ></div>
                  </div>
                  <p>{Math.round(cloningProgress)}% complete</p>
                </div>
              )}
              
              {cloningStatus === 'completed' && (
                <div className="completed-status">
                  <h4>✅ Voice Clone Created Successfully!</h4>
                  <p>Your custom voice is ready to use in audio generation.</p>
                </div>
              )}
            </div>
          )}

          <div className="cloning-actions">
            <button 
              className="btn-clone"
              onClick={startCloning}
              disabled={cloningStatus === 'processing' || (!voiceName.trim())}
            >
              {cloningStatus === 'processing' ? 'Creating Clone...' : '🧬 Create Voice Clone'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceCloning;
