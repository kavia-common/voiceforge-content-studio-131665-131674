import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

// PUBLIC_INTERFACE
/**
 * Main layout component that provides the dashboard-style layout with sidebar navigation
 * and central content area for the VoiceForge application
 */
const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
