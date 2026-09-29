import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import CinematicVideoSection from './components/CinematicVideoSection';
import DesignSection from './components/DesignSection';
import PerformanceSection from './components/PerformanceSection';
import EngineeringSection from './components/EngineeringSection';
import FinalSection from './components/FinalSection';
import MenuDrawer from './components/MenuDrawer';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const video1Ref = useRef(null);
  const video2Ref = useRef(null);

  useEffect(() => {
    // Scroll restoration manual to prevent jump on reload
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: '#08080a', minHeight: '100vh', color: '#f5f5f7' }}>
      {/* Precision Loading Screen */}
      {!loaded && (
        <LoadingScreen
          onLoaded={() => setLoaded(true)}
          video1Ref={video1Ref}
          video2Ref={video2Ref}
        />
      )}

      {/* Fixed Minimal Navigation */}
      <Navbar onOpenMenu={() => setMenuOpen(true)} isMenuOpen={menuOpen} />

      {/* Main Content Flow */}
      <main>
        {/* Sections 01 & 02: Pinned Dual Scroll-Driven Cinematic Experience */}
        <CinematicVideoSection video1Ref={video1Ref} video2Ref={video2Ref} />

        {/* Section 03: Design Architecture */}
        <DesignSection />

        {/* Section 04: Performance Telemetry */}
        <PerformanceSection />

        {/* Section 05: Engineering Around Motion */}
        <EngineeringSection />

        {/* Section 06: Final Climax Moment */}
        <FinalSection />
      </main>

      {/* Full-screen Minimal Menu Drawer */}
      <MenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
