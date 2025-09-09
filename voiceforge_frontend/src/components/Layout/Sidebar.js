import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

// PUBLIC_INTERFACE
/**
 * Sidebar navigation component providing access to all VoiceForge features
 */
const Sidebar = () => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/create', label: 'Create Audio', icon: '🎙️' },
    { path: '/voices', label: 'Voice Library', icon: '🗣️' },
    { path: '/projects', label: 'My Projects', icon: '📁' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/subscription', label: 'Subscription', icon: '💳' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">VoiceForge</h1>
      </div>
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.path} className="nav-item">
            <NavLink 
              to={item.path} 
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
