import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAppContext } from '../../context/AppContext';
import './Layout.css';

// PUBLIC_INTERFACE
/**
 * Main layout component with sidebar navigation
 * Provides the dashboard-style layout for the VoiceForge application
 */
const Layout = () => {
  const { state } = useAppContext();
  const { sidebarCollapsed } = state.uiState;

  return (
    <div className={`layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
