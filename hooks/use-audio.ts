import { useState, useEffect, useCallback } from "react";
import AudioService, { PronunciationData } from "../services/audio-service";

export interface UseAudioReturn {
  playWord: (word: string, language?: string) => Promise<void>;
  stopPlayback: () => Promise<void>;
  isPlaying: boolean;
  getPronunciations: (word: string) => Promise<PronunciationData>;
  preloadCommonWords: () => Promise<void>;
  clearCache: () => Promise<void>;
  audioStats: { totalCached: number; totalDownloaded: number } | null;
  isLoading: boolean;
}

export function useAudio(): UseAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioStats, setAudioStats] = useState<{
    totalCached: number;
    totalDownloaded: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const audioService = AudioService.getInstance();

  useEffect(() => {
    const initializeAudio = async () => {
      setIsLoading(true);
      try {
        await audioService.initialize();
        const stats = await audioService.getAudioStats();
        setAudioStats(stats);
      } catch (error) {
        console.error("Failed to initialize audio service:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAudio();
  }, []);

  const playWord = useCallback(
    async (word: string, language: string = "german") => {
      if (!word.trim()) return;

      setIsPlaying(true);
      try {
        await audioService.playWordPronunciation(word, language);
        const stats = await audioService.getAudioStats();
        setAudioStats(stats);
      } catch (error) {
        console.error("Failed to play word:", error);
      } finally {
        setIsPlaying(false);
      }
    },
    []
  );

  const stopPlayback = useCallback(async () => {
    try {
      await audioService.stopPlayback();
      setIsPlaying(false);
    } catch (error) {
      console.error("Failed to stop playback:", error);
    }
  }, []);

  const getPronunciations = useCallback(
    async (word: string): Promise<PronunciationData> => {
      try {
        return await audioService.getAvailablePronunciations(word);
      } catch (error) {
        console.error("Failed to get pronunciations:", error);
        return {
          word,
          german: word,
          english: word,
        };
      }
    },
    []
  );

  const preloadCommonWords = useCallback(async () => {
    setIsLoading(true);
    try {
      await audioService.preloadCommonWords();
      const stats = await audioService.getAudioStats();
      setAudioStats(stats);
    } catch (error) {
      console.error("Failed to preload common words:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCache = useCallback(async () => {
    setIsLoading(true);
    try {
      await audioService.clearCache();
      setAudioStats({ totalCached: 0, totalDownloaded: 0 });
    } catch (error) {
      console.error("Failed to clear cache:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    playWord,
    stopPlayback,
    isPlaying,
    getPronunciations,
    preloadCommonWords,
    clearCache,
    audioStats,
    isLoading,
  };
}
