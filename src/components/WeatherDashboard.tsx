"use client";

import { useState } from "react";
import { WeatherData, ForecastPeriod } from "@/lib/weather";
import TemperatureChart from "./TemperatureChart";
import HumidityChart from "./HumidityChart";
import WindSpeedChart from "./WindSpeedChart";
import ForecastTable from "./ForecastTable";

interface WeatherDashboardProps {
  data: WeatherData[];
  locationName: string;
  forecastData?: ForecastPeriod[];
}

export default function WeatherDashboard({
  data,
  locationName,
  forecastData,
}: WeatherDashboardProps) {
  const [selectedDays, setSelectedDays] = useState(1);

  // Filter data based on selected days
  const now = new Date();
  const cutoffTime = new Date(
    now.getTime() + selectedDays * 24 * 60 * 60 * 1000
  );

  const filteredData = data.filter((item) => {
    const itemTime = new Date(item.time);
    return itemTime >= now && itemTime <= cutoffTime;
  });

  // Format data for recharts
  const chartData = filteredData.map((item) => {
    const itemDate = new Date(item.time);
    return {
      time: itemDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
      }),
      hour: itemDate.getHours(),
      date: itemDate,
      temperature: item.temperature,
      humidity: item.relativeHumidity,
      windSpeed: item.windSpeed,
      windDirection: item.windDirection,
    };
  });

  // Calculate tick positions based on selected days
  const getTickPositions = (): string[] => {
    if (chartData.length === 0) return [];

    const ticks: string[] = [];

    if (selectedDays === 1) {
      // 1 day: midnight, 6am, noon, 6pm
      chartData.forEach((item) => {
        if (
          item.hour === 0 ||
          item.hour === 6 ||
          item.hour === 12 ||
          item.hour === 18
        ) {
          ticks.push(item.time);
        }
      });
    } else if (selectedDays === 3) {
      // 3 days: midnight and noon of each day
      chartData.forEach((item) => {
        if (item.hour === 0 || item.hour === 12) {
          ticks.push(item.time);
        }
      });
    } else if (selectedDays === 7) {
      // 7 days: start of each day (midnight)
      chartData.forEach((item) => {
        if (item.hour === 0) {
          ticks.push(item.time);
        }
      });
    }

    return ticks;
  };

  const tickPositions = getTickPositions();

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Weather Dashboard - {locationName}
        </h2>

        <select
          value={selectedDays}
          onChange={(e) => setSelectedDays(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={1}>1 Day</option>
          <option value={3}>3 Days</option>
          <option value={7}>7 Days</option>
        </select>
      </div>

      <TemperatureChart data={chartData} tickPositions={tickPositions} />
      <HumidityChart data={chartData} tickPositions={tickPositions} />
      <WindSpeedChart data={chartData} tickPositions={tickPositions} />
      {forecastData && <ForecastTable forecastData={forecastData} />}
    </div>
  );
}
