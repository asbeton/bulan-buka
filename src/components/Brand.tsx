import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { typography } from '../theme/palette';

export const Brand: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const { palette } = useTheme();
  const fontSize = size === 'lg' ? 32 : size === 'md' ? 24 : 18;

  return (
    <View>
      <Text
        style={{
          ...typography.brand,
          fontSize,
          color: palette.text,
        }}
      >
        Bulan Buka
      </Text>
    </View>
  );
};

