import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ModernButton } from "@/components/ui/modern-button";
import { ModernChip } from "@/components/ui/modern-chip";
import { Typography } from "@/constants/theme";
import {
  loadLearnBundle,
  type DailyPhrase,
  type VocabItem,
} from "@/services/learn";
import {
  FlashcardType,
  updateFlashcardAfterReview,
} from "@/services/learnProgress";
import { useAppState } from "../../app/_layout";

type QuizMode = "multiple-choice" | "fill-in";

type QuizQuestion = {
  id: string;
  type: FlashcardType;
  vocab?: VocabItem;
  phrase?: DailyPhrase;
  options?: string[]; // for multiple-choice (Farsi meanings)
};

export default function LearnQuizScreen() {
  const { refreshGlobalProgress } = useAppState();
  const [mode, setMode] = useState<QuizMode>("multiple-choice");
  const [vocab, setVocab] = useState<VocabItem[]>([]);
  const [phrases, setPhrases] = useState<DailyPhrase[]>([]);
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [fillInput, setFillInput] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [incorrect, setIncorrect] = useState<QuizQuestion[]>([]);
  const [timed, setTimed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const bundle = await loadLearnBundle();
        if (!isMounted) return;
        setVocab(bundle.vocabulary);
        setPhrases(bundle.dailyPhrases);
        setQuestion(
          generateQuestion(
            "multiple-choice",
            bundle.vocabulary,
            bundle.dailyPhrases
          )
        );
      } catch (error) {
        console.warn("learn quiz load error", error);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChangeMode = (newMode: QuizMode) => {
    setMode(newMode);
    setFeedback(null);
    setSelectedOption(null);
    setFillInput("");
    setHint(null);
    setQuestion(generateQuestion(newMode, vocab, phrases));
  };

  const QUESTION_SECONDS = 20;

  useEffect(() => {
    if (!timed || !question) {
      setTimeLeft(null);
      return;
    }
    setTimeLeft(QUESTION_SECONDS);
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return prev;
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [question, timed]);

  const gradeQuestion = useCallback(
    async (opts?: { timeout?: boolean }) => {
      if (!question) return;

      let correct = false;
      if (opts?.timeout) {
        correct = false;
      } else if (mode === "multiple-choice") {
        if (!selectedOption) return;
        const correctFa = question.vocab?.fa ?? question.phrase?.fa ?? "";
        correct = selectedOption === correctFa;
      } else {
        const expected = (question.vocab?.de ?? question.phrase?.de ?? "")
          .trim()
          .toLowerCase();
        correct = fillInput.trim().toLowerCase() === expected;
      }

      const type: FlashcardType = question.type;

      try {
        await updateFlashcardAfterReview(question.id, type, correct);
        await refreshGlobalProgress();
      } catch (error) {
        console.warn("quiz updateFlashcardAfterReview error", error);
      }

      if (!correct) {
        setIncorrect((prev) => [...prev, question]);
      }

      if (opts?.timeout) {
        setFeedback(
          `Time is up (Correct: ${(
            question.vocab?.fa ??
            question.phrase?.fa ??
            ""
          ).trim()})`
        );
      } else {
        setFeedback(correct ? "Correct!" : "Try again");
      }
    },
    [question, mode, selectedOption, fillInput, refreshGlobalProgress]
  );

  const handleSubmit = async () => {
    if (!question) return;
    await gradeQuestion();
  };

  const handleNext = () => {
    setFeedback(null);
    setSelectedOption(null);
    setFillInput("");
    setHint(null);
    setQuestion(generateQuestion(mode, vocab, phrases));
  };

  useEffect(() => {
    if (!timed || timeLeft !== 0 || !question || feedback) return;
    void gradeQuestion({ timeout: true });
  }, [timed, timeLeft, question, feedback, gradeQuestion]);

  const germanPrompt = useMemo(() => {
    if (!question) return "";
    return question.vocab?.de ?? question.phrase?.de ?? "";
  }, [question]);

  const faCorrect = question?.vocab?.fa ?? question?.phrase?.fa ?? "";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
      keyboardVerticalOffset={Platform.select({ ios: 80, android: 0 }) ?? 0}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title">Quiz</ThemedText>
        <ThemedText type="subtitle">Practice words and phrases</ThemedText>

        <View style={styles.modeRow}>
          <ModernChip
            label="Multiple choice"
            variant={mode === "multiple-choice" ? "primary" : "default"}
            active={mode === "multiple-choice"}
            onPress={() => handleChangeMode("multiple-choice")}
          />
          <ModernChip
            label="Fill in"
            variant={mode === "fill-in" ? "primary" : "default"}
            active={mode === "fill-in"}
            onPress={() => handleChangeMode("fill-in")}
          />
        </View>

        <View style={styles.modeRow}>
          <ModernChip
            label={timed ? "Timed mode: On" : "Timed mode: Off"}
            variant={timed ? "primary" : "default"}
            active={timed}
            onPress={() => {
              setTimed((prev) => !prev);
              setTimeLeft(null);
            }}
          />
          {timed && timeLeft !== null && (
            <ThemedText>Time left: {timeLeft}s</ThemedText>
          )}
        </View>

        {question ? (
          <ThemedView style={styles.card}>
            <ThemedText type="subtitle">German</ThemedText>
            <ThemedText style={styles.promptText}>{germanPrompt}</ThemedText>

            {mode === "multiple-choice" ? (
              <View style={styles.optionsContainer}>
                {question.options?.map((opt) => (
                  <ModernChip
                    key={opt}
                    label={opt}
                    variant={selectedOption === opt ? "primary" : "default"}
                    active={selectedOption === opt}
                    onPress={() => setSelectedOption(opt)}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.fillContainer}>
                <ThemedText>Type the German sentence/word:</ThemedText>
                <TextInput
                  style={styles.fillInput}
                  value={fillInput}
                  onChangeText={setFillInput}
                />
              </View>
            )}

            {feedback && (
              <ThemedText style={styles.feedbackText}>
                {feedback}{" "}
                {feedback === "Try again" ? `(Correct: ${faCorrect})` : ""}
              </ThemedText>
            )}

            {hint && (
              <ThemedText style={styles.hintText}>Hint: {hint}</ThemedText>
            )}

            <View style={styles.actionsRow}>
              <ModernButton
                title="Check"
                variant="primary"
                size="md"
                onPress={handleSubmit}
              />
              <ModernButton
                title="Next"
                variant="outline"
                size="md"
                onPress={handleNext}
              />
              <ModernButton
                title="Hint"
                variant="ghost"
                size="md"
                onPress={() => {
                  if (!question) return;
                  const fa = question.vocab?.fa ?? question.phrase?.fa ?? "";
                  if (!fa) return;
                  setHint(`${fa.charAt(0)}…`);
                }}
              />
            </View>
          </ThemedView>
        ) : (
          <ThemedView style={styles.card}>
            <ThemedText>No quiz items available.</ThemedText>
          </ThemedView>
        )}

        {incorrect.length > 0 && (
          <ThemedView style={styles.reviewSection}>
            <ThemedText type="subtitle">Review incorrect answers</ThemedText>
            {incorrect.map((q) => {
              const de = q.vocab?.de ?? q.phrase?.de ?? "";
              const fa = q.vocab?.fa ?? q.phrase?.fa ?? "";
              return (
                <ThemedText key={q.id}>
                  - {de} = {fa}
                </ThemedText>
              );
            })}
          </ThemedView>
        )}
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

function generateQuestion(
  mode: QuizMode,
  vocab: VocabItem[],
  phrases: DailyPhrase[]
): QuizQuestion | null {
  const all: QuizQuestion[] = [
    ...vocab.map((v) => ({ id: v.id, type: "vocab" as const, vocab: v })),
    ...phrases.map((p) => ({ id: p.id, type: "phrase" as const, phrase: p })),
  ];

  if (!all.length) return null;

  const rand = all[Math.floor(Math.random() * all.length)];

  if (mode === "multiple-choice") {
    const correctFa = rand.vocab?.fa ?? rand.phrase?.fa ?? "";
    const pool = vocab.map((v) => v.fa).filter((fa) => fa !== correctFa);
    const distractors = shuffleArray(pool).slice(0, 3);
    const options = shuffleArray([correctFa, ...distractors]);
    return { ...rand, options };
  }

  return rand;
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },
  modeRow: {
    flexDirection: "row",
    gap: 8,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  promptText: {
    fontSize: Typography.sizes.xl,
  },
  optionsContainer: {
    gap: 8,
  },
  fillContainer: {
    gap: 8,
  },
  fillInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  feedbackText: {
    marginTop: 4,
    color: "#D32F2F",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  hintText: {
    marginTop: 4,
    fontStyle: "italic",
  },
  reviewSection: {
    marginTop: 12,
    gap: 4,
  },
});
