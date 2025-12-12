import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import PageHeader from "@/components/ui/page-header";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";
import {
  getLearningStats,
  getExercises,
  getCategories,
  getExams,
  type LearningStats,
  type Exercise,
  type LearningCategory,
  type Exam,
} from "../../services/learningService";

// User proficiency levels
const PROFICIENCY_LEVELS = {
  beginner: {
    name: "Beginner",
    color: "#10B981",
    description: "Just starting with German basics",
    nextLevel: "A1",
  },
  elementary: {
    name: "Elementary",
    color: "#3B82F6",
    description: "Can understand and use familiar expressions",
    nextLevel: "A2",
  },
  intermediate: {
    name: "Intermediate",
    color: "#8B5CF6",
    description: "Can handle most situations while traveling",
    nextLevel: "B1",
  },
  advanced: {
    name: "Advanced",
    color: "#F59E0B",
    description: "Can communicate fluently and spontaneously",
    nextLevel: "B2",
  },
  fluent: {
    name: "Fluent",
    color: "#EF4444",
    description: "Can use language flexibly for social purposes",
    nextLevel: "C1",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#000000", // Remove hardcoded color
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100, // Optimized height for narrow header
    zIndex: 5,
  },
  glassHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100, // Match gradient height
    paddingTop: 50, // Status bar
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    zIndex: 20,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 40, // Ensure proper height for content
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(20px)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.semibold,
    // color: "#FFFFFF", // Remove hardcoded color
    flex: 1,
    textAlign: "center",
    marginHorizontal: Spacing.sm, // Add horizontal spacing
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(20px)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -48, // Move button up more
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  pageHeader: {
    gap: 8,
    marginBottom: 16,
    marginTop: 80,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 120, // Match header height + status bar
    gap: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.lg,
    // backgroundColor: "rgba(255,255,255,0.05)", // Remove hardcoded color
    backdropFilter: "blur(20px)",
    borderWidth: 1,
    // borderColor: "rgba(255,255,255,0.1)", // Remove hardcoded color
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.semibold,
    // color: "#FFFFFF", // Remove hardcoded color
    marginBottom: Spacing.md,
  },
  proficiencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: Spacing.md,
  },
  proficiencyText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    // color: "#FFFFFF", // Remove hardcoded color
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  categoryCard: {
    width: "48%",
    padding: Spacing.md,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    gap: Spacing.sm,
    minHeight: 80,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    // color: "#FFFFFF", // Remove hardcoded color
    textAlign: "center",
  },
  progressRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  progressRingFill: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderTopColor: "#10B981",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    transform: [{ rotate: "-90deg" }],
  },
  progressText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    // color: "#FFFFFF", // Remove hardcoded color
  },
  analyticsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.md,
  },
  analyticsItem: {
    alignItems: "center",
    flex: 1,
  },
  analyticsValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    // color: "#FFFFFF", // Remove hardcoded color
  },
  analyticsLabel: {
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  learningPath: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  pathStep: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  stepText: {
    fontSize: Typography.sizes.sm,
    // color: "#FFFFFF", // Remove hardcoded color
    flex: 1,
  },
  textBlock: {
    marginTop: 8,
    gap: 2,
  },
  topicRow: {
    marginTop: 8,
    gap: 4,
  },
  topicBar: {
    height: 6,
    borderRadius: 999,
    borderWidth: 1,
    overflow: "hidden",
  },
  topicBarFill: {
    height: "100%",
    backgroundColor: "#6366F1",
  },
  // New styles for exams and flashcards sections
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  seeAllButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  seeAllButtonText: {
    color: "#FFFFFF",
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  examsPreview: {
    gap: Spacing.sm,
  },
  examPreviewCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    gap: Spacing.md,
  },
  examPreviewTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    flex: 1,
  },
  examPreviewDesc: {
    fontSize: Typography.sizes.xs,
    opacity: 0.8,
  },
  flashcardsPreview: {
    gap: Spacing.sm,
  },
  flashcardPreviewCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    gap: Spacing.md,
  },
  flashcardPreviewTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    flex: 1,
  },
  flashcardPreviewDesc: {
    fontSize: Typography.sizes.xs,
    opacity: 0.8,
  },
});

