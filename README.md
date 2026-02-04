# Simple Weather PWA (v0.1.0)

A beautiful, minimalistic weather application designed for simplicity and performance. Built with **React + Vite** and optimized as a Progressive Web App (PWA) for installability on mobile and desktop.

## Features

-   **Accurate Forecasts**: Uses **Open-Meteo** and **RainViewer** (Radar) for reliable data.
-   **Smart Location**: GPS support with "Current Location" tracking, plus city search.
-   **Visual Richness**:
    -   **Dynamic 24h Graph**: Temperature curves that adapt to ranges, ensuring readability without distortion.
    -   **Sun Cycle**: Huge emoji visualizations for Sunrise/Sunset.
    -   **Radar Integration**: Real-time precipitation map.
-   **PWA Ready**: Installable, works offline (cached assets), and feels native.
-   **Dark Mode**: Automatically detects system preference or togglable via settings.
-   **Units**: Metric (°C, m/s) or Imperial (°F, mph).
-   **Time Format**: 12h or 24h.

## Tech Stack

-   **Frontend**: React 19, Vite
-   **Styling**: Vanilla CSS (Variables & Utility classes), Lucide React (Icons).
-   **Data**: Open-Meteo API (Weather/Geocoding), RainViewer (Radar).
-   **Charts**: Recharts (Custom SVG implementation for 24h graph).
