import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Onboarding from './components/Onboarding';
import GeoTracker from './components/GeoTracker';

const App = () => (
  <Router basename="/SOS-WOMEN">
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/geotracker" element={<GeoTracker />} />
    </Routes>
  </Router>
);

export default App;
