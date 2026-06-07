import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SalehSettings } from '../types';

const KEY = '@saleh/settings/v1';

export const DEFAULT_SETTINGS: SalehSettings = {
  location: {
    city: 'Bakı', country: 'Azərbaycan',
    latitude: 40.4093, longitude: 49.8671,
    timezone: 'Asia/Baku',
  },
  madhab: 'hanafi',
  method: 'diyanet',
  language: 'az',
  themeMode: 'system',
  notificationsEnabled: true,
  notificationOffsets: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
  prayerAdjustments:   { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
};

export const loadSettings = async (): Promise<SalehSettings> => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<SalehSettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      notificationOffsets: { ...DEFAULT_SETTINGS.notificationOffsets, ...(parsed.notificationOffsets ?? {}) },
      prayerAdjustments:   { ...DEFAULT_SETTINGS.prayerAdjustments,   ...(parsed.prayerAdjustments ?? {}) },
    };
  } catch (err) {
    console.warn('[saleh/storage] load failed:', err);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (s: SalehSettings): Promise<void> => {
  try { await AsyncStorage.setItem(KEY, JSON.stringify(s)); }
  catch (err) { console.error('[saleh/storage] save failed:', err); }
};

export const clearSettings = async (): Promise<void> => {
  await AsyncStorage.removeItem(KEY);
};
