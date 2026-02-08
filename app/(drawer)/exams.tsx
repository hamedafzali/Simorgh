import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";

// Type assertion for Ionicons to fix TypeScript errors
const Icon = Ionicons as any;

// Type assertions to fix React Native component JSX errors
const RNScrollView = ScrollView as any;
const RNView = View as any;
const RNText = Text as any;
const RNTouchableOpacity = TouchableOpacity as any;
const RNFlatList = FlatList as any;

interface Exam {
  id: string;
  title: string;
  description: string;
  examType: "practice" | "mock" | "certification";
  level: string;
  sections: string[];
  timeLimit: number; // in minutes
  passingScore: number;
  questionCount: number;
  isActive: boolean;
  createdAt: Date;
}

interface Question {
  id: string;
  type: "multiple-choice" | "fill-blank" | "translation" | "matching";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  section: string;
}

const mockExams: Exam[] = [
  {
    id: "1",
    title: "German Basics A1",
    description: "Test your fundamental German knowledge",
    examType: "practice",
    level: "A1",
    sections: ["Vocabulary", "Grammar", "Reading"],
    timeLimit: 30,
    passingScore: 70,
    questionCount: 20,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "B1 Level Mock Exam",
    description: "Comprehensive B1 level assessment",
    examType: "mock",
    level: "B1",
    sections: ["Reading", "Writing", "Listening", "Grammar", "Vocabulary"],
    timeLimit: 90,
    passingScore: 75,
    questionCount: 50,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Certification Practice",
    description: "Prepare for official German certification",
    examType: "certification",
    level: "B2",
    sections: ["Reading", "Writing", "Listening", "Speaking", "Grammar"],
    timeLimit: 120,
    passingScore: 80,
    questionCount: 75,
    isActive: true,
    createdAt: new Date(),
  },
];

const mockQuestions: Question[] = [
  {
    id: "1",
    type: "multiple-choice",
    question: 'What is the correct article for "Haus"?',
    options: ["der", "die", "das", "den"],
    correctAnswer: "das",
    explanation: 'Haus is a neuter noun, so it uses "das".',
    section: "Grammar",
  },
  {
    id: "2",
    type: "translation",
    question: 'Translate "Good morning" to German:',
    correctAnswer: "Guten Morgen",
    explanation: "This is the standard greeting for the morning.",
    section: "Vocabulary",
  },
  {
    id: "3",
    type: "fill-blank",
    question: "Ich ___ nach Berlin. (I go to Berlin)",
    correctAnswer: "gehe",
    explanation: 'The verb "gehen" conjugated for "ich" is "gehe".',
    section: "Grammar",
  },
];

