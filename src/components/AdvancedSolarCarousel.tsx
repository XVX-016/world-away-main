import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Simple3DStarfield from './Simple3DStarfield';
import InteractiveSolarSystem from './InteractiveSolarSystem';

interface Planet {
  id: string;
  name: string;
  distance: number;
  size: number;
  color: string;
  speed: number;
  description: string;
  facts: string[];
  temperature: string;
  moons: number;
  type: string;
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
    facts: ['No atmosphere', 'Extreme temperature variations', 'Fastest orbital speed'],
    temperature: '427°C to -173°C',
    moons: 0,
    type: 'Terrestrial'
  },
  {
    id: 'venus',
    name: 'Venus',
    distance: 0.72,
    size: 0.95,
    color: '#FFC649',
    speed: 1.62,
    description: 'The hottest planet in our solar system with a thick atmosphere.',
    facts: ['Hottest planet', 'Retrograde rotation', 'Dense atmosphere'],
    temperature: '462°C',
    moons: 0,
    type: 'Terrestrial'
  },
  {
    id: 'earth',
    name: 'Earth',
    distance: 1.0,
    size: 1.0,
    color: '#6B93D6',
    speed: 1.0,
    description: 'Our home planet, the only known planet with life.',
    facts: ['Only planet with life', '71% water coverage', 'Protective magnetic field'],
    temperature: '15°C average',
    moons: 1,
    type: 'Terrestrial'
  },
  {
    id: 'mars',
    name: 'Mars',
    distance: 1.52,
    size: 0.53,
    color: '#C1440E',
    speed: 0.53,
    description: 'The Red Planet, known for its iron oxide surface.',
    facts: ['Red due to iron oxide', 'Two small moons', 'Largest volcano in solar system'],
    temperature: '-65°C average',
    moons: 2,
    type: 'Terrestrial'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    distance: 5.2,
    size: 11.2,
    color: '#D8CA9D',
    speed: 0.084,
    description: 'The largest planet in our solar system, a gas giant.',
    facts: ['Largest planet', 'Great Red Spot storm', '79+ moons'],
    temperature: '-110°C',
    moons: 79,
    type: 'Gas Giant'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    distance: 9.58,
    size: 9.4,
    color: '#FAD5A5',
    speed: 0.034,
    description: 'Famous for its prominent ring system made of ice and rock.',
    facts: ['Famous ring system', 'Less dense than water', '82+ moons'],
    temperature: '-140°C',
    moons: 82,
    type: 'Gas Giant'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    distance: 19.2,
    size: 4.0,
    color: '#4FD0E7',
    speed: 0.012,
    description: 'An ice giant that rotates on its side.',
    facts: ['Rotates on its side', 'Ice giant', 'Faint ring system'],
    temperature: '-195°C',
    moons: 27,
    type: 'Ice Giant'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    distance: 30.1,
    size: 3.9,
    color: '#4B70DD',
    speed: 0.006,
    description: 'The windiest planet with the strongest winds in the solar system.',
    facts: ['Strongest winds', 'Farthest planet', 'Dark blue color'],
    temperature: '-200°C',
    moons: 14,
    type: 'Ice Giant'
  }
];

export const AdvancedSolarCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Auto-advance removed per UI cleanup; navigation via arrows only

  const nextPlanet = () => {
    setCurrentIndex((prev) => (prev + 1) % planets.length);
  };

  const prevPlanet = () => {
    setCurrentIndex((prev) => (prev - 1 + planets.length) % planets.length);
  };

  // optional reset kept for future use; not currently exposed

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* 3D Starfield Background - Full Coverage */}
      <div className="absolute inset-0 w-full h-full">
        <Simple3DStarfield />
      </div>

      {/* 3D Solar System Model */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="w-full h-full pointer-events-auto">
          <InteractiveSolarSystem 
            currentPlanet={currentIndex} 
            onPlanetSelect={setCurrentIndex} 
          />
        </div>
      </div>

      {/* Minimal Controls - Top Right (pause/refresh removed) */}
      <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={prevPlanet}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300 transform hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={nextPlanet}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300 transform hover:scale-110"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

          {/* Progress Indicators */}
        <div className="flex justify-center gap-1">
            {planets.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                  ? 'bg-white scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
