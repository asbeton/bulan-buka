import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Brand } from './Brand';
import { useTheme } from '../theme/ThemeProvider';
import { useSettings } from '../hooks/useSettings';
import { typography } from '../theme/palette';

export const LocationHeader: React.FC = () => {
  const { palette } = useTheme();
  const { settings } = useSettings();
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 22,
      }}
    >
      <View>
        <Brand size="md" />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
          <Ionicons name="location-outline" size={12} color={palette.textSecondary} />
          <Text style={{ ...typography.caption, color: palette.textSecondary }}>
            {settings.location.city}, {settings.location.country}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <Pressable
          accessibilityLabel="Qible"
          onPress={() => router.push('/qibla')}
          hitSlop={10}
          style={{ padding: 4 }}
        >
          <Ionicons name="compass-outline" size={22} color={palette.accent} />
        </Pressable>
        <Pressable
          accessibilityLabel="Quran"
          onPress={() => router.push('/quran')}
          hitSlop={10}
          style={{ padding: 4 }}
        >
          <Ionicons name="book-outline" size={22} color={palette.accent} />
        </Pressable>
        <Pressable
          accessibilityLabel="Tesbih"
          onPress={() => router.push('/tasbih')}
          hitSlop={10}
          style={{ padding: 4 }}
        >
          <Ionicons name="ellipse-outline" size={22} color={palette.accent} />
        </Pressable>
        <Pressable
          accessibilityLabel="Settings"
          onPress={() => router.push('/settings')}
          hitSlop={10}
          style={{ padding: 4 }}
        >
          <Ionicons name="options-outline" size={22} color={palette.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
};
