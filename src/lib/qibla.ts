import { Qibla } from 'adhan';
import { Coordinates } from 'adhan';

/**
 * Kəbənin bearing-ini hesablayır (şimaldan saat əqrəbi istiqamətində dərəcə)
 */
export const getQiblaDirection = (latitude: number, longitude: number): number => {
  const coords = new Coordinates(latitude, longitude);
  return Qibla(coords);
};

// Kəbənin koordinatları (məlumat üçün)
export const KAABA = {
  latitude: 21.4225,
  longitude: 39.8262,
};
