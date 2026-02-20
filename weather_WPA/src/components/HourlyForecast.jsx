import React from 'react';
import { format } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import { useWeather } from '../context/WeatherContext';
import { tempStops } from '../utils/colors';

const HourlyForecast = ({ hourly }) => {
    const { timeFormat, t, language } = useWeather();

    if (!hourly) return null;

    // Find Current Hour Index
    const now = new Date();
    // API times are ISO. We find the first time that is >= current hour (ignoring minutes/seconds for the "current" slot, or just find nearest)
    // Actually, simple string comparison or Date object works.
    // Let's find the index where the hour matches current hour.
    const currentHourIndex = hourly.time.findIndex(t => {
        const timeDate = new Date(t);
        return timeDate.getTime() >= now.setMinutes(0, 0, 0); // Compare with current hour:00
    });

    // Fallback to 0 if not found (shouldn't happen with proper API data)
    const startIndex = currentHourIndex !== -1 ? currentHourIndex : 0;

    // Slice next 25 hours
    const hours = hourly.time.slice(startIndex, startIndex + 25).map((t, i) => ({
        time: t,
        temp: hourly.temperature_2m[startIndex + i],
        code: hourly.weather_code[startIndex + i],
        pop: hourly.precipitation_probability && hourly.precipitation_probability[startIndex + i] !== null
            ? hourly.precipitation_probability[startIndex + i]
            : null
    }));

    // Calculate scales
    let rawMax = Math.max(...hours.map(h => h.temp));
    let rawMin = Math.min(...hours.map(h => h.temp));

    // Refinement RC6: 
    // 1. Min Range: 10 degrees (was 15). Prevents "flat line" but doesn't over-expand.
    // 2. Padding: Small buffer (+2/-2) to keep curve "tight" as requested.

    let range = rawMax - rawMin;
    if (range < 10) {
        const mid = (rawMax + rawMin) / 2;
        rawMax = mid + 5;
        rawMin = mid - 5;
    }

    // Small wiggle room
    const maxTemp = rawMax + 2;
    const minTemp = rawMin - 2;

    // Recalculate range
    const tempRange = maxTemp - minTemp || 1;

    // Dimensions
    const itemWidth = 50;
    const horizontalPadding = 20; // Padding to prevent clipping on the edges
    const width = hours.length * itemWidth + (horizontalPadding * 2);
    const height = 300; // Increased overall height slightly
    const tempGraphTop = 80; // Top bound for temp line
    const tempGraphBottom = 180; // Bottom bound for temp line
    const precipBaseY = 260; // Base line for precipitation bars
    const precipMaxHeight = 40; // Max height for precip bars

    // Helper to scale Y (Temperature)
    const getY = (temp) => {
        return tempGraphBottom - ((temp - minTemp) / tempRange) * (tempGraphBottom - tempGraphTop);
    };

    // Calculate Y for 0 degrees (Reference Line)
    const yZero = getY(0);
    const showZeroLine = yZero >= tempGraphTop && yZero <= tempGraphBottom;

    // SVG Points
    const points = hours.map((h, i) => {
        const x = horizontalPadding + i * itemWidth + itemWidth / 2;
        const y = getY(h.temp);
        return `${x},${y}`;
    }).join(' ');

    const locale = language === 'ko' ? ko : enUS;
    const formatTime = (isoString) => {
        const date = new Date(isoString);
        if (timeFormat === '12h') {
            if (language === 'ko') return format(date, 'a h시', { locale });
            return format(date, 'h a').toLowerCase();
        }
        return format(date, 'HH:mm');
    };

    const getWeatherEmoji = (code) => {
        if (code === 0) return "☀️";
        if (code <= 3) return "☁️";
        if (code <= 48) return "🌫️";
        if (code <= 67) return "🌧️";
        if (code <= 77) return "❄️";
        if (code <= 99) return "⛈️";
        return "";
    };

    const getWeatherLabel = (code) => {
        // We'll use a very simple manual localization or just pass through for now, as full WMO translation is needed.
        // For simplicity, let's keep English if language is en, or simple Korean if ko.
        if (language === 'ko') {
            if (code === 0) return "맑음";
            if (code <= 3) return "구름조금";
            if (code <= 48) return "안개";
            if (code <= 67) return "비";
            if (code <= 77) return "눈";
            if (code <= 99) return "뇌우";
            return "";
        }
        if (code === 0) return "Clear";
        if (code <= 3) return "Cloudy";
        if (code <= 48) return "Fog";
        if (code <= 67) return "Rain";
        if (code <= 77) return "Snow";
        if (code <= 99) return "Storm";
        return "";
    };

    // We need to map these temps to % positions in the gradient.
    const gradientStops = tempStops.map(s => {
        let offset = (s.t - minTemp) / (maxTemp - minTemp);
        // Clamp offset to 0-1
        if (offset < 0) offset = 0;
        if (offset > 1) offset = 1;
        return <stop key={s.t} offset={`${offset * 100}%`} stopColor={s.c} />;
    });

    return (
        <div className="card overflow-hidden w-full min-h-[450px] flex flex-col gap-4">
            <h2 className="text-lg font-bold">{t.forecast24h}</h2>

            <div className="graph-wrapper w-full">
                {/* Scroll Container */}
                <div className="graph-scroll pt-2">
                    <div style={{ width: `${width}px` }} className="relative h-[300px]">
                        <svg width={width} height={height} className="overflow-visible block">
                            <defs>
                                {/* Temp Gradient */}
                                <linearGradient id="tempGradient" gradientUnits="userSpaceOnUse" x1="0" y1={tempGraphBottom} x2="0" y2={tempGraphTop}>
                                    {gradientStops}
                                </linearGradient>

                                <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.6" />
                                    <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0.2" />
                                </linearGradient>
                            </defs>

                            {/* Row 1: Condition Emjois & Text */}
                            {hours.map((h, i) => {
                                if (i % 3 !== 0 && i !== 0) return null;
                                const emoji = getWeatherEmoji(h.code);
                                const label = getWeatherLabel(h.code);
                                const x = horizontalPadding + i * itemWidth + itemWidth / 2;
                                return (
                                    <g key={`cond-${i}`}>
                                        <text x={x} y={24} textAnchor="middle" fontSize="24">{emoji}</text>
                                        <text x={x} y={48} textAnchor="middle" fill="var(--text-secondary)" fontSize="12" fontWeight="600">{label}</text>
                                    </g>
                                );
                            })}

                            {/* 0-Degree Reference Line */}
                            {showZeroLine && (
                                <g>
                                    <line
                                        x1={horizontalPadding}
                                        y1={yZero}
                                        x2={width - horizontalPadding}
                                        y2={yZero}
                                        stroke="var(--divider-color)"
                                        strokeDasharray="6 4"
                                        strokeWidth="1.5"
                                        opacity="0.8"
                                    />
                                    <text x={horizontalPadding - 12} y={yZero + 4} fontSize="12" fill="var(--accent-cyan)">❄️</text>
                                </g>
                            )}

                            {/* Vertical Grid Lines */}
                            {hours.map((_, i) => {
                                const x = horizontalPadding + i * itemWidth + itemWidth / 2;
                                return (
                                    <line
                                        key={`grid-${i}`}
                                        x1={x}
                                        y1={tempGraphTop}
                                        x2={x}
                                        y2={precipBaseY}
                                        stroke="var(--divider-color)"
                                        strokeDasharray="4 4"
                                        strokeWidth="1"
                                        opacity="0.5"
                                    />
                                )
                            })}

                            {/* Precipitation Bars */}
                            {hours.map((h, i) => {
                                const prob = h.pop; // Can be null, 0, or >0
                                const barHeight = (Math.max(prob, 0) / 100) * precipMaxHeight;
                                const x = horizontalPadding + i * itemWidth + itemWidth / 2;

                                return (
                                    <g key={`precip-${i}`}>
                                        {prob > 0 && (
                                            <rect
                                                x={x - 6}
                                                y={precipBaseY - barHeight}
                                                width={12}
                                                height={barHeight}
                                                fill="url(#precipGradient)"
                                                rx="2"
                                            />
                                        )}
                                        {/* Show Percentage on ALL bars */}
                                        <text
                                            x={x}
                                            y={prob > 0 ? precipBaseY - barHeight - 5 : precipBaseY - 5}
                                            textAnchor="middle"
                                            fill={prob > 0 ? "var(--accent-cyan)" : "var(--text-secondary)"}
                                            fontSize="10"
                                            fontWeight={prob > 0 ? "bold" : "normal"}
                                        >
                                            {prob !== null ? `${prob}%` : '-%'}
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
                                const x = horizontalPadding + i * itemWidth + itemWidth / 2;
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

                            {/* Row 3: Time Labels */}
                            {hours.map((h, i) => {
                                const x = horizontalPadding + i * itemWidth + itemWidth / 2;
                                return (
                                    <text
                                        key={`time-${i}`}
                                        x={x}
                                        y={height - 10}
                                        textAnchor="middle"
                                        fill="var(--text-secondary)"
                                        fontSize="12"
                                        fontWeight="500"
                                    >
                                        {i === 0 ? t.now : formatTime(h.time)}
                                    </text>
                                );
                            })}
                        </svg>
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
                    <span>{t.temperature}</span>
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
                    <span>{t.precipitation}</span>
                </div>
            </div>

        </div>
    );
};

export default HourlyForecast;
