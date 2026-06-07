import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from 'react';

import {
  DEFAULT_SETTINGS, loadSettings, saveSettings,
} from '../lib/storage';
import { scheduleAllPrayers } from '../lib/notifications';
import { setLocale } from '../i18n';
import type { SalehSettings } from '../types';

interface SettingsContextValue {
  settings: SalehSettings;
  isLoaded: boolean;
  update: (patch: Partial<SalehSettings>) => Promise<void>;
  reset: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SalehSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const loaded = await loadSettings();
      setSettings(loaded);
      setLocale(loaded.language);
      setIsLoaded(true);
    })();
  }, []);

  // Reschedule notifications on relevant changes
  useEffect(() => {
    if (!isLoaded || !settings.notificationsEnabled) return;
    scheduleAllPrayers({
      location: settings.location,
      madhab: settings.madhab,
      method: settings.method,
      adjustments: settings.prayerAdjustments,
      offsets: settings.notificationOffsets,
    }).catch((err) =>
      console.warn('[saleh/useSettings] schedule failed:', err)
    );
  }, [
    isLoaded,
    settings.notificationsEnabled,
    settings.location.latitude,
    settings.location.longitude,
    settings.madhab,
    settings.method,
    settings.prayerAdjustments,
    settings.notificationOffsets,
  ]);

  const update = useCallback(
    async (patch: Partial<SalehSettings>) => {
      const next = { ...settings, ...patch };
      setSettings(next);
      if (patch.language) setLocale(patch.language);
      await saveSettings(next);
    },
    [settings]
  );

  const reset = useCallback(async () => {
    setSettings(DEFAULT_SETTINGS);
    setLocale(DEFAULT_SETTINGS.language);
    await saveSettings(DEFAULT_SETTINGS);
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({ settings, isLoaded, update, reset }),
    [settings, isLoaded, update, reset]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextValue => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>');
  return ctx;
};

