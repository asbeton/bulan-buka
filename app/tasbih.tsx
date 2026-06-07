import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '../src/theme/ThemeProvider';
import { useTasbih, type Phase } from '../src/hooks/useTasbih';
import { radius, spacing } from '../src/theme/palette';

const PHASE_LABELS: Record<Phase, string> = {
  subhanallah: 'Subhənallah',
  alhamdulillah: 'Əlhəmdülillah',
  allahuakbar: 'Allahu Əkbər',
};

const PHASE_ARABIC: Record<Phase, string> = {
  subhanallah: 'سُبْحَانَ اللّٰهِ',
  alhamdulillah: 'اَلْحَمْدُ لِلّٰهِ',
  allahuakbar: 'اَللّٰهُ أَكْبَرُ',
};

const SIZE = 280;
const STROKE = 4;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function TasbihScreen() {
  const router = useRouter();
  const { palette } = useTheme();
  const { state, loaded, increment, resetCycle, setPhase, resetAll } = useTasbih();

  const tapScale = useRef(new Animated.Value(1)).current;
  const ringProgress = useRef(new Animated.Value(0)).current;
  const phaseFade = useRef(new Animated.Value(1)).current;
  const celebrate = useRef(new Animated.Value(0)).current;
  const prevCount = useRef(state.count);
  const prevPhase = useRef(state.phase);
  const prevCycles = useRef(state.completedCycles);
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    Animated.timing(ringProgress, {
      toValue: state.count / 33,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [state.count, ringProgress]);

  useEffect(() => {
    if (state.phase !== prevPhase.current) {
      Animated.sequence([
        Animated.timing(phaseFade, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(phaseFade, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
      prevPhase.current = state.phase;
    }
  }, [state.phase, phaseFade]);

  useEffect(() => {
    if (state.completedCycles > prevCycles.current) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setJustCompleted(true);
      Animated.sequence([
        Animated.timing(celebrate, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.delay(1500),
        Animated.timing(celebrate, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start(() => setJustCompleted(false));
      prevCycles.current = state.completedCycles;
    }
  }, [state.completedCycles, celebrate]);

  useEffect(() => {
    if (state.count !== prevCount.current) {
      Animated.sequence([
        Animated.timing(tapScale, { toValue: 0.94, duration: 80, useNativeDriver: true }),
        Animated.spring(tapScale, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start();
      if (state.count === 0 && prevCount.current === 32) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      prevCount.current = state.count;
    }
  }, [state.count, tapScale]);

  const handleTap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    increment();
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    resetCycle();
  };

  if (!loaded) {
    return <View style={{ flex: 1, backgroundColor: palette.bg }} />;
  }

  const strokeDashoffset = ringProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

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
            Təsbih
          </Text>
          <Pressable onPress={resetAll} hitSlop={12}>
            <Ionicons name="refresh-outline" size={22} color={palette.textSecondary} />
          </Pressable>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: spacing.sm,
            paddingHorizontal: spacing.xl,
            marginTop: spacing.lg,
          }}
        >
          {(Object.keys(PHASE_LABELS) as Phase[]).map((p) => (
            <Pressable
              key={p}
              onPress={() => setPhase(p)}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs + 2,
                borderRadius: radius.pill,
                backgroundColor: state.phase === p ? palette.accentBg : 'transparent',
                borderWidth: 0.5,
                borderColor: state.phase === p ? palette.accentBorder : palette.border,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: state.phase === p ? palette.accent : palette.textSecondary,
                  fontWeight: state.phase === p ? '500' : '400',
                  letterSpacing: 0.3,
                }}
              >
                {PHASE_LABELS[p]}
              </Text>
            </Pressable>
          ))}
        </View>

        <Animated.View style={{ alignItems: 'center', marginTop: spacing.xxl, opacity: phaseFade }}>
          <Text style={{ fontSize: 44, color: palette.text, fontWeight: '400', textAlign: 'center', lineHeight: 64 }}>
            {PHASE_ARABIC[state.phase]}
          </Text>
          <Text style={{ fontSize: 13, color: palette.textSecondary, marginTop: spacing.xs, letterSpacing: 0.5 }}>
            {PHASE_LABELS[state.phase]}
          </Text>
        </Animated.View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Pressable onPress={handleTap} onLongPress={handleLongPress} delayLongPress={600}>
            <Animated.View
              style={{
                width: SIZE,
                height: SIZE,
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{ scale: tapScale }],
              }}
            >
              <Svg width={SIZE} height={SIZE} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
                <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke={palette.accentBorder} strokeWidth={STROKE} fill="none" />
                <AnimatedCircle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  stroke={palette.accent}
                  strokeWidth={STROKE}
                  fill="none"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </Svg>
              <View
                style={{
                  width: SIZE - 30,
                  height: SIZE - 30,
                  borderRadius: (SIZE - 30) / 2,
                  backgroundColor: palette.accentBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 84, fontWeight: '200', color: palette.text, fontVariant: ['tabular-nums'], letterSpacing: -2 }}>
                  {state.count}
                </Text>
                <Text style={{ fontSize: 11, color: palette.textSecondary, letterSpacing: 2, marginTop: -8 }}>
                  / 33
                </Text>
              </View>
            </Animated.View>
          </Pressable>

          {justCompleted && (
            <Animated.View
              pointerEvents="none"
              style={{
                position: 'absolute',
                alignItems: 'center',
                opacity: celebrate,
                transform: [{ scale: celebrate.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.2] }) }],
              }}
            >
              <View style={{ backgroundColor: palette.accent, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.pill }}>
                <Text style={{ fontSize: 14, color: palette.bg, fontWeight: '600', letterSpacing: 1 }}>
                  ✦  99 təsbih tamam  ✦
                </Text>
              </View>
            </Animated.View>
          )}
        </View>

        <Text style={{ textAlign: 'center', fontSize: 10, color: palette.textMuted, letterSpacing: 1, marginBottom: spacing.lg }}>
          UZUN BAS — FAZA SIFIRLA
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.xl,
            borderTopWidth: 0.5,
            borderTopColor: palette.divider,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, color: palette.text, fontWeight: '500' }}>{state.totalToday}</Text>
            <Text style={{ fontSize: 10, color: palette.textSecondary, letterSpacing: 1.5, marginTop: 2 }}>BUGÜN</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, color: palette.accent, fontWeight: '500' }}>{state.completedCycles}</Text>
            <Text style={{ fontSize: 10, color: palette.textSecondary, letterSpacing: 1.5, marginTop: 2 }}>99 TƏSBİH</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, color: palette.text, fontWeight: '500' }}>{state.totalAll}</Text>
            <Text style={{ fontSize: 10, color: palette.textSecondary, letterSpacing: 1.5, marginTop: 2 }}>ÜMUMI</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
