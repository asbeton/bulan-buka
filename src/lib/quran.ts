import type { QuranData, QuranSurah, QuranAyah } from '../types/quran';

// Cache - yüklənmiş Quran data-sı yaddaşda saxlanır
let arCache: QuranData | null = null;
let azCache: QuranData | null = null;

/**
 * Ərəbcə Quran-ı yüklə (lazy)
 */
export const loadQuranAr = (): QuranData => {
  if (!arCache) {
    arCache = require('../../assets/quran/quran-ar.json') as QuranData;
  }
  return arCache;
};

/**
 * Azərbaycanca tərcüməni yüklə (lazy)
 */
export const loadQuranAz = (): QuranData => {
  if (!azCache) {
    azCache = require('../../assets/quran/quran-az.json') as QuranData;
  }
  return azCache;
};

/**
 * Bir surənin ərəbcə + azərbaycanca ayələrini birgə qaytarır
 */
export interface CombinedAyah {
  numberInSurah: number;
  arabicText: string;
  translation: string;
}

export const getSurah = (surahNumber: number): {
  surah: QuranSurah;
  ayahs: CombinedAyah[];
} => {
  const arData = loadQuranAr();
  const azData = loadQuranAz();

  const arSurah = arData.data.surahs.find((s) => s.number === surahNumber);
  const azSurah = azData.data.surahs.find((s) => s.number === surahNumber);

  if (!arSurah || !azSurah) {
    throw new Error(`Surah ${surahNumber} not found`);
  }

  const ayahs: CombinedAyah[] = arSurah.ayahs.map((arAyah, idx) => ({
    numberInSurah: arAyah.numberInSurah,
    arabicText: arAyah.text,
    translation: azSurah.ayahs[idx]?.text ?? '',
  }));

  return { surah: arSurah, ayahs };
};

/**
 * Bismillah xüsusi mətn (Tövbə surəsi xaric hər surənin başında)
 */
export const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
export const BISMILLAH_AZ = 'Mərhəmətli, Rəhmli Allahın adı ilə!';
