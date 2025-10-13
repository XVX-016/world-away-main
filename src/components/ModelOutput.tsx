import React from 'react';
import { Brain, CheckCircle, XCircle, Loader, TrendingUp } from 'lucide-react';

interface ModelOutputProps {
  isAnalyzing: boolean;
  analysis: {
    isPlanet: boolean;
    confidence: number;
    transitDepth?: number;
    period?: number;
  } | null;
}

export const ModelOutput: React.FC<ModelOutputProps> = ({ isAnalyzing, analysis }) => {
  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-blue-300 font-medium">Analyzing light curve data...</p>
          <p className="text-gray-400 text-sm mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const confidencePercentage = Math.round(analysis.confidence * 100);
  const confidenceColor = analysis.confidence > 0.8 ? 'text-green-400' : 
                         analysis.confidence > 0.6 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="space-y-6">
      {/* Primary Result */}
      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
        {analysis.isPlanet ? (
          <CheckCircle className="w-12 h-12 text-green-400" />
        ) : (
          <XCircle className="w-12 h-12 text-red-400" />
        )}
        <div>
          <h4 className="text-2xl font-bold text-white mb-1">
            {analysis.isPlanet ? 'Planet Candidate Detected!' : 'No Planet Detected'}
          </h4>
          <p className={`text-lg font-semibold ${confidenceColor}`}>
            Confidence: {confidencePercentage}%
          </p>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Model Confidence</span>
          <span className={confidenceColor}>{confidencePercentage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              analysis.confidence > 0.8 ? 'bg-gradient-to-r from-green-400 to-green-500' :
              analysis.confidence > 0.6 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
              'bg-gradient-to-r from-red-400 to-red-500'
            }`}
            style={{ width: `${confidencePercentage}%` }}
          />
        </div>
      </div>

      {/* Additional Parameters */}
      {analysis.isPlanet && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300 text-sm font-medium">Transit Depth</span>
            </div>
            <p className="text-white text-xl font-bold">
              {(analysis.transitDepth! * 100).toFixed(3)}%
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300 text-sm font-medium">Period</span>
            </div>
            <p className="text-white text-xl font-bold">
              {analysis.period!.toFixed(2)} days
            </p>
          </div>
        </div>
      )}

      {/* Model Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-300 text-sm">
          <strong>Model:</strong> Deep Neural Network trained on Kepler light curves
          <br />
          <strong>Features:</strong> Transit depth, duration, periodicity, signal-to-noise ratio
        </p>
      </div>
    </div>
  );
};