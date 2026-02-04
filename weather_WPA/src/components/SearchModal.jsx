import React, { useState } from 'react';
import axios from 'axios';
import { X, Search, MapPin } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

const SearchModal = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const { setLocation } = useWeather();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        try {
            const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`);
            setResults(response.data.results || []);
        } catch (error) {
            console.error("Geocoding failed", error);
        }
    };

    const handleSelect = (result) => {
        setLocation({
            lat: result.latitude,
            lon: result.longitude,
            name: result.name,
            country: result.country
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="card w-full max-w-md max-h-[80vh] flex flex-col p-4 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Search Location</h2>
                    <button onClick={onClose} className="p-2"><X /></button>
                </div>

                <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search city..."
                        className="flex-1 p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--divider-color)] text-[var(--text-primary)]"
                        autoFocus
                    />
                    <button type="submit" className="p-2 bg-[var(--accent-blue)] text-white rounded-lg">
                        <Search size={20} />
                    </button>
                </form>

                <div className="flex-1 overflow-y-auto flex flex-col gap-2">
                    {results.map((result) => (
                        <button
                            key={result.id}
                            onClick={() => handleSelect(result)}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-primary)] text-left transition-colors"
                        >
                            <MapPin size={16} className="text-[var(--text-secondary)]" />
                            <div>
                                <p className="font-bold">{result.name}</p>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    {result.admin1 ? `${result.admin1}, ` : ''}{result.country}
                                </p>
                            </div>
                        </button>
                    ))}
                    {results.length === 0 && query && (
                        <p className="text-center text-[var(--text-secondary)] mt-4">No results found</p>
                    )}
                </div>

                <button
                    onClick={() => {
                        setLocation(null); // Reset to GPS
                        onClose();
                    }}
                    className="mt-4 py-2 text-[var(--accent-blue)] text-sm font-medium"
                >
                    Use Current Location
                </button>
            </div>
        </div>
    );
};

export default SearchModal;
