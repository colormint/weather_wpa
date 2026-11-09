import React from 'react';
import { format } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import { useWeather } from '../context/WeatherContext';

const SunCycle = ({ sunrise, sunset }) => {
    const { effectiveTimeFormat, t, language } = useWeather();
    if (!sunrise || !sunset) return null;

    const locale = language === 'ko' ? ko : enUS;
    const timeString = effectiveTimeFormat === '12h'
        ? (language === 'ko' ? 'a h:mm' : 'h:mm a')
        : 'HH:mm';

    const sunriseTime = format(new Date(sunrise), timeString, { locale });
    const sunsetTime = format(new Date(sunset), timeString, { locale });

    return (
        <div className="card h-full justify-center">
            <h2 className="sun-title">{t.sunCycle}</h2>
            <div className="sun-grid">
                <div className="sun-item">
                    <span
                        className="mb-6 filter drop-shadow-sm leading-none"
                        style={{ fontSize: '5rem' }}
                    >
                        🌅
                    </span>
                    <span className="sun-time">{sunriseTime}</span>
                    <span className="text-mute">{t.sunrise}</span>
                </div>
                <div className="divider"></div>
                <div className="sun-item">
                    <span
                        className="mb-6 filter drop-shadow-sm leading-none"
                        style={{ fontSize: '5rem' }}
                    >
                        🌇
                    </span>
                    <span className="sun-time">{sunsetTime}</span>
                    <span className="text-mute">{t.sunset}</span>
                </div>
            </div>
        </div>
    );
};

export default SunCycle;
