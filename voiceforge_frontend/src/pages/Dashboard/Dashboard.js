import React from 'react';
import './Dashboard.css';

// PUBLIC_INTERFACE
/**
 * Dashboard page showing overview and quick access to VoiceForge features
 */
const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to VoiceForge</h1>
        <p>Professional voice content creation made simple</p>
      </div>
      
      <div className="quick-stats">
        <div className="stat-card">
          <h3>Projects</h3>
          <div className="stat-number">0</div>
        </div>
        <div className="stat-card">
          <h3>Audio Generated</h3>
          <div className="stat-number">0 min</div>
        </div>
        <div className="stat-card">
          <h3>Voices Used</h3>
          <div className="stat-number">0</div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn primary">
            🎙️ Create New Audio
          </button>
          <button className="action-btn secondary">
            🗣️ Browse Voices
          </button>
          <button className="action-btn secondary">
            📁 View Projects
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
