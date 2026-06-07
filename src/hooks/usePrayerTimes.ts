import { useEffect, useMemo, useState } from 'react';

import {
  buildDayEntries, computeCountdown, computePrayerTimes,
} from '../lib/prayer';
import { useSettings } from './useSettings';
import type { Countdown, PrayerEntry } from '../types';

interface Result {
  entries: PrayerEntry[];
  nextPrayer: PrayerEntry | null;
  countdown: Countdown;
  now: Date;
}

/** Computes today's prayer entries + countdown; re-runs every 30s. */
export const usePrayerTimes = (): Result => {
  const { settings } = useSettings();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30 * 1000);
    return () => clearInterval(id);
  }, []);

  return useMemo<Result>(() => {
    const times = computePrayerTimes({
      location: settings.location,
      madhab: settings.madhab,
      method: settings.method,
      adjustments: settings.prayerAdjustments,
      date: now,
    });
    const entries = buildDayEntries(times, now);
    const nextPrayer = entries.find((e) => e.isNext) ?? null;
    const countdown = nextPrayer
      ? computeCountdown(now, nextPrayer.time)
      : { hours: 0, minutes: 0, totalMinutes: 0 };
    return { entries, nextPrayer, countdown, now };
  }, [now, settings.location, settings.madhab, settings.method, settings.prayerAdjustments]);
};
