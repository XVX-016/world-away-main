import React, { useState, useEffect } from 'react';

export const SimpleSolarSystem: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-black" />
    );
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Animated Solar System with CSS */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Sun */}
        <div className="absolute w-8 h-8 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 animate-pulse" />
        
        {/* Planets with CSS animations */}
        <div className="relative w-96 h-96">
          {/* Mercury */}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-spin" 
               style={{ 
                 animation: 'orbit 8s linear infinite',
                 transformOrigin: '0 0',
                 transform: 'translate(-50%, -50%) rotate(0deg) translateX(60px) rotate(0deg)'
               }} />
          
          {/* Venus */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-yellow-300 rounded-full transform -translate-x-1/2 -translate-y-1/2" 
               style={{ 
                 animation: 'orbit 12s linear infinite',
                 transformOrigin: '0 0',
                 transform: 'translate(-50%, -50%) rotate(0deg) translateX(80px) rotate(0deg)'
               }} />
          
          {/* Earth */}
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" 
               style={{ 
                 animation: 'orbit 16s linear infinite',
                 transformOrigin: '0 0',
                 transform: 'translate(-50%, -50%) rotate(0deg) translateX(100px) rotate(0deg)'
               }} />
          
          {/* Mars */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" 
               style={{ 
                 animation: 'orbit 20s linear infinite',
                 transformOrigin: '0 0',
                 transform: 'translate(-50%, -50%) rotate(0deg) translateX(120px) rotate(0deg)'
               }} />
          
          {/* Jupiter */}
          <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-orange-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" 
               style={{ 
                 animation: 'orbit 30s linear infinite',
                 transformOrigin: '0 0',
                 transform: 'translate(-50%, -50%) rotate(0deg) translateX(160px) rotate(0deg)'
               }} />
          
          {/* Saturn */}
          <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-yellow-200 rounded-full transform -translate-x-1/2 -translate-y-1/2" 
               style={{ 
                 animation: 'orbit 40s linear infinite',
                 transformOrigin: '0 0',
                 transform: 'translate(-50%, -50%) rotate(0deg) translateX(200px) rotate(0deg)'
               }} />
          
          {/* Uranus */}
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-cyan-300 rounded-full transform -translate-x-1/2 -translate-y-1/2" 
               style={{ 
                 animation: 'orbit 50s linear infinite',
                 transformOrigin: '0 0',
                 transform: 'translate(-50%, -50%) rotate(0deg) translateX(240px) rotate(0deg)'
               }} />
          
          {/* Neptune */}
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2" 
               style={{ 
                 animation: 'orbit 60s linear infinite',
                 transformOrigin: '0 0',
                 transform: 'translate(-50%, -50%) rotate(0deg) translateX(280px) rotate(0deg)'
               }} />
        </div>
      </div>
      
      {/* Add CSS keyframes for orbit animation */}
      <style jsx>{`
        @keyframes orbit {
          from { transform: translate(-50%, -50%) rotate(0deg) translateX(var(--radius, 60px)) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateX(var(--radius, 60px)) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
};
