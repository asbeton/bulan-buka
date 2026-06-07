import * as Location from 'expo-location';
import type { SalehLocation } from '../types';

export const requestLocationPermissions = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};

export const getCurrentLocation = async (): Promise<SalehLocation | null> => {
  const granted = await requestLocationPermissions();
  if (!granted) return null;

  try {
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const { latitude, longitude } = pos.coords;

    let city = 'Naməlum';
    let country = '';
    try {
      const geo = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geo[0]) {
        city = geo[0].city ?? geo[0].subregion ?? geo[0].region ?? city;
        country = geo[0].country ?? '';
      }
    } catch (geoErr) {
      console.warn('[saleh/location] reverse geocode failed:', geoErr);
    }

    return { city, country, latitude, longitude, timezone: 'UTC' };
  } catch (err) {
    console.warn('[saleh/location] getCurrentPosition failed:', err);
    return null;
  }
};
