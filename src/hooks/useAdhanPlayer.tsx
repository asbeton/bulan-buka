import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef } from 'react';

const ADHAN_ASSET = require('../../assets/audio/adhan_short.mp3');

export const useAdhanPlayer = () => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const isPlayingRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => undefined);
        soundRef.current = null;
      }
    };
  }, []);

  const play = useCallback(async () => {
    try {
      // If already playing, stop first
      if (soundRef.current) {
        await soundRef.current.unloadAsync().catch(() => undefined);
        soundRef.current = null;
      }

      // Configure audio mode (play even in silent mode on iOS)
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        ADHAN_ASSET,
        { shouldPlay: true, volume: 1.0 }
      );

      soundRef.current = sound;
      isPlayingRef.current = true;

      // Auto-cleanup when finished
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => undefined);
          soundRef.current = null;
          isPlayingRef.current = false;
        }
      });
    } catch (err) {
      console.warn('[adhan] play failed:', err);
      isPlayingRef.current = false;
    }
  }, []);

  const stop = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync().catch(() => undefined);
        await soundRef.current.unloadAsync().catch(() => undefined);
        soundRef.current = null;
        isPlayingRef.current = false;
      }
    } catch (err) {
      console.warn('[adhan] stop failed:', err);
    }
  }, []);

  const isPlaying = useCallback(() => isPlayingRef.current, []);

  return { play, stop, isPlaying };
};

