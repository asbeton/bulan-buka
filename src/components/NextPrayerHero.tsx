import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { useSettings } from '../hooks/useSettings';
import { formatTime } from '../lib/prayer';
import { t } from '../i18n';
import { radius, typography } from '../theme/palette';
import type { Countdown, PrayerEntry } from '../types';

interface Props {
  nextPrayer: PrayerEntry | null;
  countdown: Countdown;
}

export const NextPrayerHero: React.FC<Props> = ({ nextPrayer, countdown }) => {
  const { palette } = useTheme();
  const { settings } = useSettings();

  if (!nextPrayer) {
    return (
      <View
        style={{
          backgroundColor: palette.bgCard,
          borderColor: palette.accentBorder,
          borderWidth: 0.5,
          borderRadius: radius.lg,
          padding: 18,
          marginBottom: 16,
        }}
      >
        <Text style={{ ...typography.body, color: palette.textSecondary }}>—</Text>
      </View>
    );
  }

  const locale = settings.language === 'az' ? 'az-AZ' : settings.language === 'ru' ? 'ru-RU' : 'en-GB';

  const countdownText =
    countdown.totalMinutes > 60
      ? t('home.remaining', { hours: countdown.hours, minutes: countdown.minutes })
      : countdown.totalMinutes > 0
        ? t('home.remainingMinutes', { minutes: countdown.minutes })
        : t('home.now');

  return (
    <View
      style={{
        backgroundColor: palette.bgCard,
        borderColor: palette.accentBorder,
        borderWidth: 0.5,
        borderRadius: radius.lg,
        paddingHorizontal: 18,
        paddingVertical: 14,
        marginBottom: 16,
      }}
    >
      <Text style={{ ...typography.micro, color: palette.accent }}>
        {t('prayer.next').toUpperCase()}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginTop: 6,
        }}
      >
        <Text style={{ ...typography.hero, color: palette.text }}>
          {t(`prayer.${nextPrayer.key}`)}
        </Text>
        <Text
          style={{
            fontSize: 22,
            fontWeight: '400',
            color: palette.text,
            fontVariant: ['tabular-nums'],
          }}
        >
          {formatTime(nextPrayer.time, locale)}
        </Text>
      </View>
      <Text style={{ ...typography.caption, color: palette.textSecondary, marginTop: 6 }}>
        {countdownText}
      </Text>
    </View>
  );
};
