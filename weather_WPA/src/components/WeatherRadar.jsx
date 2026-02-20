import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useWeather } from '../context/WeatherContext';

// Simple map updater
function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

const WeatherRadar = () => {
    const { location, effectiveTheme } = useWeather();
    const [radarTs, setRadarTs] = useState(null);
    const [satelliteTs, setSatelliteTs] = useState(null);

    useEffect(() => {
        const fetchRadar = async () => {
            try {
                const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
                const data = await res.json();

                // Radar (Precipitation)
                if (data?.radar?.past?.length > 0) {
                    const latest = data.radar.past[data.radar.past.length - 1];
                    setRadarTs(latest.time);
                }

                // Satellite (Clouds) - Infrared
                // Note: often empty on free tier or certain regions
                if (data?.satellite?.infrared?.length > 0) {
                    const latestSat = data.satellite.infrared[data.satellite.infrared.length - 1];
                    setSatelliteTs(latestSat.time);
                }
            } catch (err) {
                console.error("Radar fetch error:", err);
            }
        };

        fetchRadar();
    }, []);

    // Safety check
    if (!location) return null;

    const isDark = effectiveTheme === 'dark';
    const tileLayerUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    // Explicit style to ensure visibility and match theme
    const containerStyle = {
        height: '320px',
        width: '100%',
        position: 'relative',
        borderRadius: '1.5rem',
        overflow: 'hidden',
        marginTop: '1rem',
        // Dark mode: #252525, Light mode: #f8f9fa (secondary)
        backgroundColor: isDark ? '#252525' : '#f8f9fa',
        // Dark mode shadow vs Light mode shadow
        boxShadow: isDark
            ? '0 8px 16px rgba(0, 0, 0, 0.4)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    };

    return (
        <div style={containerStyle} className="weather-radar-box">
            {/* Map */}
            <MapContainer
                center={[location.lat, location.lon]}
                zoom={10}
                style={{ height: '100%', width: '100%', background: 'transparent' }}
                zoomControl={false}
                attributionControl={false}
            >
                {/* Base Map */}
                <TileLayer url={tileLayerUrl} />

                {/* Satellite Layer (Clouds) - Fallback if available */}
                {satelliteTs && (
                    <TileLayer
                        url={`https://tile.cache.rainviewer.com/v2/satellite-infrared/${satelliteTs}/256/{z}/{x}/{y}/0/1_1.png`}
                        opacity={0.5}
                    />
                )}

                {/* Radar Layer (Precipitation) */}
                {radarTs && (
                    <TileLayer
                        url={`https://tile.cache.rainviewer.com/v2/radar/${radarTs}/256/{z}/{x}/{y}/2/1_1.png`}
                        opacity={0.8}
                    />
                )}

                <MapUpdater center={[location.lat, location.lon]} />
            </MapContainer>

            {/* Overlays - Absolute Positioning */}
            <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                zIndex: 1000,
                backgroundColor: 'var(--bg-primary)',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                opacity: 0.9,
                color: 'var(--text-primary)'
            }}>
                🌧️ Weather Radar
            </div>

            <div style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                zIndex: 1000,
                fontSize: '0.65rem',
                backgroundColor: 'rgba(255,255,255,0.5)',
                padding: '2px 6px',
                borderRadius: '4px',
                color: '#000',
                pointerEvents: 'none'
            }}>
                RainViewer | OSM
            </div>
        </div>
    );
};

export default WeatherRadar;
