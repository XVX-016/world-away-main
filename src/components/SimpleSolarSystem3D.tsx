import React, { useState, useEffect, useRef } from 'react';

interface SimpleSolarSystem3DProps {
  currentPlanet: number;
  onPlanetSelect: (index: number) => void;
}

const SimpleSolarSystem3D: React.FC<SimpleSolarSystem3DProps> = ({ currentPlanet, onPlanetSelect }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const planets = [
    { name: 'Mercury', distance: 60, size: 8, color: '#8C7853', speed: 0.02 },
    { name: 'Venus', distance: 80, size: 12, color: '#FFC649', speed: 0.015 },
    { name: 'Earth', distance: 100, size: 12, color: '#6B93D6', speed: 0.01 },
    { name: 'Mars', distance: 120, size: 10, color: '#C1440E', speed: 0.008 },
    { name: 'Jupiter', distance: 160, size: 20, color: '#D8CA9D', speed: 0.003 },
    { name: 'Saturn', distance: 200, size: 18, color: '#FAD5A5', speed: 0.002 },
    { name: 'Uranus', distance: 240, size: 14, color: '#4FD0E7', speed: 0.001 },
    { name: 'Neptune', distance: 280, size: 14, color: '#4B70DD', speed: 0.0005 }
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer"
      style={{ perspective: '1200px' }}
    >
      {/* Sun */}
      <div className="absolute w-8 h-8 bg-yellow-400 rounded-full shadow-2xl shadow-yellow-400/50 animate-pulse z-10" style={{ transform: 'translateZ(100px)' }}>
        <div className="absolute inset-0 w-6 h-6 bg-yellow-300/30 rounded-full animate-ping"></div>
      </div>

      {/* Orbital Rings */}
      {planets.map((planet, index) => (
        <div
          key={`orbit-${index}`}
          className="absolute border border-white/10 rounded-full"
          style={{
            width: `${planet.distance * 2}px`,
            height: `${planet.distance * 2}px`,
            transform: 'rotateX(75deg)'
          }}
        />
      ))}

      {/* Planets */}
      {planets.map((planet, index) => {
        const angle = (360 / planets.length) * index;
        const isActive = index === currentPlanet;
        const isHovered = false;

        return (
          <div
            key={planet.name}
            className={`absolute rounded-full cursor-pointer transition-all duration-500 ${
              isActive ? 'scale-150 z-20' : isHovered ? 'scale-125 z-15' : 'scale-100 z-10'
            }`}
            style={{
              width: `${planet.size}px`,
              height: `${planet.size}px`,
              backgroundColor: planet.color,
              left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * planet.distance}px)`,
              top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * (planet.distance * 0.25)}px)`,
              transform: 'translate(-50%, -50%) translateZ(100px)',
              boxShadow: isActive 
                ? `0 0 30px ${planet.color}60, 0 0 60px ${planet.color}40`
                : isHovered
                ? `0 0 20px ${planet.color}40`
                : `0 0 10px ${planet.color}30`,
              animation: `orbit-${index} ${20 / planet.speed}s linear infinite`
            }}
            onClick={() => onPlanetSelect(index)}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
          >
            {isActive && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-sm font-bold whitespace-nowrap bg-black/50 px-3 py-1 rounded-full">
                {planet.name}
              </div>
            )}
          </div>
        );
      })}

      <style>{`
        ${planets
          .map((p, i) => `
          @keyframes orbit-${i} {
            from { transform: translate(-50%, -50%) translateZ(100px) rotate(0deg) translateX(${p.distance}px) rotate(0deg); }
            to { transform: translate(-50%, -50%) translateZ(100px) rotate(360deg) translateX(${p.distance}px) rotate(-360deg); }
          }
        `)
          .join('\n')}
      `}</style>
    </div>
  );
};

export default SimpleSolarSystem3D;
