import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

import { ThemeProvider } from '../src/theme/ThemeProvider';
import { SettingsProvider, useSettings } from '../src/hooks/useSettings';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const ThemedStack: React.FC = () => {
  const { isLoaded, settings } = useSettings();

  useEffect(() => {
    if (isLoaded) SplashScreen.hideAsync().catch(() => undefined);
  }, [isLoaded]);

  if (!isLoaded) return null;

  return (
    <ThemeProvider mode={settings.themeMode}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="settings"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="tasbih"
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="quran"
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="quran/[surah]"
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="qibla"
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
      </Stack>
    </ThemeProvider>
  );
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SettingsProvider>
          <ThemedStack />
        </SettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
