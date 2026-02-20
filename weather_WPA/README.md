# Simple Weather PWA (v0.1.4)

A clean, modern React Native Progressive Web Application that provides incredibly precise, visually elegant weather forecasting.

## v0.1.4 Features & Changes
This release stabilizes UI, improves graph drawing performance, and fully finalizes i18n support.

### Features
* **Perfectly Aligned Graphs:** The 24-hour forecast container was entirely rewritten to use absolute SVG coordinate mapping ensuring perfect icon-to-gridline visual alignment. Both temperature lines and precipitation bars render dynamically with custom boundaries.
* **Korean Localization (ko-KR):** Fully translated UI strings including:
  * "H" / "L" vs "최고" / "최저" in daily forecast
  * Mapped AM/PM standardizations per locale
  * Translated Open-Meteo weather codes
* **Dynamic Air Quality Indices (AQI):** The application intelligently switches between United States EPA and European EAQI air quality standard thresholds dynamically based upon the user's current loaded timezone.
* **Unified Gradient System:** Both the Hourly Forecast wave graph and textual averages (like the 7-day card and overview) dynamically invoke a unified temperature-to-color interpolation tool, shifting from icy blue (< -10°C) up to red (> 40°C).
* **Robust Settings:** Time format toggle is strictly limited to user preference (12h vs 24h), migrating cleanly from older "Auto" variants.
* **Radar Module Baseline:** Default tracking view initialized to city-bounds.

## Setup
Built via Vite. 

```bash
npm install
npm run dev
# or build for prod
npm run build
```
