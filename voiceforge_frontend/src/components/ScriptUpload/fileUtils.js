// PUBLIC_INTERFACE
/**
 * Utility functions for file processing and validation in the ScriptUpload component
 */

// Supported file types and their configurations
export const FILE_TYPES = {
  TEXT: {
    mimeTypes: ['text/plain'],
    extensions: ['.txt'],
    maxSize: 10 * 1024 * 1024, // 10MB
    description: 'Plain text files'
  },
  PDF: {
    mimeTypes: ['application/pdf'],
    extensions: ['.pdf'],
    maxSize: 20 * 1024 * 1024, // 20MB
    description: 'PDF documents'
  },
  DOCX: {
    mimeTypes: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    extensions: ['.docx'],
    maxSize: 15 * 1024 * 1024, // 15MB
    description: 'Microsoft Word documents (newer format)'
  },
  DOC: {
    mimeTypes: ['application/msword'],
    extensions: ['.doc'],
    maxSize: 15 * 1024 * 1024, // 15MB
    description: 'Microsoft Word documents (legacy format)'
  }
};

// Get all supported MIME types
export const getSupportedMimeTypes = () => {
  return Object.values(FILE_TYPES).reduce((acc, type) => {
    return { ...acc, ...type.mimeTypes.reduce((mimeAcc, mime) => ({ ...mimeAcc, [mime]: type.extensions }), {}) };
  }, {});
};

// Validate file type and size
export const validateFile = (file) => {
  const errors = [];
  
  // Check file size
  const maxSize = Math.max(...Object.values(FILE_TYPES).map(type => type.maxSize));
  if (file.size > maxSize) {
    errors.push(`File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(maxSize)})`);
  }
  
  // Check file type
  const fileName = file.name.toLowerCase();
  const isValidType = Object.values(FILE_TYPES).some(type => 
    type.mimeTypes.includes(file.type) || 
    type.extensions.some(ext => fileName.endsWith(ext))
  );
  
  if (!isValidType) {
    const supportedExts = Object.values(FILE_TYPES).flatMap(type => type.extensions).join(', ');
    errors.push(`File type not supported. Supported types: ${supportedExts}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file type information
export const getFileTypeInfo = (file) => {
  const fileName = file.name.toLowerCase();
  
  for (const [key, type] of Object.entries(FILE_TYPES)) {
    if (type.mimeTypes.includes(file.type) || 
        type.extensions.some(ext => fileName.endsWith(ext))) {
      return { key, ...type };
    }
  }
  
  return null;
};

// Estimate reading time based on word count
export const estimateReadingTime = (text) => {
  const wordsPerMinute = 150; // Average speaking rate
  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  if (minutes < 1) return 'Less than 1 minute';
  if (minutes === 1) return '1 minute';
  return `${minutes} minutes`;
};

// Clean and prepare text for audio generation
export const prepareTextForAudio = (text) => {
  return text
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove special characters that might cause issues
    .replace(/[^\w\s.,!?;:()\-\[\]]/g, '')
    // Normalize line breaks
    .replace(/\n+/g, '\n')
    .trim();
};

// Extract voice control tags from text
export const extractVoiceControls = (text) => {
  const controls = [];
  const tagRegex = /\[(PAUSE|EMPHASIS|SPEED:[\w]+|VOLUME:[\w]+|PITCH:[\w]+)\]/g;
  
  let match;
  while ((match = tagRegex.exec(text)) !== null) {
    controls.push({
      tag: match[1],
      position: match.index,
      fullMatch: match[0]
    });
  }
  
  return controls;
};
