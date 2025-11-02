'use client';

import { WeatherData, ForecastPeriod } from '@/lib/weather';
import TemperatureChart from './TemperatureChart';
import HumidityChart from './HumidityChart';
import WindSpeedChart from './WindSpeedChart';
import ForecastTable from './ForecastTable';

interface WeatherDashboardProps {
  data: WeatherData[];
  locationName: string;
  forecastData?: ForecastPeriod[];
}

export default function WeatherDashboard({ data, locationName, forecastData }: WeatherDashboardProps) {
  // Format data for recharts
  const chartData = data.map((item) => ({
    time: new Date(item.time).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
    }),
    hour: new Date(item.time).getHours(),
    temperature: item.temperature,
    humidity: item.relativeHumidity,
    windSpeed: item.windSpeed,
    windDirection: item.windDirection,
  }));

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Weather Dashboard - {locationName}
      </h2>
      
      <TemperatureChart data={chartData} />
      <HumidityChart data={chartData} />
      <WindSpeedChart data={chartData} />
      {forecastData && <ForecastTable forecastData={forecastData} />}
    </div>
  );
}
