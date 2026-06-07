import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../src/theme/ThemeProvider';
import { SURAH_LIST } from '../src/data/surah-list';
import { radius, spacing } from '../src/theme/palette';
import type { SurahMeta } from '../src/types/quran';

export default function QuranScreen() {
  const router = useRouter();
  const { palette } = useTheme();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return SURAH_LIST;
    const q = search.toLowerCase().trim();
    return SURAH_LIST.filter(
      (s) =>
        s.nameAz.toLowerCase().includes(q) ||
        s.englishName.toLowerCase().includes(q) ||
        s.number.toString() === q
    );
  }, [search]);

  const openSurah = (surahNumber: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/quran/${surahNumber}`);
  };

  const renderItem = ({ item }: { item: SurahMeta }) => (
    <Pressable
      onPress={() => openSurah(item.number)}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        opacity: pressed ? 0.6 : 1,
        borderBottomWidth: 0.5,
        borderBottomColor: palette.divider,
      })}
    >
      {/* Number badge */}
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          borderWidth: 0.5,
          borderColor: palette.accentBorder,
          backgroundColor: palette.accentBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.md,
        }}
      >
        <Text style={{ fontSize: 13, color: palette.accent, fontWeight: '500' }}>
          {item.number}
        </Text>
      </View>

      {/* Name + meta */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, color: palette.text, fontWeight: '500' }}>
          {item.nameAz}
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: palette.textSecondary,
            marginTop: 2,
            letterSpacing: 0.5,
          }}
        >
          {item.revelationType === 'Meccan' ? 'Məkki' : 'Mədəni'} · {item.ayahCount} ayə
        </Text>
      </View>

      {/* Arabic name */}
      <Text
        style={{
          fontSize: 20,
          color: palette.text,
          fontWeight: '400',
          marginLeft: spacing.md,
        }}
      >
        {item.nameAr}
      </Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.md,
          }}
        >
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={26} color={palette.textSecondary} />
          </Pressable>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '500',
              color: palette.text,
              letterSpacing: 0.5,
            }}
          >
            Quran
          </Text>
          <View style={{ width: 26 }} />
        </View>

        {/* Search */}
        <View
          style={{
            paddingHorizontal: spacing.xl,
            paddingBottom: spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: palette.accentBg,
              borderRadius: radius.md,
              paddingHorizontal: spacing.md,
              height: 44,
              borderWidth: 0.5,
              borderColor: palette.border,
            }}
          >
            <Ionicons name="search" size={16} color={palette.textSecondary} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Surə axtar..."
              placeholderTextColor={palette.textMuted}
              style={{
                flex: 1,
                marginLeft: spacing.sm,
                color: palette.text,
                fontSize: 14,
              }}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={palette.textMuted} />
              </Pressable>
            )}
          </View>
        </View>

        {/* List */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.number.toString()}
          renderItem={renderItem}
          initialNumToRender={15}
          windowSize={10}
          ListEmptyComponent={
            <View style={{ padding: spacing.xxl, alignItems: 'center' }}>
              <Text style={{ color: palette.textSecondary }}>Surə tapılmadı</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}
