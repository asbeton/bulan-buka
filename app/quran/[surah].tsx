import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../src/theme/ThemeProvider';
import { SURAH_LIST } from '../../src/data/surah-list';
import { getSurah, BISMILLAH, BISMILLAH_AZ, type CombinedAyah } from '../../src/lib/quran';
import { radius, spacing } from '../../src/theme/palette';

export default function SurahDetailScreen() {
  const router = useRouter();
  const { palette } = useTheme();
  const params = useLocalSearchParams<{ surah: string }>();
  const surahNumber = parseInt(params.surah ?? '1', 10);

  const [loading, setLoading] = useState(true);
  const [ayahs, setAyahs] = useState<CombinedAyah[]>([]);

  const meta = useMemo(
    () => SURAH_LIST.find((s) => s.number === surahNumber),
    [surahNumber]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const result = getSurah(surahNumber);
        setAyahs(result.ayahs);
      } catch (err) {
        console.warn('[quran] surah load failed:', err);
      } finally {
        setLoading(false);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [surahNumber]);

  const showBismillah = surahNumber !== 1 && surahNumber !== 9;

  const renderAyah = ({ item }: { item: CombinedAyah }) => (
    <View
      style={{
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        borderBottomWidth: 0.5,
        borderBottomColor: palette.divider,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            borderWidth: 0.5,
            borderColor: palette.accentBorder,
            backgroundColor: palette.accentBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 11, color: palette.accent, fontWeight: '500' }}>
            {item.numberInSurah}
          </Text>
        </View>
      </View>

      <Text
        style={{
          fontSize: 26,
          color: palette.text,
          lineHeight: 52,
          textAlign: 'right',
          fontWeight: '400',
          marginBottom: spacing.md,
        }}
      >
        {item.arabicText}
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: palette.textSecondary,
          lineHeight: 22,
          fontStyle: 'italic',
        }}
      >
        {item.translation}
      </Text>
    </View>
  );

  if (!meta) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: palette.text }}>Surə tapılmadı</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.md,
            borderBottomWidth: 0.5,
            borderBottomColor: palette.divider,
          }}
        >
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={26} color={palette.textSecondary} />
          </Pressable>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: palette.text }}>
              {meta.nameAz}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: palette.textSecondary,
                letterSpacing: 1,
                marginTop: 2,
              }}
            >
              {meta.revelationType === 'Meccan' ? 'MƏKKİ' : 'MƏDƏNİ'} · {meta.ayahCount} AYƏ
            </Text>
          </View>
          <Text style={{ fontSize: 20, color: palette.text, width: 60, textAlign: 'right' }}>
            {meta.nameAr}
          </Text>
        </View>

        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="small" color={palette.accent} />
            <Text style={{ color: palette.textSecondary, marginTop: spacing.md, fontSize: 12 }}>
              Yüklənir...
            </Text>
          </View>
        ) : (
          <FlatList
            data={ayahs}
            keyExtractor={(item) => item.numberInSurah.toString()}
            renderItem={renderAyah}
            initialNumToRender={5}
            windowSize={5}
            ListHeaderComponent={
              showBismillah ? (
                <View style={{ paddingVertical: spacing.xl, paddingHorizontal: spacing.xl, alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize: 26,
                      color: palette.accent,
                      textAlign: 'center',
                      lineHeight: 44,
                      fontWeight: '400',
                    }}
                  >
                    {BISMILLAH}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: palette.textSecondary,
                      marginTop: spacing.sm,
                      fontStyle: 'italic',
                    }}
                  >
                    {BISMILLAH_AZ}
                  </Text>
                </View>
              ) : null
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}
