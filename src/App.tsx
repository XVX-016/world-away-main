import React, { useRef } from 'react';
import { EnhancedStarField } from './components/EnhancedStarField';
import { SolarSystem } from './components/SolarSystem';
import { Hero } from './components/Hero';
import { DemoSection } from './components/DemoSection';
import { ExoplanetDiscoverySection } from './components/ExoplanetDiscoverySection';
import { Footer } from './components/Footer';

function App() {
  const demoRef = useRef<HTMLDivElement>(null);

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Enhanced Interactive Star Background */}
      <EnhancedStarField />
      
      {/* 3D Solar System */}
      <SolarSystem />
      
      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <Hero onExploreClick={scrollToDemo} />
        
        {/* Demo Section */}
        <div ref={demoRef}>
          <DemoSection />
        </div>
        
        {/* Exoplanet Discovery Section */}
        <ExoplanetDiscoverySection />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Gradient Overlays for Depth */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-900/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-purple-900/20 to-transparent" />
      </div>
    </div>
  );
}

export default App;