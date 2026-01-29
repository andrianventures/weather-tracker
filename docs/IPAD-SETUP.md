# How to Get the Weather Diary on Your iPad (One Device, No App Store)

You only need: **GitHub account**, **Mac** (or any computer), **iPad**, and **Wi‑Fi**. No Xcode, no Apple Developer account, no App Store. Data is saved **only on that iPad**.

---

## Part 1: Put the App on the Internet (GitHub Pages)

### Step 1: Create a GitHub repository

1. Go to [github.com](https://github.com) and sign in.
2. Click the **+** (top right) → **New repository**.
3. Name it whatever you like, e.g. **`pogoda-2026`** (no spaces).
4. Choose **Public**, leave “Add a README” **unchecked**, click **Create repository**.

### Step 2: Push your project to GitHub

On your **Mac** (or the computer where the project lives), open **Terminal** and run these commands. Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repo name.

```bash
cd /path/to/your/weather-diary-project
git init
git add .
git commit -m "Weather diary app for iPad"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

If the project is already a git repo and already on GitHub, just make sure the latest code is pushed:

```bash
git add .
git commit -m "Ready for iPad"
git push
```

### Step 3: Build the app for GitHub Pages

In the same project folder, set the **base path** to your repo name and build. Use your **actual repo name** (e.g. `pogoda-2026`).

```bash
npm install
VITE_BASE=/pogoda-2026/ npm run build
```

(If your repo is named something else, use that: `VITE_BASE=/my-repo-name/ npm run build`.)

This creates a **`dist`** folder with the built app.

### Step 4: Enable GitHub Pages and deploy

1. On GitHub, open your repo → **Settings** → **Pages** (left sidebar).
2. Under **Build and deployment**:
   - **Source**: select **GitHub Actions**.
3. In your project folder, create the workflow file so GitHub can build and deploy for you.

Create the folder and file (on Mac/Linux):

```bash
mkdir -p .github/workflows
```

The project already includes **`.github/workflows/deploy-pages.yml`**. You only need to turn on GitHub Pages:

1. On GitHub, open your repo → **Settings** → **Pages** (left sidebar).
2. Under **Build and deployment**, set **Source** to **GitHub Actions** (if you don’t see it, run the workflow once from the Actions tab, then return to Settings → Pages).
3. Commit and push the project (including the `.github/workflows` folder) if you haven’t already:

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push
```

4. Go to the **Actions** tab. Wait for the “Deploy to GitHub Pages” workflow to finish (green check).
5. Go back to **Settings** → **Pages**. You should see: “Your site is live at **https://YOUR_USERNAME.github.io/YOUR_REPO/**”.

**Optional – “Мишка-Метеоролог” AI on the iPad:**  
The workflow is set up to use a **`GEMINI_API_KEY`** secret. To enable the AI text in the monthly report:

1. GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
2. Name: **`GEMINI_API_KEY`**, Value: your Gemini API key → **Add secret**.
3. The next time the workflow runs (e.g. after another push), the hosted app will have the AI feature. No change to the workflow file is needed.

Write down that URL (e.g. `https://jane.github.io/pogoda-2026/`).

---

## Part 2: Put the App on the iPad

### Step 5: Open the app on the iPad in Safari

1. On the **iPad**, connect to Wi‑Fi.
2. Open **Safari** (not Chrome – “Add to Home Screen” works best in Safari).
3. In the address bar, type or paste the GitHub Pages URL, e.g.  
   `https://YOUR_USERNAME.github.io/YOUR_REPO/`
4. Tap **Go**. The weather diary should open (full page with calendar).

### Step 6: Add it to the Home Screen (so it works like an app)

1. Tap the **Share** button (square with an arrow, at the top or bottom of Safari).
2. Scroll and tap **“Add to Home Screen”** (or “Add to Home Screen” / “На экран”).
3. The name will be something like “Погода 2026” or the title of the page. You can edit it, then tap **Add**.
4. An icon appears on the Home Screen.

### Step 7: Use it like an app

1. Tap the new **icon** on the Home Screen.
2. The app opens **full screen** (no Safari bar).
3. Use the calendar, add temperature and weather, tap **Запомнить!** – everything is saved **on this iPad** (in the browser storage). No account needed on the iPad.

---

## Summary

| Step | Where | What you do |
|------|--------|-------------|
| 1–2 | GitHub + your computer | Create repo, push project |
| 3–4 | Your computer + GitHub | Build with `VITE_BASE=/REPO_NAME/`, add workflow, push, wait for Pages to deploy |
| 5–6 | iPad | In Safari, open the Pages URL → Share → Add to Home Screen |
| 7 | iPad | Open from the icon; data stays on the iPad |

**Data:** Stored only in Safari on that iPad (localStorage). Clearing Safari website data for this site would delete the diary data on that device.

**Updates:** After you change the code and push to GitHub, the workflow will redeploy. The next time the iPad opens the app (from the icon or Safari), it will get the new version. No need to remove or re-add the Home Screen icon.

**No App Store, no Xcode, no Apple Developer account.** One iPad, one URL, one “Add to Home Screen.”
