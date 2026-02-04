import React from 'react';
import { X } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

const SettingsModal = ({ onClose }) => {
    const { theme, setTheme, units, setUnits, timeFormat, setTimeFormat } = useWeather();

    const RadioGroup = ({ options, value, onChange }) => (
        <div className="flex flex-col gap-2">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`radio-item ${value === opt.value ? 'active' : ''}`}
                >
                    <div className="radio-circle"></div>
                    <span className="flex-1 text-left">{opt.label}</span>
                </button>
            ))}
        </div>
    );

    return (
        <div className="modal-overlay">
            <div className="card modal-content p-6 flex-col gap-6 relative">
                <button
                    onClick={onClose}
                    className="icon-btn absolute top-6 right-6 z-50"
                >
                    <X size={24} />
                </button>
                <div className="flex justify-between items-center pl-2 mt-2">
                    <h2 className="text-2xl font-bold">Settings</h2>
                </div>

                <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
                    {/* Theme Section */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">Theme</h3>
                        <RadioGroup
                            options={[
                                { label: 'Light Mode', value: 'light' },
                                { label: 'Dark Mode', value: 'dark' },
                                { label: 'Auto (System)', value: 'system' }
                            ]}
                            value={theme}
                            onChange={setTheme}
                        />
                    </div>

                    {/* Units Section */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">Units</h3>
                        <RadioGroup
                            options={[
                                { label: 'Metric (°C, m/s)', value: 'metric' },
                                { label: 'Imperial (°F, mph)', value: 'imperial' }
                            ]}
                            value={units}
                            onChange={setUnits}
                        />
                    </div>

                    {/* Time Format Section */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">Time Format</h3>
                        <RadioGroup
                            options={[
                                { label: '12 Hour (AM/PM)', value: '12h' },
                                { label: '24 Hour', value: '24h' }
                            ]}
                            value={timeFormat}
                            onChange={setTimeFormat}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
