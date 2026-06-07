import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../theme/ThemeProvider';
import { useSettings } from '../hooks/useSettings';
import { formatTime } from '../lib/prayer';
import { t } from '../i18n';
import { radius, typography } from '../theme/palette';
import type { PrayerEntry, PrayerKey } from '../types';

const ICON_FOR: Record<PrayerKey, keyof typeof Ionicons.glyphMap> = {
  fajr: 'partly-sunny-outline',
  sunrise: 'sunny-outline',
  dhuhr: 'sunny-outline',
  asr: 'cloud-outline',
  maghrib: 'cloudy-night-outline',
  isha: 'moon-outline',
};

interface Props {
  entries: PrayerEntry[];
}

export const PrayerList: React.FC<Props> = ({ entries }) => {
  const { palette } = useTheme();
  const { settings } = useSettings();
  const locale = settings.language === 'az' ? 'az-AZ' : settings.language === 'ru' ? 'ru-RU' : 'en-GB';

  return (
    <View>
      {entries.map((entry) => {
        const isCurrentSlot = entry.isNext;
        const muted = entry.hasPassed;
        return (
          <View
            key={entry.key}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 11,
              paddingHorizontal: isCurrentSlot ? 12 : 4,
              backgroundColor: isCurrentSlot ? palette.accentSoft : 'transparent',
              borderRadius: isCurrentSlot ? radius.sm : 0,
              marginVertical: isCurrentSlot ? 4 : 0,
              opacity: muted ? 0.4 : 1,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons
                name={ICON_FOR[entry.key]}
                size={16}
                color={isCurrentSlot ? palette.accent : palette.text}
              />
              <Text
                style={{
                  ...typography.body,
                  fontWeight: isCurrentSlot ? '500' : '400',
                  color: palette.text,
                }}
              >
                {t(`prayer.${entry.key}`)}
              </Text>
            </View>
            <Text
              style={{
                ...typography.body,
                fontWeight: isCurrentSlot ? '500' : '400',
                color: palette.text,
                fontVariant: ['tabular-nums'],
              }}
            >
              {formatTime(entry.time, locale)}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
