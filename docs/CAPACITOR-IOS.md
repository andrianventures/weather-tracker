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

   When prompted for **Password**, enter your **Mac login password** (the one you use to unlock the Mac). Nothing appears as you type—that's normal.

   **No admin password?** Install CocoaPods for your user only (no `sudo`):

   ```bash
   gem install cocoapods --user-install
   export PATH="$HOME/.gem/ruby/$(ruby -e 'puts RUBY_VERSION')/bin:$PATH"
   ```

   Add that `export` line to your `~/.zshrc` (or `~/.bash_profile`) so `pod` is found in new terminals. Then run `pod install` from step 4.

   Alternatively, if you have **Homebrew**: `brew install cocoapods` (often works without sudo).

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

## 2. Get the app on your iPad (two options)

### Option A: Run from Xcode (iPad connected to Mac)

You need to **connect the iPad via USB at least once** so Apple can register the device and Xcode can create a provisioning profile. After that, you can use **Connect via network** (Wi‑Fi) for future runs if you enable it.

1. In Xcode, select the **App** project (blue icon) in the left sidebar.
2. Select the **App** target → **Signing & Capabilities**.
3. Under **Team**, choose your Apple ID team (or add your Apple ID in Xcode → Settings → Accounts). You need a **paid** Apple Developer Program membership to run on a real device.
4. **Connect your iPad** to the Mac via **USB** (unlock the iPad and tap **Trust** if asked). For later runs you can use “Connect via network” (Window → Devices and Simulators → select iPad → check "Connect via network").
5. If Xcode says "No devices" or "No profiles", register the iPad (troubleshooting below), then try again.
6. At the top, choose your **iPad** as the run destination (instead of “Any iOS Device” or a simulator).
7. Press **Run** (▶) or **Product → Run**. The app installs and launches on the iPad. Data is stored locally using **Capacitor Preferences** (native iOS storage), so it survives app rebuilds and dev deploys.

**No cable / iPad elsewhere?** Install via **TestFlight** instead: build and upload from the Mac once; on the iPad install the TestFlight app and open the invite link. No USB needed (see §3 TestFlight below).

**“No devices” / “No profiles” error?** Apple needs your iPad registered before it can create a provisioning profile:

1. Connect the **iPad** to the Mac via USB. Unlock the iPad and tap **Trust** if asked.
2. On the Mac, open **Finder**, select the iPad in the sidebar, then click the device name under the tabs. Click the text that shows **Model**, **Serial Number**, etc. until it shows **UDID** — right‑click it and **Copy**.
3. Go to [Certificates, Identifiers & Profiles → Devices](https://developer.apple.com/account/resources/devices/list) (sign in with your Apple Developer account).
4. Click **+** to add a device: paste the UDID, give it a name (e.g. “My iPad”), register.
5. In **Xcode**, select the **App** target → **Signing & Capabilities**. Click **Try Again** or uncheck/check **Automatically manage signing** so Xcode fetches a new profile that includes the device.
6. Choose your **iPad** as the run destination and press **Run** again.

**“Development mode disabled” / “Developer Mode disabled”?** (iOS 16+) On the **iPad**, enable Developer Mode:

1. Open **Settings** → **Privacy & Security** → **Developer Mode**.
2. Turn **Developer Mode** on → tap **Restart** when asked.
3. After the iPad restarts, confirm with **Turn On** and enter your device passcode if prompted.
4. Reconnect the iPad to the Mac and run from Xcode again.

If **Developer Mode** doesn’t appear, unplug and replug the iPad, or restart the iPad once after connecting to the Mac.

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

## 5. Data persistence on iPad (dev mode)

The app uses **Capacitor Preferences** for storage on the native app. Data is saved in iOS UserDefaults, so it stays intact across:

- App rebuilds and reinstall from Xcode
- `npm run build` and `npx cap sync ios`
- Live reload (if you use a dev server URL in `capacitor.config.ts`)

If you had data in the app before this change, it is migrated once from the old WebView storage into Preferences when you first open the updated app.

**After adding new Capacitor plugins** (e.g. `@capacitor/preferences`), run `pod install` in the iOS project, then sync:

```bash
cd ios/App
pod install
cd ../..
npx cap sync ios
```

---

## 6. Optional: Gemini API key in the native app

The app uses the same build as the web. If you want the “Мишка-Метеоролог” AI in the monthly report inside the native app, bake the key into the build **before** syncing to iOS:

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

Data is stored **locally on the iPad** via Capacitor Preferences (native storage). No server or App Store required for daily use.
