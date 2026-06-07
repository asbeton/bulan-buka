import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';

import { useTheme } from '../src/theme/ThemeProvider';
import { useSettings } from '../src/hooks/useSettings';
import { getQiblaDirection } from '../src/lib/qibla';
import { spacing } from '../src/theme/palette';

const SIZE = 300;
const CENTER = SIZE / 2;

export default function QiblaScreen() {
  const router = useRouter();
  const { palette } = useTheme();
  const { settings } = useSettings();

  const [heading, setHeading] = useState(0);
  const [available, setAvailable] = useState(true);
  const [accuracy, setAccuracy] = useState(0);
  const rotation = useRef(new Animated.Value(0)).current;
  const lastAligned = useRef(false);

  const qiblaBearing = getQiblaDirection(
    settings.location.latitude,
    settings.location.longitude
  );

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setAvailable(false);
          return;
        }

        subscription = await Location.watchHeadingAsync((data) => {
          // trueHeading varsa onu istifadə et (daha dəqiq), yoxsa magHeading
          const h = data.trueHeading >= 0 ? data.trueHeading : data.magHeading;
          setHeading(h);
          setAccuracy(data.accuracy);
        });
      } catch (err) {
        console.warn('[qibla] heading error:', err);
        setAvailable(false);
      }
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: -heading,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [heading, rotation]);

  const diff = Math.abs(((heading - qiblaBearing + 540) % 360) - 180);
  const isAligned = diff < 5;

  useEffect(() => {
    if (isAligned && !lastAligned.current) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      lastAligned.current = true;
    } else if (!isAligned) {
      lastAligned.current = false;
    }
  }, [isAligned]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [-360, 0],
    outputRange: ['-360deg', '0deg'],
  });

  // Accuracy göstəricisi (Android-də: 0=ən pis, 3=ən yaxşı)
  const needsCalibration = accuracy >= 0 && accuracy < 2;

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
          }}
        >
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={26} color={palette.textSecondary} />
          </Pressable>
          <Text style={{ fontSize: 18, fontWeight: '500', color: palette.text, letterSpacing: 0.5 }}>
            Qiblə
          </Text>
          <View style={{ width: 26 }} />
        </View>

        {!available ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl }}>
            <Ionicons name="compass-outline" size={64} color={palette.textMuted} />
            <Text style={{ color: palette.text, fontSize: 16, marginTop: spacing.lg, textAlign: 'center' }}>
              Kompas əlçatan deyil
            </Text>
            <Text style={{ color: palette.textSecondary, fontSize: 13, marginTop: spacing.sm, textAlign: 'center' }}>
              Yer icazəsi verilmədi və ya cihazda sensor yoxdur.
            </Text>
          </View>
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
              <Text
                style={{
                  fontSize: 14,
                  color: isAligned ? palette.accent : palette.textSecondary,
                  fontWeight: '500',
                  letterSpacing: 0.5,
                }}
              >
                {isAligned ? '✦ Qiblə istiqamətindəsiniz ✦' : 'Telefonu döndərin'}
              </Text>
              <Text style={{ fontSize: 11, color: palette.textMuted, marginTop: 4 }}>
                Qiblə: {Math.round(qiblaBearing)}° · İndi: {Math.round(heading)}°
              </Text>
            </View>

            {needsCalibration && (
              <View
                style={{
                  backgroundColor: palette.accentBg,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderRadius: 8,
                  marginBottom: spacing.lg,
                  borderWidth: 0.5,
                  borderColor: palette.accentBorder,
                }}
              >
                <Text style={{ fontSize: 11, color: palette.accent, textAlign: 'center' }}>
                  ⟳ Kompası kalibr edin: telefonu 8 rəqəmi şəklində hərəkət etdirin
                </Text>
              </View>
            )}

            <View style={{ width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' }}>
              <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                <Svg width={SIZE} height={SIZE}>
                  <Circle cx={CENTER} cy={CENTER} r={CENTER - 10} stroke={palette.accentBorder} strokeWidth={1} fill="none" />
                  {[0, 90, 180, 270].map((deg) => {
                    const rad = (deg - 90) * (Math.PI / 180);
                    const x1 = CENTER + (CENTER - 18) * Math.cos(rad);
                    const y1 = CENTER + (CENTER - 18) * Math.sin(rad);
                    const x2 = CENTER + (CENTER - 30) * Math.cos(rad);
                    const y2 = CENTER + (CENTER - 30) * Math.sin(rad);
                    return <Line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={palette.textSecondary} strokeWidth={2} />;
                  })}
                  <SvgText x={CENTER} y={32} fill={palette.accent} fontSize={16} fontWeight="bold" textAnchor="middle">N</SvgText>
                  <SvgText x={CENTER} y={SIZE - 20} fill={palette.textSecondary} fontSize={14} textAnchor="middle">S</SvgText>
                  <SvgText x={SIZE - 22} y={CENTER + 5} fill={palette.textSecondary} fontSize={14} textAnchor="middle">E</SvgText>
                  <SvgText x={22} y={CENTER + 5} fill={palette.textSecondary} fontSize={14} textAnchor="middle">W</SvgText>
                  <G rotation={qiblaBearing} origin={`${CENTER}, ${CENTER}`}>
                    <Circle cx={CENTER} cy={28} r={14} fill={isAligned ? palette.accent : palette.accentBg} stroke={palette.accent} strokeWidth={1.5} />
                    <SvgText x={CENTER} y={33} fill={isAligned ? palette.bg : palette.accent} fontSize={14} textAnchor="middle">🕋</SvgText>
                  </G>
                </Svg>
              </Animated.View>

              <View style={{ position: 'absolute', top: 0, alignItems: 'center' }}>
                <View
                  style={{
                    width: 0,
                    height: 0,
                    borderLeftWidth: 8,
                    borderRightWidth: 8,
                    borderTopWidth: 14,
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderTopColor: isAligned ? palette.accent : palette.textSecondary,
                  }}
                />
              </View>

              <View style={{ position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: palette.accent }} />
            </View>

            <Text
              style={{
                fontSize: 12,
                color: palette.textMuted,
                marginTop: spacing.xxl,
                textAlign: 'center',
                paddingHorizontal: spacing.xxl,
                lineHeight: 18,
              }}
            >
              Telefonu üfüqi tutun və 🕋 işarəsi yuxarıdakı oxla üst-üstə düşənə qədər döndərin
            </Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
