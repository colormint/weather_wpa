import React from 'react';

const AirQuality = ({ pm10, pm25 }) => {
    const getAQIStatus = (aqi) => {
        if (aqi <= 50) return "Good";
        if (aqi <= 100) return "Moderate";
        if (aqi <= 150) return "Unhealthy for Sensitive Groups";
        if (aqi <= 200) return "Unhealthy";
        if (aqi <= 300) return "Very Unhealthy";
        return "Hazardous";
    };

    const getAQIColor = (aqi) => {
        if (aqi > 150) return "#7f1d1d"; // Dark Red
        if (aqi > 100) return "#dc2626"; // Red
        if (aqi > 50) return "#f97316"; // Orange
        if (aqi > 25) return "#eab308"; // Yellow
        if (aqi > 15) return "#22c55e"; // Green
        if (aqi > 5) return "#0ea5e9"; // Sky Blue
        return "#3b82f6"; // Blue (Perfect)
    };

    if (!pm10 && !pm25) return null;

    return (
        <div className="card">
            <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]">Air Quality</h2>
            <div className="grid grid-cols-2 gap-8 relative items-center justify-items-center">
                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">PM10</span>
                    <span className="text-3xl font-bold" style={{ color: getAQIColor(pm10) }}>{pm10}</span>
                    <span className="text-xs text-[var(--text-secondary)] mt-1 font-medium">{getAQIStatus(pm10)}</span>
                </div>

                {/* Vertical Divider */}
                <div className="absolute h-12 w-px bg-[var(--divider-color)] left-1/2 -translate-x-1/2"></div>

                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">PM2.5</span>
                    <span className="text-3xl font-bold" style={{ color: getAQIColor(pm25) }}>{pm25}</span>
                    <span className="text-xs text-[var(--text-secondary)] mt-1 font-medium">{getAQIStatus(pm25)}</span>
                </div>
            </div>
        </div>
    );
};

export default AirQuality;
