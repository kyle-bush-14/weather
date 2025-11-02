'use client';

import { useState } from 'react';
import WeatherDashboard from '@/components/WeatherDashboard';
import { fetchHourlyWeather, fetchForecast, searchLocation, WeatherData, ForecastPeriod } from '@/lib/weather';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [forecastData, setForecastData] = useState<ForecastPeriod[]>([]);
  const [locationName, setLocationName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<{ lat: number; lon: number; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const results = await searchLocation(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search for location');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = async (lat: number, lon: number, name: string) => {
    setLoading(true);
    setError(null);
    setWeatherData([]);
    setForecastData([]);
    
    try {
      const [hourlyData, forecast] = await Promise.all([
        fetchHourlyWeather(lat, lon),
        fetchForecast(lat, lon)
      ]);
      setWeatherData(hourlyData);
      setForecastData(forecast);
      setLocationName(name);
      setSearchResults([]);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const [hourlyData, forecast] = await Promise.all([
            fetchHourlyWeather(lat, lon),
            fetchForecast(lat, lon)
          ]);
          setWeatherData(hourlyData);
          setForecastData(forecast);
          setLocationName(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
        } catch (err) {
          setError('Failed to fetch weather data for your location');
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError('Failed to get your location. Please enable location services.');
        console.error(err);
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Weather Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Powered by the National Weather Service API
          </p>
        </header>

        {/* Search Interface */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for a location..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !searchQuery.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Search
              </button>
              <button
                onClick={handleUseCurrentLocation}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Use Current Location
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Results:
                </h3>
                <div className="space-y-2">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleLocationSelect(result.lat, result.lon, result.name)}
                      disabled={loading}
                      className="w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-900 dark:text-white"
                    >
                      {result.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="mt-4 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Loading...</p>
              </div>
            )}
          </div>
        </div>

        {/* Weather Dashboard */}
        {weatherData.length > 0 && !loading && (
          <div className="max-w-7xl mx-auto">
            <WeatherDashboard data={weatherData} forecastData={forecastData} locationName={locationName} />
          </div>
        )}

        {/* Empty State */}
        {weatherData.length === 0 && !loading && !error && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                Get Started
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Search for a location or use your current location to view hourly weather data
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
