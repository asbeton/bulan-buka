export interface QuranAyah {
  number: number;        // global ayah number (1-6236)
  numberInSurah: number; // ayah number in this surah
  text: string;          // arabic or translation text
}

export interface QuranSurah {
  number: number;        // 1-114
  name: string;          // arabic name
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  ayahs: QuranAyah[];
}

export interface QuranData {
  data: {
    surahs: QuranSurah[];
  };
}

export interface SurahMeta {
  number: number;
  nameAr: string;       // ərəbcə ad
  nameAz: string;       // azərbaycanca ad
  englishName: string;
  ayahCount: number;
  revelationType: 'Meccan' | 'Medinan';
}
