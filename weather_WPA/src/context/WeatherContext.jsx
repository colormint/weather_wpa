import React, { createContext, useContext, useState, useEffect } from 'react';

const WeatherContext = createContext();

export const useWeather = () => useContext(WeatherContext);

export const WeatherProvider = ({ children }) => {
    // Theme: 'light' | 'dark' | 'system'
    const [theme, setTheme] = useState(() => localStorage.getItem('weather-theme') || 'light');

    // Units: 'metric' (Celsius, km/h) | 'imperial' (Fahrenheit, mph)
    const [units, setUnits] = useState(() => localStorage.getItem('weather-units') || 'metric');

    // Time Format: '24h' | '12h'
    const [timeFormat, setTimeFormat] = useState(() => localStorage.getItem('weather-time-format') || '12h');

    // Location: { lat, lon, name }
    const [location, setLocation] = useState(null);

    useEffect(() => {
        const root = window.document.body;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }

        localStorage.setItem('weather-theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('weather-units', units);
    }, [units]);

    useEffect(() => {
        localStorage.setItem('weather-time-format', timeFormat);
    }, [timeFormat]);

    const value = {
        theme,
        setTheme,
        units,
        setUnits,
        timeFormat,
        setTimeFormat,
        location,
        setLocation
    };

    return (
        <WeatherContext.Provider value={value}>
            {children}
        </WeatherContext.Provider>
    );
};
