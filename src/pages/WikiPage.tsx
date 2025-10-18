import React, { useState, useEffect } from 'react';
import { Search, Star, Globe, Zap, Target, TrendingUp, BookOpen, Info } from 'lucide-react';

interface CelestialObject {
  id: string;
  name: string;
  type: 'planet' | 'star' | 'moon' | 'asteroid' | 'comet' | 'blackhole';
  description: string;
  facts: string[];
  properties: {
    size?: number;
    distance?: number;
    temperature?: number;
    mass?: number;
    orbitalPeriod?: number;
  };
  discoveryDate?: string;
  discoverer?: string;
  image?: string;
}

const WikiPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedObject, setSelectedObject] = useState<CelestialObject | null>(null);

  // Sample celestial objects database
  const celestialObjects: CelestialObject[] = [
    {
      id: '1',
      name: 'Kepler-452b',
      type: 'planet',
      description: 'Kepler-452b is an exoplanet orbiting the Sun-like star Kepler-452 about 1,402 light-years from Earth in the constellation Cygnus.',
      facts: [
        'First near-Earth-size planet discovered in the habitable zone of a G2-type star',
        'Orbits its star every 385 days',
        'About 60% larger than Earth',
        'Located in the "Goldilocks zone" where liquid water could exist'
      ],
      properties: {
        size: 1.6,
        distance: 1402,
        temperature: 265,
        orbitalPeriod: 385
      },
      discoveryDate: '2015-07-23',
      discoverer: 'Kepler Space Telescope'
    },
    {
      id: '2',
      name: 'Proxima Centauri b',
      type: 'planet',
      description: 'Proxima Centauri b is an exoplanet orbiting within the habitable zone of the red dwarf star Proxima Centauri, the closest star to the Sun.',
      facts: [
        'Closest known exoplanet to Earth',
        'Located in the habitable zone of its star',
        'Receives about 65% of the radiation Earth gets from the Sun',
        'May be tidally locked to its star'
      ],
      properties: {
        size: 1.3,
        distance: 4.2,
        temperature: 234,
        orbitalPeriod: 11.2
      },
      discoveryDate: '2016-08-24',
      discoverer: 'European Southern Observatory'
    },
    {
      id: '3',
      name: 'TRAPPIST-1',
      type: 'star',
      description: 'TRAPPIST-1 is an ultra-cool red dwarf star located 39 light-years away from Earth in the constellation Aquarius.',
      facts: [
        'Ultra-cool red dwarf star',
        'Much smaller and cooler than the Sun',
        'Hosts at least 7 Earth-sized planets',
        'Three planets are in the habitable zone'
      ],
      properties: {
        size: 0.12,
        temperature: 2550,
        mass: 0.08
      },
      discoveryDate: '2016-05-02',
      discoverer: 'TRAPPIST telescope'
    },
    {
      id: '4',
      name: 'Sagittarius A*',
      type: 'blackhole',
      description: 'Sagittarius A* is a supermassive black hole located at the center of the Milky Way galaxy.',
      facts: [
        'Mass of about 4.1 million solar masses',
        'Located at the center of our galaxy',
        'First black hole to be directly imaged',
        'Surrounded by a hot accretion disk'
      ],
      properties: {
        mass: 4100000,
        distance: 26000
      },
      discoveryDate: '1974',
      discoverer: 'Bruce Balick and Robert Brown'
    },
    {
      id: '5',
      name: 'Ceres',
      type: 'asteroid',
      description: 'Ceres is the largest object in the asteroid belt between Mars and Jupiter and the only dwarf planet in the inner solar system.',
      facts: [
        'Largest object in the asteroid belt',
        'Contains more fresh water than Earth',
        'Has a thin atmosphere of water vapor',
        'Classified as both an asteroid and a dwarf planet'
      ],
      properties: {
        size: 0.074,
        distance: 2.77,
        orbitalPeriod: 1680
      },
      discoveryDate: '1801-01-01',
      discoverer: 'Giuseppe Piazzi'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Objects', icon: Globe },
    { id: 'planet', name: 'Exoplanets', icon: Star },
    { id: 'star', name: 'Stars', icon: Zap },
    { id: 'blackhole', name: 'Black Holes', icon: Target },
    { id: 'asteroid', name: 'Asteroids', icon: TrendingUp }
  ];

  const filteredObjects = celestialObjects.filter(obj => {
    const matchesSearch = obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         obj.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || obj.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'planet': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'star': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'blackhole': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'asteroid': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold">Celestial Wiki</h1>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search celestial objects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Object List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Celestial Objects ({filteredObjects.length})</h2>
            <div className="space-y-4">
              {filteredObjects.map(obj => (
                <div
                  key={obj.id}
                  onClick={() => setSelectedObject(obj)}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${getTypeColor(obj.type)}`}>
                        {obj.type === 'planet' && <Star className="w-6 h-6" />}
                        {obj.type === 'star' && <Zap className="w-6 h-6" />}
                        {obj.type === 'blackhole' && <Target className="w-6 h-6" />}
                        {obj.type === 'asteroid' && <TrendingUp className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{obj.name}</h3>
                        <p className="text-gray-400 capitalize">{obj.type}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm border ${getTypeColor(obj.type)}`}>
                      {obj.type}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4 line-clamp-2">{obj.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {obj.properties.size && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">
                        Size: {obj.properties.size} R⊕
                      </span>
                    )}
                    {obj.properties.distance && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                        Distance: {obj.properties.distance} ly
                      </span>
                    )}
                    {obj.properties.temperature && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-sm">
                        Temp: {obj.properties.temperature}K
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Object Details */}
          <div className="lg:col-span-1">
            {selectedObject ? (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 sticky top-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${getTypeColor(selectedObject.type)}`}>
                    {selectedObject.type === 'planet' && <Star className="w-6 h-6" />}
                    {selectedObject.type === 'star' && <Zap className="w-6 h-6" />}
                    {selectedObject.type === 'blackhole' && <Target className="w-6 h-6" />}
                    {selectedObject.type === 'asteroid' && <TrendingUp className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedObject.name}</h3>
                    <p className="text-gray-400 capitalize">{selectedObject.type}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Description</h4>
                    <p className="text-gray-300">{selectedObject.description}</p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Key Facts</h4>
                    <ul className="space-y-2">
                      {selectedObject.facts.map((fact, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-300">
                          <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedObject.properties && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Properties</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(selectedObject.properties).map(([key, value]) => (
                          <div key={key} className="bg-white/5 rounded-lg p-3">
                            <div className="text-gray-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                            <div className="text-white font-semibold">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedObject.discoveryDate && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Discovery</h4>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-gray-300">
                          <strong>Date:</strong> {selectedObject.discoveryDate}
                        </div>
                        {selectedObject.discoverer && (
                          <div className="text-gray-300 mt-2">
                            <strong>Discoverer:</strong> {selectedObject.discoverer}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Select an Object</h3>
                <p className="text-gray-400">Choose a celestial object from the list to view detailed information.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WikiPage;
