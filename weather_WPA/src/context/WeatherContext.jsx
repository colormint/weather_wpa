import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const WeatherContext = createContext();

export const useWeather = () => useContext(WeatherContext);

// Translations
const translations = {
    ko: {
        settings: "설정",
        theme: "테마",
        lightMode: "라이트 모드",
        darkMode: "다크 모드",
        systemAuto: "자동 (시스템)",
        units: "단위",
        metric: "미터법 (°C, m/s)",
        imperial: "야드파운드법 (°F, mph)",
        autoRegion: "자동 (지역 기반)",
        timeFormat: "시간 표기",
        hour12: "12시간제 (오전/오후)",
        hour24: "24시간제",
        language: "언어",
        searchPrompt: "도시를 검색하세요",
        currentLocation: "현재 위치",
        currentWeather: "현재 날씨",
        forecast24h: "24시간 예보",
        forecast7d: "7일 예보",
        sunCycle: "일출/일몰",
        sunrise: "일출",
        sunset: "일몰",
        airQuality: "대기질",
        now: "지금",
        high: "최고",
        low: "최저",
        feelsLike: "체감",
        overview: "개요",
        seoulDefault: "서울 (기본)",
        defaultLocationMsg: "기본 위치(서울)를 사용 중입니다. 검색하여 도시를 찾아보세요.",
        temperature: "온도",
        precipitation: "강수 확률"
    },
    en: {
        settings: "Settings",
        theme: "Theme",
        lightMode: "Light Mode",
        darkMode: "Dark Mode",
        systemAuto: "Auto (System)",
        units: "Units",
        metric: "Metric (°C, m/s)",
        imperial: "Imperial (°F, mph)",
        autoRegion: "Auto (Region)",
        timeFormat: "Time Format",
        hour12: "12 Hour (AM/PM)",
        hour24: "24 Hour",
        language: "Language",
        searchPrompt: "Search for cities",
        currentLocation: "Current Location",
        currentWeather: "Current Weather",
        forecast24h: "24h Forecast",
        forecast7d: "7-Day Forecast",
        sunCycle: "Sun Cycle",
        sunrise: "Sunrise",
        sunset: "Sunset",
        airQuality: "Air Quality",
        now: "Now",
        high: "H",
        low: "L",
        feelsLike: "Feels like",
        overview: "Overview",
        seoulDefault: "Seoul (Default)",
        defaultLocationMsg: "Using default location (Seoul). Tap Search to find your city.",
        temperature: "Temperature",
        precipitation: "Chance of rain"
    }
};

export const WeatherProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('weather-theme') || 'system');
    const [units, setUnits] = useState(() => localStorage.getItem('weather-units') || 'auto');
    const [timeFormat, setTimeFormat] = useState(() => {
        const saved = localStorage.getItem('weather-time-format');
        return (saved && saved !== 'auto') ? saved : '24h';
    });
    const [language, setLanguage] = useState(() => localStorage.getItem('weather-language') || 'ko');

    const [location, setLocation] = useState(() => {
        try {
            const saved = localStorage.getItem('weather-location');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });

    const [effectiveTheme, setEffectiveTheme] = useState('light');
    const [effectiveUnits, setEffectiveUnits] = useState('metric');
    const [effectiveTimeFormat, setEffectiveTimeFormat] = useState('24h');

    // Persist settings
    useEffect(() => { localStorage.setItem('weather-theme', theme); }, [theme]);
    useEffect(() => { localStorage.setItem('weather-units', units); }, [units]);
    useEffect(() => { localStorage.setItem('weather-time-format', timeFormat); }, [timeFormat]);
    useEffect(() => { localStorage.setItem('weather-language', language); }, [language]);
    useEffect(() => {
        if (location) localStorage.setItem('weather-location', JSON.stringify(location));
    }, [location]);

    // Resolve Theme
    useEffect(() => {
        const root = window.document.body;
        let activeTheme = theme;
        if (theme === 'system') {
            activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        root.classList.remove('light', 'dark');
        root.classList.add(activeTheme);
        setEffectiveTheme(activeTheme);

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

    // Resolve Units
    useEffect(() => {
        if (units === 'auto') {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
            const isImperial = tz.startsWith('America/') || tz === 'Europe/London';
            setEffectiveUnits(isImperial ? 'imperial' : 'metric');
        } else {
            setEffectiveUnits(units);
        }
    }, [units]);

    // Resolve Time Format
    useEffect(() => {
        if (timeFormat === 'auto') {
            setTimeFormat('24h');
            setEffectiveTimeFormat('24h');
        } else {
            setEffectiveTimeFormat(timeFormat);
        }
    }, [timeFormat]);

    const t = useMemo(() => translations[language] || translations.en, [language]);

    const value = {
        theme, setTheme, effectiveTheme,
        units, setUnits, effectiveUnits,
        timeFormat, setTimeFormat, effectiveTimeFormat,
        language, setLanguage, t,
        location, setLocation
    };

    return (
        <WeatherContext.Provider value={value}>
            {children}
        </WeatherContext.Provider>
    );
};
