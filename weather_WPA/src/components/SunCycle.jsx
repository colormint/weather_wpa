import React from 'react';
import { Sunrise, Sunset } from 'lucide-react';
import { format } from 'date-fns';

const SunCycle = ({ sunrise, sunset }) => {
    if (!sunrise || !sunset) return null;

    const sunriseTime = format(new Date(sunrise), 'HH:mm');
    const sunsetTime = format(new Date(sunset), 'HH:mm');

    return (
        <div className="card h-full justify-center">
            <h2 className="sun-title">Sun Cycle</h2>
            <div className="sun-grid">
                <div className="sun-item">
                    <Sunrise size={32} className="text-[var(--accent-yellow)] mb-2" />
                    <span className="sun-time">{sunriseTime}</span>
                    <span className="text-mute">Sunrise</span>
                </div>
                <div className="divider"></div>
                <div className="sun-item">
                    <Sunset size={32} className="text-[var(--accent-yellow)] mb-2" />
                    <span className="sun-time">{sunsetTime}</span>
                    <span className="text-mute">Sunset</span>
                </div>
            </div>
        </div>
    );
};

export default SunCycle;
