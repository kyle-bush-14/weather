import axios from 'axios';

export interface WeatherData {
  time: Date;
  temperature: number;
  relativeHumidity: number;
  windSpeed: number;
  windDirection: number;
  conditions: string;
}

interface NWSPoint {
  gridId: string;
  gridX: number;
  gridY: number;
}

interface NWSHourlyData {
  number: number;
  startTime: string;
  temperature: number;
  relativeHumidity: { value: number };
  windSpeed: string;
  windDirection: number;
  shortForecast: string;
}

/**
 * Gets the grid coordinates for a given latitude and longitude
 */
async function getGridPoint(lat: number, lon: number): Promise<NWSPoint> {
  try {
    const response = await axios.get(
      `https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`
    );
    return {
      gridId: response.data.properties.gridId,
      gridX: response.data.properties.gridX,
      gridY: response.data.properties.gridY,
    };
  } catch (error) {
    console.error('Error fetching grid point:', error);
    throw new Error('Failed to fetch grid point from NWS API');
  }
}

/**
 * Fetches hourly forecast data from the NWS API
 */
export async function fetchHourlyWeather(lat: number, lon: number): Promise<WeatherData[]> {
  try {
    // First, get the grid point
    const gridPoint = await getGridPoint(lat, lon);
    
    // Then fetch the hourly forecast
    const response = await axios.get(
      `https://api.weather.gov/gridpoints/${gridPoint.gridId}/${gridPoint.gridX},${gridPoint.gridY}/forecast/hourly`
    );

    const periods: NWSHourlyData[] = response.data.properties.periods;
    
    // Transform the data to our WeatherData format
    const weatherData: WeatherData[] = periods.map((period) => {
      // Extract numeric wind speed from string like "5 mph" or "5 to 10 mph"
      const windSpeedMatch = period.windSpeed.match(/(\d+)/);
      const windSpeed = windSpeedMatch ? parseInt(windSpeedMatch[1]) : 0;
      
      return {
        time: new Date(period.startTime),
        temperature: period.temperature,
        relativeHumidity: period.relativeHumidity.value,
        windSpeed: windSpeed,
        windDirection: period.windDirection || 0,
        conditions: period.shortForecast,
      };
    });

    return weatherData;
  } catch (error) {
    console.error('Error fetching hourly weather:', error);
    throw new Error('Failed to fetch hourly weather data from NWS API');
  }
}

/**
 * Searches for locations by name using the geocoding API
 */
export async function searchLocation(query: string): Promise<{ lat: number; lon: number; name: string }[]> {
  try {
    const response = await axios.get(
      'https://geocoding-api.open-meteo.com/v1/search',
      {
        params: {
          name: query,
          count: 10,
          language: 'en',
          format: 'json',
        },
      }
    );

    if (!response.data.results) {
      return [];
    }

    return response.data.results.map((result: any) => ({
      name: `${result.name}, ${result.admin1 || ''} ${result.country}`,
      lat: result.latitude,
      lon: result.longitude,
    }));
  } catch (error) {
    console.error('Error searching location:', error);
    return [];
  }
}

