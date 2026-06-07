/**
 * Saleh prayer-time engine.
 * Built on adhan-js (MIT). Fully offline.
 */

import {
  Coordinates, CalculationMethod, CalculationParameters,
  HighLatitudeRule, Madhab as AdhanMadhab, PrayerTimes, Qibla,
} from 'adhan';

import type {
  CalculationMethodKey, Countdown, Madhab, PrayerEntry, PrayerKey, SalehLocation,
} from '../types';

const methodParams = (method: CalculationMethodKey): CalculationParameters => {
  switch (method) {
    case 'diyanet':      return CalculationMethod.Turkey();
    case 'mwl':          return CalculationMethod.MuslimWorldLeague();
    case 'isna':         return CalculationMethod.NorthAmerica();
    case 'egyptian':     return CalculationMethod.Egyptian();
    case 'umm_al_qura':  return CalculationMethod.UmmAlQura();
    case 'karachi':      return CalculationMethod.Karachi();
    case 'tehran':       return CalculationMethod.Tehran();
    case 'singapore':    return CalculationMethod.Singapore();
    case 'moonsighting': return CalculationMethod.MoonsightingCommittee();
    case 'dubai':        return CalculationMethod.Dubai();
    case 'kuwait':       return CalculationMethod.Kuwait();
    case 'qatar':        return CalculationMethod.Qatar();
    case 'jafari': {
      const p = CalculationMethod.Other();
      p.fajrAngle = 16;
      p.ishaAngle = 14;
      return p;
    }
    default: return CalculationMethod.MuslimWorldLeague();
  }
};

const toAdhanMadhab = (m: Madhab): AdhanMadhab =>
  m === 'hanafi' ? AdhanMadhab.Hanafi : AdhanMadhab.Shafi;

export interface ComputeArgs {
  location: SalehLocation;
  madhab: Madhab;
  method: CalculationMethodKey;
  adjustments?: Partial<Record<PrayerKey, number>>;
  date?: Date;
}

export const computePrayerTimes = (args: ComputeArgs): PrayerTimes => {
  const { location, madhab, method, adjustments, date = new Date() } = args;
  const coords = new Coordinates(location.latitude, location.longitude);
  const params = methodParams(method);
  params.madhab = toAdhanMadhab(madhab);
  params.highLatitudeRule = HighLatitudeRule.MiddleOfTheNight;
  if (adjustments) {
    params.adjustments.fajr = adjustments.fajr ?? 0;
    params.adjustments.sunrise = adjustments.sunrise ?? 0;
    params.adjustments.dhuhr = adjustments.dhuhr ?? 0;
    params.adjustments.asr = adjustments.asr ?? 0;
    params.adjustments.maghrib = adjustments.maghrib ?? 0;
    params.adjustments.isha = adjustments.isha ?? 0;
  }
  return new PrayerTimes(coords, date, params);
};

export const buildDayEntries = (times: PrayerTimes, now: Date = new Date()): PrayerEntry[] => {
  const list: Array<{ key: PrayerKey; time: Date }> = [
    { key: 'fajr',    time: times.fajr },
    { key: 'sunrise', time: times.sunrise },
    { key: 'dhuhr',   time: times.dhuhr },
    { key: 'asr',     time: times.asr },
    { key: 'maghrib', time: times.maghrib },
    { key: 'isha',    time: times.isha },
  ];
  const entries: PrayerEntry[] = list.map((p) => ({
    ...p,
    hasPassed: p.time.getTime() <= now.getTime(),
    isNext: false,
  }));
  const nextIdx = entries.findIndex((e) => !e.hasPassed && e.key !== 'sunrise');
  if (nextIdx >= 0) entries[nextIdx].isNext = true;
  return entries;
};

export const getQiblaDirection = (latitude: number, longitude: number): number =>
  Qibla(new Coordinates(latitude, longitude));

export const formatTime = (date: Date, locale = 'en-GB'): string =>
  date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false });

export const computeCountdown = (from: Date, to: Date): Countdown => {
  const diffMs = to.getTime() - from.getTime();
  if (diffMs <= 0) return { hours: 0, minutes: 0, totalMinutes: 0 };
  const totalMinutes = Math.floor(diffMs / 60000);
  return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60, totalMinutes };
};
