import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { useSettings } from '../hooks/useSettings';
import { formatGregorian, formatHijri } from '../lib/hijri';
import { MADHABS } from '../data/methods';
import { METHODS } from '../data/methods';
import { radius, typography } from '../theme/palette';

export const DateFooter: React.FC<{ now: Date }> = ({ now }) => {
  const { palette } = useTheme();
  const { settings } = useSettings();

  const madhab = MADHABS.find((m) => m.key === settings.madhab);
  const method = METHODS.find((m) => m.key === settings.method);

  const madhabLabel = settings.language === 'en' ? madhab?.labelEn : settings.language === 'ru' ? madhab?.labelRu : madhab?.labelAz;
  const methodLabel = settings.language === 'en' ? method?.labelEn : settings.language === 'ru' ? method?.labelRu : method?.labelAz;

  return (
    <View
      style={{
        marginTop: 18,
        paddingTop: 14,
        borderTopWidth: 0.5,
        borderTopColor: palette.divider,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <View>
        <Text style={{ ...typography.caption, color: palette.text }}>
          {formatGregorian(now, settings.language)}
        </Text>
        <Text style={{ fontSize: 11, color: palette.textSecondary, marginTop: 2 }}>
          {formatHijri(now, settings.language)}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: palette.bgPill,
          paddingHorizontal: 11,
          paddingVertical: 5,
          borderRadius: radius.pill,
        }}
      >
        <Text style={{ fontSize: 11, color: palette.accent }}>
          {madhabLabel} · {methodLabel}
        </Text>
      </View>
    </View>
  );
};
