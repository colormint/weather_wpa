import React from 'react';
import { format } from 'date-fns';

const DailyCard = ({ day }) => {
    const date = new Date(day.time);
    const dayName = format(date, 'EEEE');
    const fullDate = format(date, 'MMM d');

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
        <div className="day-card justify-between py-6 min-h-[220px]">
            <div className="flex flex-col items-center">
                <span className="font-bold text-lg text-[var(--text-primary)]">{dayName}</span>
                <span className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wide opacity-80">{fullDate}</span>
            </div>

            <div className="flex flex-col items-center gap-4">
                <div className="text-7xl filter drop-shadow-sm my-1">
                    {getIcon(day.code)}
                </div>
                <span className="text-5xl font-bold text-[var(--text-primary)] tracking-tight">
                    {Math.round((day.max + day.min) / 2)}°
                </span>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium opacity-80">
                <span className="text-[var(--accent-danger)]">{Math.round(day.max)}°</span>
                <span className="text-[var(--text-secondary)]">/</span>
                <span className="text-[var(--accent-blue)]">{Math.round(day.min)}°</span>
            </div>
        </div>
    );
};

const WeeklyForecast = ({ daily }) => {
    if (!daily) return null;

    // daily: { time: [], weather_code: [], temperature_2m_max: [], temperature_2m_min: [] }
    const days = daily.time.map((t, i) => ({
        time: t,
        code: daily.weather_code[i],
        max: daily.temperature_2m_max[i],
        min: daily.temperature_2m_min[i]
    }));

    return (
        <div className="card">
            <div className="flex justify-between items-center mb-8">
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
