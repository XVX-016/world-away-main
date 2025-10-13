import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockFeatureData = [
  { feature: 'Transit Depth', importance: 0.35, color: '#00D4FF' },
  { feature: 'Periodicity', importance: 0.28, color: '#8B5CF6' },
  { feature: 'Duration', importance: 0.22, color: '#10B981' },
  { feature: 'Signal-to-Noise', importance: 0.15, color: '#F59E0B' }
];

export const FeatureImportance: React.FC = () => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium">{payload[0].payload.feature}</p>
          <p className="text-blue-300">{`Importance: ${(payload[0].value * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockFeatureData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="feature"
              stroke="#9CA3AF"
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="importance"
              radius={[4, 4, 0, 0]}
              fill="url(#colorGradient)"
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00D4FF" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-yellow-300 text-sm">
          <strong>SHAP Analysis:</strong> Feature importance values showing how much each feature 
          contributes to the model's prediction. Higher values indicate stronger influence on the classification.
        </p>
      </div>
    </div>
  );
};