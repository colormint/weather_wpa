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
    const [location, setLocation] = useState(() => {
        try {
            const saved = localStorage.getItem('weather-location');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error("Failed to parse location", e);
            return null;
        }
    });

    useEffect(() => {
        if (location) {
            localStorage.setItem('weather-location', JSON.stringify(location));
        }
    }, [location]);

    const [effectiveTheme, setEffectiveTheme] = useState(theme);

    useEffect(() => {
        const root = window.document.body;
        root.classList.remove('light', 'dark');

        let activeTheme = theme;
        if (theme === 'system') {
            activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        root.classList.add(activeTheme);
        setEffectiveTheme(activeTheme);

        localStorage.setItem('weather-theme', theme);

        // Listen for system changes if mode is system
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e) => {
                const newTheme = e.matches ? 'dark' : 'light';
                root.classList.remove('light', 'dark');
                root.classList.add(newTheme);
                setEffectiveTheme(newTheme);
            };
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
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
        effectiveTheme, // Expose the actual resolved theme
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
