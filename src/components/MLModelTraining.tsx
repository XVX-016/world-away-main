import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, CheckCircle, AlertCircle, Database } from 'lucide-react';

interface TrainingProgress {
  epoch: number;
  accuracy: number;
  loss: number;
  status: 'training' | 'completed' | 'error';
}

interface ModelMetrics {
  precision: number;
  recall: number;
  f1Score: number;
  accuracy: number;
  confusionMatrix: number[][];
}

export const MLModelTraining: React.FC = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState<TrainingProgress | null>(null);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [trainingHistory, setTrainingHistory] = useState<{epoch: number, accuracy: number, loss: number}[]>([]);

  const startTraining = async () => {
    setIsTraining(true);
    setProgress({ epoch: 0, accuracy: 0, loss: 1, status: 'training' });
    setTrainingHistory([]);

    // Simulate training process
    for (let epoch = 1; epoch <= 50; epoch++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const accuracy = Math.min(0.95, 0.3 + (epoch / 50) * 0.65 + Math.random() * 0.1);
      const loss = Math.max(0.05, 1 - (epoch / 50) * 0.9 + Math.random() * 0.1);
      
      setProgress({ epoch, accuracy, loss, status: 'training' });
      setTrainingHistory(prev => [...prev, { epoch, accuracy, loss }]);
    }

    // Final metrics
    setMetrics({
      precision: 0.92 + Math.random() * 0.05,
      recall: 0.89 + Math.random() * 0.06,
      f1Score: 0.90 + Math.random() * 0.05,
      accuracy: 0.94 + Math.random() * 0.04,
      confusionMatrix: [
        [850, 45],
        [38, 67]
      ]
    });

    setProgress({ epoch: 50, accuracy: 0.94, loss: 0.05, status: 'completed' });
    setIsTraining(false);
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-semibold text-white">ML Model Training</h3>
      </div>

      <div className="space-y-6">
        {/* Training Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={startTraining}
            disabled={isTraining}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 disabled:scale-100"
          >
            <Database className="w-5 h-5" />
            {isTraining ? 'Training...' : 'Start Training'}
          </button>
          
          {progress && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-300">Epoch: {progress.epoch}/50</span>
              <span className="text-blue-300">Accuracy: {(progress.accuracy * 100).toFixed(1)}%</span>
            </div>
          )}
        </div>

        {/* Training Progress */}
        {progress && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Training Progress</span>
              <span className="text-purple-300">{progress.status}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"
                style={{ width: `${(progress.epoch / 50) * 100}%` }}
              />
            </div>
            
            {/* Loss and Accuracy */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300 text-sm">Accuracy</span>
                </div>
                <p className="text-white text-xl font-bold">
                  {(progress.accuracy * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-gray-300 text-sm">Loss</span>
                </div>
                <p className="text-white text-xl font-bold">
                  {progress.loss.toFixed(3)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Model Metrics */}
        {metrics && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Model Performance
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <span className="text-gray-300 text-sm">Precision</span>
                <p className="text-white text-xl font-bold">
                  {(metrics.precision * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <span className="text-gray-300 text-sm">Recall</span>
                <p className="text-white text-xl font-bold">
                  {(metrics.recall * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <span className="text-gray-300 text-sm">F1 Score</span>
                <p className="text-white text-xl font-bold">
                  {(metrics.f1Score * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <span className="text-gray-300 text-sm">Overall Accuracy</span>
                <p className="text-white text-xl font-bold">
                  {(metrics.accuracy * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Confusion Matrix */}
            <div className="bg-white/5 rounded-lg p-4">
              <span className="text-gray-300 text-sm mb-3 block">Confusion Matrix</span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-green-500/20 rounded p-2">
                  <div className="text-white font-bold">{metrics.confusionMatrix[0][0]}</div>
                  <div className="text-xs text-gray-300">True Negatives</div>
                </div>
                <div className="bg-red-500/20 rounded p-2">
                  <div className="text-white font-bold">{metrics.confusionMatrix[0][1]}</div>
                  <div className="text-xs text-gray-300">False Positives</div>
                </div>
                <div className="bg-red-500/20 rounded p-2">
                  <div className="text-white font-bold">{metrics.confusionMatrix[1][0]}</div>
                  <div className="text-xs text-gray-300">False Negatives</div>
                </div>
                <div className="bg-green-500/20 rounded p-2">
                  <div className="text-white font-bold">{metrics.confusionMatrix[1][1]}</div>
                  <div className="text-xs text-gray-300">True Positives</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Training History Chart */}
        {trainingHistory.length > 0 && (
          <div className="bg-white/5 rounded-lg p-4">
            <span className="text-gray-300 text-sm mb-3 block">Training History</span>
            <div className="h-32 flex items-end gap-1">
              {trainingHistory.slice(-20).map((point, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-purple-400 to-pink-400 rounded-t"
                    style={{ height: `${point.accuracy * 100}px` }}
                  />
                  <div className="text-xs text-gray-400 mt-1">{point.epoch}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
