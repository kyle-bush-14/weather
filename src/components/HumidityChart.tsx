"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

interface ChartData {
  time: string;
  humidity: number;
}

interface HumidityChartProps {
  data: ChartData[];
  tickPositions?: string[];
}

export default function HumidityChart({
  data,
  tickPositions = [],
}: HumidityChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Relative Humidity (%)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="time"
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
            ticks={tickPositions}
          />
          <YAxis
            label={{ value: "%", angle: -90, position: "insideLeft" }}
            stroke="#6b7280"
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            name="Humidity"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
