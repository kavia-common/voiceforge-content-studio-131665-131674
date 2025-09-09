import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useApp } from '../../context/AppContext';
import './Layout.css';

// PUBLIC_INTERFACE
/**
 * Main layout component with sidebar navigation
 * Provides the dashboard-style layout for the VoiceForge application
 */
const Layout = () => {
  const { sidebarCollapsed } = useApp();

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
