import React from 'react';
import { format } from 'date-fns';

const HourlyForecast = ({ hourly }) => {
    if (!hourly) return null;

    // Data for next 24 hours
    const hours = hourly.time.slice(0, 24).map((t, i) => ({
        time: t,
        temp: hourly.temperature_2m[i],
        code: hourly.weather_code[i],
        pop: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0
    }));

    // Calculate scales
    const maxTemp = Math.max(...hours.map(h => h.temp)) + 2;
    const minTemp = Math.min(...hours.map(h => h.temp)) - 2;
    const tempRange = maxTemp - minTemp || 1;

    // Fixed width per hour item to ensure correct density (e.g. 50px per hour * 24 = 1200px)
    // Or simpler: use a wider SVG and let the container scroll.
    const width = 1000;
    const height = 180;
    const padding = 20;

    // Scale Precip bar height
    const precipMaxHeight = height * 0.4; // Bottom 40%

    // Helper to scale Y (Temperature)
    // Temp takes top 60% approx
    const getY = (temp) => {
        const graphTop = padding;
        const graphBottom = height - precipMaxHeight - 10; // Overlap slightly or sit above
        const availableHeight = graphBottom - graphTop;
        return graphBottom - ((temp - minTemp) / tempRange) * availableHeight;
    };

    // SVG Points for Temperature Line
    const points = hours.map((h, i) => {
        const x = (i / (hours.length - 1)) * (width - 2 * padding) + padding;
        const y = getY(h.temp);
        return `${x},${y}`;
    }).join(' ');

    // Helper to get text from code
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
            {/* Wrapper to isolate scrollbar logic inside the card */}
            <div className="w-full overflow-hidden">
                <div className="w-full overflow-x-auto scrollbar-hide pb-2">
                    {/* Container fixed width to allow scrolling */}
                    <div style={{ minWidth: '100%', width: `${width}px`, height: `${height}px` }} className="relative">
                        <svg width={width} height={height} className="absolute top-0 left-0">
                            {/* Gradient for Area under curve */}
                            <defs>
                                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0" />
                                </linearGradient>
                                <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.6" />
                                    <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0.2" />
                                </linearGradient>
                            </defs>

                            {/* Weather Condition Background Strip (Top) */}
                            <rect x="0" y="0" width={width} height="30" fill="var(--bg-secondary)" rx="4" opacity="0.5" />
                            {hours.map((h, i) => {
                                // Only show text if it changes or every 6th item to properly space it out
                                if (i % 6 !== 0 && i !== 0) return null;
                                const x = (i / (hours.length - 1)) * (width - 2 * padding) + padding;
                                return (
                                    <text key={`txt-${i}`} x={x} y="20" textAnchor="middle" fill="var(--text-secondary)" fontSize="12" fontWeight="500">
                                        {getWeatherText(h.code)}
                                    </text>
                                );
                            })}

                            {/* Precipitation Bars (Background) */}
                            {hours.map((h, i) => {
                                const prob = h.pop || 0;
                                const barHeight = (prob / 100) * (precipMaxHeight - 10); // -10 for text padding
                                const x = (i / (hours.length - 1)) * (width - 2 * padding) + padding;

                                if (prob === 0) return null;

                                return (
                                    <g key={`bar-${i}`}>
                                        <rect
                                            x={x - 8}
                                            y={height - 30 - barHeight}
                                            width={16}
                                            height={barHeight}
                                            fill="url(#precipGradient)"
                                            rx="4"
                                        />
                                        <text x={x} y={height - 35 - barHeight} textAnchor="middle" fill="var(--accent-cyan)" fontSize="10" fontWeight="bold">
                                            {prob}%
                                        </text>
                                    </g>
                                );
                            })}

                            {/* Area path */}
                            <path
                                d={`M${padding},${height - 50} ${points.split(' ').map((p, i) => `L${p}`).join(' ')} L${width - padding},${height - 50}`}
                                fill="url(#tempGradient)"
                            />

                            {/* Line path */}
                            <polyline
                                fill="none"
                                stroke="var(--accent-blue)"
                                strokeWidth="3"
                                points={points}
                            />

                            {/* Points and Labels */}
                            {hours.map((h, i) => {
                                const x = (i / (hours.length - 1)) * (width - 2 * padding) + padding;
                                const y = getY(h.temp);
                                return (
                                    <g key={i}>
                                        <circle cx={x} cy={y} r="4" fill="var(--bg-primary)" stroke="var(--accent-blue)" strokeWidth="2" />
                                        <text x={x} y={y - 12} textAnchor="middle" fill="var(--text-primary)" fontSize="12" fontWeight="bold">
                                            {Math.round(h.temp)}°
                                        </text>
                                        <text x={x} y={height - 10} textAnchor="middle" fill="var(--text-secondary)" fontSize="11" fontWeight="500">
                                            {i === 0 ? 'Now' : format(new Date(h.time), 'HH')}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HourlyForecast;
