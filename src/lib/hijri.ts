import moment from 'moment-hijri';
import type { Language } from '../types';

const MONTHS_AZ = ['Məhərrəm','Səfər','Rəbiüləvvəl','Rəbiüləxir','Cəmadiyəlul','Cəmadiyəlsani','Rəcəb','Şaban','Ramazan','Şəvval','Zilqədə','Zilhiccə'];
const MONTHS_EN = ['Muharram','Safar',"Rabi' al-Awwal","Rabi' al-Thani",'Jumada al-Awwal','Jumada al-Thani','Rajab',"Sha'ban",'Ramadan','Shawwal',"Dhu al-Qa'dah","Dhu al-Hijjah"];
const MONTHS_RU = ['Мухаррам','Сафар','Рабиʿ аль-авваль','Рабиʿ ас-сани','Джумада аль-уля','Джумада ас-сани','Раджаб','Шаʿбан','Рамадан','Шавваль','Зу-ль-каʿда','Зу-ль-хиджжа'];

const SUFFIX: Record<Language, string> = { az: 'h.', en: 'AH', ru: 'г.х.' };

export const formatHijri = (date: Date = new Date(), language: Language = 'az'): string => {
  const m = moment(date);
  const day = m.iDate();
  const monthIdx = m.iMonth();
  const year = m.iYear();
  const months = language === 'en' ? MONTHS_EN : language === 'ru' ? MONTHS_RU : MONTHS_AZ;
  return `${day} ${months[monthIdx]} ${year} ${SUFFIX[language]}`;
};

export const formatGregorian = (date: Date = new Date(), language: Language = 'az'): string => {
  const locales: Record<Language, string> = { az: 'az-AZ', en: 'en-GB', ru: 'ru-RU' };
  return date.toLocaleDateString(locales[language], {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};
