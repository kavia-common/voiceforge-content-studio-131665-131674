import React from 'react';
import './VoiceFilters.css';

// PUBLIC_INTERFACE
/**
 * Voice Filters component providing advanced filtering options for voice selection
 * Includes gender, accent, age, language, category, and premium filters
 */
const VoiceFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    onFiltersChange(newFilters);
  };

  const handlePremiumToggle = () => {
    handleFilterChange('premium', !filters.premium);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== 'all' && value !== false
  );

  const filterOptions = {
    gender: [
      { value: 'all', label: 'All Genders' },
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' }
    ],
    accent: [
      { value: 'all', label: 'All Accents' },
      { value: 'american', label: 'American' },
      { value: 'british', label: 'British' },
      { value: 'australian', label: 'Australian' },
      { value: 'canadian', label: 'Canadian' },
      { value: 'indian', label: 'Indian' },
      { value: 'irish', label: 'Irish' },
      { value: 'scottish', label: 'Scottish' },
      { value: 'south-african', label: 'South African' }
    ],
    age: [
      { value: 'all', label: 'All Ages' },
      { value: 'young', label: 'Young (18-30)' },
      { value: 'middle-aged', label: 'Middle-aged (30-50)' },
      { value: 'mature', label: 'Mature (50+)' }
    ],
    language: [
      { value: 'all', label: 'All Languages' },
      { value: 'english', label: 'English' },
      { value: 'spanish', label: 'Spanish' },
      { value: 'french', label: 'French' },
      { value: 'german', label: 'German' },
      { value: 'italian', label: 'Italian' },
      { value: 'portuguese', label: 'Portuguese' },
      { value: 'dutch', label: 'Dutch' },
      { value: 'russian', label: 'Russian' }
    ],
    category: [
      { value: 'all', label: 'All Categories' },
      { value: 'conversational', label: 'Conversational' },
      { value: 'professional', label: 'Professional' },
      { value: 'narrative', label: 'Narrative' },
      { value: 'commercial', label: 'Commercial' },
      { value: 'character', label: 'Character' },
      { value: 'educational', label: 'Educational' }
    ]
  };

  return (
    <div className="voice-filters">
      <div className="filters-header">
        <h3>Filters</h3>
        {hasActiveFilters && (
          <button 
            className="clear-all-btn"
            onClick={onClearFilters}
            title="Clear all filters"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="filter-groups">
        {/* Gender Filter */}
        <div className="filter-group">
          <label className="filter-label">Gender</label>
          <select
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            className="filter-select"
          >
            {filterOptions.gender.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Accent Filter */}
        <div className="filter-group">
          <label className="filter-label">Accent</label>
          <select
            value={filters.accent}
            onChange={(e) => handleFilterChange('accent', e.target.value)}
            className="filter-select"
          >
            {filterOptions.accent.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Age Filter */}
        <div className="filter-group">
          <label className="filter-label">Age Group</label>
          <select
            value={filters.age}
            onChange={(e) => handleFilterChange('age', e.target.value)}
            className="filter-select"
          >
            {filterOptions.age.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Language Filter */}
        <div className="filter-group">
          <label className="filter-label">Language</label>
          <select
            value={filters.language}
            onChange={(e) => handleFilterChange('language', e.target.value)}
            className="filter-select"
          >
            {filterOptions.language.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            {filterOptions.category.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Premium Filter */}
        <div className="filter-group">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={filters.premium}
              onChange={handlePremiumToggle}
            />
            <span className="checkbox-custom"></span>
            <span className="checkbox-label">
              Premium Voices Only
              <span className="premium-icon">👑</span>
            </span>
          </label>
        </div>
      </div>

      <div className="filter-summary">
        <div className="active-filters">
          {filters.gender !== 'all' && (
            <span className="active-filter">
              Gender: {filterOptions.gender.find(opt => opt.value === filters.gender)?.label}
            </span>
          )}
          {filters.accent !== 'all' && (
            <span className="active-filter">
              Accent: {filterOptions.accent.find(opt => opt.value === filters.accent)?.label}
            </span>
          )}
          {filters.age !== 'all' && (
            <span className="active-filter">
              Age: {filterOptions.age.find(opt => opt.value === filters.age)?.label}
            </span>
          )}
          {filters.language !== 'all' && (
            <span className="active-filter">
              Language: {filterOptions.language.find(opt => opt.value === filters.language)?.label}
            </span>
          )}
          {filters.category !== 'all' && (
            <span className="active-filter">
              Category: {filterOptions.category.find(opt => opt.value === filters.category)?.label}
            </span>
          )}
          {filters.premium && (
            <span className="active-filter">
              Premium Only
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceFilters;
