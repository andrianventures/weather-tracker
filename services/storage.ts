import { Preferences } from '@capacitor/preferences';
import { WeatherStore, DayEntries, DayRecord } from '../types';

const STORAGE_KEY = 'weather_tracker_2026_data';
const LAST_MONTH_KEY = 'weather_tracker_2026_last_month';

function isDayRecord(v: unknown): v is DayRecord {
  return (
    typeof v === 'object' &&
    v !== null &&
    'temperature' in v &&
    'weather' in v &&
    !('morning' in v) &&
    !('evening' in v)
  );
}

/** Migrate old format (one DayRecord per date) to new format (DayEntries with morning). */
function migrateToDayEntries(parsed: Record<string, unknown>): WeatherStore {
  const out: WeatherStore = {};
  for (const [dateStr, val] of Object.entries(parsed)) {
    if (isDayRecord(val)) {
      out[dateStr] = { morning: val };
    } else if (val && typeof val === 'object' && ('morning' in val || 'evening' in val)) {
      out[dateStr] = val as DayEntries;
    }
  }
  return out;
}

/**
 * Persists weather records. On iPad/native uses UserDefaults; on web uses localStorage (via Preferences fallback).
 * Data survives app rebuilds and dev deploys on iPad.
 */
export const saveRecords = async (records: WeatherStore): Promise<void> => {
  await Preferences.set({
    key: STORAGE_KEY,
    value: JSON.stringify(records),
  });
};

/**
 * Loads weather records. Migrates old single-entry-per-day data to morning. Migrates from localStorage if present.
 */
export const loadRecords = async (): Promise<WeatherStore> => {
  const { value } = await Preferences.get({ key: STORAGE_KEY });
  if (value) {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    return migrateToDayEntries(parsed);
  }

  try {
    const fromLocal = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (fromLocal) {
      const parsed = JSON.parse(fromLocal) as Record<string, unknown>;
      const migrated = migrateToDayEntries(parsed);
      await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(migrated) });
      localStorage.removeItem(STORAGE_KEY);
      return migrated;
    }
  } catch {
    // ignore
  }
  return {};
};

/** Load last viewed/saved month (0–11). Returns null if not set. */
export const loadLastViewedMonth = async (): Promise<number | null> => {
  const { value } = await Preferences.get({ key: LAST_MONTH_KEY });
  if (value === null || value === undefined) return null;
  const n = parseInt(value, 10);
  if (Number.isNaN(n) || n < 0 || n > 11) return null;
  return n;
};

/** Save last viewed/saved month (0–11). */
export const saveLastViewedMonth = async (month: number): Promise<void> => {
  await Preferences.set({
    key: LAST_MONTH_KEY,
    value: String(month),
  });
};
