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
    const itemWidth = 60;
    const width = hours.length * itemWidth;
    const height = 200; // Requested 200px
    const padding = 20;

    // Scale Precip bar height
    const precipMaxHeight = 60;

    // Helper to scale Y (Temperature)
    // Reserve bottom space for precipitation
    const graphBottom = height - precipMaxHeight - 10;
    const getY = (temp) => {
        return graphBottom - ((temp - minTemp) / tempRange) * (graphBottom - padding);
    };

    // Calculate Y for 0 degrees (Reference Line)
    const yZero = getY(0);
    const showZeroLine = yZero >= padding && yZero <= graphBottom;

    // SVG Points
    const points = hours.map((h, i) => {
        const x = i * itemWidth + itemWidth / 2;
        const y = getY(h.temp);
        return `${x},${y}`;
    }).join(' ');

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        if (timeFormat === '12h') {
            return format(date, 'h a').toLowerCase();
        }
        return format(date, 'HH:mm');
    };

    const getWeatherText = (code) => {
        if (code === 0) return "☀️ Clear";
        if (code <= 3) return "☁️ Cloudy";
        if (code <= 48) return "🌫️ Fog";
        if (code <= 67) return "🌧️ Rain";
        if (code <= 77) return "❄️ Snow";
        if (code <= 99) return "⛈️ Storm";
        return "";
    };

    // Dynamic Gradient Stops based on Abs Temperature
    // Define standard colors for temps: -10 (Blue), 0 (Cyan), 15 (Green), 30 (Red)
    const tempStops = [
        { t: -10, c: '#3b82f6' }, // Blue
        { t: 0, c: '#06b6d4' },   // Cyan
        { t: 15, c: '#22c55e' },  // Green
        { t: 30, c: '#ef4444' }   // Red
    ];

    // We need to map these temps to % positions in the gradient.
    // y1=graphBottom (Low Temp), y2=padding (High Temp).
    const gradientStops = tempStops.map(s => {
        let offset = (s.t - minTemp) / (maxTemp - minTemp);
        // Clamp offset to 0-1
        if (offset < 0) offset = 0;
        if (offset > 1) offset = 1;
        return <stop key={s.t} offset={`${offset * 100}%`} stopColor={s.c} />;
    });


    return (
        <div className="card overflow-hidden w-full min-h-[450px] flex flex-col gap-4">
            <h2 className="text-lg font-bold">24h Forecast</h2>

            <div className="graph-wrapper w-full">
                {/* Scroll Container */}
                <div className="graph-scroll">
                    <div style={{ width: `${width}px` }} className="relative flex flex-col justify-between">

                        {/* Row 1: Condition Text */}
                        <div className="flex w-full h-8 relative mb-4">
                            {hours.map((h, i) => {
                                if (i % 3 !== 0 && i !== 0) return null;
                                const text = getWeatherText(h.code);
                                return (
                                    <span
                                        key={`cond-${i}`}
                                        className="absolute text-sm text-[var(--text-secondary)] font-medium text-center transform -translate-x-1/2 whitespace-nowrap"
                                        style={{ left: i * itemWidth + itemWidth / 2 }}
                                    >
                                        {text}
                                    </span>
                                );
                            })}
                        </div>

                        {/* Row 2: Graph */}
                        <div className="relative h-[200px] w-full">
                            <svg width={width} height={height} className="overflow-visible">
                                <defs>
                                    {/* Temp Gradient */}
                                    <linearGradient id="tempGradient" gradientUnits="userSpaceOnUse" x1="0" y1={graphBottom} x2="0" y2={padding}>
                                        {gradientStops}
                                    </linearGradient>

                                    <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.6" />
                                        <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0.2" />
                                    </linearGradient>
                                </defs>

                                {/* 0-Degree Reference Line */}
                                {showZeroLine && (
                                    <g>
                                        <line
                                            x1={0}
                                            y1={yZero}
                                            x2={width}
                                            y2={yZero}
                                            stroke="var(--divider-color)"
                                            strokeDasharray="6 4"
                                            strokeWidth="1.5"
                                            opacity="0.8"
                                        />
                                        {/* Adjusted Ice Emoji Position: Snowflake, Small, Left */}
                                        <text x={0} y={yZero + 4} fontSize="14">❄️</text>
                                    </g>
                                )}

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
                                        opacity="0.5"
                                    />
                                ))}

                                {/* Precipitation Bars */}
                                {hours.map((h, i) => {
                                    const prob = h.pop || 0;
                                    // Always render bar frame or text for 0%
                                    // If 0, min height for visual or just text? 
                                    // User said "put percentage even on 0% precipitation data"
                                    // Let's show a tiny bar line for 0 or just text at bottom

                                    // Let's ensure text is always shown
                                    // Bar height: if 0, maybe 2px?
                                    const effectiveProb = Math.max(prob, 2); // Minimum 2% height for visibility of "empty" spot? Or just text.
                                    // Actually if 0, bar height is 0. Text should be at bottom.

                                    const barHeight = (Math.max(prob, 0) / 100) * precipMaxHeight;
                                    const x = i * itemWidth + itemWidth / 2;

                                    return (
                                        <g key={`precip-${i}`}>
                                            {prob > 0 && (
                                                <rect
                                                    x={x - 6}
                                                    y={height - barHeight}
                                                    width={12}
                                                    height={barHeight}
                                                    fill="url(#precipGradient)"
                                                    rx="2"
                                                />
                                            )}
                                            {/* Show Percentage on ALL bars */}
                                            {/* If 0%, show at bottom axis */}
                                            <text
                                                x={x}
                                                y={prob > 0 ? height - barHeight - 5 : height - 5}
                                                textAnchor="middle"
                                                fill={prob > 0 ? "var(--accent-cyan)" : "var(--text-secondary)"}
                                                fontSize="10"
                                                fontWeight={prob > 0 ? "bold" : "normal"}
                                            >
                                                {prob}%
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Temperature Line */}
                                <polyline
                                    fill="none"
                                    stroke="url(#tempGradient)"
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
                                            <circle cx={x} cy={y} r="4" fill="var(--bg-primary)" stroke="url(#tempGradient)" strokeWidth="2" />
                                            <text x={x} y={y - 12} textAnchor="middle" fill="var(--text-primary)" fontSize="12" fontWeight="bold">
                                                {Math.round(h.temp)}°
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>

                        {/* Row 3: Time Labels */}
                        <div className="flex w-full h-6 relative mt-4">
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

            {/* Visual Legend */}
            <div className="graph-legend">
                <div className="legend-item">
                    {/* Visual Line for Temp (o-o style) */}
                    <svg width="40" height="12" viewBox="0 0 40 12" className="overflow-visible">
                        <defs>
                            <linearGradient id="legendGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="40" y2="0">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#ef4444" />
                            </linearGradient>
                        </defs>
                        <line x1="5" y1="6" x2="35" y2="6" stroke="url(#legendGradient)" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="5" cy="6" r="3" fill="var(--bg-primary)" stroke="#3b82f6" strokeWidth="2" />
                        <circle cx="35" cy="6" r="3" fill="var(--bg-primary)" stroke="#ef4444" strokeWidth="2" />
                    </svg>
                    <span>Temperature</span>
                </div>
                <div className="legend-item">
                    {/* Visual Bar for Precip */}
                    <svg width="20" height="12" viewBox="0 0 20 12">
                        <linearGradient id="legendPrecip" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0.2" />
                        </linearGradient>
                        <rect x="6" y="0" width="8" height="12" rx="2" fill="url(#legendPrecip)" />
                    </svg>
                    <span>Precipitation</span>
                </div>
            </div>

        </div>
    );
};

export default HourlyForecast;
