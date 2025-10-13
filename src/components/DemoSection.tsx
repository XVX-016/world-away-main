import React, { useState } from 'react';
import { Upload, Brain, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { LightCurveChart } from './LightCurveChart';
import { ModelOutput } from './ModelOutput';
import { FeatureImportance } from './FeatureImportance';
import { MLModelTraining } from './MLModelTraining';

export interface LightCurveData {
  time: number;
  flux: number;
}

export const DemoSection: React.FC = () => {
  const [data, setData] = useState<LightCurveData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    isPlanet: boolean;
    confidence: number;
    transitDepth?: number;
    period?: number;
  } | null>(null);

  const handleDataUpload = (newData: LightCurveData[]) => {
    setData(newData);
    setAnalysis(null);
    
    // Simulate AI analysis
    setIsAnalyzing(true);
    setTimeout(() => {
      const mockAnalysis = {
        isPlanet: Math.random() > 0.3,
        confidence: 0.7 + Math.random() * 0.25,
        transitDepth: 0.001 + Math.random() * 0.01,
        period: 2 + Math.random() * 10
      };
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <section id="demo" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2 mb-6">
            <Brain className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-medium">AI Detection Lab</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Detect Exoplanets in Real-Time
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Upload your light curve data and watch our AI model identify potential planetary transits
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Data Input */}
          <div className="space-y-8">
            {/* File Upload */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Upload className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">Upload Light Curve Data</h3>
              </div>
              <FileUpload onDataLoad={handleDataUpload} />
            </div>

            {/* ML Model Training */}
            <MLModelTraining />

            {/* Model Status */}
            {(isAnalyzing || analysis) && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white">AI Model Analysis</h3>
                </div>
                <ModelOutput isAnalyzing={isAnalyzing} analysis={analysis} />
              </div>
            )}
          </div>

          {/* Right Column - Visualization */}
          <div className="space-y-8">
            {/* Light Curve Chart */}
            {data.length > 0 && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-semibold text-white">Light Curve Visualization</h3>
                </div>
                <LightCurveChart data={data} />
              </div>
            )}

            {/* Feature Importance */}
            {analysis && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-semibold text-white">Feature Importance (SHAP)</h3>
                </div>
                <FeatureImportance />
              </div>
            )}
          </div>
        </div>

        {/* Sample Data Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => {
              // Generate sample data
              const sampleData: LightCurveData[] = [];
              for (let i = 0; i < 1000; i++) {
                const time = i * 0.1;
                let flux = 1.0 + Math.random() * 0.001;
                
                // Add transit-like dips
                if ((time % 5) < 0.3) {
                  flux *= 0.995;
                }
                
                sampleData.push({ time, flux });
              }
              handleDataUpload(sampleData);
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            <CheckCircle className="w-5 h-5" />
            Try Sample Data
          </button>
        </div>
      </div>
    </section>
  );
};