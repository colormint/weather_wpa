# Simple Weather PWA (v0.1.4.6)

A simple weather PWA built for various devices.

## Features

-   **Forecasts**: Uses **Open-Meteo** (Weather, Geocoding, Air Quality) and **RainViewer** (Radar) for data.
-   **Air Quality Indicator**: Supports EU and US EPA air quality index standards for PM10 and PM2.5 based on the user's region.
-   **Location & Privacy**: GPS support plus city search. Geolocation coordinates are rounded to 2 decimal places (~1.1km area precision) for user privacy. Cache is stored in `sessionStorage` and cleared upon tab closure.
-   **24h Graph**: Color coded emperature curves and precipitation probability bars rendered using a custom SVG implementation.
-   **Weather Radar**: Displays RainViewer precipitation tiles with Leaflet/React-Leaflet.
-   **PWA support**
-   **Dark Mode**: Automatically detects system preference or togglable via settings.
-   **Units**: Metric (°C, m/s), Imperial (°F, mph), or Regional Auto detection.
-   **Time Format**: 12h, 24h, or Auto detection.
-   **Multilingual Support**: Supports both Korean (ko) and English (en) interface translations.

## Tech Stack

-   **Frontend**: React 19, Vite
-   **Libraries**: Axios, date-fns, Leaflet, React-Leaflet, Vite PWA Plugin
-   **Styling**: Vanilla CSS (Variables & Utility classes), Lucide React (Icons).
-   **Data**: Open-Meteo API (Weather/Geocoding/Air Quality), RainViewer (Radar & Satellite).
-   **Charts**: Custom SVG implementation (no Recharts).

