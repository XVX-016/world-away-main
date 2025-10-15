import React, { useState } from 'react';
import { Globe, Star, Zap, TrendingUp, Eye, Target, Brain, Calendar } from 'lucide-react';
import { ExoplanetCandidate } from '../utils/exoplanetDetector';

interface ExoplanetDiscoveryCardProps {
  exoplanet: ExoplanetCandidate;
  onAnalyze: () => void;
  isAnalyzed?: boolean;
}

export const ExoplanetDiscoveryCard: React.FC<ExoplanetDiscoveryCardProps> = ({ 
  exoplanet, 
  onAnalyze,
  isAnalyzed = false
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsAnalyzing(false);
    onAnalyze();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-400';
    if (confidence > 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence > 0.8) return 'bg-green-500/20 border-green-500/30';
    if (confidence > 0.6) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold text-white truncate">{exoplanet.name}</h3>
            <p className="text-gray-400 text-sm">Exoplanet Candidate</p>
            {exoplanet.hostStar && (
              <p className="text-gray-500 text-xs">Host: {exoplanet.hostStar}</p>
            )}
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getConfidenceBg(exoplanet.confidence)} flex-shrink-0`}>
          <span className={getConfidenceColor(exoplanet.confidence)}>
            {(exoplanet.confidence * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-300 text-sm">Distance</span>
          </div>
          <p className="text-white font-bold">{exoplanet.distance.toFixed(1)} ly</p>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300 text-sm">Size</span>
          </div>
          <p className="text-white font-bold">{exoplanet.size.toFixed(1)} R⊕</p>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-red-400" />
            <span className="text-gray-300 text-sm">Temperature</span>
          </div>
          <p className="text-white font-bold">{exoplanet.temperature}K</p>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-gray-300 text-sm">Orbital Period</span>
          </div>
          <p className="text-white font-bold">{exoplanet.orbitalPeriod} days</p>
        </div>
      </div>

      {/* Discovery Method and Date */}
      <div className="mb-6 flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-4 h-4 text-purple-400" />
          <span className="text-gray-300 text-sm">Discovery Method</span>
        </div>
        <p className="text-white font-medium mb-3">{exoplanet.discoveryMethod}</p>
        
        {exoplanet.discoveryDate && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Discovered: {exoplanet.discoveryDate}</span>
          </div>
        )}
      </div>

      {/* Analysis Button */}
      <div className="mt-auto">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || isAnalyzed}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </>
          ) : isAnalyzed ? (
            <>
              <TrendingUp className="w-4 h-4" />
              Analysis Complete
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              Analyze with ML Model
            </>
          )}
        </button>

        {/* Analysis Status */}
        {isAnalyzed && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-300 text-sm">
              ✓ Analysis complete! This exoplanet has been processed by our ML model.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

