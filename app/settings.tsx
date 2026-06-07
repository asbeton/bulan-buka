import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../src/theme/ThemeProvider';
import { useSettings } from '../src/hooks/useSettings';
import { MADHABS, METHODS } from '../src/data/methods';
import { DEFAULT_CITIES } from '../src/data/cities';
import { getCurrentLocation } from '../src/lib/location';
import { t } from '../src/i18n';
import { radius, spacing, typography } from '../src/theme/palette';
import type {
  CalculationMethodKey, Language, Madhab, ThemeMode,
} from '../src/types';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  const { palette } = useTheme();
  return (
    <View style={{ marginBottom: spacing.xxl }}>
      <Text
        style={{
          ...typography.micro,
          color: palette.textSecondary,
          marginBottom: spacing.sm,
        }}
      >
        {title.toUpperCase()}
      </Text>
      <View
        style={{
          backgroundColor: palette.bgCard,
          borderRadius: radius.lg,
          padding: spacing.xs,
        }}
      >
        {children}
      </View>
    </View>
  );
};

interface RowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  selected?: boolean;
}

const Row: React.FC<RowProps> = ({ label, value, onPress, selected }) => {
  const { palette } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Text style={{ ...typography.body, color: palette.text }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {value ? (
          <Text style={{ ...typography.body, color: palette.textSecondary }}>
            {value}
          </Text>
        ) : null}
        {selected ? (
          <Ionicons name="checkmark" size={18} color={palette.accent} />
        ) : null}
      </View>
    </Pressable>
  );
};

export default function SettingsScreen() {
  const router = useRouter();
  const { palette } = useTheme();
  const { settings, update, reset } = useSettings();

  const labelFor = (
    items: { key: string; labelAz: string; labelEn: string; labelRu: string }[],
    key: string
  ): string => {
    const item = items.find((x) => x.key === key);
    if (!item) return key;
    return settings.language === 'en'
      ? item.labelEn
      : settings.language === 'ru'
        ? item.labelRu
        : item.labelAz;
  };

  const handleUseGPS = async () => {
    const loc = await getCurrentLocation();
    if (loc) await update({ location: loc });
  };

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
          <Text style={{ fontSize: 20, fontWeight: '500', color: palette.text }}>
            {t('settings.title')}
          </Text>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="close" size={24} color={palette.textSecondary} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl }}
        >
          {/* Location */}
          <Section title={t('settings.location')}>
            <Row
              label={t('settings.useGPS')}
              value={`${settings.location.city}`}
              onPress={handleUseGPS}
            />
            {DEFAULT_CITIES.slice(0, 6).map((c) => (
              <Row
                key={`${c.city}-${c.country}`}
                label={`${c.city}, ${c.country}`}
                onPress={() => update({ location: c })}
                selected={
                  c.latitude === settings.location.latitude &&
                  c.longitude === settings.location.longitude
                }
              />
            ))}
          </Section>

          {/* Madhab */}
          <Section title={t('settings.madhab')}>
            {MADHABS.map((m) => (
              <Row
                key={m.key}
                label={labelFor(MADHABS, m.key)}
                onPress={() => update({ madhab: m.key as Madhab })}
                selected={settings.madhab === m.key}
              />
            ))}
          </Section>

          {/* Method */}
          <Section title={t('settings.method')}>
            {METHODS.map((m) => (
              <Row
                key={m.key}
                label={labelFor(METHODS, m.key)}
                value={`${m.fajrAngle}° / ${m.ishaAngle}`}
                onPress={() => update({ method: m.key as CalculationMethodKey })}
                selected={settings.method === m.key}
              />
            ))}
          </Section>

          {/* Language */}
          <Section title={t('settings.language')}>
            {(['az', 'en', 'ru'] as Language[]).map((lang) => (
              <Row
                key={lang}
                label={lang === 'az' ? 'Azərbaycan' : lang === 'en' ? 'English' : 'Русский'}
                onPress={() => update({ language: lang })}
                selected={settings.language === lang}
              />
            ))}
          </Section>

          {/* Theme */}
          <Section title={t('settings.theme')}>
            {(['system', 'light', 'dark'] as ThemeMode[]).map((m) => (
              <Row
                key={m}
                label={t(`settings.theme${m.charAt(0).toUpperCase() + m.slice(1)}`)}
                onPress={() => update({ themeMode: m })}
                selected={settings.themeMode === m}
              />
            ))}
          </Section>

          {/* Notifications */}
          <Section title={t('settings.notifications')}>
            <Row
              label={
                settings.notificationsEnabled
                  ? t('settings.notificationsOn')
                  : t('settings.notificationsOff')
              }
              onPress={() =>
                update({ notificationsEnabled: !settings.notificationsEnabled })
              }
              selected={settings.notificationsEnabled}
            />
          </Section>

          {/* Reset */}
          <Pressable
            onPress={reset}
            style={({ pressed }) => ({
              alignItems: 'center',
              paddingVertical: spacing.md,
              borderRadius: radius.md,
              borderWidth: 0.5,
              borderColor: palette.border,
              opacity: pressed ? 0.6 : 1,
              marginTop: spacing.md,
            })}
          >
            <Text style={{ ...typography.body, color: palette.textSecondary }}>
              {t('settings.reset')}
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
