import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LightCurveData } from './DemoSection';

interface LightCurveChartProps {
  data: LightCurveData[];
}

export const LightCurveChart: React.FC<LightCurveChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-blue-300 font-medium">{`Time: ${label?.toFixed(4)}`}</p>
          <p className="text-green-300">{`Flux: ${payload[0].value?.toFixed(6)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis
            dataKey="time"
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
            domain={['dataMin - 0.001', 'dataMax + 0.001']}
            tickFormatter={(value) => value.toFixed(4)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="flux"
            stroke="#00D4FF"
            strokeWidth={1}
            dot={false}
            activeDot={{
              r: 4,
              fill: '#00D4FF',
              stroke: '#ffffff',
              strokeWidth: 2
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};