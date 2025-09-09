import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as mammoth from 'mammoth';
import { 
  getSupportedMimeTypes, 
  validateFile, 
  formatFileSize,
  estimateReadingTime,
  extractVoiceControls
} from './fileUtils';
import './ScriptUpload.css';

// PUBLIC_INTERFACE
/**
 * Comprehensive Script Upload component with drag-and-drop file upload,
 * file validation, progress tracking, and integrated text editor
 */
const ScriptUpload = ({ onScriptChange, onFileUpload }) => {
  const [scriptText, setScriptText] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' or 'upload'
  const textareaRef = useRef(null);

  // Extract text from different file types
  const extractTextFromFile = useCallback(async (file) => {
    try {
      let extractedText = '';
      
      if (file.type === 'text/plain') {
        const text = await file.text();
        extractedText = text;
      } else if (file.type === 'application/pdf') {
        // For PDF files, we'll use a simulated extraction for now
        // In production, you'd use pdf-parse on the server side due to browser limitations
        extractedText = `PDF file "${file.name}" uploaded successfully.\n\nNote: PDF text extraction will be processed on the server. Please review the extracted content before generating audio.\n\n[PDF content will appear here after processing...]`;
      } else if (file.name.toLowerCase().endsWith('.docx')) {
        // Extract text from DOCX files using mammoth
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
      } else if (file.name.toLowerCase().endsWith('.doc')) {
        // Legacy DOC files - show message about conversion
        extractedText = `Legacy DOC file "${file.name}" detected.\n\nPlease save your document as .docx format for better text extraction, or copy and paste the content directly into the text editor.`;
      }
      
      setScriptText(extractedText);
      if (onScriptChange) {
        onScriptChange(extractedText);
      }
    } catch (error) {
      console.error('Error extracting text from file:', error);
      setUploadError('Failed to extract text from file. Please try again or use the text editor.');
    }
  }, [onScriptChange]);

  // File validation using utility functions
  const validateFileInput = useCallback((file) => {
    const validation = validateFile(file);
    return validation.isValid ? null : validation.errors.join('. ');
  }, []);

  // Simulate file upload progress
  const simulateUpload = useCallback((file) => {
    setIsUploading(true);
    setUploadError('');
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate processing time
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setIsUploading(false);
      setUploadedFile(file);
      
      // Extract text based on file type
      extractTextFromFile(file);
      
      if (onFileUpload) {
        onFileUpload(file);
      }
    }, 2500);
  }, [onFileUpload, extractTextFromFile]);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      setUploadError(error.message);
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    const validationError = validateFileInput(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    simulateUpload(file);
  }, [validateFileInput, simulateUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: getSupportedMimeTypes(),
    maxSize: 20 * 1024 * 1024 // 20MB max
  });

  // Handle text editor changes
  const handleTextChange = useCallback((e) => {
    const newText = e.target.value;
    setScriptText(newText);
    if (onScriptChange) {
      onScriptChange(newText);
    }
  }, [onScriptChange]);

  // Clear uploaded file and reset
  const clearUpload = useCallback(() => {
    setUploadedFile(null);
    setUploadProgress(0);
    setUploadError('');
    setScriptText('');
    if (onScriptChange) {
      onScriptChange('');
    }
  }, [onScriptChange]);

  // Insert text at cursor position
  const insertTextAtCursor = useCallback((insertText) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = scriptText.substring(0, start) + insertText + scriptText.substring(end);
    
    setScriptText(newText);
    if (onScriptChange) {
      onScriptChange(newText);
    }

    // Restore cursor position
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + insertText.length;
      textarea.focus();
    }, 0);
  }, [scriptText, onScriptChange]);

  return (
    <div className="script-upload">
      <div className="script-upload-header">
        <h2>Script Upload & Editor</h2>
        <div className="tab-switcher">
          <button 
            className={`tab ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            📝 Text Editor
          </button>
          <button 
            className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            📁 File Upload
          </button>
        </div>
      </div>

      {activeTab === 'upload' && (
        <div className="upload-section">
          <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            <div className="dropzone-content">
              <div className="upload-icon">📄</div>
              {isDragActive ? (
                <p>Drop your script file here...</p>
              ) : (
                <>
                  <p>Drag & drop your script file here, or click to browse</p>
                  <p className="file-types">Supports: .txt, .pdf, .docx, .doc (max 10MB)</p>
                </>
              )}
            </div>
          </div>

          {isUploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p>Uploading... {uploadProgress}%</p>
            </div>
          )}

          {uploadError && (
            <div className="upload-error">
              <span className="error-icon">❌</span>
              {uploadError}
            </div>
          )}

          {uploadedFile && (
            <div className="uploaded-file">
              <div className="file-info">
                <span className="file-icon">📄</span>
                <div className="file-details">
                  <span className="file-name">{uploadedFile.name}</span>
                  <span className="file-size">
                    {formatFileSize(uploadedFile.size)}
                  </span>
                </div>
              </div>
              <button className="clear-btn" onClick={clearUpload}>
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'editor' && (
        <div className="editor-section">
          <div className="editor-toolbar">
            <div className="editor-tools">
              <button 
                className="tool-btn"
                onClick={() => insertTextAtCursor('[PAUSE]')}
                title="Insert pause"
              >
                ⏸️ Pause
              </button>
              <button 
                className="tool-btn"
                onClick={() => insertTextAtCursor('[EMPHASIS]')}
                title="Add emphasis"
              >
                💪 Emphasis
              </button>
              <button 
                className="tool-btn"
                onClick={() => insertTextAtCursor('[SPEED:slow]')}
                title="Slow down"
              >
                🐌 Slow
              </button>
              <button 
                className="tool-btn"
                onClick={() => insertTextAtCursor('[SPEED:fast]')}
                title="Speed up"
              >
                🐇 Fast
              </button>
            </div>
            <div className="script-stats">
              <div className="word-count">
                Words: {scriptText.split(/\s+/).filter(word => word.length > 0).length}
              </div>
              {scriptText && (
                <div className="reading-time">
                  Est. Time: {estimateReadingTime(scriptText)}
                </div>
              )}
              {scriptText && extractVoiceControls(scriptText).length > 0 && (
                <div className="voice-controls">
                  Controls: {extractVoiceControls(scriptText).length}
                </div>
              )}
            </div>
          </div>

          <div className="editor-container">
            <textarea
              ref={textareaRef}
              className="script-editor"
              value={scriptText}
              onChange={handleTextChange}
              placeholder="Type or paste your script here, or upload a file using the File Upload tab..."
              rows={20}
            />
          </div>

          <div className="editor-footer">
            <p className="editor-tip">
              💡 Tip: Use the toolbar buttons to add voice control tags to your script
            </p>
          </div>
        </div>
      )}

      {scriptText && (
        <div className="script-preview">
          <h3>Script Preview</h3>
          <div className="preview-content">
            {scriptText.substring(0, 200)}
            {scriptText.length > 200 && '...'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptUpload;
