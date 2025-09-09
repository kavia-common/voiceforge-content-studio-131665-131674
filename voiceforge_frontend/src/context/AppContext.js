import React, { createContext, useContext, useState, useReducer } from 'react';

const AppContext = createContext();

// PUBLIC_INTERFACE
/**
 * Hook to access the application context
 * @returns {Object} Application context value with state and actions
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Initial state for the application
const initialState = {
  currentProject: null,
  recentProjects: [],
  selectedVoice: null,
  audioSettings: {
    speed: 1.0,
    pitch: 1.0,
    emotion: 'neutral',
    backgroundMusic: false
  },
  notifications: [],
  isGenerating: false,
  currentScript: '',
  generatedAudio: null
};

// Action types
const actionTypes = {
  SET_CURRENT_PROJECT: 'SET_CURRENT_PROJECT',
  ADD_RECENT_PROJECT: 'ADD_RECENT_PROJECT',
  SET_SELECTED_VOICE: 'SET_SELECTED_VOICE',
  UPDATE_AUDIO_SETTINGS: 'UPDATE_AUDIO_SETTINGS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_GENERATING: 'SET_GENERATING',
  SET_CURRENT_SCRIPT: 'SET_CURRENT_SCRIPT',
  SET_GENERATED_AUDIO: 'SET_GENERATED_AUDIO'
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_CURRENT_PROJECT:
      return {
        ...state,
        currentProject: action.payload
      };
    
    case actionTypes.ADD_RECENT_PROJECT:
      const updatedRecents = [action.payload, ...state.recentProjects.filter(p => p.id !== action.payload.id)].slice(0, 5);
      return {
        ...state,
        recentProjects: updatedRecents
      };
    
    case actionTypes.SET_SELECTED_VOICE:
      return {
        ...state,
        selectedVoice: action.payload
      };
    
    case actionTypes.UPDATE_AUDIO_SETTINGS:
      return {
        ...state,
        audioSettings: {
          ...state.audioSettings,
          ...action.payload
        }
      };
    
    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, { ...action.payload, id: Date.now() }]
      };
    
    case actionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    case actionTypes.SET_GENERATING:
      return {
        ...state,
        isGenerating: action.payload
      };
    
    case actionTypes.SET_CURRENT_SCRIPT:
      return {
        ...state,
        currentScript: action.payload
      };
    
    case actionTypes.SET_GENERATED_AUDIO:
      return {
        ...state,
        generatedAudio: action.payload
      };
    
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
/**
 * Application provider component that manages global application state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Action creators
  const actions = {
    // PUBLIC_INTERFACE
    /**
     * Set the current project
     * @param {Object} project - Project object
     */
    setCurrentProject: (project) => {
      dispatch({ type: actionTypes.SET_CURRENT_PROJECT, payload: project });
    },

    // PUBLIC_INTERFACE
    /**
     * Add a project to recent projects
     * @param {Object} project - Project object
     */
    addRecentProject: (project) => {
      dispatch({ type: actionTypes.ADD_RECENT_PROJECT, payload: project });
    },

    // PUBLIC_INTERFACE
    /**
     * Set the selected voice
     * @param {Object} voice - Voice object
     */
    setSelectedVoice: (voice) => {
      dispatch({ type: actionTypes.SET_SELECTED_VOICE, payload: voice });
    },

    // PUBLIC_INTERFACE
    /**
     * Update audio settings
     * @param {Object} settings - Audio settings to update
     */
    updateAudioSettings: (settings) => {
      dispatch({ type: actionTypes.UPDATE_AUDIO_SETTINGS, payload: settings });
    },

    // PUBLIC_INTERFACE
    /**
     * Add a notification
     * @param {Object} notification - Notification object with type, message, and optional duration
     */
    addNotification: (notification) => {
      dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: notification });
      
      // Auto-remove notification after duration (default 5 seconds)
      const duration = notification.duration || 5000;
      setTimeout(() => {
        actions.removeNotification(Date.now());
      }, duration);
    },

    // PUBLIC_INTERFACE
    /**
     * Remove a notification
     * @param {number} id - Notification ID
     */
    removeNotification: (id) => {
      dispatch({ type: actionTypes.REMOVE_NOTIFICATION, payload: id });
    },

    // PUBLIC_INTERFACE
    /**
     * Set the generating state
     * @param {boolean} isGenerating - Whether audio is being generated
     */
    setGenerating: (isGenerating) => {
      dispatch({ type: actionTypes.SET_GENERATING, payload: isGenerating });
    },

    // PUBLIC_INTERFACE
    /**
     * Set the current script
     * @param {string} script - Script text
     */
    setCurrentScript: (script) => {
      dispatch({ type: actionTypes.SET_CURRENT_SCRIPT, payload: script });
    },

    // PUBLIC_INTERFACE
    /**
     * Set the generated audio
     * @param {Object} audio - Generated audio object
     */
    setGeneratedAudio: (audio) => {
      dispatch({ type: actionTypes.SET_GENERATED_AUDIO, payload: audio });
    },

    // PUBLIC_INTERFACE
    /**
     * Toggle sidebar collapsed state
     */
    toggleSidebar: () => {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const value = {
    ...state,
    sidebarCollapsed,
    actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
