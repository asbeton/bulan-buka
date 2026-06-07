import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { darkPalette, lightPalette, type Palette } from './palette';
import type { ThemeMode } from '../types';

interface ThemeContextValue {
  palette: Palette;
  mode: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue>({
  palette: darkPalette,
  mode: 'dark',
});

interface Props {
  mode: ThemeMode;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<Props> = ({ mode, children }) => {
  const systemScheme = useColorScheme();

  const resolved: 'light' | 'dark' = useMemo(() => {
    if (mode === 'system') return systemScheme === 'light' ? 'light' : 'dark';
    return mode;
  }, [mode, systemScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode: resolved,
      palette: resolved === 'light' ? lightPalette : darkPalette,
    }),
    [resolved]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
