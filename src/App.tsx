import { useRef } from 'react';
import { AdvancedSolarCarousel } from './components/AdvancedSolarCarousel';
import { Hero } from './components/Hero';
import { DemoSection } from './components/DemoSection';
import { ExoplanetDiscoverySection } from './components/ExoplanetDiscoverySection';
import { Footer } from './components/Footer';
import { ExoplanetProvider } from './contexts/ExoplanetContext';

function App() {
  const demoRef = useRef<HTMLDivElement>(null);
  const impactRef = useRef<HTMLDivElement>(null);
  const wikiRef = useRef<HTMLDivElement>(null);

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ExoplanetProvider>
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

          {/* Impact Simulation Placeholder */}
          <section ref={impactRef} className="min-h-screen flex items-center justify-center">
            <div className="max-w-4xl w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4">Impact Simulation</h2>
              <p className="text-gray-300">Coming soon: physics-based asteroid/stellar interaction simulator with NASA data.</p>
            </div>
          </section>

          {/* Celestial Wiki Placeholder */}
          <section ref={wikiRef} className="min-h-screen flex items-center justify-center">
            <div className="max-w-4xl w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4">Celestial Wiki</h2>
              <p className="text-gray-300">Interactive encyclopedia for planets, stars, black holes, and more.</p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ExoplanetProvider>
  );
}

export default App;