import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';

interface Planet {
  id: string;
  name: string;
  distance: number;
  size: number;
  color: string;
  speed: number;
  description: string;
  facts: string[];
}

const planets: Planet[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    distance: 0.39,
    size: 0.38,
    color: '#8C7853',
    speed: 4.15,
    description: 'The smallest planet in our solar system and closest to the Sun.',
    facts: ['No atmosphere', 'Extreme temperature variations', 'Fastest orbital speed']
  },
  {
    id: 'venus',
    name: 'Venus',
    distance: 0.72,
    size: 0.95,
    color: '#FFC649',
    speed: 1.62,
    description: 'The hottest planet in our solar system with a thick atmosphere.',
    facts: ['Hottest planet', 'Retrograde rotation', 'Dense atmosphere']
  },
  {
    id: 'earth',
    name: 'Earth',
    distance: 1.0,
    size: 1.0,
    color: '#6B93D6',
    speed: 1.0,
    description: 'Our home planet, the only known planet with life.',
    facts: ['Only planet with life', '71% water coverage', 'Protective magnetic field']
  },
  {
    id: 'mars',
    name: 'Mars',
    distance: 1.52,
    size: 0.53,
    color: '#C1440E',
    speed: 0.53,
    description: 'The Red Planet, known for its iron oxide surface.',
    facts: ['Red due to iron oxide', 'Two small moons', 'Largest volcano in solar system']
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    distance: 5.2,
    size: 11.2,
    color: '#D8CA9D',
    speed: 0.084,
    description: 'The largest planet in our solar system, a gas giant.',
    facts: ['Largest planet', 'Great Red Spot storm', '79+ moons']
  },
  {
    id: 'saturn',
    name: 'Saturn',
    distance: 9.58,
    size: 9.4,
    color: '#FAD5A5',
    speed: 0.034,
    description: 'Famous for its prominent ring system made of ice and rock.',
    facts: ['Famous ring system', 'Less dense than water', '82+ moons']
  },
  {
    id: 'uranus',
    name: 'Uranus',
    distance: 19.2,
    size: 4.0,
    color: '#4FD0E7',
    speed: 0.012,
    description: 'An ice giant that rotates on its side.',
    facts: ['Rotates on its side', 'Ice giant', 'Faint ring system']
  },
  {
    id: 'neptune',
    name: 'Neptune',
    distance: 30.1,
    size: 3.9,
    color: '#4B70DD',
    speed: 0.006,
    description: 'The windiest planet with the strongest winds in the solar system.',
    facts: ['Strongest winds', 'Farthest planet', 'Dark blue color']
  }
];

export const SolarSystemCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % planets.length);
      }, 3000 / animationSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, animationSpeed]);

  const nextPlanet = () => {
    setCurrentIndex((prev) => (prev + 1) % planets.length);
  };

  const prevPlanet = () => {
    setCurrentIndex((prev) => (prev - 1 + planets.length) % planets.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetCarousel = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const currentPlanet = planets[currentIndex];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Enhanced Starfield Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-purple-900/20 to-black">
        {/* Animated Stars */}
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Solar System Visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-96 h-96">
          {/* Sun at center */}
          <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 animate-pulse transform -translate-x-1/2 -translate-y-1/2" />
          
          {/* Planets in orbit */}
          {planets.map((planet, index) => {
            const angle = (360 / planets.length) * index;
            const distance = 120 + (planet.distance * 20);
            const x = Math.cos((angle * Math.PI) / 180) * distance;
            const y = Math.sin((angle * Math.PI) / 180) * distance;
            const isActive = index === currentIndex;
            
            return (
              <div
                key={planet.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                  isActive ? 'scale-125 z-10' : 'scale-100 z-0'
                }`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                }}
              >
                <div
                  className="rounded-full shadow-lg transition-all duration-300"
                  style={{
                    width: `${Math.max(8, planet.size * 4)}px`,
                    height: `${Math.max(8, planet.size * 4)}px`,
                    backgroundColor: planet.color,
                    boxShadow: isActive 
                      ? `0 0 20px ${planet.color}50, 0 0 40px ${planet.color}30`
                      : `0 0 10px ${planet.color}30`
                  }}
                />
                {isActive && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium whitespace-nowrap">
                    {planet.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Planet Information Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6">
        <div className="max-w-4xl mx-auto">
          {/* Planet Details */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">{currentPlanet.name}</h2>
            <p className="text-gray-300 text-lg mb-4">{currentPlanet.description}</p>
            
            {/* Planet Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold text-white">{currentPlanet.distance} AU</div>
                <div className="text-sm text-gray-300">Distance from Sun</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold text-white">{currentPlanet.size} R⊕</div>
                <div className="text-sm text-gray-300">Size (Earth = 1)</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold text-white">{currentPlanet.speed} years</div>
                <div className="text-sm text-gray-300">Orbital Period</div>
              </div>
            </div>

            {/* Planet Facts */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {currentPlanet.facts.map((fact, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm"
                >
                  {fact}
                </span>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevPlanet}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={togglePlayPause}
              className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full transition-all duration-300 transform hover:scale-110"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={resetCarousel}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110"
            >
              <RotateCcw className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={nextPlanet}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {planets.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-500 scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Speed Control */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="text-gray-300 text-sm">Speed:</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              className="w-24 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-gray-300 text-sm">{animationSpeed}x</span>
          </div>
        </div>
      </div>
    </div>
  );
};
