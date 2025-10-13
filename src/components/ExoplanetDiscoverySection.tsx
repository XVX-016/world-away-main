import React, { useState } from 'react';
import { Search, Filter, Star, TrendingUp } from 'lucide-react';
import { ExoplanetDiscoveryCard, sampleExoplanets, ExoplanetData } from './ExoplanetDiscoveryCard';

export const ExoplanetDiscoverySection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [analyzedExoplanets, setAnalyzedExoplanets] = useState<ExoplanetData[]>([]);

  const handleAnalyze = (exoplanet: ExoplanetData) => {
    setAnalyzedExoplanets(prev => [...prev, exoplanet]);
  };

  const filteredExoplanets = sampleExoplanets.filter(exoplanet => {
    const matchesSearch = exoplanet.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterMethod === 'all' || exoplanet.discoveryMethod.toLowerCase().includes(filterMethod.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-4 py-2 mb-6">
            <Star className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-medium">Exoplanet Discovery</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover New Worlds
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore confirmed exoplanets and analyze them with our advanced ML models
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search exoplanets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
            />
          </div>
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-full text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
          >
            <option value="all">All Methods</option>
            <option value="transit">Transit Method</option>
            <option value="radial">Radial Velocity</option>
            <option value="direct">Direct Imaging</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{sampleExoplanets.length}</h3>
            <p className="text-gray-300">Total Exoplanets</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{analyzedExoplanets.length}</h3>
            <p className="text-gray-300">Analyzed</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {Math.round((analyzedExoplanets.length / sampleExoplanets.length) * 100)}%
            </h3>
            <p className="text-gray-300">Analysis Rate</p>
          </div>
        </div>

        {/* Exoplanet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExoplanets.map((exoplanet) => (
            <ExoplanetDiscoveryCard
              key={exoplanet.id}
              exoplanet={exoplanet}
              onAnalyze={handleAnalyze}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredExoplanets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Exoplanets Found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </section>
  );
};
