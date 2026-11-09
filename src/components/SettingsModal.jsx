import React from 'react';
import { X } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

const SettingsModal = ({ onClose }) => {
    const {
        theme, setTheme,
        units, setUnits,
        timeFormat, setTimeFormat,
        language, setLanguage,
        t
    } = useWeather();

    const RadioGroup = ({ options, value, onChange }) => (
        <div className="flex flex-col gap-4">
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
            <div className="card modal-content p-6 flex-col gap-8 relative">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{t.settings}</h2>
                    <button onClick={onClose} className="icon-btn">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-col gap-8 max-h-[70vh] overflow-y-auto scrollbar-hide">
                    {/* Language Section */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">{t.language}</h3>
                        <RadioGroup
                            options={[
                                { label: '한국어', value: 'ko' },
                                { label: 'English', value: 'en' }
                            ]}
                            value={language}
                            onChange={setLanguage}
                        />
                    </div>

                    {/* Theme Section */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">{t.theme}</h3>
                        <RadioGroup
                            options={[
                                { label: t.systemAuto, value: 'system' },
                                { label: t.lightMode, value: 'light' },
                                { label: t.darkMode, value: 'dark' }
                            ]}
                            value={theme}
                            onChange={setTheme}
                        />
                    </div>

                    {/* Units Section */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">{t.units}</h3>
                        <RadioGroup
                            options={[
                                { label: t.autoRegion, value: 'auto' },
                                { label: t.metric, value: 'metric' },
                                { label: t.imperial, value: 'imperial' }
                            ]}
                            value={units}
                            onChange={setUnits}
                        />
                    </div>

                    {/* Time Format Section */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-1">{t.timeFormat}</h3>
                        <RadioGroup
                            options={[
                                { label: t.hour12, value: '12h' },
                                { label: t.hour24, value: '24h' }
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
