import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@saleh/tasbih/v1';

export type Phase = 'subhanallah' | 'alhamdulillah' | 'allahuakbar';

export const PHASES: Phase[] = ['subhanallah', 'alhamdulillah', 'allahuakbar'];

export interface TasbihState {
  count: number;
  phase: Phase;
  totalToday: number;
  totalAll: number;
  lastDate: string;
  completedCycles: number;
}

const DEFAULT_STATE: TasbihState = {
  count: 0,
  phase: 'subhanallah',
  totalToday: 0,
  totalAll: 0,
  lastDate: '',
  completedCycles: 0,
};

const todayKey = () => new Date().toISOString().slice(0, 10);

export const useTasbih = () => {
  const [state, setState] = useState<TasbihState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as TasbihState;
          if (parsed.lastDate !== todayKey()) {
            parsed.totalToday = 0;
            parsed.completedCycles = 0;
            parsed.lastDate = todayKey();
          }
          setState(parsed);
        } else {
          setState({ ...DEFAULT_STATE, lastDate: todayKey() });
        }
      } catch (err) {
        console.warn('[tasbih] load failed:', err);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = useCallback(async (next: TasbihState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn('[tasbih] save failed:', err);
    }
  }, []);

  const increment = useCallback(() => {
    setState((prev) => {
      const newCount = prev.count + 1;
      const phaseComplete = newCount >= 33;
      const phaseIdx = PHASES.indexOf(prev.phase);
      const isLastPhase = phaseIdx === PHASES.length - 1;

      let next: TasbihState;
      if (phaseComplete && isLastPhase) {
        next = {
          ...prev,
          count: 0,
          phase: PHASES[0],
          totalToday: prev.totalToday + 1,
          totalAll: prev.totalAll + 1,
          completedCycles: prev.completedCycles + 1,
          lastDate: todayKey(),
        };
      } else if (phaseComplete) {
        next = {
          ...prev,
          count: 0,
          phase: PHASES[phaseIdx + 1],
          totalToday: prev.totalToday + 1,
          totalAll: prev.totalAll + 1,
          lastDate: todayKey(),
        };
      } else {
        next = {
          ...prev,
          count: newCount,
          totalToday: prev.totalToday + 1,
          totalAll: prev.totalAll + 1,
          lastDate: todayKey(),
        };
      }
      persist(next);
      return next;
    });
  }, [persist]);

  const resetCycle = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, count: 0, phase: PHASES[0] };
      persist(next);
      return next;
    });
  }, [persist]);

  const setPhase = useCallback((phase: Phase) => {
    setState((prev) => {
      const next = { ...prev, phase, count: 0 };
      persist(next);
      return next;
    });
  }, [persist]);

  const resetAll = useCallback(() => {
    const next: TasbihState = { ...DEFAULT_STATE, lastDate: todayKey() };
    setState(next);
    persist(next);
  }, [persist]);

  return useMemo(
    () => ({ state, loaded, increment, resetCycle, setPhase, resetAll }),
    [state, loaded, increment, resetCycle, setPhase, resetAll]
  );
};