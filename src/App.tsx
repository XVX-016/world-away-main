import { useRef } from 'react';
import { AdvancedSolarCarousel } from './components/AdvancedSolarCarousel';
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
    <div className="min-h-screen text-white overflow-x-hidden">
      {/* Background layers */}
      <AdvancedSolarCarousel />

      {/* Main Content */}
      <main className="relative z-20">
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
    </div>
  );
}

export default App;