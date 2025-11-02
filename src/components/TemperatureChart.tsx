'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  time: string;
  temperature: number;
}

interface TemperatureChartProps {
  data: ChartData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-3">
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {entry.value} {entry.unit || ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TemperatureChart({ data }: TemperatureChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Temperature (°F)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            label={{ value: '°F', angle: -90, position: 'insideLeft' }}
            stroke="#6b7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
            name="Temperature"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

