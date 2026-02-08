import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ErrorHandler } from "../utils/error-handler";

export interface AudioFile {
  id: string;
  word: string;
  language: string;
  url: string;
  localPath?: string;
  isDownloaded: boolean;
  duration?: number;
}

export interface PronunciationData {
  word: string;
  german: string;
  english: string;
  farsi?: string;
  arabic?: string;
  turkish?: string;
}

class AudioService {
  private static instance: AudioService;
  private errorHandler: ErrorHandler;
  private currentSound: Audio.Sound | null = null;
  private isPlaying = false;
  private audioCache: Map<string, AudioFile> = new Map();

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
  }

  static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  async initialize(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      await this.loadAudioCache();
    } catch (error) {
      this.errorHandler.handleNetworkError(error, "AudioService.initialize");
    }
  }

  async playWordPronunciation(
    word: string,
    language: string = "german"
  ): Promise<void> {
    try {
      if (this.isPlaying && this.currentSound) {
        await this.currentSound.stopAsync();
        await this.currentSound.unloadAsync();
      }

      const audioFile = await this.getAudioFile(word, language);

      if (!audioFile) {
        // Fallback to text-to-speech if no audio file available
        await this.speakWord(word, language);
        return;
      }

      if (audioFile.isDownloaded && audioFile.localPath) {
        // Play from local cache
        await this.playLocalAudio(audioFile.localPath);
      } else {
        // Stream from URL and cache for future use
        await this.playRemoteAudio(audioFile);
      }
    } catch (error) {
      this.errorHandler.handleNetworkError(error, "playWordPronunciation");
      // Fallback to text-to-speech
      await this.speakWord(word, language);
    }
  }

  private async getAudioFile(
    word: string,
    language: string
  ): Promise<AudioFile | null> {
    const cacheKey = `${word}_${language}`;

    // Check cache first
    if (this.audioCache.has(cacheKey)) {
      return this.audioCache.get(cacheKey)!;
    }

    // Generate mock audio file data (in real app, this would come from API)
    const audioFile: AudioFile = {
      id: Date.now().toString(),
      word,
      language,
      url: `https://api.simorgh-connect.com/audio/${language}/${word.toLowerCase()}.mp3`,
      isDownloaded: false,
    };

    this.audioCache.set(cacheKey, audioFile);
    await this.saveAudioCache();

    return audioFile;
  }

  private async playLocalAudio(localPath: string): Promise<void> {
    try {
      this.currentSound = new Audio.Sound();
      await this.currentSound.loadAsync({ uri: localPath });

      this.isPlaying = true;
      await this.currentSound.playAsync();

      this.currentSound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          await this.cleanup();
        }
      });
    } catch (error) {
      this.errorHandler.handleNetworkError(error, "playLocalAudio");
      throw error;
    }
  }

  private async playRemoteAudio(audioFile: AudioFile): Promise<void> {
    try {
      this.currentSound = new Audio.Sound();
      await this.currentSound.loadAsync({ uri: audioFile.url });

      const status = await this.currentSound.getStatusAsync();
      if (status.isLoaded) {
        audioFile.duration = status.durationMillis
          ? status.durationMillis / 1000
          : undefined;
      }

      this.isPlaying = true;
      await this.currentSound.playAsync();

      this.currentSound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          await this.cleanup();
        }
      });

      // Download for offline use
      this.downloadAudioForOffline(audioFile);
    } catch (error) {
      this.errorHandler.handleNetworkError(error, "playRemoteAudio");
      throw error;
    }
  }

  private async downloadAudioForOffline(audioFile: AudioFile): Promise<void> {
    try {
      // In a real app, you would download the file and store it locally
      // For now, we'll just mark it as downloaded for demo purposes
      audioFile.isDownloaded = true;
      audioFile.localPath = `file:///local/cache/${audioFile.word}_${audioFile.language}.mp3`;

      this.audioCache.set(`${audioFile.word}_${audioFile.language}`, audioFile);
      await this.saveAudioCache();
    } catch (error) {
      console.error("Failed to download audio for offline use:", error);
    }
  }

  private async speakWord(word: string, language: string): Promise<void> {
    try {
      // Fallback text-to-speech implementation
      // In a real app, you would use expo-speech or a similar library
      console.log(
        `Speaking "${word}" in ${language} (text-to-speech fallback)`
      );

      // Mock TTS delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      this.errorHandler.handleNetworkError(error, "speakWord");
      throw error;
    }
  }

  async stopPlayback(): Promise<void> {
    try {
      if (this.currentSound && this.isPlaying) {
        await this.currentSound.stopAsync();
        await this.cleanup();
      }
    } catch (error) {
      this.errorHandler.handleNetworkError(error, "stopPlayback");
    }
  }

  private async cleanup(): Promise<void> {
    if (this.currentSound) {
      await this.currentSound.unloadAsync();
      this.currentSound = null;
    }
    this.isPlaying = false;
  }

  async preloadCommonWords(): Promise<void> {
    const commonWords = [
      "hallo",
      "danke",
      "bitte",
      "ja",
      "nein",
      "guten morgen",
      "guten tag",
      "guten abend",
      "tschüss",
      "auf wiedersehen",
      "wie geht es dir",
      "ich heiße",
      "woher kommen sie",
      "ich spreche deutsch",
      "entschuldigung",
      "verzeihung",
    ];

    try {
      for (const word of commonWords) {
        await this.getAudioFile(word, "german");
      }
    } catch (error) {
      console.error("Failed to preload common words:", error);
    }
  }

  async getAvailablePronunciations(word: string): Promise<PronunciationData> {
    // Mock pronunciation data - in real app, this would come from API
    const pronunciations: Record<string, PronunciationData> = {
      hallo: {
        word: "hallo",
        german: "HAH-loh",
        english: "hah-loh",
        farsi: "هلو",
        arabic: "هالو",
        turkish: "merhaba",
      },
      danke: {
        word: "danke",
        german: "DAHN-keh",
        english: "dahn-kuh",
        farsi: "مرسی",
        arabic: "شكرا",
        turkish: "teşekkürler",
      },
      bitte: {
        word: "bitte",
        german: "BIT-teh",
        english: "bit-tuh",
        farsi: "لطفا",
        arabic: "من فضلك",
        turkish: "lütfen",
      },
      ja: {
        word: "ja",
        german: "YAH",
        english: "yah",
        farsi: "بله",
        arabic: "نعم",
        turkish: "evet",
      },
      nein: {
        word: "nein",
        german: "NINE",
        english: "nine",
        farsi: "خیر",
        arabic: "لا",
        turkish: "hayır",
      },
    };

    return (
      pronunciations[word.toLowerCase()] || {
        word,
        german: word,
        english: word,
      }
    );
  }

  private async loadAudioCache(): Promise<void> {
    try {
      const cached = await AsyncStorage.getItem("audio_cache");
      if (cached) {
        const cacheData = JSON.parse(cached);
        this.audioCache = new Map(Object.entries(cacheData));
      }
    } catch (error) {
      console.error("Failed to load audio cache:", error);
    }
  }

  private async saveAudioCache(): Promise<void> {
    try {
      const cacheData = Object.fromEntries(this.audioCache);
      await AsyncStorage.setItem("audio_cache", JSON.stringify(cacheData));
    } catch (error) {
      console.error("Failed to save audio cache:", error);
    }
  }

  async clearCache(): Promise<void> {
    try {
      this.audioCache.clear();
      await AsyncStorage.removeItem("audio_cache");
      await this.cleanup();
    } catch (error) {
      this.errorHandler.handleNetworkError(error, "clearCache");
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  async getAudioStats(): Promise<{
    totalCached: number;
    totalDownloaded: number;
  }> {
    const totalCached = this.audioCache.size;
    const totalDownloaded = Array.from(this.audioCache.values()).filter(
      (file) => file.isDownloaded
    ).length;

    return { totalCached, totalDownloaded };
  }
}

export default AudioService;
