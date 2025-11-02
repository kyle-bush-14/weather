# Weather Dashboard

A beautiful and modern weather dashboard that displays hourly weather data from the National Weather Service (NWS) API. Built with Next.js, React, TypeScript, Tailwind CSS, and Recharts.

## Features

- 🔍 **Location Search**: Search for any location worldwide
- 📍 **Current Location**: Get weather data for your current location using browser geolocation
- 📊 **Multiple Charts**: Visualize temperature, humidity, wind speed, and combined weather data
- 📋 **Detailed Table**: View hourly forecast details in a comprehensive table
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode support
- ⚡ **Real-time Data**: Fetches live hourly forecast data from the official NWS API

## Tech Stack

- **Next.js 16**: Latest version with App Router
- **React 19**: Latest React with TypeScript
- **Tailwind CSS**: For styling
- **Recharts**: For beautiful, interactive charts
- **Axios**: For API requests
- **National Weather Service API**: For weather data
- **Open-Meteo Geocoding API**: For location search

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/weather.git
cd weather
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Search for a location**: Type a city or location name and click "Search"
2. **Select from results**: Click on a location from the search results
3. **Use current location**: Click "Use Current Location" to get weather for where you are
4. **View charts**: Explore the various charts showing temperature, humidity, and wind data
5. **Check details**: View the detailed hourly forecast table at the bottom

## Weather Data

The dashboard displays the following weather metrics:

- **Temperature**: Current temperature in Fahrenheit
- **Relative Humidity**: Percentage of humidity
- **Wind Speed**: Wind speed in miles per hour
- **Wind Direction**: Wind direction in degrees
- **Conditions**: Short forecast description

## API Information

This project uses the [National Weather Service API](https://www.weather.gov/documentation/services-web-api) which is free and does not require an API key.

The location search uses the [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) which is also free and open.

## Project Structure

```
weather/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main dashboard page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   └── WeatherDashboard.tsx  # Dashboard component with charts
│   └── lib/
│       └── weather.ts        # Weather API utilities
├── public/
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [National Weather Service](https://www.weather.gov/) for providing free weather data
- [Open-Meteo](https://open-meteo.com/) for geocoding services
- [Recharts](https://recharts.org/) for beautiful chart components
- [Next.js](https://nextjs.org/) for the amazing framework
