import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import CreateAudio from './pages/CreateAudio/CreateAudio';
import VoiceLibrary from './pages/VoiceLibrary/VoiceLibrary';
import Projects from './pages/Projects/Projects';
import Analytics from './pages/Analytics/Analytics';
import Subscription from './pages/Subscription/Subscription';
import Settings from './pages/Settings/Settings';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Main application component with routing configuration for VoiceForge platform
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="create" element={<CreateAudio />} />
            <Route path="voices" element={<VoiceLibrary />} />
            <Route path="projects" element={<Projects />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
