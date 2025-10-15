import React from 'react';
import { ChevronDown, Telescope, Zap } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative px-6">
      {/* NASA Logo Placeholder */}
      <div className="mb-8 flex justify-center">
        <div className="w-20 h-20 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center mb-4">
          <Telescope className="w-10 h-10 text-white" />
        </div>
      </div>
      
      {/* Main Title with Animation */}
      <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent animate-pulse text-center">
        A World Away
      </h1>
      
      {/* Subtitle */}
      <p className="text-2xl md:text-3xl text-gray-300 mb-8 font-light text-center">
        Exploring Exoplanets with AI
      </p>
      
      {/* Challenge Badge removed */}
      
      {/* Project Description */}
      <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed text-center">
        Harness the power of artificial intelligence to detect exoplanets from light curve data. 
        Our advanced machine learning models analyze stellar brightness variations to identify 
        planetary transits with unprecedented accuracy.
      </p>
      
      {/* CTA Button */}
      <button
        onClick={onExploreClick}
        className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-gray-500/25"
      >
        <span className="text-lg">Explore Data</span>
        <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
      </button>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-ping"></div>
      <div className="absolute bottom-40 right-20 w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 right-10 w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
    </section>
  );
};