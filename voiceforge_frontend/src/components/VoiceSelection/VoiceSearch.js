import React, { useState, useEffect } from 'react';
import './VoiceSearch.css';

// PUBLIC_INTERFACE
/**
 * Voice Search component with real-time search and suggestions
 */
const VoiceSearch = ({ searchQuery, onSearchChange, placeholder = "Search voices..." }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Popular search terms for suggestions
  const popularSearches = [
    'american male', 'british female', 'young professional', 'mature narrator',
    'conversational', 'commercial', 'educational', 'character voice',
    'australian accent', 'canadian', 'irish', 'scottish'
  ];

  useEffect(() => {
    setLocalQuery(searchQuery || '');
  }, [searchQuery]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    
    // Generate suggestions based on input
    if (value.length > 0) {
      const filtered = popularSearches.filter(term =>
        term.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions(popularSearches.slice(0, 5));
      setShowSuggestions(false);
    }

    // Debounced search
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocalQuery(suggestion);
    setShowSuggestions(false);
    if (onSearchChange) {
      onSearchChange(suggestion);
    }
  };

  const handleClearSearch = () => {
    setLocalQuery('');
    setShowSuggestions(false);
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  const handleFocus = () => {
    if (localQuery.length === 0) {
      setSuggestions(popularSearches.slice(0, 5));
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="voice-search">
      <div className="search-input-container">
        <div className="search-icon">🔍</div>
        <input
          type="text"
          value={localQuery}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="search-input"
        />
        {localQuery && (
          <button 
            className="clear-search-btn"
            onClick={handleClearSearch}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          <div className="suggestions-header">
            {localQuery ? 'Suggestions' : 'Popular searches'}
          </div>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className="suggestion-icon">🔍</span>
              <span className="suggestion-text">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceSearch;
