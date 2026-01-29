# Native iOS App (No App Store) — Capacitor

You can build a **native .ipa** from this project and install it on one iPad via **ad-hoc** or **TestFlight**, without publishing to the App Store.

**You need:**
- **Mac** with **Xcode** installed
- **Apple Developer Program** ($99/year) — required to run on a physical iPad

---

## 1. On your Mac: get the project and install tools

1. Clone or pull the repo on your Mac.
2. Install dependencies and build the web app (no `VITE_BASE` — we use `/` for the native app):

   ```bash
   cd /path/to/weather-tracker
   npm install
   npm run build
   ```

3. Install **CocoaPods** if you don’t have it (needed for iOS):

   ```bash
   sudo gem install cocoapods
   ```

4. Install iOS dependencies:

   ```bash
   cd ios/App
   pod install
   cd ../..
   ```

5. Sync the built web app into the iOS project and open Xcode:

   ```bash
   npx cap sync ios
   npx cap open ios
   ```

   Or use the shortcut:

   ```bash
   npm run ios
   ```

   (This runs `npm run build`, then `cap sync ios`, then opens Xcode.)

---

## 2. In Xcode: sign and run on iPad

1. In Xcode, select the **App** project (blue icon) in the left sidebar.
2. Select the **App** target → **Signing & Capabilities**.
3. Under **Team**, choose your Apple ID team (or add your Apple ID in Xcode → Settings → Accounts). You need a **paid** Apple Developer Program membership to run on a real device.
4. Connect your **iPad** via USB (or use “Connect via network” if enabled).
5. At the top, choose your **iPad** as the run destination (instead of “Any iOS Device” or a simulator).
6. Press **Run** (▶) or **Product → Run**. The app installs and launches on the iPad. Data is stored locally in the app (WebView storage).

---

## 3. Build an .ipa for ad-hoc or TestFlight

### Ad-hoc (install on specific iPads without TestFlight)

1. In Xcode: **Product → Archive**.
2. When the Organizer opens, select the archive → **Distribute App**.
3. Choose **Ad Hoc** → **Next** → select your team and options → **Next**.
4. You may need to **register the iPad’s UDID** in your Apple Developer account (Devices) and create/use a provisioning profile that includes that device.
5. Export the .ipa. Install via **Apple Configurator** (Mac) or a distribution link (e.g. via a simple server or a service that hosts ad-hoc IPAs).

### TestFlight (easier for one iPad)

1. **Product → Archive** → in Organizer, **Distribute App**.
2. Choose **App Store Connect** → **Upload**.
3. After the upload, go to [App Store Connect](https://appstoreconnect.apple.com) → your app → **TestFlight**.
4. Add yourself (or the tester’s email) as an **Internal** or **External** tester. They get an invite and install via the **TestFlight** app. No public App Store listing.

---

## 4. After you change the web app

Whenever you change the React/Vite app:

1. Build and sync:

   ```bash
   npm run build
   npx cap sync ios
   ```

   Or:

   ```bash
   npm run ios
   ```

2. In Xcode, run or archive again. The native shell stays the same; only the web assets inside the app are updated.

---

## 5. Optional: Gemini API key in the native app

The app uses `localStorage` and the same build as the web. If you want the “Мишка-Метеоролог” AI in the monthly report inside the native app, bake the key into the build **before** syncing to iOS:

- Put `GEMINI_API_KEY` in `.env.local` on your Mac.
- Run `npm run build` (Vite will read `.env.local` and embed the key in the bundle).
- Then run `npx cap sync ios` and open/run in Xcode.

Do **not** commit `.env.local`; it’s in `.gitignore`.

---

## Summary

| Step              | Command / action                          |
|-------------------|-------------------------------------------|
| Build web app     | `npm run build`                           |
| Install pods      | `cd ios/App && pod install`               |
| Sync + open Xcode | `npx cap sync ios && npx cap open ios` or `npm run ios` |
| Run on iPad       | In Xcode: select iPad → Run               |
| Create .ipa       | Product → Archive → Distribute (Ad Hoc or TestFlight) |

Data is stored **locally on the iPad** in the app (same as the PWA). No server or App Store required for daily use.
