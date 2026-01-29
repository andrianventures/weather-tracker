<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Дневник Погоды 2026 — Weather Tracker for Kids

A colorful, kid-friendly weather diary for 2026 with a calendar, temperature scale, and monthly reports. Works on desktop and **iPad** (install to home screen, no App Store).

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. (Optional) For the “Мишка-Метеоролог” AI insight in the monthly report, set `GEMINI_API_KEY` in `.env.local` to your [Google AI Studio](https://aistudio.google.com/) API key. The rest of the app works without it.
3. Run the app: `npm run dev`

---

## Using on iPad (no App Store)

The app is a **Progressive Web App (PWA)**. You can put it on your son’s iPad as a home-screen icon and use it like an app, **without the App Store**. All data is saved **locally on the device** (in the browser).

### Option A: Add to Home Screen (recommended, no API keys)

1. **Host the app** so the iPad can open it over the internet:
   - Build: `npm run build`
   - Deploy the `dist/` folder to any static host (Vercel, Netlify, GitHub Pages, or your own server).
   - Or, from your computer on the same Wi‑Fi: run `npm run build && npm run preview`, then find your computer’s IP (e.g. `http://192.168.1.10:4173`) and open that URL on the iPad in Safari.

2. **On the iPad**, open the app URL in **Safari** (Chrome on iOS does not support “Add to Home Screen” the same way).

3. Tap the **Share** button (square with arrow) → **“Add to Home Screen”** → name it (e.g. “Погода 2026”) → **Add**.

4. The new icon opens the app **full screen**, and **data is stored locally** on the iPad. No account or API key is required for the calendar, temperature, weather icons, or saving entries.

**API key only if you want AI:** The monthly report’s “Мишка-Метеоролог” text uses Google’s Gemini API. If you want that feature when the app is hosted, set `GEMINI_API_KEY` in your build environment (e.g. in your host’s env vars). The app works fully without it; the report will show a friendly fallback message.

### Option B: Install as a real .ipa (advanced)

If you want a native .ipa to install on one device (e.g. via cable or TestFlight) and **bypass the App Store**, you can wrap this app with **Capacitor** and build in Xcode. You will need:

- **Apple Developer Program** ($99/year) for signing and installing on a real device.
- **Expo** is not required for this approach; the current app is React + Vite, and Capacitor wraps the built web app.

Steps in short: add `@capacitor/core` and `@capacitor/ios`, run `npx cap add ios`, build with `npm run build`, copy into the iOS project, open in Xcode, then build and run (or archive for ad-hoc/TestFlight). Data still saves locally inside the app. If you want, I can add a `capacitor.config.ts` and exact commands to the repo.

---

## Tech stack

- React, TypeScript, Vite  
- Tailwind CSS  
- Local storage for all diary data  
- PWA (manifest + service worker) for iPad “Add to Home Screen” and offline use
