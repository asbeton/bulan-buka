import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LocationHeader } from '../src/components/LocationHeader';
import { NextPrayerHero } from '../src/components/NextPrayerHero';
import { PrayerList } from '../src/components/PrayerList';
import { DateFooter } from '../src/components/DateFooter';
import { SkyBackground, getTimePhase } from '../src/components/SkyBackground';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { usePrayerTimes } from '../src/hooks/usePrayerTimes';
import { spacing } from '../src/theme/palette';

export default function HomeScreen() {
  const { entries, nextPrayer, countdown, now } = usePrayerTimes();
  const phase = getTimePhase();

  return (
    <View style={{ flex: 1, backgroundColor: '#0F1B2D' }}>
      <SkyBackground phase={phase}>
        <ThemeProvider mode="dark">
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
            <View style={{ flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.sm }}>
              <LocationHeader />
              <NextPrayerHero nextPrayer={nextPrayer} countdown={countdown} />
              <PrayerList entries={entries} />
              <DateFooter now={now} />
            </View>
          </SafeAreaView>
        </ThemeProvider>
      </SkyBackground>
    </View>
  );
}
