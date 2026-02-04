import React, { useState, useEffect } from 'react';
import { MapPin, Search, Settings } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import SettingsModal from './SettingsModal';
import axios from 'axios';

const Header = () => {
    const { location, setLocation } = useWeather();
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
        const displayName = result.admin1 ? `${name}, ${country}` : `${name}, ${country}`;

        setLocation({
            lat: result.latitude,
            lon: result.longitude,
            name: displayName,
            country: result.country
        });
        setShowResults(false);
        setSearchQuery('');
    };

    const handleGeoLocation = () => {
        setSearchQuery(''); // Clear any existing search text to ensure placeholder shows
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                try {
                    // Reverse Geocoding to get City Name
                    const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en&format=json`);
                    const result = response.data.results ? response.data.results[0] : null;

                    let displayName = "Current Location";
                    if (result) {
                        displayName = `📍 ${result.name}, ${result.country} (Current Location)`;
                    } else {
                        // Fallback but still try to be descriptive if possible or just stick to format
                        displayName = "📍 Current Location";
                    }

                    setLocation({
                        lat: lat,
                        lon: lon,
                        name: displayName,
                        isGPS: true
                    });
                } catch (error) {
                    console.error("Reverse geocoding failed", error);
                    setLocation({
                        lat: lat,
                        lon: lon,
                        name: "📍 Current Location",
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
                        Simple Weather <span className="text-secondary font-medium text-sm">v0.0.9.3</span>
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
                <div className="w-full relative">
                    <div className="search-container">
                        <Search size={18} className="text-[var(--text-secondary)] flex-shrink-0" />
                        <input
                            type="text"
                            // If location exists use it, otherwise placeholder.
                            // BUT: If user is typing code needs to handle value.
                            // The value prop is searchQuery.
                            // If searchQuery is empty, we want to show the current location name as placeholder?
                            // Or should we set the searchQuery to the name?
                            // Standard pattern: Placeholder shows current context, Input shows user query.
                            placeholder={location ? location.name : "Search City..."}
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
            </header>

            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        </>
    );
};

export default Header;
