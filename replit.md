# Weather Diary 2026 (Дневник Погоды 2026)

## Overview
A Russian-language weather tracking diary application for the year 2026. Built with React, TypeScript, and Vite. Users can record daily temperature and weather conditions (sunny, cloudy, rainy, snowy) through an interactive calendar interface.

## Project Structure
- `index.html` - Entry HTML file with Tailwind CSS CDN
- `index.tsx` - React app entry point
- `App.tsx` - Main application component with routing logic
- `types.ts` - TypeScript type definitions
- `constants.tsx` - App constants
- `components/` - React components
  - `Calendar.tsx` - Calendar view for selecting dates
  - `DayEntry.tsx` - Form for entering weather data
  - `MonthlyReport.tsx` - Monthly weather statistics
- `services/` - Service utilities
  - `storage.ts` - Local storage management
- `vite.config.ts` - Vite configuration (port 5000, allows all hosts)

## Tech Stack
- React 19
- TypeScript
- Vite
- Tailwind CSS (via CDN)
- Recharts (for charts)
- @google/genai (Gemini API integration)

## Running the App
```bash
npm run dev
```
The app runs on port 5000.

## Environment Variables
- `GEMINI_API_KEY` - Google Gemini API key (optional, for AI features)

## Data Storage
Weather data is stored in browser localStorage under the key `weather_tracker_2026_data`.
