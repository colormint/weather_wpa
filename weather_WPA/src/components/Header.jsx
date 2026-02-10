import React, { useState, useEffect } from 'react';
import { MapPin, Search, Settings } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import SettingsModal from './SettingsModal';
import axios from 'axios';

const Header = () => {
    const { location, setLocation, theme, effectiveTheme } = useWeather();
    const [showSettings, setShowSettings] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length > 2) {
                try {
                    const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${searchQuery}&count=5&language=en&format=json`);
                    setResults(response.data.results || []);
                    setShowResults(true);
                } catch (error) {
                    console.error("Search failed", error);
                }
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSelect = (result) => {
        // Format: "City, Country"
        const name = result.name;
        const country = result.country;
        const cleanName = result.admin1 ? `${name}, ${country}` : `${name}, ${country}`;

        setLocation({
            lat: result.latitude,
            lon: result.longitude,
            name: cleanName,
            country: result.country,
            isGPS: false
        });
        setShowResults(false);
        setSearchQuery('');
    };

    const handleGeoLocation = () => {
        setSearchQuery('');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                try {
                    // Reverse Geocoding to get City Name
                    const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en&format=json`);
                    const result = response.data.results ? response.data.results[0] : null;

                    let cleanName = "Current Location";
                    if (result) {
                        cleanName = `${result.name}, ${result.country}`;
                    }

                    setLocation({
                        lat: lat,
                        lon: lon,
                        name: cleanName,
                        isGPS: true
                    });
                } catch (error) {
                    console.error("Reverse geocoding failed", error);
                    setLocation({
                        lat: lat,
                        lon: lon,
                        name: "Current Location",
                        isGPS: true
                    });
                }
            }, (error) => {
                console.error("Geolocation error", error);
                alert("Unable to retrieve your location");
            });
        } else {
            alert("Geolocation is not supported by your browser");
        }
    };

    return (
        <>
            <header className="app-header w-full px-4 pt-4 pb-2 z-50 flex-col gap-4">
                {/* Row 1: Title and Settings */}
                <div className="flex w-full justify-between items-center px-1">
                    <h1 className="header-title">
                        Simple Weather <span className="text-secondary font-medium text-sm">v0.1.3</span>
                    </h1>
                    <div className="flex gap-2">
                        <button
                            onClick={handleGeoLocation}
                            className="icon-btn"
                            title="Use Current Location"
                        >
                            <MapPin size={22} />
                        </button>
                        <button
                            onClick={() => setShowSettings(true)}
                            className="icon-btn"
                        >
                            <Settings size={22} />
                        </button>
                    </div>
                </div>

                {/* Row 2: Search Bar */}
                <div className="w-full relative z-20">
                    <div className="search-container shadow-md">
                        <Search size={18} className="text-[var(--text-secondary)] flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search for cities"
                            className="header-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => { if (results.length > 0) setShowResults(true); }}
                        />
                    </div>

                    {/* Dropdown Results */}
                    {showResults && results.length > 0 && (
                        <div className="dropdown-menu">
                            {results.map((res) => (
                                <button
                                    key={res.id}
                                    onClick={() => handleSelect(res)}
                                    className="dropdown-item"
                                >
                                    <MapPin size={16} className="text-[var(--accent-blue)] flex-shrink-0" />
                                    <div className="flex-col items-start gap-1">
                                        <span className="font-bold text-sm block text-[var(--text-primary)] leading-tight">{res.name}</span>
                                        <span className="text-xs text-[var(--text-secondary)] leading-tight">{res.admin1 ? `${res.admin1}, ` : ''}{res.country}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {location && (
                    <div className="w-full flex justify-center items-center mt-4 mb-2">
                        <span
                            className="text-xl font-black text-center tracking-tight"
                            style={{ color: effectiveTheme === 'dark' ? '#ffffff' : '#000000' }}
                        >
                            {location.isGPS
                                ? (location.name === "Current Location" ? "📍 Current Location" : `📍 ${location.name} (Current Location)`)
                                : location.name
                            }
                        </span>
                    </div>
                )}
            </header>

            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        </>
    );
};

export default Header;
