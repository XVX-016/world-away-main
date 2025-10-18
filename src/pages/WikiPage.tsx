import React, { useState, useEffect } from 'react';
import { Search, Star, Globe, Zap, Target, TrendingUp, BookOpen, Info } from 'lucide-react';

interface CelestialObject {
  id: string;
  name: string;
  type: 'planet' | 'star' | 'moon' | 'asteroid' | 'comet' | 'blackhole';
  description: string;
  overview: string;
  characteristics: {
    physical: string[];
    orbital: string[];
    atmospheric?: string[];
  };
  discovery: {
    date: string;
    discoverer: string;
    method: string;
    significance: string;
  };
  properties: {
    size?: number;
    distance?: number;
    temperature?: number;
    mass?: number;
    orbitalPeriod?: number;
    radius?: number;
    density?: number;
    gravity?: number;
    escapeVelocity?: number;
  };
  references: string[];
  relatedObjects: string[];
  image?: string;
}

const WikiPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedObject, setSelectedObject] = useState<CelestialObject | null>(null);

  // Comprehensive celestial objects database
  const celestialObjects: CelestialObject[] = [
    {
      id: '1',
      name: 'Kepler-452b',
      type: 'planet',
      description: 'Kepler-452b is a super-Earth exoplanet orbiting within the inner edge of the habitable zone of the Sun-like star Kepler-452, and is the first planet with a near-Earth-size orbit in the habitable zone of a G2-type star.',
      overview: 'Kepler-452b is located about 1,402 light-years from Earth in the constellation Cygnus. It was discovered by NASA\'s Kepler Space Telescope and is the first near-Earth-size planet discovered in the habitable zone of a G2-type star, making it a prime candidate for the search for extraterrestrial life.',
      characteristics: {
        physical: [
          'Radius approximately 1.6 times that of Earth',
          'Mass estimated at 5 Earth masses',
          'Density similar to Earth, suggesting a rocky composition',
          'Surface gravity about 2.5 times Earth\'s gravity'
        ],
        orbital: [
          'Orbital period of 385 days (5% longer than Earth\'s year)',
          'Semi-major axis of 1.046 AU from its star',
          'Eccentricity of 0.0 (nearly circular orbit)',
          'Receives 10% more stellar flux than Earth'
        ],
        atmospheric: [
          'May have a thick atmosphere due to higher surface gravity',
          'Potential for water vapor and other greenhouse gases',
          'Atmospheric composition unknown but could support life'
        ]
      },
      discovery: {
        date: '2015-07-23',
        discoverer: 'Kepler Science Team',
        method: 'Transit photometry',
        significance: 'First Earth-size planet in the habitable zone of a Sun-like star'
      },
      properties: {
        size: 1.6,
        distance: 1402,
        temperature: 265,
        mass: 5.0,
        orbitalPeriod: 385,
        radius: 1.6,
        density: 5.5,
        gravity: 2.5
      },
      references: [
        'Jenkins, J. M., et al. (2015). "Discovery and Validation of Kepler-452b: A 1.6 R⊕ Super Earth Exoplanet in the Habitable Zone of a G2 Star." The Astronomical Journal.',
        'NASA Exoplanet Archive. "Kepler-452 b."',
        'Torres, G., et al. (2015). "Validation of Twelve Small Kepler Transiting Planets in the Habitable Zone." The Astrophysical Journal.'
      ],
      relatedObjects: ['Kepler-452', 'Kepler-452c', 'Kepler-186f']
    },
    {
      id: '2',
      name: 'Proxima Centauri b',
      type: 'planet',
      description: 'Proxima Centauri b is an exoplanet orbiting within the habitable zone of the red dwarf star Proxima Centauri, the closest star to the Sun at a distance of 4.2 light-years.',
      overview: 'Discovered in 2016, Proxima Centauri b is the closest known exoplanet to Earth and orbits within the habitable zone of its star. Despite being in the habitable zone, the planet faces significant challenges including intense stellar flares and potential tidal locking.',
      characteristics: {
        physical: [
          'Minimum mass of 1.27 Earth masses',
          'Radius estimated at 1.3 Earth radii',
          'Density suggests a rocky composition',
          'Surface gravity similar to Earth'
        ],
        orbital: [
          'Orbital period of 11.2 days',
          'Semi-major axis of 0.0485 AU',
          'Eccentricity of 0.0 (circular orbit)',
          'Receives 65% of Earth\'s stellar flux'
        ],
        atmospheric: [
          'May have lost its atmosphere due to stellar activity',
          'Potential for water if atmosphere is retained',
          'Subject to intense X-ray and UV radiation'
        ]
      },
      discovery: {
        date: '2016-08-24',
        discoverer: 'European Southern Observatory',
        method: 'Radial velocity',
        significance: 'Closest known exoplanet to Earth'
      },
      properties: {
        size: 1.3,
        distance: 4.2,
        temperature: 234,
        mass: 1.27,
        orbitalPeriod: 11.2,
        radius: 1.3,
        density: 5.0
      },
      references: [
        'Anglada-Escudé, G., et al. (2016). "A terrestrial planet candidate in a temperate orbit around Proxima Centauri." Nature.',
        'ESO Press Release. "Planet Found in Habitable Zone Around Nearest Star."',
        'Ribas, I., et al. (2016). "The habitability of Proxima Centauri b." Astronomy & Astrophysics.'
      ],
      relatedObjects: ['Proxima Centauri', 'Alpha Centauri A', 'Alpha Centauri B']
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
                {/* Wikipedia-style header */}
                <div className="border-b border-white/10 pb-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${getTypeColor(selectedObject.type)}`}>
                      {selectedObject.type === 'planet' && <Star className="w-6 h-6" />}
                      {selectedObject.type === 'star' && <Zap className="w-6 h-6" />}
                      {selectedObject.type === 'blackhole' && <Target className="w-6 h-6" />}
                      {selectedObject.type === 'asteroid' && <TrendingUp className="w-6 h-6" />}
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white">{selectedObject.name}</h1>
                      <p className="text-gray-400 capitalize text-lg">{selectedObject.type}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-lg leading-relaxed">{selectedObject.description}</p>
                </div>

                {/* Wikipedia-style content sections */}
                <div className="space-y-8">
                  {/* Overview */}
                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">Overview</h2>
                    <p className="text-gray-300 leading-relaxed">{selectedObject.overview}</p>
                  </section>

                  {/* Characteristics */}
                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">Characteristics</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Physical Properties</h3>
                        <ul className="space-y-2">
                          {selectedObject.characteristics.physical.map((char, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-300">
                              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                              <span>{char}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Orbital Properties</h3>
                        <ul className="space-y-2">
                          {selectedObject.characteristics.orbital.map((char, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-300">
                              <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                              <span>{char}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {selectedObject.characteristics.atmospheric && (
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-3">Atmospheric Properties</h3>
                          <ul className="space-y-2">
                            {selectedObject.characteristics.atmospheric.map((char, index) => (
                              <li key={index} className="flex items-start gap-2 text-gray-300">
                                <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{char}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Discovery */}
                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">Discovery</h2>
                    <div className="bg-white/5 rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-400 text-sm">Discovery Date:</span>
                          <p className="text-white font-semibold">{selectedObject.discovery.date}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Discoverer:</span>
                          <p className="text-white font-semibold">{selectedObject.discovery.discoverer}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Method:</span>
                          <p className="text-white font-semibold">{selectedObject.discovery.method}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Significance:</span>
                          <p className="text-white font-semibold">{selectedObject.discovery.significance}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Physical Properties Table */}
                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">Physical Properties</h2>
                    <div className="bg-white/5 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <tbody>
                          {Object.entries(selectedObject.properties).map(([key, value]) => (
                            <tr key={key} className="border-b border-white/10 last:border-b-0">
                              <td className="px-4 py-3 text-gray-400 capitalize font-medium">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </td>
                              <td className="px-4 py-3 text-white font-semibold">
                                {typeof value === 'number' ? value.toFixed(2) : value}
                                {key === 'size' || key === 'radius' ? ' R⊕' : ''}
                                {key === 'distance' ? ' ly' : ''}
                                {key === 'temperature' ? ' K' : ''}
                                {key === 'mass' ? ' M⊕' : ''}
                                {key === 'orbitalPeriod' ? ' days' : ''}
                                {key === 'density' ? ' g/cm³' : ''}
                                {key === 'gravity' ? ' g' : ''}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* References */}
                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">References</h2>
                    <ol className="space-y-2">
                      {selectedObject.references.map((ref, index) => (
                        <li key={index} className="text-gray-300 text-sm leading-relaxed">
                          <span className="text-blue-400 font-semibold">[{index + 1}]</span> {ref}
                        </li>
                      ))}
                    </ol>
                  </section>

                  {/* Related Objects */}
                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">See Also</h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedObject.relatedObjects.map((obj, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                          {obj}
                        </span>
                      ))}
                    </div>
                  </section>
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
