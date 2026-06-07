import type { CalculationMethodKey, Madhab } from '../types';

export interface MethodInfo {
  key: CalculationMethodKey;
  labelAz: string;
  labelEn: string;
  labelRu: string;
  region: string;
  fajrAngle: number;
  ishaAngle: number | string;
}

export const METHODS: MethodInfo[] = [
  { key: 'diyanet',      labelAz: 'Diyanet (Türkiyə)',        labelEn: 'Diyanet (Turkey)',        labelRu: 'Диянет (Турция)',         region: 'Türkiyə, CIS',           fajrAngle: 18,   ishaAngle: 17 },
  { key: 'mwl',          labelAz: 'Müsəlman Dünyası Liqası',  labelEn: 'Muslim World League',     labelRu: 'Лига исламского мира',    region: 'Avropa, qlobal',         fajrAngle: 18,   ishaAngle: 17 },
  { key: 'isna',         labelAz: 'ISNA (Şimali Amerika)',    labelEn: 'ISNA (North America)',    labelRu: 'ISNA (Северная Америка)', region: 'ABŞ, Kanada',            fajrAngle: 15,   ishaAngle: 15 },
  { key: 'egyptian',     labelAz: 'Misir Survey',             labelEn: 'Egyptian General Auth.',  labelRu: 'Египетская служба',       region: 'Misir, Şimali Afrika',   fajrAngle: 19.5, ishaAngle: 17.5 },
  { key: 'umm_al_qura',  labelAz: 'Ümmül-Qura',               labelEn: 'Umm al-Qura',             labelRu: 'Умм аль-Кура',            region: 'Səudiyyə Ərəbistanı',    fajrAngle: 18.5, ishaAngle: '+90 dəq' },
  { key: 'karachi',      labelAz: 'Kərachi',                  labelEn: 'Karachi',                 labelRu: 'Карачи',                  region: 'Pakistan, Hindistan',    fajrAngle: 18,   ishaAngle: 18 },
  { key: 'tehran',       labelAz: 'Tehran Geofizika',         labelEn: 'Tehran Geophysics',       labelRu: 'Тегеранский геофиз.',     region: 'İran',                   fajrAngle: 17.7, ishaAngle: 14 },
  { key: 'jafari',       labelAz: 'Cəfəri',                   labelEn: 'Jafari',                  labelRu: 'Джафари',                 region: 'Şia məzhəbi',            fajrAngle: 16,   ishaAngle: 14 },
  { key: 'singapore',    labelAz: 'Singapur (MUIS)',          labelEn: 'Singapore (MUIS)',        labelRu: 'Сингапур (MUIS)',         region: 'Cənub-Şərqi Asiya',      fajrAngle: 20,   ishaAngle: 18 },
  { key: 'moonsighting', labelAz: 'Moonsighting Committee',   labelEn: 'Moonsighting Committee',  labelRu: 'Moonsighting Committee',  region: 'Qlobal',                 fajrAngle: 18,   ishaAngle: 18 },
  { key: 'dubai',        labelAz: 'Dubai',                    labelEn: 'Dubai',                   labelRu: 'Дубай',                   region: 'BƏƏ',                    fajrAngle: 18.2, ishaAngle: 18.2 },
  { key: 'kuwait',       labelAz: 'Kuveyt',                   labelEn: 'Kuwait',                  labelRu: 'Кувейт',                  region: 'Kuveyt',                 fajrAngle: 18,   ishaAngle: 17.5 },
  { key: 'qatar',        labelAz: 'Qatar',                    labelEn: 'Qatar',                   labelRu: 'Катар',                   region: 'Qatar',                  fajrAngle: 18,   ishaAngle: '+90 dəq' },
];

export interface MadhabInfo {
  key: Madhab;
  labelAz: string;
  labelEn: string;
  labelRu: string;
  asrFactor: 1 | 2;
}

export const MADHABS: MadhabInfo[] = [
  { key: 'hanafi',  labelAz: 'Hənəfi',  labelEn: 'Hanafi',   labelRu: 'Ханафи', asrFactor: 2 },
  { key: 'shafi',   labelAz: 'Şafii',   labelEn: "Shafi'i",  labelRu: 'Шафии',  asrFactor: 1 },
  { key: 'maliki',  labelAz: 'Maliki',  labelEn: 'Maliki',   labelRu: 'Малики', asrFactor: 1 },
  { key: 'hanbali', labelAz: 'Hənbəli', labelEn: 'Hanbali',  labelRu: 'Ханбали',asrFactor: 1 },
  { key: 'jafari',  labelAz: 'Cəfəri',  labelEn: 'Jafari',   labelRu: 'Джафари',asrFactor: 1 },
];
