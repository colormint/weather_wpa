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
        if (code === 0) return "Clear";
        if (code <= 3) return "Cloudy";
        if (code <= 48) return "Fog";
        if (code <= 67) return "Rain";
        if (code <= 77) return "Snow";
        if (code <= 99) return "Storm";
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
                        <div className="flex w-full h-6 relative mb-4">
                            {hours.map((h, i) => {
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
                                            opacity="0.7"
                                        />
                                        <text x={10} y={yZero - 4} fontSize="12">❄️</text>
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
                                        opacity="0.3"
                                    />
                                ))}

                                {/* Precipitation Bars */}
                                {hours.map((h, i) => {
                                    const prob = h.pop || 0;
                                    if (prob === 0) return null;
                                    const barHeight = (prob / 100) * precipMaxHeight;
                                    const x = i * itemWidth + itemWidth / 2;

                                    return (
                                        <g key={`precip-${i}`}>
                                            <rect
                                                x={x - 6}
                                                y={height - barHeight}
                                                width={12}
                                                height={barHeight}
                                                fill="url(#precipGradient)"
                                                rx="2"
                                            />
                                            {/* Show Percentage on ALL bars if > 0 */}
                                            <text x={x} y={height - barHeight - 5} textAnchor="middle" fill="var(--accent-cyan)" fontSize="9" fontWeight="bold">
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
                    {/* Visual Line for Temp */}
                    <svg width="24" height="6" viewBox="0 0 24 6">
                        <line x1="0" y1="3" x2="24" y2="3" stroke="url(#tempGradient)" strokeWidth="3" strokeLinecap="round" />
                        <defs>
                            <linearGradient id="tempGradient" gradientUnits="userSpaceOnUse" x1="0" y1="6" x2="0" y2="0">
                                {gradientStops}
                            </linearGradient>
                        </defs>
                    </svg>
                    <span>Temperature</span>
                </div>
                <div className="legend-item">
                    {/* Visual Bar for Precip */}
                    <div className="w-3 h-3 rounded-[2px] bg-[var(--accent-cyan)] opacity-60"></div>
                    <span>Precipitation</span>
                </div>
            </div>

        </div>
    );
};

export default HourlyForecast;
