import React from 'react';
import { format } from 'date-fns';
import { useWeather } from '../context/WeatherContext';

const HourlyForecast = ({ hourly }) => {
    const { timeFormat } = useWeather();

    if (!hourly) return null;

    // Data for next 24 hours
    const hours = hourly.time.slice(0, 25).map((t, i) => ({
        time: t,
        temp: hourly.temperature_2m[i],
        code: hourly.weather_code[i],
        pop: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0
    }));

    // Calculate scales
    const maxTemp = Math.max(...hours.map(h => h.temp)) + 2;
    const minTemp = Math.min(...hours.map(h => h.temp)) - 2;
    const tempRange = maxTemp - minTemp || 1;

    // Dimensions
    const itemWidth = 60; // Slightly wider for readability
    const width = hours.length * itemWidth;
    const height = 160;
    const padding = 20;

    // Helper to scale Y (Temperature)
    const getY = (temp) => {
        return height - padding - ((temp - minTemp) / tempRange) * (height - 2 * padding);
    };

    // SVG Points
    const points = hours.map((h, i) => {
        const x = i * itemWidth + itemWidth / 2;
        const y = getY(h.temp);
        return `${x},${y}`;
    }).join(' ');

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        if (timeFormat === '12h') {
            return format(date, 'h a').toLowerCase(); // 10am
        }
        return format(date, 'HH:mm'); // 10:00
    };

    const getWeatherText = (code) => {
        if (code === 0) return "Clear";
        if (code <= 3) return "Cloudy";
        if (code <= 48) return "Fog";
        if (code <= 67) return "Rain";
        if (code <= 77) return "Snow";
        if (code <= 99) return "Storm";
        return "";
    };

    return (
        <div className="card overflow-hidden w-full">
            <h2 className="text-lg font-bold mb-4">24h Forecast</h2>

            <div className="graph-wrapper">
                <div className="graph-scroll scrollbar-hide">
                    <div style={{ width: `${width}px` }} className="relative flex flex-col">

                        {/* Row 1: Condition Text */}
                        <div className="flex w-full h-8 relative mb-2">
                            {hours.map((h, i) => {
                                // De-duplicate text: only show if different from previous or every 3rd to avoid clutter?
                                // User asked for "Clear/Cloudy text", "Separated row".
                                // Let's show spaced out.
                                if (i % 3 !== 0 && i !== 0) return null;
                                const text = getWeatherText(h.code);
                                return (
                                    <span
                                        key={`cond-${i}`}
                                        className="absolute text-xs text-[var(--text-secondary)] font-medium text-center transform -translate-x-1/2"
                                        style={{ left: i * itemWidth + itemWidth / 2 }}
                                    >
                                        {text}
                                    </span>
                                );
                            })}
                        </div>

                        {/* Row 2: Graph */}
                        <div className="relative h-[160px] w-full">
                            <svg width={width} height={height} className="overflow-visible">
                                <defs>
                                    <linearGradient id="lineGradient" gradientUnits="userSpaceOnUse" x1="0" y1={height} x2="0" y2="0">
                                        <stop offset="0%" stopColor="#3b82f6" /> {/* Blue at bottom (Cold) */}
                                        <stop offset="50%" stopColor="#22c55e" /> {/* Green/Mild */}
                                        <stop offset="100%" stopColor="#ef4444" /> {/* Red at top (Hot) */}
                                    </linearGradient>
                                    <mask id="gridMask">
                                        <rect x="0" y="0" width={width} height={height} fill="white" />
                                    </mask>
                                </defs>

                                {/* Vertical Grid Lines */}
                                {hours.map((_, i) => (
                                    <line
                                        key={`grid-${i}`}
                                        x1={i * itemWidth + itemWidth / 2}
                                        y1={0}
                                        x2={i * itemWidth + itemWidth / 2}
                                        y2={height}
                                        stroke="var(--divider-color)"
                                        strokeDasharray="4 4"
                                        strokeWidth="1"
                                    />
                                ))}

                                {/* Temperature Line */}
                                <polyline
                                    fill="none"
                                    stroke="url(#lineGradient)"
                                    strokeWidth="4"
                                    points={points}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Points and Temp Labels */}
                                {hours.map((h, i) => {
                                    const x = i * itemWidth + itemWidth / 2;
                                    const y = getY(h.temp);
                                    return (
                                        <g key={i}>
                                            <circle cx={x} cy={y} r="4" fill="var(--bg-primary)" stroke="url(#lineGradient)" strokeWidth="2" />
                                            <text x={x} y={y - 12} textAnchor="middle" fill="var(--text-primary)" fontSize="12" fontWeight="bold">
                                                {Math.round(h.temp)}°
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>

                        {/* Row 3: Time Labels */}
                        <div className="flex w-full h-8 relative mt-2">
                            {hours.map((h, i) => (
                                <span
                                    key={`time-${i}`}
                                    className="absolute text-xs text-[var(--text-secondary)] text-center transform -translate-x-1/2 min-w-[40px]"
                                    style={{ left: i * itemWidth + itemWidth / 2 }}
                                >
                                    {i === 0 ? 'Now' : formatTime(h.time)}
                                </span>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default HourlyForecast;
