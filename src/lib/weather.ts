import axios from 'axios';

export interface WeatherData {
  time: Date;
  temperature: number;
  relativeHumidity: number;
  windSpeed: number;
  windDirection: number;
  conditions: string;
}

export interface ForecastPeriod {
  name: string;
  startTime: Date;
  endTime: Date;
  temperature: number;
  temperatureUnit: string;
  windSpeed: string;
  windDirection: string;
  shortForecast: string;
  detailedForecast: string;
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
 * Fetches the forecast overview from the NWS API
 */
export async function fetchForecast(lat: number, lon: number): Promise<ForecastPeriod[]> {
  try {
    // First, get the grid point
    const gridPoint = await getGridPoint(lat, lon);
    
    // Then fetch the forecast
    const response = await axios.get(
      `https://api.weather.gov/gridpoints/${gridPoint.gridId}/${gridPoint.gridX},${gridPoint.gridY}/forecast`
    );

    const periods: any[] = response.data.properties.periods;
    
    // Transform the data to our ForecastPeriod format
    const forecastData: ForecastPeriod[] = periods.map((period) => ({
      name: period.name,
      startTime: new Date(period.startTime),
      endTime: new Date(period.endTime),
      temperature: period.temperature,
      temperatureUnit: period.temperatureUnit,
      windSpeed: period.windSpeed,
      windDirection: period.windDirection,
      shortForecast: period.shortForecast,
      detailedForecast: period.detailedForecast,
    }));

    return forecastData;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw new Error('Failed to fetch forecast data from NWS API');
  }
}

/**
 * Searches for locations by name using LocationIQ geocoding API
 */
export async function searchLocation(query: string): Promise<{ lat: number; lon: number; name: string }[]> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;

    if (!apiKey) {
      console.error('LocationIQ API key is not configured');
      return [];
    }

    const url = new URL('https://us1.locationiq.com/v1/search');
    url.searchParams.append('key', apiKey);
    url.searchParams.append('q', query);
    url.searchParams.append('format', 'json');
    url.searchParams.append('limit', '10');

    console.log('LocationIQ API URL:', url.toString());

    const response = await axios.get(url.toString());

    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data.map((result: any) => ({
      name: result.display_name,
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('LocationIQ API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    } else {
      console.error('Error searching location:', error);
    }
    return [];
  }
}

