# Simple Weather PWA (v0.1.4.6)

A clean, modern React Progressive Web Application that provides incredibly precise, visually elegant weather forecasting.

## v0.1.4.6 Features & Changes
This release restores the weather radar layer by adapting to RainViewer's updated hash-based path API, implements coordinate rounding for geolocation privacy, and migrates location caching to session storage.

### Features & Fixes
* **Weather Radar Fix:** Updated tile layer requests to fetch active paths and hosts dynamically from the RainViewer API, resolving issues from hardcoded defunct domains and timestamp API deprecations.
* **Smart Zoom Scaling:** Configured max Native Zoom to 7 for radar tiles, allowing the Leaflet map to stretch tiles smoothly up to level 18 without breaking detail levels.
* **Geolocation Privacy:** Implemented 2 decimal place coordinate rounding (~1.1km area precision) before querying third-party APIs to mask precise home/building addresses.
* **Storage Migration:** Moved geolocation cache from localStorage to sessionStorage so location data is completely purged when the browser tab is closed. Added automatic legacy localStorage key cleanup.

## Setup
Built via Vite. 

```bash
npm install
npm run dev
# or build for prod
npm run build
```
