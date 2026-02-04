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
        setLocation({
            lat: result.latitude,
            lon: result.longitude,
            name: result.name,
            country: result.country
        });
        setShowResults(false);
        setSearchQuery('');
    };

    return (
        <>
            <header className="app-header w-full px-4 pt-4 pb-2 z-50 flex-col gap-4">
                {/* Row 1: Title and Settings */}
                <div className="flex w-full justify-between items-center px-1">
                    <h1 className="header-title">
                        Simple Weather <span className="text-secondary font-medium text-sm">v0.0.9.2</span>
                    </h1>
                    <button
                        onClick={() => setShowSettings(true)}
                        className="icon-btn"
                    >
                        <Settings size={22} />
                    </button>
                </div>

                {/* Row 2: Search Bar */}
                <div className="w-full relative">
                    <div className="search-container">
                        <Search size={18} className="text-[var(--text-secondary)] flex-shrink-0" />
                        <input
                            type="text"
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
