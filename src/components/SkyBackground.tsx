import React, { useMemo } from 'react';
import { View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';

export type TimePhase = 'dawn' | 'day' | 'dusk' | 'night';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const getTimePhase = (date: Date = new Date()): TimePhase => {
  const h = date.getHours();
  if (h >= 4 && h < 7) return 'dawn';
  if (h >= 7 && h < 17) return 'day';
  if (h >= 17 && h < 20) return 'dusk';
  return 'night';
};

// Hər faza üçün gradient - aşağıda fon rənginə keçir
const GRADIENTS: Record<TimePhase, string[]> = {
  dawn: ['#1a2540', '#6b5b7a', '#d4a574', '#f0c896'],
  day: ['#4a7ab8', '#7badd8', '#a8c8e8', '#cfe0f0'],
  dusk: ['#2a2545', '#8a4a5a', '#d4733a', '#e89850'],
  night: ['#0a0e1a', '#0f1b2d', '#15203a', '#1a2540'],
};

interface SkyBackgroundProps {
  phase?: TimePhase;
  children?: React.ReactNode;
}

export const SkyBackground: React.FC<SkyBackgroundProps> = ({ phase, children }) => {
  const activePhase = phase ?? getTimePhase();
  const colors = GRADIENTS[activePhase];

  const celestial = useMemo(() => {
    switch (activePhase) {
      case 'dawn':
        return (
          <Svg width={SCREEN_W} height={400} style={{ position: 'absolute', top: 0 }}>
            <Circle cx={SCREEN_W / 2} cy={310} r={26} fill="#fff5e0" opacity={0.9} />
            <Circle cx={SCREEN_W / 2} cy={310} r={36} fill="#fff5e0" opacity={0.2} />
          </Svg>
        );
      case 'day':
        return (
          <Svg width={SCREEN_W} height={400} style={{ position: 'absolute', top: 0 }}>
            <Circle cx={SCREEN_W / 2} cy={70} r={24} fill="#fff8e0" />
            <Circle cx={SCREEN_W / 2} cy={70} r={34} fill="#fff8e0" opacity={0.25} />
          </Svg>
        );
      case 'dusk':
        return (
          <Svg width={SCREEN_W} height={400} style={{ position: 'absolute', top: 0 }}>
            <Circle cx={SCREEN_W / 2} cy={320} r={28} fill="#ffd090" opacity={0.85} />
            <Circle cx={SCREEN_W / 2} cy={320} r={40} fill="#ffd090" opacity={0.2} />
          </Svg>
        );
      case 'night':
        return (
          <Svg width={SCREEN_W} height={400} style={{ position: 'absolute', top: 0 }}>
            <Path
              d={`M ${SCREEN_W - 60} 60 A 18 18 0 1 0 ${SCREEN_W - 60} 96 A 14 14 0 1 1 ${SCREEN_W - 60} 60 Z`}
              fill="#d4a574"
            />
            <Circle cx={50} cy={80} r={1.2} fill="#fff" opacity={0.8} />
            <Circle cx={90} cy={55} r={1.5} fill="#fff" opacity={0.7} />
            <Circle cx={140} cy={110} r={1} fill="#fff" opacity={0.6} />
            <Circle cx={40} cy={130} r={1.2} fill="#fff" opacity={0.7} />
            <Circle cx={SCREEN_W - 120} cy={70} r={1} fill="#fff" opacity={0.6} />
            <Circle cx={SCREEN_W - 40} cy={140} r={1.3} fill="#fff" opacity={0.7} />
          </Svg>
        );
    }
  }, [activePhase]);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={colors as [string, string, ...string[]]}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      {celestial}
      {children}
    </View>
  );
};
