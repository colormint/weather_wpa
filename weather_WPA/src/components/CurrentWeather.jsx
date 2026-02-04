import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog } from 'lucide-react';

const getWeatherIcon = (code, isDay) => {
    // WMO Weather interpretation codes (WW)
    // 0: Clear sky
    // 1, 2, 3: Mainly clear, partly cloudy, and overcast
    // 45, 48: Fog
    // 51, 53, 55: Drizzle
    // 61, 63, 65: Rain
    // 71, 73, 75: Snow
    // 95, 96, 99: Thunderstorm

    const iconProps = { size: 64, className: "text-current" };

    if (code === 0) return isDay ? "☀️" : "🌙";
    if (code >= 1 && code <= 3) return isDay ? "⛅" : "☁️";
    if (code === 45 || code === 48) return "🌫️";
    if (code >= 51 && code <= 55) return "🌦️";
    if (code >= 61 && code <= 65) return "🌧️";
    if (code >= 71 && code <= 77) return "❄️";
    if (code >= 95) return "⛈️";

    return "🌡️";
};

const CurrentWeather = ({ temperature, weatherCode, isDay, feelsLike, high, low }) => {
    return (
        <div className="w-full">
            <div className="card current-weather relative pt-10">
                <h2 className="text-lg font-bold absolute top-4 left-6">Overview</h2>
                <div className="weather-icon">
                    {getWeatherIcon(weatherCode, isDay)}
                </div>
                <div className="flex flex-col items-center">
                    <h1 className="text-gradient weather-temp">
                        {Math.round(temperature)}°
                    </h1>
                    <p className="weather-desc">
                        {weatherCode === 0 ? "Clear" :
                            weatherCode <= 3 ? "Cloudy" :
                                weatherCode <= 65 ? "Rain" : "Storm"}
                    </p>
                    <div className="flex gap-4 mt-2 text-[var(--text-secondary)] font-medium">
                        <span>H: {Math.round(high)}°</span>
                        <span>L: {Math.round(low)}°</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                        Feels like {Math.round(feelsLike)}°
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CurrentWeather;
