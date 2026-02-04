import React from 'react';
import { format } from 'date-fns';

const DailyCard = ({ day }) => {
    const date = new Date(day.time);
    const dayName = format(date, 'EEEE');
    const fullDate = format(date, 'MMM d');

    // Get condition text based on code (simplified)
    const getConditionText = (code) => {
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
        <div className="day-card justify-between py-6 min-h-[260px]">
            {/* Header: Date */}
            <div className="flex flex-col items-center">
                <span className="font-bold text-lg text-[var(--text-primary)]">{dayName}</span>
                <span className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wide opacity-80">{fullDate}</span>
            </div>

            {/* Main Content: Icon & Temp */}
            <div className="flex flex-col items-center gap-1 my-2">
                <div className="text-6xl filter drop-shadow-sm mb-2">
                    {getIcon(day.code)}
                </div>
                <span className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">
                    {Math.round((day.max + day.min) / 2)}°
                </span>
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                    {getConditionText(day.code)}
                </span>
            </div>

            {/* Footer: H/L & Feels Like */}
            <div className="flex flex-col items-center gap-2 w-full">
                <div className="flex gap-4 text-sm font-semibold">
                    <span className="text-[var(--text-secondary)]">H: {Math.round(day.max)}°</span>
                    <span className="text-[var(--text-secondary)]">L: {Math.round(day.min)}°</span>
                </div>
                <span className="text-xs text-[var(--text-secondary)] font-medium">
                    Feels like {Math.round((day.apparentMax + day.apparentMin) / 2)}°
                </span>
            </div>
        </div>
    );
};

const WeeklyForecast = ({ daily }) => {
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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">7-Day Forecast</h2>
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