export default function ExamsScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [results, setResults] = useState({
    score: 0,
    correct: 0,
    incorrect: 0,
    total: 0,
  });

  useEffect(() => {
    let timer: number;
    if (examStarted && !examCompleted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            completeExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, examCompleted, timeRemaining]);

  const startExam = (exam: Exam) => {
    setSelectedExam(exam);
    setExamStarted(true);
    setTimeRemaining(exam.timeLimit * 60);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setExamCompleted(false);
  };

  const answerQuestion = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [mockQuestions[currentQuestionIndex].id]: answer,
    }));

    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      completeExam();
    }
  };

  const completeExam = () => {
    if (!selectedExam) return;

    const correctAnswers = mockQuestions.filter(
      (q) => answers[q.id] === q.correctAnswer
    ).length;
    const score = Math.round((correctAnswers / mockQuestions.length) * 100);

    setResults({
      score,
      correct: correctAnswers,
      incorrect: mockQuestions.length - correctAnswers,
      total: mockQuestions.length,
    });
    setExamCompleted(true);
    setExamStarted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case "practice":
        return theme.success;
      case "mock":
        return theme.warning;
      case "certification":
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  const getExamTypeIcon = (type: string) => {
    switch (type) {
      case "practice":
        return "school-outline";
      case "mock":
        return "document-text-outline";
      case "certification":
        return "award-outline";
      default:
        return "help-outline";
    }
  };

  if (examStarted && selectedExam && !examCompleted) {
    const currentQuestion = mockQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / mockQuestions.length) * 100;

    return (
      <RNView
        style={[
          styles.container,
          { backgroundColor: theme.background, paddingTop: insets.top },
        ]}
      >
        <RNView style={styles.examHeader}>
          <RNView style={styles.examInfo}>
            <RNText style={[styles.examTitle, { color: theme.text }]}>
              {selectedExam.title}
            </RNText>
            <RNView style={styles.examStats}>
              <RNView style={styles.statItem}>
                <Icon
                  name="time-outline"
                  size={16}
                  color={theme.textSecondary}
                />
                <RNText
                  style={[styles.statText, { color: theme.textSecondary }]}
                >
                  {formatTime(timeRemaining)}
                </RNText>
              </RNView>
              <RNView style={styles.statItem}>
                <Icon
                  name="list-outline"
                  size={16}
                  color={theme.textSecondary}
                />
                <RNText
                  style={[styles.statText, { color: theme.textSecondary }]}
                >
                  {currentQuestionIndex + 1}/{mockQuestions.length}
                </RNText>
              </RNView>
            </RNView>
          </RNView>

          {/* Progress Bar */}
          <RNView style={styles.progressContainer}>
            <RNView
              style={[styles.progressBar, { backgroundColor: theme.border }]}
            >
              <RNView
                style={[
                  styles.progressFill,
                  { backgroundColor: theme.accent, width: `${progress}%` },
                ]}
              />
            </RNView>
          </RNView>
        </RNView>

        <RNScrollView style={styles.questionContainer}>
          <RNView
            style={[
              styles.questionCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <RNView style={styles.questionHeader}>
              <RNText
                style={[styles.questionType, { color: theme.textSecondary }]}
              >
                {currentQuestion.section} •{" "}
                {currentQuestion.type.replace("-", " ")}
              </RNText>
            </RNView>

            <RNText style={[styles.questionText, { color: theme.text }]}>
              {currentQuestion.question}
            </RNText>

            {currentQuestion.type === "multiple-choice" &&
              currentQuestion.options && (
                <RNView style={styles.optionsContainer}>
                  {currentQuestion.options.map((option, index) => (
                    <RNTouchableOpacity
                      key={index}
                      style={[
                        styles.optionButton,
                        {
                          backgroundColor:
                            answers[currentQuestion.id] === option
                              ? theme.accent
                              : theme.cardBackground,
                          borderColor: theme.border,
                        },
                      ]}
                      onPress={() => answerQuestion(option)}
                    >
                      <RNText
                        style={[
                          styles.optionText,
                          {
                            color:
                              answers[currentQuestion.id] === option
                                ? "#FFFFFF"
                                : theme.text,
                          },
                        ]}
                      >
                        {option}
                      </RNText>
                    </RNTouchableOpacity>
                  ))}
                </RNView>
              )}

            {currentQuestion.type === "translation" && (
              <RNTouchableOpacity
                style={[styles.submitButton, { backgroundColor: theme.accent }]}
                onPress={() => answerQuestion("User answer")}
              >
                <RNText style={styles.submitButtonText}>Submit Answer</RNText>
              </RNTouchableOpacity>
            )}

            {currentQuestion.type === "fill-blank" && (
              <RNTouchableOpacity
                style={[styles.submitButton, { backgroundColor: theme.accent }]}
                onPress={() => answerQuestion("User answer")}
              >
                <RNText style={styles.submitButtonText}>Submit Answer</RNText>
              </RNTouchableOpacity>
            )}
          </RNView>
        </RNScrollView>
      </RNView>
    );
  }

  if (examCompleted && selectedExam) {
    const passed = results.score >= selectedExam.passingScore;

    return (
      <RNView
        style={[
          styles.container,
          { backgroundColor: theme.background, paddingTop: insets.top },
        ]}
      >
        <RNScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <RNView style={styles.resultsContainer}>
            <Icon
              name={passed ? "trophy-outline" : "close-circle-outline"}
              size={80}
              color={passed ? theme.success : theme.error}
              style={styles.resultIcon}
            />
            <RNText style={[styles.resultTitle, { color: theme.text }]}>
              {passed ? "Congratulations!" : "Keep Practicing!"}
            </RNText>
            <RNText
              style={[styles.resultSubtitle, { color: theme.textSecondary }]}
            >
              {selectedExam.title}
            </RNText>

            <RNView style={styles.scoreCard}>
              <RNText
                style={[
                  styles.scoreNumber,
                  { color: passed ? theme.success : theme.error },
                ]}
              >
                {results.score}%
              </RNText>
              <RNText
                style={[styles.scoreLabel, { color: theme.textSecondary }]}
              >
                Final Score
              </RNText>
            </RNView>

            <RNView style={styles.resultsStats}>
              <RNView style={styles.statItem}>
                <RNText style={[styles.statNumber, { color: theme.success }]}>
                  {results.correct}
                </RNText>
                <RNText
                  style={[styles.statLabel, { color: theme.textSecondary }]}
                >
                  Correct
                </RNText>
              </RNView>
              <RNView style={styles.statItem}>
                <RNText style={[styles.statNumber, { color: theme.error }]}>
                  {results.incorrect}
                </RNText>
                <RNText
                  style={[styles.statLabel, { color: theme.textSecondary }]}
                >
                  Incorrect
                </RNText>
              </RNView>
              <RNView style={styles.statItem}>
                <RNText style={[styles.statNumber, { color: theme.accent }]}>
                  {selectedExam.passingScore}%
                </RNText>
                <RNText
                  style={[styles.statLabel, { color: theme.textSecondary }]}
                >
                  Passing Score
                </RNText>
              </RNView>
            </RNView>

            <RNTouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.accent }]}
              onPress={() => {
                setExamCompleted(false);
                setSelectedExam(null);
              }}
            >
              <RNText style={styles.actionButtonText}>Back to Exams</RNText>
            </RNTouchableOpacity>
          </RNView>
        </RNScrollView>
      </RNView>
    );
  }

  return (
    <RNView
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: insets.top },
      ]}
    >
      <RNScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <RNView style={styles.header}>
          <RNText style={[styles.title, { color: theme.text }]}>
            German Exams
          </RNText>
          <RNText style={[styles.subtitle, { color: theme.textSecondary }]}>
            Test your German language skills
          </RNText>
        </RNView>

        <RNFlatList
          data={mockExams}
          renderItem={({ item }) => (
            <RNTouchableOpacity
              style={[
                styles.examCard,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => startExam(item)}
            >
              <RNView style={styles.examCardHeader}>
                <RNView style={styles.examCardInfo}>
                  <RNText style={[styles.examCardTitle, { color: theme.text }]}>
                    {item.title}
                  </RNText>
                  <RNText
                    style={[
                      styles.examCardDescription,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {item.description}
                  </RNText>
                </RNView>
                <Icon
                  name={getExamTypeIcon(item.examType) as any}
                  size={24}
                  color={getExamTypeColor(item.examType)}
                />
              </RNView>

              <RNView style={styles.examCardMeta}>
                <RNView style={styles.metaItem}>
                  <RNText
                    style={[styles.metaLabel, { color: theme.textSecondary }]}
                  >
                    Level:
                  </RNText>
                  <RNText style={[styles.metaValue, { color: theme.accent }]}>
                    {item.level}
                  </RNText>
                </RNView>
                <RNView style={styles.metaItem}>
                  <RNText
                    style={[styles.metaLabel, { color: theme.textSecondary }]}
                  >
                    Time:
                  </RNText>
                  <RNText style={[styles.metaValue, { color: theme.text }]}>
                    {item.timeLimit} min
                  </RNText>
                </RNView>
                <RNView style={styles.metaItem}>
                  <RNText
                    style={[styles.metaLabel, { color: theme.textSecondary }]}
                  >
                    Questions:
                  </RNText>
                  <RNText style={[styles.metaValue, { color: theme.text }]}>
                    {item.questionCount}
                  </RNText>
                </RNView>
              </RNView>

              <RNView style={styles.examCardFooter}>
                <RNView style={styles.sectionsContainer}>
                  <RNText
                    style={[
                      styles.sectionsLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Sections:
                  </RNText>
                  <RNView style={styles.sectionsList}>
                    {item.sections.map((section, index) => (
                      <RNText
                        key={index}
                        style={[
                          styles.sectionTag,
                          { backgroundColor: theme.border, color: theme.text },
                        ]}
                      >
                        {section}
                      </RNText>
                    ))}
                  </RNView>
                </RNView>

                <RNView style={styles.examTypeContainer}>
                  <RNView
                    style={[
                      styles.examTypeBadge,
                      { backgroundColor: getExamTypeColor(item.examType) },
                    ]}
                  >
                    <RNText style={styles.examTypeText}>
                      {item.examType.charAt(0).toUpperCase() +
                        item.examType.slice(1)}
                    </RNText>
                  </RNView>
                </RNView>
              </RNView>
            </RNTouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          style={styles.examsList}
          showsVerticalScrollIndicator={false}
        />
      </RNScrollView>
    </RNView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
  },
  examsList: {
    flex: 1,
  },
  examCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  examCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  examCardInfo: {
    flex: 1,
    marginRight: 16,
  },
  examCardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  examCardDescription: {
    fontSize: 14,
    fontWeight: "400",
  },
  examCardMeta: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  metaItem: {
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  examCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionsContainer: {
    flex: 1,
  },
  sectionsLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
  },
  sectionsList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sectionTag: {
    fontSize: 10,
    fontWeight: "500",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  examTypeContainer: {
    alignItems: "flex-end",
  },
  examTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  examTypeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  examHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  examInfo: {
    marginBottom: 16,
  },
  examTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  examStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  questionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
  },
  questionHeader: {
    marginBottom: 20,
  },
  questionType: {
    fontSize: 14,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 24,
  },
  optionsContainer: {
    marginTop: 16,
  },
  optionButton: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  submitButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  resultIcon: {
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 30,
  },
  scoreCard: {
    alignItems: "center",
    marginBottom: 30,
  },
  scoreNumber: {
    fontSize: 64,
    fontWeight: "700",
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: "400",
  },
  resultsStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 40,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "400",
  },
  actionButton: {
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
