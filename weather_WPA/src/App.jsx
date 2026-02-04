import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useWeather } from './context/WeatherContext';
import Header from './components/Header';
import CurrentWeather from './components/CurrentWeather';
import AirQuality from './components/AirQuality';
import HourlyForecast from './components/HourlyForecast';
import WeeklyForecast from './components/WeeklyForecast';
import SunCycle from './components/SunCycle';
import { Loader2, AlertCircle } from 'lucide-react';

function App() {
  const { location, setLocation, units } = useWeather();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initial Geolocation
  useEffect(() => {
    if (location) return;

    const SEOUL = { lat: 37.5665, lon: 126.9780, name: "Seoul (Default)" };

    if (!navigator.geolocation) {
      setLocation(SEOUL);
      setError("Geolocation not supported. Using default location.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          name: "Current Location"
        });
      },
      (err) => {
        console.warn("Geolocation failed, falling back to Seoul");
        setLocation(SEOUL);
        setError("Location access denied. Using default location.");
      }
    );
  }, []);

  // Data Fetching
  useEffect(() => {
    if (!location) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const unitParam = units === 'imperial' ? '&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch' : '';

        // API 1: Weather (Expanded for Forecasts)
        // hourly: temp, code
        // daily: max/min, sunrise/sunset
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,weather_code,is_day,apparent_temperature&minutely_15=precipitation&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=7&models=best_match${unitParam}`;

        // API 2: Air Quality
        const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.lat}&longitude=${location.lon}&current=pm10,pm2_5&hourly=pm10,pm2_5&timezone=auto`;

        const [weatherRes, aqRes] = await Promise.all([
          axios.get(weatherUrl),
          axios.get(aqUrl)
        ]);

        setData({
          weather: weatherRes.data,
          aq: aqRes.data
        });
      } catch (err) {
        setError("Failed to fetch weather data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location, units]);

  if (!location && loading) {
    return (
      <div className="flex-center h-screen flex-col gap-4 text-[var(--accent-blue)]">
        <Loader2 className="animate-spin" size={48} />
        <p>Locating...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex-center h-screen flex-col gap-4 text-[var(--accent-danger)] p-4 text-center">
        <AlertCircle size={48} />
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[var(--bg-secondary)] rounded-lg text-[var(--text-primary)] mt-4"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { current: cw, minutely_15: min15, hourly, daily } = data.weather;
  const { current: aqCurrent } = data.aq;

  // Preparing data for today's high/low
  const todayMax = daily.temperature_2m_max[0];
  const todayMin = daily.temperature_2m_min[0];

  return (
    <div className="container">
      {error && error.includes("default location") && (
        <div className="bg-[var(--accent-yellow)] text-black p-2 text-center text-sm font-bold animate-pulse">
          Using default location (Seoul). Tap Search to find your city.
        </div>
      )}
      <Header />

      <CurrentWeather
        temperature={cw.temperature_2m}
        weatherCode={cw.weather_code}
        isDay={cw.is_day}
        feelsLike={cw.apparent_temperature}
        high={todayMax}
        low={todayMin}
      />

      <HourlyForecast hourly={hourly} />

      <AirQuality
        pm10={aqCurrent.pm10}
        pm25={aqCurrent.pm2_5}
      />

      <WeeklyForecast daily={daily} />

      <div className="grid-2">
        <SunCycle
          sunrise={daily.sunrise[0]}
          sunset={daily.sunset[0]}
        />
        {/* Placeholder for future component or just SunCycle full width if grid-2 is not appropriate,
            but request was to move AQI. I'll put AQI above and maybe leave SunCycle alone or paired with something else.
            Request: "AirQuality below 24h forecast". done.
            "Rearrange boxes".
        */}
      </div>

      <footer className="text-center text-mute mt-4 pb-8 text-xs">
        Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline font-medium decoration-slice">Open-Meteo.com</a> & <a href="https://www.rainviewer.com/" target="_blank" rel="noopener noreferrer" className="underline font-medium decoration-slice">RainViewer</a>
      </footer>
    </div>
  );
}

export default App;
