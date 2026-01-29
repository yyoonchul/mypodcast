import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PodcastSelectionPage from './pages/PodcastSelectionPage';
import CustomizationPage from './pages/CustomizationPage';
import WaitlistSignupPage from './pages/WaitlistSignupPage';
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/podcast-selection" element={<PodcastSelectionPage />} />
        <Route path="/customization" element={<CustomizationPage />} />
        <Route path="/signup" element={<WaitlistSignupPage />} />
      </Routes>
      <Analytics/>
    </Router>
  );
}

export default App; 