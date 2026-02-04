import React from 'react';
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
                    <span
                        className="mb-6 filter drop-shadow-sm leading-none"
                        style={{ fontSize: '5rem' }}
                    >
                        🌅
                    </span>
                    <span className="sun-time">{sunriseTime}</span>
                    <span className="text-mute">Sunrise</span>
                </div>
                <div className="divider"></div>
                <div className="sun-item">
                    <span
                        className="mb-6 filter drop-shadow-sm leading-none"
                        style={{ fontSize: '5rem' }}
                    >
                        🌇
                    </span>
                    <span className="sun-time">{sunsetTime}</span>
                    <span className="text-mute">Sunset</span>
                </div>
            </div>
        </div>
    );
};

export default SunCycle;
