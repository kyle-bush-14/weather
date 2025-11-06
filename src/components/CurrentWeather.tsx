'use client';

import { WeatherData } from '@/lib/weather';

interface CurrentWeatherProps {
  data: WeatherData[];
  locationName: string;
}

export default function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
  if (data.length === 0) return null;

  const currentWeather = data[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {locationName}
      </h2>

      <div className="grid grid-cols-3 gap-6">
        {/* Temperature */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">
            {Math.round(currentWeather.temperature)}°
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Temperature
          </p>
        </div>

        {/* Conditions */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-lg text-gray-900 dark:text-white font-semibold">
            {currentWeather.conditions}
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Conditions
          </p>
        </div>

        {/* Wind Speed */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-amber-600 dark:text-amber-400">
            {currentWeather.windSpeed}
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Wind Speed (mph)
          </p>
        </div>
      </div>
    </div>
  );
}
