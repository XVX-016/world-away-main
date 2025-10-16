import { useEffect, useRef } from 'react';
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

  const scrollToImpact = () => {
    impactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToWiki = () => {
    wikiRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Arrow keys and swipe navigation across major sections
  useEffect(() => {
    const sections: HTMLElement[] = [
      document.body, // Hero top
      demoRef.current!,
      impactRef.current!,
      wikiRef.current!
    ].filter(Boolean) as HTMLElement[];

    const getCurrentIndex = () => {
      const y = window.scrollY + window.innerHeight / 3;
      let idx = 0;
      for (let i = 0; i < sections.length; i++) {
        const top = sections[i].offsetTop;
        if (y >= top) idx = i;
      }
      return idx;
    };

    const scrollToIndex = (idx: number) => {
      const clamped = Math.max(0, Math.min(idx, sections.length - 1));
      sections[clamped].scrollIntoView({ behavior: 'smooth' });
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToIndex(getCurrentIndex() + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToIndex(getCurrentIndex() - 1);
      }
    };

    let touchStartY = 0;
    let touchEndY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      const delta = touchEndY - touchStartY;
      if (Math.abs(delta) > 60) {
        if (delta < 0) scrollToIndex(getCurrentIndex() + 1);
        else scrollToIndex(getCurrentIndex() - 1);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      touchEndY = e.touches[0].clientY;
    };

    window.addEventListener('keydown', onKey, { passive: false } as EventListenerOptions);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey as any);
      window.removeEventListener('touchstart', onTouchStart as any);
      window.removeEventListener('touchmove', onTouchMove as any);
      window.removeEventListener('touchend', onTouchEnd as any);
    };
  }, []);

  return (
    <ExoplanetProvider>
      <div className="min-h-screen text-white overflow-x-hidden">
        {/* Background layers */}
        <AdvancedSolarCarousel />

        {/* Main Content */}
        <main className="relative z-20">
          {/* Hero Section */}
          <Hero onExploreClick={scrollToDemo} />

          {/* Top-right navigation buttons */}
          <div className="fixed top-4 right-4 z-40 flex gap-2">
            <button onClick={scrollToDemo} className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20">Data</button>
            <button onClick={scrollToImpact} className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20">Impact</button>
            <button onClick={scrollToWiki} className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20">Wiki</button>
          </div>

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