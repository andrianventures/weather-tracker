
export type WeatherType = 'sun' | 'cloud' | 'rain' | 'snow';

export interface DayRecord {
  date: string; // ISO string YYYY-MM-DD
  temperature: number;
  weather: WeatherType;
}

export interface WeatherStore {
  [date: string]: DayRecord;
}

export enum AppMode {
  CALENDAR = 'CALENDAR',
  ENTRY = 'ENTRY',
  REPORT = 'REPORT'
}
