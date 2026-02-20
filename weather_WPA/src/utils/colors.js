export const tempStops = [
    { t: -10, c: '#3b82f6' }, // Blue
    { t: 0, c: '#0ea5e9' },   // Light Blue
    { t: 10, c: '#22c55e' },  // Green
    { t: 20, c: '#eab308' },  // Yellow
    { t: 30, c: '#f97316' },  // Orange
    { t: 40, c: '#ef4444' }   // Red
];

const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
};

export const getTempColor = (temp) => {
    if (temp <= tempStops[0].t) return tempStops[0].c;
    if (temp >= tempStops[tempStops.length - 1].t) return tempStops[tempStops.length - 1].c;

    for (let i = 0; i < tempStops.length - 1; i++) {
        const lower = tempStops[i];
        const upper = tempStops[i + 1];
        if (temp >= lower.t && temp <= upper.t) {
            const ratio = (temp - lower.t) / (upper.t - lower.t);
            const rgb1 = hexToRgb(lower.c);
            const rgb2 = hexToRgb(upper.c);

            const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * ratio);
            const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * ratio);
            const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * ratio);
            return `rgb(${r}, ${g}, ${b})`;
        }
    }
    return tempStops[0].c;
};

export const getTempGradientStyle = (temp) => {
    const topColor = getTempColor(temp + 2);
    const bottomColor = getTempColor(temp - 4);
    return {
        backgroundImage: `linear-gradient(to bottom, ${topColor}, ${bottomColor})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    };
};
