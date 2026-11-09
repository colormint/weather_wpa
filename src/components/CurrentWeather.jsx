import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { getTempGradientStyle } from '../utils/colors';

const getWeatherCondition = (code, language) => {
    if (language === 'ko') {
        if (code === 0) return "맑음";
        if (code <= 3) return "구름조금";
        if (code <= 48) return "안개";
        if (code <= 67) return "비";
        if (code <= 77) return "눈";
        if (code <= 99) return "뇌우";
        return "알 수 없음";
    }
    if (code === 0) return "Clear";
    if (code <= 3) return "Cloudy";
    if (code <= 48) return "Fog";
    if (code <= 67) return "Rain";
    if (code <= 77) return "Snow";
    if (code <= 99) return "Storm";
    return "Unknown";
};

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
    const { t, language } = useWeather();
    return (
        <div className="w-full">
            <div className="card current-weather flex flex-col items-center">
                <div className="w-full text-left self-start">
                    <h2 className="text-lg font-bold">{t.overview}</h2>
                </div>
                <div className="weather-icon mt-4">
                    {getWeatherIcon(weatherCode, isDay)}
                </div>
                <div className="flex flex-col items-center">
                    <h1 className="weather-temp" style={getTempGradientStyle(Math.round(temperature))}>
                        {Math.round(temperature)}°
                    </h1>
                    <p className="weather-desc">
                        {getWeatherCondition(weatherCode, language)}
                    </p>
                    <div className="flex gap-4 mt-2 text-[var(--text-secondary)] font-medium">
                        <span>{t.high}: {Math.round(high)}°</span>
                        <span>{t.low}: {Math.round(low)}°</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                        {t.feelsLike} {Math.round(feelsLike)}°
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CurrentWeather;