type LearnState = {
  dailyWords: any[];
  grammarTopics: any[];
  exercises: Exercise[];
  stats: LearningStats | null;
  exams: Exam[];
};

export default function LearnScreen() {
  const { colors } = useTheme(); // Add theme hook
  const router = useRouter();
  const [data, setData] = useState<LearnState | null>(null);
  const [userLevel, setUserLevel] = useState<string>("A1");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<LearningCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Get learning analytics from database
  const getAnalytics = () => {
    return data?.stats || null;
  };

  // Generate personalized learning path based on database stats
  const generateLearningPath = (level: string) => {
    const paths = {
      A1: [
        "Learn basic greetings and introductions",
        "Master essential vocabulary (100 words)",
        "Practice simple sentence structures",
        "Complete A1 level exercises",
      ],
      A2: [
        "Expand vocabulary to 300 words",
        "Learn past and present tense",
        "Practice daily conversations",
        "Complete A2 level exercises",
      ],
      B1: [
        "Build 600+ word vocabulary",
        "Master complex grammar",
        "Practice business German",
        "Complete B1 level exercises",
      ],
      B2: [
        "Learn idiomatic expressions",
        "Practice formal writing",
        "Study cultural context",
        "Complete B2 level exercises",
      ],
      C1: [
        "Perfect pronunciation",
        "Study literature and poetry",
        "Master regional dialects",
        "Complete C1 level exercises",
      ],
      C2: [
        "Achieve native-like fluency",
        "Master academic German",
        "Study advanced literature",
        "Complete C2 level exercises",
      ],
    };

    return paths[level as keyof typeof paths] || paths.A1;
  };

  useEffect(() => {
    let isMounted = true;

    const loadLearningData = async () => {
      try {
        setIsLoading(true);

        // Get user learning stats from API
        const stats = await getLearningStats();

        // Get recommended exercises from API
        const exercises = await getExercises();

        // Get categories from API
        const categoriesData = await getCategories();

        // Get exams from API
        const exams = await getExams();

        if (!isMounted) return;

        setData({
          dailyWords: [], // TODO: Implement getWords API call
          grammarTopics: [], // TODO: Implement grammar topics API
          exercises,
          stats,
          exams,
        });

        setCategories(categoriesData);
        setUserLevel(stats?.currentLevel || "A1");
      } catch (error) {
        console.warn("Learning data load error:", error);
        if (!isMounted) return;

        // Set empty state on error
        setData({
          dailyWords: [],
          grammarTopics: [],
          exercises: [],
          stats: null,
          exams: [],
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadLearningData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fade in and slide animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const analytics = getAnalytics();
  const currentLevelData =
    PROFICIENCY_LEVELS[userLevel as keyof typeof PROFICIENCY_LEVELS] ||
    PROFICIENCY_LEVELS.beginner;
  const learningPath = generateLearningPath(userLevel);

  // Calculate exam statistics
  const examStats = {
    totalExams: data?.exams?.length || 0,
    takenExams: analytics?.totalExams || 0,
    remainingExams: (data?.exams?.length || 0) - (analytics?.totalExams || 0),
    examPassRate: analytics?.lastExamScore || 0,
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background } as any]}
    >
      {/* Page Header */}
      <PageHeader
        title="Learning"
        showBackButton={true}
        onBackPress={() => router.back()}
        height="medium"
      />

      {/* Card-based Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <Animated.View style={[{ opacity: fadeAnim }]}>
            <ThemedView style={styles.card}>
              <ThemedText type="heading" style={styles.cardTitle}>
                Loading...
              </ThemedText>
            </ThemedView>
          </Animated.View>
        ) : (
          <>
            {/* Proficiency Level Card */}
            <Animated.View style={[{ opacity: fadeAnim }]}>
              <ThemedView
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card as any,
                    borderColor: colors.border as any,
                  },
                ]}
              >
                <ThemedText
                  type="heading"
                  style={[styles.cardTitle, { color: colors.text as any }]}
                >
                  Your German Level
                </ThemedText>
                <View
                  style={[
                    styles.proficiencyBadge,
                    { backgroundColor: currentLevelData.color },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.proficiencyText,
                      { color: colors.text as any },
                    ]}
                  >
                    {currentLevelData.name} • {userLevel}
                  </ThemedText>
                </View>
                <ThemedText style={{ color: colors.textMuted as any }}>
                  {currentLevelData.description}
                </ThemedText>

                {/* Progress Ring */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: Spacing.md,
                  }}
                >
                  <View style={styles.progressRing}>
                    <View
                      style={[
                        styles.progressRingFill,
                        {
                          borderTopColor: currentLevelData.color,
                          transform: [
                            { rotate: "-90deg" },
                            {
                              rotate: `${(analytics?.accuracy || 0) * 3.6}deg`,
                            },
                          ],
                        },
                      ]}
                    />
                    <ThemedText
                      style={[
                        styles.progressText,
                        { color: colors.text as any },
                      ]}
                    >
                      {analytics?.accuracy || 0}%
                    </ThemedText>
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={{ color: colors.text as any }}>
                      Overall Progress
                    </ThemedText>
                    <ThemedText
                      style={{
                        color: colors.textMuted as any,
                        fontSize: Typography.sizes.sm,
                      }}
                    >
                      {analytics?.masteredWords || 0} of{" "}
                      {analytics?.totalWords || 0} words mastered
                    </ThemedText>
                  </View>
                </View>
              </ThemedView>
            </Animated.View>

            {/* Learning Analytics Card */}
            <Animated.View
              style={[
                { opacity: fadeAnim },
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <ThemedView
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card as any,
                    borderColor: colors.border as any,
                  },
                ]}
              >
                <ThemedText
                  type="heading"
                  style={[styles.cardTitle, { color: colors.text as any }]}
                >
                  Learning Analytics
                </ThemedText>
                <View style={styles.analyticsRow}>
                  <View style={styles.analyticsItem}>
                    <ThemedText
                      style={[
                        styles.analyticsValue,
                        { color: colors.text as any },
                      ]}
                    >
                      {analytics?.streakDays || 0}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.analyticsLabel,
                        { color: colors.textMuted as any },
                      ]}
                    >
                      Day Streak
                    </ThemedText>
                  </View>
                  <View style={styles.analyticsItem}>
                    <ThemedText
                      style={[
                        styles.analyticsValue,
                        { color: colors.text as any },
                      ]}
                    >
                      {analytics?.totalReviews || 0}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.analyticsLabel,
                        { color: colors.textMuted as any },
                      ]}
                    >
                      Total Reviews
                    </ThemedText>
                  </View>
                  <View style={styles.analyticsItem}>
                    <ThemedText
                      style={[
                        styles.analyticsValue,
                        { color: colors.text as any },
                      ]}
                    >
                      {analytics?.masteredWords || 0}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.analyticsLabel,
                        { color: colors.textMuted as any },
                      ]}
                    >
                      Words Learned
                    </ThemedText>
                  </View>
                </View>

                {/* Exam Statistics Row */}
                <View style={styles.analyticsRow}>
                  <View style={styles.analyticsItem}>
                    <ThemedText
                      style={[
                        styles.analyticsValue,
                        { color: colors.text as any },
                      ]}
                    >
                      {examStats.totalExams}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.analyticsLabel,
                        { color: colors.textMuted as any },
                      ]}
                    >
                      Total Exams
                    </ThemedText>
                  </View>
                  <View style={styles.analyticsItem}>
                    <ThemedText
                      style={[
                        styles.analyticsValue,
                        { color: colors.text as any },
                      ]}
                    >
                      {examStats.takenExams}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.analyticsLabel,
                        { color: colors.textMuted as any },
                      ]}
                    >
                      Taken
                    </ThemedText>
                  </View>
                  <View style={styles.analyticsItem}>
                    <ThemedText
                      style={[
                        styles.analyticsValue,
                        { color: colors.text as any },
                      ]}
                    >
                      {examStats.remainingExams}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.analyticsLabel,
                        { color: colors.textMuted as any },
                      ]}
                    >
                      Remaining
                    </ThemedText>
                  </View>
                </View>
              </ThemedView>
            </Animated.View>

            {/* Learning Categories */}
            <Animated.View
              style={[
                { opacity: fadeAnim },
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <ThemedView
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card as any,
                    borderColor: colors.border as any,
                  },
                ]}
              >
                <ThemedText
                  type="heading"
                  style={[styles.cardTitle, { color: colors.text as any }]}
                >
                  Learning Categories
                </ThemedText>
                <View style={styles.categoryGrid}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryCard,
                        selectedCategory === category.id && {
                          backgroundColor: category.color + "20",
                          borderColor: category.color,
                        },
                      ]}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <View
                        style={[
                          styles.categoryIcon,
                          { backgroundColor: category.color + "20" },
                        ]}
                      >
                        <IconSymbol
                          name={category.icon as any}
                          size={20}
                          color={category.color}
                        />
                      </View>
                      <ThemedText
                        style={[
                          styles.categoryName,
                          { color: colors.text as any },
                        ]}
                      >
                        {category.name}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </ThemedView>
            </Animated.View>

            {/* Exams Section */}
            <Animated.View
              style={[
                { opacity: fadeAnim },
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <ThemedView
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card as any,
                    borderColor: colors.border as any,
                  },
                ]}
              >
                <View style={styles.sectionHeader}>
                  <ThemedText
                    type="heading"
                    style={[styles.cardTitle, { color: colors.text as any }]}
                  >
                    German Exams
                  </ThemedText>
                  <TouchableOpacity
                    style={[
                      styles.seeAllButton,
                      { backgroundColor: colors.primary as any },
                    ]}
                    onPress={() => router.push("/(tabs)/exams")}
                  >
                    <ThemedText style={styles.seeAllButtonText}>
                      See All
                    </ThemedText>
                  </TouchableOpacity>
                </View>

                <View style={styles.examsPreview}>
                  <TouchableOpacity
                    style={[
                      styles.examPreviewCard,
                      { backgroundColor: colors.card as any },
                    ]}
                    onPress={() => router.push("/(tabs)/exams")}
                  >
                    <IconSymbol
                      name="doc.text.fill"
                      size={24}
                      color={colors.primary}
                    />
                    <ThemedText
                      style={[
                        styles.examPreviewTitle,
                        { color: colors.text as any },
                      ]}
                    >
                      German Basics Assessment
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.examPreviewDesc,
                        { color: colors.textMuted as any },
                      ]}
                    >
                      Test your knowledge of basic German
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </ThemedView>
            </Animated.View>

            {/* Flashcards Section */}
            <Animated.View
              style={[
                { opacity: fadeAnim },
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <ThemedView
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card as any,
                    borderColor: colors.border as any,
                  },
                ]}
              >
                <View style={styles.sectionHeader}>
                  <ThemedText
                    type="heading"
                    style={[styles.cardTitle, { color: colors.text as any }]}
                  >
                    Flashcard Practice
                  </ThemedText>
                  <TouchableOpacity
                    style={[
                      styles.seeAllButton,
                      { backgroundColor: colors.primary as any },
                    ]}
                    onPress={() => router.push("/(tabs)/flashcards")}
                  >
                    <ThemedText style={styles.seeAllButtonText}>
                      Practice
                    </ThemedText>
                  </TouchableOpacity>
                </View>

                <View style={styles.flashcardsPreview}>
                  <TouchableOpacity
                    style={[
                      styles.flashcardPreviewCard,
                      { backgroundColor: colors.card as any },
                    ]}
                    onPress={() => router.push("/(tabs)/flashcards")}
                  >
                    <IconSymbol
                      name="rectangle.stack.fill"
                      size={24}
                      color={colors.primary}
                    />
                    <ThemedText
                      style={[
                        styles.flashcardPreviewTitle,
                        { color: colors.text as any },
                      ]}
                    >
                      Review Due Cards
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.flashcardPreviewDesc,
                        { color: colors.textMuted as any },
                      ]}
                    >
                      3 cards ready for review
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </ThemedView>
            </Animated.View>

            {/* Personalized Learning Path */}
            <Animated.View
              style={[
                { opacity: fadeAnim },
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <ThemedView
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card as any,
                    borderColor: colors.border as any,
                  },
                ]}
              >
                <ThemedText
                  type="heading"
                  style={[styles.cardTitle, { color: colors.text as any }]}
                >
                  Your Learning Path
                </ThemedText>
                <View style={styles.learningPath}>
                  {learningPath.map((step, index) => (
                    <View key={index} style={styles.pathStep}>
                      <View style={styles.stepNumber}>
                        <ThemedText
                          style={{
                            color: colors.text as any,
                            fontSize: Typography.sizes.xs,
                            fontWeight: "600",
                          }}
                        >
                          {index + 1}
                        </ThemedText>
                      </View>
                      <ThemedText
                        style={[styles.stepText, { color: colors.text as any }]}
                      >
                        {step}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </ThemedView>
            </Animated.View>

            {/* Daily Words Card */}
            <Animated.View
              style={[
                { opacity: fadeAnim },
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <ThemedView style={styles.card}>
                <ThemedText
                  type="heading"
                  style={[styles.cardTitle, { color: colors.text as any }]}
                >
                  Daily Words
                </ThemedText>
                {data?.dailyWords.slice(0, 3).map((word) => (
                  <View key={word._id} style={styles.textBlock}>
                    <ThemedText style={{ color: colors.text as any }}>
                      {word.article} {word.word}
                    </ThemedText>
                    <ThemedText style={{ color: colors.textMuted as any }}>
                      {word.translations[0]?.text}
                    </ThemedText>
                  </View>
                ))}
              </ThemedView>
            </Animated.View>

            {/* Grammar Topics Card */}
            <Animated.View
              style={[
                { opacity: fadeAnim },
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <ThemedView
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card as any,
                    borderColor: colors.border as any,
                  },
                ]}
              >
                <ThemedText
                  type="heading"
                  style={[styles.cardTitle, { color: colors.text as any }]}
                >
                  Grammar Topics
                </ThemedText>
                {data?.grammarTopics.slice(0, 3).map((topic) => (
                  <View key={topic.id} style={styles.textBlock}>
                    <ThemedText style={{ color: colors.text as any }}>
                      {topic.title}
                    </ThemedText>
                    <ThemedText style={{ color: colors.textMuted as any }}>
                      {topic.description}
                    </ThemedText>
                  </View>
                ))}
              </ThemedView>
            </Animated.View>

            {/* Practice Exercises Card */}
            <Animated.View
              style={[
                { opacity: fadeAnim },
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <ThemedView
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card as any,
                    borderColor: colors.border as any,
                  },
                ]}
              >
                <ThemedText
                  type="heading"
                  style={[styles.cardTitle, { color: colors.text as any }]}
                >
                  Practice Exercises
                </ThemedText>
                {data?.exercises.slice(0, 3).map((exercise) => (
                  <View key={exercise.id} style={styles.textBlock}>
                    <ThemedText style={{ color: colors.text as any }}>
                      {exercise.title}
                    </ThemedText>
                    <ThemedText style={{ color: colors.textMuted as any }}>
                      {exercise.type} • {exercise.level} •{" "}
                      {exercise.questionCount} questions
                    </ThemedText>
                  </View>
                ))}
              </ThemedView>
            </Animated.View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

LearnScreen.options = {
  title: "Learn",
};
