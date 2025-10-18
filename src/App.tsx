import { useState } from 'react';
import { AdvancedSolarCarousel } from './components/AdvancedSolarCarousel';
import { Hero } from './components/Hero';
import { DemoSection } from './components/DemoSection';
import { ExoplanetDiscoverySection } from './components/ExoplanetDiscoverySection';
import { Footer } from './components/Footer';
import { Navigation } from './components/Navigation';
import { ExoplanetProvider } from './contexts/ExoplanetContext';
import WikiPage from './pages/WikiPage';
import ImpactSimulationPage from './pages/ImpactSimulationPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="min-h-screen text-white overflow-x-hidden">
            {/* Background layers */}
            <AdvancedSolarCarousel />

            {/* Main Content */}
            <main className="relative z-20">
              {/* Hero Section */}
              <Hero onExploreClick={() => setCurrentPage('demo')} />

              {/* Demo Section */}
              <DemoSection />

              {/* Exoplanet Discovery Section */}
              <ExoplanetDiscoverySection />
            </main>

            {/* Footer */}
            <Footer />
          </div>
        );
      case 'demo':
        return (
          <div className="min-h-screen text-white overflow-x-hidden">
            {/* Background layers */}
            <AdvancedSolarCarousel />

            {/* Main Content */}
            <main className="relative z-20">
              {/* Demo Section */}
              <DemoSection />

              {/* Exoplanet Discovery Section */}
              <ExoplanetDiscoverySection />
            </main>

            {/* Footer */}
            <Footer />
          </div>
        );
      case 'wiki':
        return <WikiPage />;
      case 'impact':
        return <ImpactSimulationPage />;
      default:
        return (
          <div className="min-h-screen text-white overflow-x-hidden">
            {/* Background layers */}
            <AdvancedSolarCarousel />

            {/* Main Content */}
            <main className="relative z-20">
              {/* Hero Section */}
              <Hero onExploreClick={() => setCurrentPage('demo')} />

              {/* Demo Section */}
              <DemoSection />

              {/* Exoplanet Discovery Section */}
              <ExoplanetDiscoverySection />
            </main>

            {/* Footer */}
            <Footer />
          </div>
        );
    }
  };

  return (
    <ExoplanetProvider>
      <div className="min-h-screen text-white overflow-x-hidden">
        {/* Navigation */}
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        
        {/* Page Content */}
        {renderPage()}
      </div>
    </ExoplanetProvider>
  );
}

export default App;