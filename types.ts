export type WeatherType = 'sun' | 'cloud' | 'rain' | 'snow';

export type TimeOfDay = 'morning' | 'evening';

export interface DayRecord {
  date: string; // ISO string YYYY-MM-DD
  temperature: number;
  weather: WeatherType;
}

/** Morning and/or evening entry for one day */
export interface DayEntries {
  morning?: DayRecord;
  evening?: DayRecord;
}

export interface WeatherStore {
  [date: string]: DayEntries;
}

export enum AppMode {
  CALENDAR = 'CALENDAR',
  ENTRY = 'ENTRY',
  REPORT = 'REPORT'
}
