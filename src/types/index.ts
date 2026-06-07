/** Saleh — core types. */

export type Madhab = 'hanafi' | 'shafi' | 'maliki' | 'hanbali' | 'jafari';

export type CalculationMethodKey =
  | 'diyanet' | 'mwl' | 'isna' | 'egyptian' | 'umm_al_qura'
  | 'karachi' | 'tehran' | 'jafari' | 'singapore'
  | 'moonsighting' | 'dubai' | 'kuwait' | 'qatar';

export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type Language = 'az' | 'en' | 'ru';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface SalehLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface SalehSettings {
  location: SalehLocation;
  madhab: Madhab;
  method: CalculationMethodKey;
  language: Language;
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  notificationOffsets: Partial<Record<PrayerKey, number>>;
  prayerAdjustments: Partial<Record<PrayerKey, number>>;
}

export interface PrayerEntry {
  key: PrayerKey;
  time: Date;
  hasPassed: boolean;
  isNext: boolean;
}

export interface Countdown {
  hours: number;
  minutes: number;
  totalMinutes: number;
}
