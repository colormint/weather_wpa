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
            <header className="app-header max-w-full px-4 pt-4 pb-2 z-50">
                <div className="flex items-center gap-3 w-full relative">
                    {/* Search Icon */}
                    <Search size={20} className="text-[var(--text-secondary)] flex-shrink-0" />

                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder={location ? location.name : "Search City..."}
                            className="w-full bg-transparent text-[var(--text-primary)] font-bold text-lg placeholder:text-[var(--text-secondary)] placeholder:font-normal focus:outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => { if (results.length > 0) setShowResults(true); }}
                        />

                        {/* Dropdown Results */}
                        {showResults && results.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-4 bg-[var(--bg-primary)] rounded-xl shadow-xl border border-[var(--divider-color)] overflow-hidden z-[60]">
                                {results.map((res) => (
                                    <button
                                        key={res.id}
                                        onClick={() => handleSelect(res)}
                                        className="w-full text-left px-4 py-3 hover:bg-[var(--bg-secondary)] flex items-center gap-2 border-b border-[var(--divider-color)] last:border-none"
                                    >
                                        <MapPin size={14} className="text-[var(--accent-blue)]" />
                                        <div>
                                            <span className="font-bold text-sm block text-[var(--text-primary)]">{res.name}</span>
                                            <span className="text-xs text-[var(--text-secondary)]">{res.admin1 ? `${res.admin1}, ` : ''}{res.country}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Settings Icon */}
                    <button
                        onClick={() => setShowSettings(true)}
                        className="icon-btn flex-shrink-0"
                    >
                        <Settings size={24} />
                    </button>
                </div>
            </header>

            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        </>
    );
};

export default Header;
