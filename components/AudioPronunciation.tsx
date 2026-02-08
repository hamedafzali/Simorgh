import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/use-theme";
import { useAudio } from "../hooks/use-audio";
import { PronunciationData } from "../services/audio-service";

interface AudioPronunciationProps {
  word: string;
  language?: string;
  showPronunciationGuide?: boolean;
  compact?: boolean;
  onPlay?: () => void;
  onStop?: () => void;
}

export default function AudioPronunciation({
  word,
  language = "german",
  showPronunciationGuide = true,
  compact = false,
  onPlay,
  onStop,
}: AudioPronunciationProps) {
  const { theme } = useTheme();
  const { playWord, stopPlayback, isPlaying, getPronunciations, isLoading } =
    useAudio();
  const [showDetails, setShowDetails] = useState(false);
  const [pronunciations, setPronunciations] =
    useState<PronunciationData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPronunciations();
  }, [word]);

  const loadPronunciations = async () => {
    setLoading(true);
    try {
      const data = await getPronunciations(word);
      setPronunciations(data);
    } catch (error) {
      console.error("Failed to load pronunciations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = async () => {
    if (isPlaying) {
      await stopPlayback();
      onStop?.();
    } else {
      onPlay?.();
      await playWord(word, language);
    }
  };

  const renderCompactView = () => (
    <TouchableOpacity
      style={[
        styles.compactButton,
        { backgroundColor: theme.cardBackground, borderColor: theme.border },
      ]}
      onPress={handlePlay}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={theme.accent} />
      ) : (
        <Ionicons
          name={isPlaying ? "pause-circle" : "volume-high-outline"}
          size={20}
          color={isPlaying ? theme.accent : theme.textSecondary}
        />
      )}
    </TouchableOpacity>
  );

  const renderFullView = () => (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.cardBackground, borderColor: theme.border },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.word, { color: theme.text }]}>{word}</Text>
        <TouchableOpacity
          style={[
            styles.playButton,
            { backgroundColor: isPlaying ? theme.error : theme.accent },
          ]}
          onPress={handlePlay}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={20}
              color="#FFFFFF"
            />
          )}
        </TouchableOpacity>
      </View>

      {showPronunciationGuide && pronunciations && (
        <View style={styles.pronunciationGuide}>
          <Text
            style={[styles.pronunciationLabel, { color: theme.textSecondary }]}
          >
            Pronunciation:
          </Text>
          <Text style={[styles.pronunciationText, { color: theme.text }]}>
            {pronunciations.german}
          </Text>
          {pronunciations.english !== pronunciations.german && (
            <Text
              style={[
                styles.englishPronunciation,
                { color: theme.textSecondary },
              ]}
            >
              English: {pronunciations.english}
            </Text>
          )}
        </View>
      )}

      {(pronunciations?.farsi ||
        pronunciations?.arabic ||
        pronunciations?.turkish) && (
        <TouchableOpacity
          style={[styles.detailsButton, { backgroundColor: theme.background }]}
          onPress={() => setShowDetails(true)}
        >
          <Ionicons name="globe-outline" size={16} color={theme.accent} />
          <Text style={[styles.detailsButtonText, { color: theme.accent }]}>
            More Languages
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderDetailsModal = () => (
    <Modal
      visible={showDetails}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        style={[styles.modalContainer, { backgroundColor: theme.background }]}
      >
        <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={() => setShowDetails(false)}>
            <Ionicons name="close-outline" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            Pronunciation Guide
          </Text>
          <View style={styles.modalSpacer} />
        </View>

        <ScrollView style={styles.modalContent}>
          <View
            style={[
              styles.wordHeader,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={[styles.modalWord, { color: theme.text }]}>
              {word}
            </Text>
            <TouchableOpacity
              style={[
                styles.modalPlayButton,
                { backgroundColor: theme.accent },
              ]}
              onPress={handlePlay}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={24}
                  color="#FFFFFF"
                />
              )}
            </TouchableOpacity>
          </View>

          {pronunciations && (
            <View style={styles.pronunciationList}>
              <View
                style={[
                  styles.pronunciationItem,
                  { backgroundColor: theme.cardBackground },
                ]}
              >
                <Text
                  style={[styles.languageLabel, { color: theme.textSecondary }]}
                >
                  German
                </Text>
                <Text
                  style={[styles.pronunciationValue, { color: theme.text }]}
                >
                  {pronunciations.german}
                </Text>
              </View>

              <View
                style={[
                  styles.pronunciationItem,
                  { backgroundColor: theme.cardBackground },
                ]}
              >
                <Text
                  style={[styles.languageLabel, { color: theme.textSecondary }]}
                >
                  English
                </Text>
                <Text
                  style={[styles.pronunciationValue, { color: theme.text }]}
                >
                  {pronunciations.english}
                </Text>
              </View>

              {pronunciations.farsi && (
                <View
                  style={[
                    styles.pronunciationItem,
                    { backgroundColor: theme.cardBackground },
                  ]}
                >
                  <Text
                    style={[
                      styles.languageLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Farsi
                  </Text>
                  <Text
                    style={[styles.pronunciationValue, { color: theme.text }]}
                  >
                    {pronunciations.farsi}
                  </Text>
                </View>
              )}

              {pronunciations.arabic && (
                <View
                  style={[
                    styles.pronunciationItem,
                    { backgroundColor: theme.cardBackground },
                  ]}
                >
                  <Text
                    style={[
                      styles.languageLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Arabic
                  </Text>
                  <Text
                    style={[styles.pronunciationValue, { color: theme.text }]}
                  >
                    {pronunciations.arabic}
                  </Text>
                </View>
              )}

              {pronunciations.turkish && (
                <View
                  style={[
                    styles.pronunciationItem,
                    { backgroundColor: theme.cardBackground },
                  ]}
                >
                  <Text
                    style={[
                      styles.languageLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Turkish
                  </Text>
                  <Text
                    style={[styles.pronunciationValue, { color: theme.text }]}
                  >
                    {pronunciations.turkish}
                  </Text>
                </View>
              )}
            </View>
          )}

          <View
            style={[
              styles.tipsSection,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={[styles.tipsTitle, { color: theme.text }]}>
              Pronunciation Tips
            </Text>
            <Text style={[styles.tipsText, { color: theme.textSecondary }]}>
              • Listen carefully to the audio pronunciation
            </Text>
            <Text style={[styles.tipsText, { color: theme.textSecondary }]}>
              • Practice saying the word out loud
            </Text>
            <Text style={[styles.tipsText, { color: theme.textSecondary }]}>
              • Pay attention to stressed syllables
            </Text>
            <Text style={[styles.tipsText, { color: theme.textSecondary }]}>
              • Record yourself and compare with the original
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  if (compact) {
    return renderCompactView();
  }

  return (
    <>
      {renderFullView()}
      {renderDetailsModal()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  word: {
    fontSize: 20,
    fontWeight: "600",
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  pronunciationGuide: {
    marginTop: 12,
  },
  pronunciationLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  pronunciationText: {
    fontSize: 16,
    fontWeight: "500",
  },
  englishPronunciation: {
    fontSize: 14,
    marginTop: 2,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  compactButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalSpacer: {
    width: 24,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  wordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalWord: {
    fontSize: 24,
    fontWeight: "700",
  },
  modalPlayButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  pronunciationList: {
    marginBottom: 20,
  },
  pronunciationItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  languageLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  pronunciationValue: {
    fontSize: 18,
    fontWeight: "500",
  },
  tipsSection: {
    padding: 16,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
});
