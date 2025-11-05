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
import CustomTooltip from './CustomTooltip';

interface ChartData {
  time: string;
  temperature: number;
}

interface TemperatureChartProps {
  data: ChartData[];
}

export default function TemperatureChart({ data }: TemperatureChartProps) {
  // Calculate min and max temperatures with 5 degree buffer
  const temperatures = data.map(d => d.temperature);
  const minTemp = Math.min(...temperatures);
  const maxTemp = Math.max(...temperatures);
  const yAxisMin = Math.floor(minTemp - 5);
  const yAxisMax = Math.ceil(maxTemp + 5);

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
            domain={[yAxisMin, yAxisMax]}
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

