import React, { useState, useEffect, useCallback } from 'react';
import VoiceCard from './VoiceCard';
import VoiceFilters from './VoiceFilters';
import VoiceSearch from './VoiceSearch';
import VoicePreview from './VoicePreview';
import './VoiceSelection.css';

// PUBLIC_INTERFACE
/**
 * Advanced Voice Selection component with search, filtering, preview, and favorites
 * Supports browsing 200+ AI voices with advanced filtering options
 */
const VoiceSelection = ({ onVoiceSelect, selectedVoice, showFavoritesOnly = false }) => {
  const [voices, setVoices] = useState([]);
  const [filteredVoices, setFilteredVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    gender: 'all',
    accent: 'all',
    age: 'all',
    language: 'all',
    category: 'all',
    premium: false
  });
  const [previewVoice, setPreviewVoice] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'name', 'newest'

  // Mock data for 200+ voices - in production this would come from API
  const generateMockVoices = useCallback(() => {
    const voices = [];
    const genders = ['male', 'female'];
    const accents = ['american', 'british', 'australian', 'canadian', 'indian', 'irish', 'scottish', 'south-african'];
    const ages = ['young', 'middle-aged', 'mature'];
    const languages = ['english', 'spanish', 'french', 'german', 'italian', 'portuguese', 'dutch', 'russian'];
    const categories = ['conversational', 'professional', 'narrative', 'commercial', 'character', 'educational'];
    const names = [
      'Alex', 'Sarah', 'David', 'Emma', 'Michael', 'Olivia', 'James', 'Sophia', 'William', 'Isabella',
      'Benjamin', 'Charlotte', 'Lucas', 'Amelia', 'Henry', 'Mia', 'Alexander', 'Harper', 'Sebastian', 'Evelyn',
      'Jack', 'Abigail', 'Owen', 'Emily', 'Daniel', 'Elizabeth', 'Matthew', 'Sofia', 'Samuel', 'Avery',
      'Joseph', 'Ella', 'Levi', 'Madison', 'John', 'Scarlett', 'Dylan', 'Victoria', 'Luke', 'Aria'
    ];

    for (let i = 0; i < 220; i++) {
      const gender = genders[Math.floor(Math.random() * genders.length)];
      const accent = accents[Math.floor(Math.random() * accents.length)];
      const age = ages[Math.floor(Math.random() * ages.length)];
      const language = languages[Math.floor(Math.random() * languages.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const name = names[Math.floor(Math.random() * names.length)];
      
      voices.push({
        id: `voice_${i + 1}`,
        name: `${name} ${i + 1}`,
        gender,
        accent,
        age,
        language,
        category,
        isPremium: Math.random() > 0.7,
        isCloned: Math.random() > 0.9,
        rating: Math.floor(Math.random() * 5) + 1,
        popularity: Math.floor(Math.random() * 1000),
        description: `A ${age} ${gender} voice with a ${accent} accent, perfect for ${category} content.`,
        tags: [category, accent, age, gender],
        sampleUrl: `/api/voices/${i + 1}/sample`, // Placeholder backend integration
        duration: Math.floor(Math.random() * 30) + 10,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
      });
    }

    return voices.sort((a, b) => b.popularity - a.popularity);
  }, []);

  // Initialize voices data
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockVoices = generateMockVoices();
      setVoices(mockVoices);
      setFilteredVoices(mockVoices);
      setLoading(false);
    }, 1000);
  }, [generateMockVoices]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('voiceforge-favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Filter and search voices
  useEffect(() => {
    let filtered = voices;

    // Apply favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(voice => favorites.has(voice.id));
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(voice =>
        voice.name.toLowerCase().includes(query) ||
        voice.description.toLowerCase().includes(query) ||
        voice.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.gender !== 'all') {
      filtered = filtered.filter(voice => voice.gender === filters.gender);
    }
    if (filters.accent !== 'all') {
      filtered = filtered.filter(voice => voice.accent === filters.accent);
    }
    if (filters.age !== 'all') {
      filtered = filtered.filter(voice => voice.age === filters.age);
    }
    if (filters.language !== 'all') {
      filtered = filtered.filter(voice => voice.language === filters.language);
    }
    if (filters.category !== 'all') {
      filtered = filtered.filter(voice => voice.category === filters.category);
    }
    if (filters.premium) {
      filtered = filtered.filter(voice => voice.isPremium);
    }

    // Apply sorting
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default: // popular
        filtered.sort((a, b) => b.popularity - a.popularity);
    }

    setFilteredVoices(filtered);
  }, [voices, searchQuery, filters, showFavoritesOnly, favorites, sortBy]);

  const handleVoiceSelect = useCallback((voice) => {
    if (onVoiceSelect) {
      onVoiceSelect(voice);
    }
  }, [onVoiceSelect]);

  const handlePreviewVoice = useCallback((voice) => {
    setPreviewVoice(voice);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewVoice(null);
  }, []);

  const handleToggleFavorite = useCallback((voiceId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(voiceId)) {
      newFavorites.delete(voiceId);
    } else {
      newFavorites.add(voiceId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('voiceforge-favorites', JSON.stringify([...newFavorites]));
  }, [favorites]);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setFilters({
      gender: 'all',
      accent: 'all',
      age: 'all',
      language: 'all',
      category: 'all',
      premium: false
    });
  }, []);

  if (loading) {
    return (
      <div className="voice-selection-loading">
        <div className="loading-spinner"></div>
        <p>Loading voice library...</p>
      </div>
    );
  }

  return (
    <div className="voice-selection">
      <div className="voice-selection-header">
        <div className="header-main">
          <h2>Voice Library</h2>
          <p>Choose from {voices.length}+ ultra-realistic AI voices</p>
        </div>
        <div className="header-controls">
          <div className="view-controls">
            <label>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="popular">Most Popular</option>
              <option value="name">Name (A-Z)</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
          <div className="view-mode-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              📱
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              📋
            </button>
          </div>
        </div>
      </div>

      <div className="voice-selection-content">
        <div className="filters-sidebar">
          <VoiceSearch
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            placeholder="Search voices by name, accent, or style..."
          />
          <VoiceFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={clearAllFilters}
          />
        </div>

        <div className="voices-main">
          <div className="voices-header">
            <div className="results-info">
              <span className="results-count">
                {filteredVoices.length} voices found
              </span>
              {(searchQuery || Object.values(filters).some(f => f !== 'all' && f !== false)) && (
                <button className="clear-filters-btn" onClick={clearAllFilters}>
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {filteredVoices.length === 0 ? (
            <div className="no-voices-found">
              <div className="no-voices-icon">🔍</div>
              <h3>No voices found</h3>
              <p>Try adjusting your search criteria or filters</p>
              <button className="clear-filters-btn" onClick={clearAllFilters}>
                Clear all filters
              </button>
            </div>
          ) : (
            <div className={`voices-grid ${viewMode}`}>
              {filteredVoices.map((voice) => (
                <VoiceCard
                  key={voice.id}
                  voice={voice}
                  isSelected={selectedVoice?.id === voice.id}
                  isFavorite={favorites.has(voice.id)}
                  onSelect={handleVoiceSelect}
                  onPreview={handlePreviewVoice}
                  onToggleFavorite={handleToggleFavorite}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {previewVoice && (
        <VoicePreview
          voice={previewVoice}
          onClose={handleClosePreview}
          onSelect={handleVoiceSelect}
          isFavorite={favorites.has(previewVoice.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  );
};

export default VoiceSelection;
