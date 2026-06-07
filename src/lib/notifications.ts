/**
 * Bulan Buka notifications.
 * iOS limit â‰ˆ 64. We schedule 7 days Ã— 5 prayers = 35 and refresh on foreground.
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { computePrayerTimes } from './prayer';
import { i18n } from '../i18n';
import type {
  CalculationMethodKey, Madhab, PrayerKey, SalehLocation,
} from '../types';

const SCHEDULE_DAYS = 7;
const NOTIFY_PRAYERS: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

// Adhan səs faylı (assets/audio/adhan_short.mp3 ilə bağlıdır)
const ADHAN_SOUND_ANDROID = 'adhan_short';  // Android: uzantısız
const ADHAN_SOUND_IOS = 'adhan_short.mp3';  // iOS: tam ad

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestPermissions = async (): Promise<boolean> => {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.status === 'granted') return true;
  const next = await Notifications.requestPermissionsAsync();
  return next.status === 'granted';
};

const ensureAndroidChannel = async () => {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('prayer-times', {
    name: 'Prayer Times',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#D4A574',
    sound: ADHAN_SOUND_ANDROID,
  });
};

export interface ScheduleArgs {
  location: SalehLocation;
  madhab: Madhab;
  method: CalculationMethodKey;
  adjustments?: Partial<Record<PrayerKey, number>>;
  offsets?: Partial<Record<PrayerKey, number>>;
}

export const scheduleAllPrayers = async (args: ScheduleArgs): Promise<number> => {
  const granted = await requestPermissions();
  if (!granted) return 0;
  await ensureAndroidChannel();
  await Notifications.cancelAllScheduledNotificationsAsync();
  const now = new Date();
  let count = 0;
  for (let d = 0; d < SCHEDULE_DAYS; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    const times = computePrayerTimes({
      location: args.location,
      madhab: args.madhab,
      method: args.method,
      adjustments: args.adjustments,
      date,
    });
    for (const key of NOTIFY_PRAYERS) {
      const base = (times as unknown as Record<PrayerKey, Date>)[key];
      if (!base) continue;
      const offset = args.offsets?.[key] ?? 0;
      const fireAt = new Date(base.getTime() + offset * 60000);
      if (fireAt.getTime() <= now.getTime()) continue;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t(`prayer.${key}`),
          body: i18n.t('notification.body', { city: args.location.city }),
          sound: Platform.OS === 'ios' ? ADHAN_SOUND_IOS : ADHAN_SOUND_ANDROID,
          data: { prayer: key, scheduledFor: fireAt.toISOString() },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: fireAt,
        },
      });
      count++;
    }
  }
  return count;
};

export const cancelAllPrayers = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const getScheduledCount = async (): Promise<number> => {
  const list = await Notifications.getAllScheduledNotificationsAsync();
  return list.length;
};
