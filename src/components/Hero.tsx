import React from 'react';
import { ChevronDown, Telescope, Zap } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative px-6">
      <div className="text-center max-w-4xl mx-auto bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-10 shadow-2xl shadow-black/40">
        {/* NASA Logo Placeholder */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Telescope className="w-10 h-10 text-white" />
          </div>
        </div>
        
        {/* Main Title with Animation */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
          A World Away
        </h1>
        
        {/* Subtitle */}
        <p className="text-2xl md:text-3xl text-blue-300 mb-8 font-light">
          Exploring Exoplanets with AI
        </p>
        
        {/* Challenge Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-blue-500/30 rounded-full px-6 py-3 mb-12">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span className="text-blue-200 font-medium">NASA Space Apps Challenge 2024</span>
        </div>
        
        {/* Project Description */}
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Harness the power of artificial intelligence to detect exoplanets from light curve data. 
          Our advanced machine learning models analyze stellar brightness variations to identify 
          planetary transits with unprecedented accuracy.
        </p>
        
        {/* CTA Button */}
        <button
          onClick={onExploreClick}
          className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
        >
          <span className="text-lg">Explore Data</span>
          <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
        </button>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
      <div className="absolute bottom-40 right-20 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 right-10 w-1 h-1 bg-pink-400 rounded-full animate-bounce"></div>
    </section>
  );
};