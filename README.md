# Simple Weather PWA (v0.1.4.6)

A beautiful, minimalistic weather application designed for simplicity and performance. Built with **React + Vite** and optimized as a Progressive Web App (PWA) for installability on mobile and desktop.

## Features

-   **Accurate Forecasts**: Uses **Open-Meteo** (Weather, Geocoding, Air Quality) and **RainViewer** (Radar) for reliable data.
-   **Air Quality Indicator**: Supports EU and US EPA air quality index standards for PM10 and PM2.5 based on the user's region.
-   **Smart Location & Privacy**: GPS support with "Current Location" tracking, plus city search. Geolocation coordinates are rounded to 2 decimal places (~1.1km area precision) for user privacy. Cache is secured in `sessionStorage` and cleared upon tab closure.
-   **Visual Richness**:
    -   **Dynamic 24h Graph**: Temperature curves (with customizable temperature-based color gradients) and precipitation probability bars rendered using a custom SVG implementation for performance and responsive scaling.
    -   **Sun Cycle**: Huge emoji visualizations for Sunrise/Sunset.
    -   **Interactive Weather Radar**: Real-time precipitation map integrated with Leaflet and React-Leaflet, utilizing RainViewer API dynamically with smart native zoom scaling.
-   **PWA Ready**: Installable, works offline (cached assets via Vite PWA plugin), and feels native.
-   **Dark Mode**: Automatically detects system preference or togglable via settings (with CSS-variable-based themes).
-   **Units**: Metric (°C, m/s), Imperial (°F, mph), or Regional Auto detection.
-   **Time Format**: 12h, 24h, or Auto detection.
-   **Multilingual Support**: Supports both Korean (ko) and English (en) interface translations.

## Tech Stack

-   **Frontend**: React 19, Vite
-   **Libraries**: Axios, date-fns, Leaflet, React-Leaflet, Vite PWA Plugin
-   **Styling**: Vanilla CSS (Variables & Utility classes), Lucide React (Icons).
-   **Data**: Open-Meteo API (Weather/Geocoding/Air Quality), RainViewer (Radar & Satellite).
-   **Charts**: Custom SVG implementation (no Recharts).

