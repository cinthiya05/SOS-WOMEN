// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Onboarding from './components/Onboarding';
import GeoTracker from './components/GeoTracker';
import VoiceDetection from './components/VoiceDetection';
import HandDetector from './components/HandDetector';

const App = () => (
  <Router basename="/SOS-WOMEN">
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/geotracker" element={<GeoTracker />} />
      <Route path="/voice" element={<VoiceDetection />} />
      <Route path="/detect" element={<HandDetector />} />
    </Routes>
  </Router>
);

export default App;
