import React from 'react';
import { format } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import { useWeather } from '../context/WeatherContext';
import { getTempGradientStyle } from '../utils/colors';

const DailyCard = ({ day }) => {
    const { t, language } = useWeather();
    const date = new Date(day.time);
    const locale = language === 'ko' ? ko : enUS;
    const dayName = format(date, 'EEEE', { locale });
    const formatStr = language === 'ko' ? 'M월 d일' : 'MMM d';
    const fullDate = format(date, formatStr, { locale });

    const getConditionText = (code) => {
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

    const getIcon = (code) => {
        if (code === 0) return "☀️";
        if (code <= 3) return "☁️";
        if (code <= 48) return "🌫️";
        if (code <= 67) return "🌧️";
        if (code <= 77) return "❄️";
        if (code <= 99) return "🌩️";
        return "☁️";
    }

    return (
        <div className="day-card card shadow-md border-0 justify-between py-6 min-h-[260px] mx-2 my-2 rounded-xl">
            {/* Header: Date */}
            <div className="flex flex-col items-center">
                <span className="font-bold text-lg text-[var(--text-primary)]">{dayName}</span>
                <span className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wide opacity-80">{fullDate}</span>
            </div>

            {/* Main Content: Icon & Temp */}
            <div className="flex flex-col items-center gap-2 my-4">
                <div className="text-7xl filter drop-shadow-sm mb-2">
                    {getIcon(day.code)}
                </div>
                <span className="text-5xl font-extrabold weather-temp tracking-tighter" style={getTempGradientStyle(Math.round((day.max + day.min) / 2))}>
                    {Math.round((day.max + day.min) / 2)}°
                </span>
                <span className="text-base font-bold text-[var(--text-secondary)]">
                    {getConditionText(day.code)}
                </span>
            </div>

            {/* Footer: H/L & Feels Like */}
            <div className="flex flex-col items-center gap-2 w-full">
                <div className="flex gap-4 text-base font-bold">
                    <span className="text-[var(--text-secondary)]">{t.high}: {Math.round(day.max)}°</span>
                    <span className="text-[var(--text-secondary)]">{t.low}: {Math.round(day.min)}°</span>
                </div>
                <span className="text-sm text-[var(--text-secondary)] font-semibold">
                    {t.feelsLike} {Math.round((day.apparentMax + day.apparentMin) / 2)}°
                </span>
            </div>
        </div>
    );
};

const WeeklyForecast = ({ daily }) => {
    const { t } = useWeather();
    if (!daily) return null;

    // daily: { time: [], weather_code: [], temperature_2m_max: [], temperature_2m_min: [], apparent_temperature_max: [], apparent_temperature_min: [] }
    const days = daily.time.map((t, i) => ({
        time: t,
        code: daily.weather_code[i],
        max: daily.temperature_2m_max[i],
        min: daily.temperature_2m_min[i],
        apparentMax: daily.apparent_temperature_max ? daily.apparent_temperature_max[i] : daily.temperature_2m_max[i],
        apparentMin: daily.apparent_temperature_min ? daily.apparent_temperature_min[i] : daily.temperature_2m_min[i]
    }));

    return (
        <div className="card w-full">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-bold">{t.forecast7d}</h2>
            </div>
            <div className="carousel-container pb-4">
                {days.map((day, i) => (
                    <DailyCard key={i} day={day} />
                ))}
            </div>
        </div>
    );
};

export default WeeklyForecast;
