import React from 'react';
import { useWeather } from '../context/WeatherContext';

const AirQuality = ({ pm10, pm25, timezone }) => {
    const { t, language } = useWeather();
    const isAmerica = timezone?.startsWith('America/') || false;

    // US EPA Thresholds
    const getUSStatus = (val, type) => {
        if (type === 'pm25') {
            if (val <= 12) return language === 'ko' ? "좋음" : "Good";
            if (val <= 35.4) return language === 'ko' ? "보통" : "Moderate";
            if (val <= 55.4) return language === 'ko' ? "민감군 나쁨" : "Unhealthy for Sensitive Groups";
            if (val <= 150.4) return language === 'ko' ? "나쁨" : "Unhealthy";
            if (val <= 250.4) return language === 'ko' ? "매우 나쁨" : "Very Unhealthy";
            return language === 'ko' ? "위험" : "Hazardous";
        } else {
            // pm10
            if (val <= 54) return language === 'ko' ? "좋음" : "Good";
            if (val <= 154) return language === 'ko' ? "보통" : "Moderate";
            if (val <= 254) return language === 'ko' ? "민감군 나쁨" : "Unhealthy for Sensitive Groups";
            if (val <= 354) return language === 'ko' ? "나쁨" : "Unhealthy";
            if (val <= 424) return language === 'ko' ? "매우 나쁨" : "Very Unhealthy";
            return language === 'ko' ? "위험" : "Hazardous";
        }
    };

    const getUSColor = (val, type) => {
        if (type === 'pm25') {
            if (val <= 12) return "#22c55e"; // Green
            if (val <= 35.4) return "#eab308"; // Yellow
            if (val <= 55.4) return "#f97316"; // Orange
            if (val <= 150.4) return "#dc2626"; // Red
            if (val <= 250.4) return "#7e22ce"; // Purple
            return "#7f1d1d"; // Maroon
        } else {
            // pm10
            if (val <= 54) return "#22c55e";
            if (val <= 154) return "#eab308";
            if (val <= 254) return "#f97316";
            if (val <= 354) return "#dc2626";
            if (val <= 424) return "#7e22ce";
            return "#7f1d1d";
        }
    };

    // EU EAQI Thresholds
    const getEUStatus = (val, type) => {
        if (type === 'pm25') {
            if (val <= 10) return language === 'ko' ? "좋음" : "Good";
            if (val <= 20) return language === 'ko' ? "보통" : "Fair";
            if (val <= 25) return language === 'ko' ? "민감군 나쁨" : "Moderate";
            if (val <= 50) return language === 'ko' ? "나쁨" : "Poor";
            if (val <= 75) return language === 'ko' ? "매우 나쁨" : "Very Poor";
            return language === 'ko' ? "최악" : "Extremely Poor";
        } else {
            // pm10
            if (val <= 20) return language === 'ko' ? "좋음" : "Good";
            if (val <= 40) return language === 'ko' ? "보통" : "Fair";
            if (val <= 50) return language === 'ko' ? "민감군 나쁨" : "Moderate";
            if (val <= 100) return language === 'ko' ? "나쁨" : "Poor";
            if (val <= 150) return language === 'ko' ? "매우 나쁨" : "Very Poor";
            return language === 'ko' ? "최악" : "Extremely Poor";
        }
    };

    const getEUColor = (val, type) => {
        if (type === 'pm25') {
            if (val <= 10) return "#0ea5e9"; // Blue
            if (val <= 20) return "#22c55e"; // Green
            if (val <= 25) return "#eab308"; // Yellow
            if (val <= 50) return "#dc2626"; // Red
            if (val <= 75) return "#7f1d1d"; // Dark Red
            return "#450a0a"; // Very Dark Red
        } else {
            // pm10
            if (val <= 20) return "#0ea5e9";
            if (val <= 40) return "#22c55e";
            if (val <= 50) return "#eab308";
            if (val <= 100) return "#dc2626";
            if (val <= 150) return "#7f1d1d";
            return "#450a0a";
        }
    };

    const getStatus = (val, type) => isAmerica ? getUSStatus(val, type) : getEUStatus(val, type);
    const getColor = (val, type) => isAmerica ? getUSColor(val, type) : getEUColor(val, type);

    if (pm10 === null || pm25 === null || pm10 === undefined || pm25 === undefined) return null;

    return (
        <div className="card">
            <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]">{t.airQuality}</h2>
            <div className="grid-cols-2 relative items-center justify-items-center">
                <div className="flex flex-col items-center text-center">
                    <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">PM10</span>
                    <span className="text-3xl font-bold" style={{ color: getColor(pm10, 'pm10') }}>{pm10}</span>
                    <span className="text-xs text-[var(--text-secondary)] mt-1 font-medium px-2">{getStatus(pm10, 'pm10')}</span>
                </div>

                {/* Vertical Divider */}
                <div className="absolute h-12 w-px bg-[var(--divider-color)] left-1/2 -translate-x-1/2"></div>

                <div className="flex flex-col items-center text-center">
                    <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">PM2.5</span>
                    <span className="text-3xl font-bold" style={{ color: getColor(pm25, 'pm25') }}>{pm25}</span>
                    <span className="text-xs text-[var(--text-secondary)] mt-1 font-medium px-2">{getStatus(pm25, 'pm25')}</span>
                </div>
            </div>
        </div>
    );
};

export default AirQuality;
