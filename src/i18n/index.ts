import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import az from './az.json';
import en from './en.json';
import ru from './ru.json';

import type { Language } from '../types';

export const i18n = new I18n({ az, en, ru });
i18n.enableFallback = true;
i18n.defaultLocale = 'az';

const SUPPORTED: Language[] = ['az', 'en', 'ru'];

export const detectInitialLanguage = (): Language => {
  const code = Localization.getLocales()[0]?.languageCode ?? 'az';
  return (SUPPORTED as string[]).includes(code) ? (code as Language) : 'az';
};

i18n.locale = detectInitialLanguage();

export const setLocale = (lang: Language) => { i18n.locale = lang; };

export const t = (key: string, options?: Record<string, unknown>) =>
  i18n.t(key, options);
