import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.andrianventures.weathertracker',
  appName: 'Погода 2026',
  webDir: 'dist',
  server: {
    // Leave empty for production (bundled app). For live reload during dev, you could set:
    // url: 'http://YOUR_MAC_IP:5000',
    // cleartext: true,
  },
  ios: {
    contentInset: 'automatic',
  },
};

export default config;
