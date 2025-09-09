import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './AudioGeneration.css';

// PUBLIC_INTERFACE
/**
 * Advanced Audio Generation component for single and batch audio processing,
 * generation history management, and download functionality
 */
const AudioGeneration = ({ 
  onGenerationComplete,
  selectedVoice,
  audioSettings,
  scriptText 
}) => {
  const [activeTab, setActiveTab] = useState('single'); // 'single', 'batch', 'history'
  const [generationMode, setGenerationMode] = useState('single');
  const [outputFormat, setOutputFormat] = useState('mp3');
  const [outputQuality, setOutputQuality] = useState('high');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // Batch processing state
  const [batchFiles, setBatchFiles] = useState([]);
  const [batchSettings, setBatchSettings] = useState({
    voiceAssignment: 'same', // 'same', 'random', 'custom'
    outputNaming: 'original', // 'original', 'sequential', 'custom'
    processingOrder: 'sequential' // 'sequential', 'parallel'
  });
  const [batchProgress, setBatchProgress] = useState({
    total: 0,
    completed: 0,
    processing: 0,
    failed: 0
  });

  // Generation history
  const [generationHistory, setGenerationHistory] = useState([]);
  const [historyFilter, setHistoryFilter] = useState('all');

  const fileInputRef = useRef(null);

  // Load generation history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('voiceforge-generation-history');
    if (savedHistory) {
      setGenerationHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save generation history to localStorage
  const saveHistoryToStorage = useCallback((history) => {
    localStorage.setItem('voiceforge-generation-history', JSON.stringify(history));
  }, []);

  // File validation for batch upload
  const validateBatchFile = useCallback((file) => {
    const allowedTypes = ['text/plain', 'application/json', 'text/csv'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.txt')) {
      return 'Please upload text files (.txt, .json, .csv) only.';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 10MB.';
    }

    return null;
  }, []);

  // Handle batch file upload
  const onBatchDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      alert('Some files were rejected. Please check file types and sizes.');
      return;
    }

    const validFiles = acceptedFiles.filter(file => {
      const error = validateBatchFile(file);
      if (error) {
        alert(error);
        return false;
      }
      return true;
    });

    const newFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      status: 'pending',
      progress: 0,
      voice: selectedVoice,
      settings: { ...audioSettings },
      createdAt: new Date()
    }));

    setBatchFiles(prev => [...prev, ...newFiles]);
  }, [validateBatchFile, selectedVoice, audioSettings]);

  const { getRootProps: getBatchRootProps, getInputProps: getBatchInputProps } = useDropzone({
    onDrop: onBatchDrop,
    accept: {
      'text/*': ['.txt', '.json', '.csv']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024
  });

  // Single audio generation
  const generateSingleAudio = useCallback(async () => {
    if (!scriptText.trim() || !selectedVoice) {
      alert('Please provide script text and select a voice.');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate generation process
      const generationData = {
        id: `gen_${Date.now()}`,
        type: 'single',
        script: scriptText,
        voice: selectedVoice,
        settings: audioSettings,
        format: outputFormat,
        quality: outputQuality,
        status: 'processing',
        progress: 0,
        createdAt: new Date(),
        estimatedTime: Math.ceil(scriptText.split(/\s+/).length / 100) // rough estimate
      };

      console.log('Starting single generation:', generationData);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            
            // Add to history
            const completedGeneration = {
              ...generationData,
              status: 'completed',
              progress: 100,
              completedAt: new Date(),
              downloadUrl: '/api/generations/audio-output.mp3',
              fileSize: '2.3 MB',
              duration: '00:03:45'
            };

            setGenerationHistory(prev => {
              const newHistory = [completedGeneration, ...prev];
              saveHistoryToStorage(newHistory);
              return newHistory;
            });

            setIsGenerating(false);
            
            if (onGenerationComplete) {
              onGenerationComplete(completedGeneration);
            }

            alert('Audio generation completed successfully!');
            return 100;
          }
          return newProgress;
        });
      }, 300);

    } catch (error) {
      console.error('Generation failed:', error);
      setIsGenerating(false);
      setGenerationProgress(0);
      alert('Generation failed. Please try again.');
    }
  }, [scriptText, selectedVoice, audioSettings, outputFormat, outputQuality, onGenerationComplete, saveHistoryToStorage]);

  // Batch audio generation
  const generateBatchAudio = useCallback(async () => {
    if (batchFiles.length === 0) {
      alert('Please upload files for batch processing.');
      return;
    }

    setIsGenerating(true);
    setBatchProgress({ total: batchFiles.length, completed: 0, processing: 0, failed: 0 });

    try {
      const batchGeneration = {
        id: `batch_${Date.now()}`,
        type: 'batch',
        totalFiles: batchFiles.length,
        settings: batchSettings,
        format: outputFormat,
        quality: outputQuality,
        status: 'processing',
        createdAt: new Date()
      };

      console.log('Starting batch generation:', batchGeneration);

      // Process files sequentially or in parallel based on settings
      if (batchSettings.processingOrder === 'sequential') {
        for (let i = 0; i < batchFiles.length; i++) {
          const file = batchFiles[i];
          
          // Update file status
          setBatchFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'processing' } : f
          ));

          setBatchProgress(prev => ({ ...prev, processing: prev.processing + 1 }));

          // Simulate processing time
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Complete file
          setBatchFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'completed', progress: 100 } : f
          ));

          setBatchProgress(prev => ({ 
            ...prev, 
            completed: prev.completed + 1, 
            processing: prev.processing - 1 
          }));
        }
      }

      // Add batch to history
      const completedBatch = {
        ...batchGeneration,
        status: 'completed',
        completedAt: new Date(),
        downloadUrl: '/api/generations/batch-output.zip',
        fileSize: '15.7 MB'
      };

      setGenerationHistory(prev => {
        const newHistory = [completedBatch, ...prev];
        saveHistoryToStorage(newHistory);
        return newHistory;
      });

      setIsGenerating(false);
      alert('Batch generation completed successfully!');

    } catch (error) {
      console.error('Batch generation failed:', error);
      setIsGenerating(false);
      alert('Batch generation failed. Please try again.');
    }
  }, [batchFiles, batchSettings, outputFormat, outputQuality, saveHistoryToStorage]);

  // Remove file from batch
  const removeBatchFile = useCallback((fileId) => {
    setBatchFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  // Clear all batch files
  const clearBatchFiles = useCallback(() => {
    setBatchFiles([]);
    setBatchProgress({ total: 0, completed: 0, processing: 0, failed: 0 });
  }, []);

  // Download generation result
  const downloadGeneration = useCallback((generation) => {
    // In production, this would trigger actual download
    console.log('Downloading:', generation);
    alert(`Downloading: ${generation.id}`);
  }, []);

  // Delete generation from history
  const deleteGeneration = useCallback((generationId) => {
    if (window.confirm('Are you sure you want to delete this generation?')) {
      setGenerationHistory(prev => {
        const newHistory = prev.filter(g => g.id !== generationId);
        saveHistoryToStorage(newHistory);
        return newHistory;
      });
    }
  }, [saveHistoryToStorage]);

  // Filter generation history
  const filteredHistory = generationHistory.filter(generation => {
    if (historyFilter === 'all') return true;
    if (historyFilter === 'single') return generation.type === 'single';
    if (historyFilter === 'batch') return generation.type === 'batch';
    if (historyFilter === 'completed') return generation.status === 'completed';
    if (historyFilter === 'processing') return generation.status === 'processing';
    return true;
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  };

  return (
    <div className="audio-generation">
      <div className="generation-header">
        <h2>🎵 Audio Generation</h2>
        <p>Generate high-quality audio from your scripts with advanced controls</p>
      </div>

      <div className="generation-tabs">
        <button
          className={`generation-tab ${activeTab === 'single' ? 'active' : ''}`}
          onClick={() => setActiveTab('single')}
        >
          <span className="tab-icon">🎙️</span>
          Single Generation
        </button>
        <button
          className={`generation-tab ${activeTab === 'batch' ? 'active' : ''}`}
          onClick={() => setActiveTab('batch')}
        >
          <span className="tab-icon">📁</span>
          Batch Processing
        </button>
        <button
          className={`generation-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <span className="tab-icon">📊</span>
          Generation History
        </button>
      </div>

      <div className="generation-content">
        {activeTab === 'single' && (
          <div className="single-generation fade-in">
            <div className="generation-summary">
              <div className="summary-grid">
                <div className="summary-item">
                  <div className="summary-label">Word Count</div>
                  <div className="summary-value">
                    {scriptText ? scriptText.split(/\s+/).filter(word => word.length > 0).length : 0}
                  </div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Estimated Duration</div>
                  <div className="summary-value">
                    {scriptText ? Math.ceil(scriptText.split(/\s+/).length / 150) : 0} min
                  </div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Selected Voice</div>
                  <div className="summary-value">
                    {selectedVoice ? selectedVoice.name : 'None'}
                  </div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Output Quality</div>
                  <div className="summary-value">{outputQuality.toUpperCase()}</div>
                </div>
              </div>
            </div>

            <div className="generation-controls">
              <div className="controls-header">
                <h4 className="controls-title">Output Settings</h4>
                <div className="quality-selector">
                  <label>Quality:</label>
                  <select 
                    value={outputQuality}
                    onChange={(e) => setOutputQuality(e.target.value)}
                    className="quality-select"
                  >
                    <option value="standard">Standard (128kbps)</option>
                    <option value="high">High (256kbps)</option>
                    <option value="premium">Premium (320kbps)</option>
                  </select>
                </div>
              </div>

              <div className="output-options">
                <div className="option-group">
                  <label>Output Format</label>
                  <select 
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="option-select"
                  >
                    <option value="mp3">MP3</option>
                    <option value="wav">WAV</option>
                    <option value="m4a">M4A</option>
                    <option value="flac">FLAC</option>
                  </select>
                </div>
                <div className="option-group">
                  <label>File Name</label>
                  <input 
                    type="text"
                    placeholder="audio-output"
                    className="option-input"
                  />
                </div>
              </div>

              {isGenerating && (
                <div className="batch-progress slide-up">
                  <div className="overall-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                    <div className="progress-text">
                      <span>Generating audio...</span>
                      <span>{Math.round(generationProgress)}%</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="generation-actions">
                <button 
                  className={`btn-generate ${isGenerating ? 'processing' : ''}`}
                  onClick={generateSingleAudio}
                  disabled={isGenerating || !scriptText || !selectedVoice}
                >
                  {isGenerating ? '⏳ Generating...' : '🎵 Generate Audio'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'batch' && (
          <div className="batch-generation fade-in">
            <div className="batch-upload">
              <div className="upload-section">
                <h3>Upload Script Files</h3>
                <div className="upload-methods">
                  <div {...getBatchRootProps()} className="upload-method">
                    <input {...getBatchInputProps()} />
                    <div className="upload-icon">📄</div>
                    <div className="upload-title">Drag & Drop Files</div>
                    <div className="upload-description">
                      Drop multiple script files here or click to browse
                    </div>
                  </div>
                  <div 
                    className="upload-method"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="upload-icon">📁</div>
                    <div className="upload-title">Browse Files</div>
                    <div className="upload-description">
                      Select text files from your device
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {batchFiles.length > 0 && (
              <div className="batch-files">
                <div className="files-header">
                  <h4 className="files-title">Batch Files ({batchFiles.length})</h4>
                  <div className="files-actions">
                    <button className="btn-clear" onClick={clearBatchFiles}>
                      🗑️ Clear All
                    </button>
                    <button className="btn-add" onClick={() => fileInputRef.current?.click()}>
                      ➕ Add More
                    </button>
                  </div>
                </div>

                <div className="files-list">
                  {batchFiles.map((file) => (
                    <div key={file.id} className="file-item">
                      <div className="file-info">
                        <span className="file-icon">📄</span>
                        <div className="file-details">
                          <div className="file-name">{file.name}</div>
                          <div className="file-meta">
                            {formatFileSize(file.size)} • {formatDate(file.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className={`file-status ${file.status}`}>
                        <span>
                          {file.status === 'pending' && '⏳'}
                          {file.status === 'processing' && '⚙️'}
                          {file.status === 'completed' && '✅'}
                          {file.status === 'error' && '❌'}
                        </span>
                        {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                      </div>
                      <div className="file-actions">
                        <button 
                          className="file-action-btn"
                          onClick={() => removeBatchFile(file.id)}
                          title="Remove file"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="batch-settings">
              <h4>Batch Settings</h4>
              <div className="settings-grid">
                <div className="option-group">
                  <label>Voice Assignment</label>
                  <select 
                    value={batchSettings.voiceAssignment}
                    onChange={(e) => setBatchSettings(prev => ({...prev, voiceAssignment: e.target.value}))}
                    className="option-select"
                  >
                    <option value="same">Use Same Voice for All</option>
                    <option value="random">Random Voice per File</option>
                    <option value="custom">Custom Assignment</option>
                  </select>
                </div>
                <div className="option-group">
                  <label>Output Naming</label>
                  <select 
                    value={batchSettings.outputNaming}
                    onChange={(e) => setBatchSettings(prev => ({...prev, outputNaming: e.target.value}))}
                    className="option-select"
                  >
                    <option value="original">Keep Original Names</option>
                    <option value="sequential">Sequential Numbering</option>
                    <option value="custom">Custom Pattern</option>
                  </select>
                </div>
                <div className="option-group">
                  <label>Processing Order</label>
                  <select 
                    value={batchSettings.processingOrder}
                    onChange={(e) => setBatchSettings(prev => ({...prev, processingOrder: e.target.value}))}
                    className="option-select"
                  >
                    <option value="sequential">Sequential</option>
                    <option value="parallel">Parallel</option>
                  </select>
                </div>
                <div className="option-group">
                  <label>Output Format</label>
                  <select 
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="option-select"
                  >
                    <option value="mp3">MP3</option>
                    <option value="wav">WAV</option>
                    <option value="m4a">M4A</option>
                  </select>
                </div>
              </div>

              {isGenerating && batchProgress.total > 0 && (
                <div className="batch-progress slide-up">
                  <div className="progress-header">
                    <h4>Batch Progress</h4>
                  </div>
                  <div className="progress-stats">
                    <div className="progress-stat">
                      <span className="stat-number">{batchProgress.total}</span>
                      <span className="stat-label">Total</span>
                    </div>
                    <div className="progress-stat">
                      <span className="stat-number">{batchProgress.processing}</span>
                      <span className="stat-label">Processing</span>
                    </div>
                    <div className="progress-stat">
                      <span className="stat-number">{batchProgress.completed}</span>
                      <span className="stat-label">Completed</span>
                    </div>
                    <div className="progress-stat">
                      <span className="stat-number">{batchProgress.failed}</span>
                      <span className="stat-label">Failed</span>
                    </div>
                  </div>
                  <div className="overall-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${batchProgress.total > 0 ? (batchProgress.completed / batchProgress.total) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <div className="progress-text">
                      <span>Processing batch files...</span>
                      <span>
                        {batchProgress.completed}/{batchProgress.total} complete
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="generation-actions">
                <button 
                  className={`btn-generate ${isGenerating ? 'processing' : ''}`}
                  onClick={generateBatchAudio}
                  disabled={isGenerating || batchFiles.length === 0}
                >
                  {isGenerating ? '⏳ Processing Batch...' : '🚀 Start Batch Generation'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="generation-history fade-in">
            <div className="history-header">
              <h4 className="history-title">Generation History</h4>
              <div className="history-filters">
                <select 
                  value={historyFilter}
                  onChange={(e) => setHistoryFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Generations</option>
                  <option value="single">Single Only</option>
                  <option value="batch">Batch Only</option>
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                </select>
              </div>
            </div>

            <div className="history-list">
              {filteredHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                  <p>No generation history found</p>
                </div>
              ) : (
                filteredHistory.map((generation) => (
                  <div key={generation.id} className="history-item">
                    <div className="history-item-header">
                      <div>
                        <h5 className="history-item-title">
                          {generation.type === 'single' ? '🎙️' : '📁'} 
                          {generation.type === 'single' ? 'Single Generation' : `Batch Generation (${generation.totalFiles || 'N/A'} files)`}
                        </h5>
                        <div className="history-item-meta">
                          Created: {formatDate(generation.createdAt)}
                          {generation.completedAt && ` • Completed: ${formatDate(generation.completedAt)}`}
                        </div>
                      </div>
                      <div className="history-item-actions">
                        {generation.status === 'completed' && (
                          <button 
                            className="history-action-btn download"
                            onClick={() => downloadGeneration(generation)}
                          >
                            📥 Download
                          </button>
                        )}
                        <button 
                          className="history-action-btn"
                          onClick={() => deleteGeneration(generation.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                    <div className="history-item-details">
                      <div className="detail-item">
                        <span className="detail-label">Status</span>
                        <span className="detail-value">{generation.status}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Format</span>
                        <span className="detail-value">{generation.format?.toUpperCase() || 'MP3'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Quality</span>
                        <span className="detail-value">{generation.quality || 'High'}</span>
                      </div>
                      {generation.fileSize && (
                        <div className="detail-item">
                          <span className="detail-label">File Size</span>
                          <span className="detail-value">{generation.fileSize}</span>
                        </div>
                      )}
                      {generation.duration && (
                        <div className="detail-item">
                          <span className="detail-label">Duration</span>
                          <span className="detail-value">{generation.duration}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".txt,.json,.csv"
        style={{ display: 'none' }}
        onChange={(e) => {
          const files = Array.from(e.target.files);
          onBatchDrop(files, []);
          e.target.value = '';
        }}
      />
    </div>
  );
};

export default AudioGeneration;
