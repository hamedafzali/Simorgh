import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  FlatList,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ExamCard } from "@/components/exam-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { SkeletonList } from "@/components/ui/skeleton";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";
import { useRouter } from "expo-router";
import { localLearningService } from "@/services/local-learning-service";
import { Exam } from "@/database/types";

export default function ExamsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState<{
    [key: string]: number;
  }>({});
  const examsPerPage = 20;

  // Group exams by category
  const getExamsByCategory = () => {
    const categories: { [key: string]: Exam[] } = {};

    exams.forEach((exam) => {
      const category = exam.category || "general";
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(exam);
    });

    return categories;
  };

  const getCategoryInfo = (category: string) => {
    const categoryInfo: {
      [key: string]: { name: string; icon: string; color: string };
    } = {
      vocabulary: {
        name: "Vocabulary Tests",
        icon: "book.fill",
        color: "#10B981",
      },
      grammar: { name: "Grammar Tests", icon: "textformat", color: "#3B82F6" },
      conversation: {
        name: "Conversation Tests",
        icon: "message.fill",
        color: "#8B5CF6",
      },
      reading: {
        name: "Reading Comprehension",
        icon: "doc.text.fill",
        color: "#F59E0B",
      },
      listening: {
        name: "Listening Tests",
        icon: "headphones",
        color: "#EF4444",
      },
      assessment: {
        name: "Assessments",
        icon: "clipboard.fill",
        color: "#6B7280",
      },
      general: { name: "General Tests", icon: "doc.fill", color: "#6B7280" },
    };

    return categoryInfo[category] || categoryInfo.general;
  };

  // Get random exam from all categories
  const getRandomExam = () => {
    if (exams.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * exams.length);
    return exams[randomIndex];
  };

  const handleStartExam = async (examId: string) => {
    try {
      const session = await localLearningService.startExam(examId);
      if (session) {
        setCurrentSession(session);
        router.push({
          pathname: "/(tabs)/exam-taking",
          params: { session: JSON.stringify(session) },
        });
      }
    } catch (error) {
      console.error("Error starting exam:", error);
      Alert.alert("Error", "Failed to start exam. Please try again.");
    }
  };

  const handleRandomTest = () => {
    const randomExam = getRandomExam();
    if (randomExam) {
      handleStartExam(randomExam.id);
    } else {
      Alert.alert("No Exams", "No exams available for random test.");
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setExams([]);
    loadExams(1, category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setCurrentPage(1);
    setExams([]);
    loadExams(1, null);
  };

  const loadCategoryCounts = useCallback(async () => {
    try {
      const categories = [
        "vocabulary",
        "grammar",
        "conversation",
        "reading",
        "listening",
      ];
      const counts: { [key: string]: number } = {};

      for (const category of categories) {
        const count = await localLearningService.getExamCount(category);
        counts[category] = count;
      }

      setCategoryCounts(counts);
      console.log("Category counts loaded:", counts);
    } catch (error) {
      console.error("Error loading category counts:", error);
    }
  }, []);

  const loadExams = useCallback(
    async (page = 1, category: string | null = null, append = false) => {
      try {
        if (append) {
          setIsLoadingMore(true);
        } else {
          setLoading(true);
        }

        const result = await localLearningService.getExams(
          category || undefined,
          page,
          examsPerPage
        );

        if (append) {
          // Filter out duplicates by ID
          const existingIds = new Set(exams.map((exam: Exam) => exam.id));
          const newExams = result.filter(
            (exam: Exam) => !existingIds.has(exam.id)
          );
          setExams((prev) => [...prev, ...newExams]);
        } else {
          setExams(result);
        }

        // Get total count
        const total = await localLearningService.getExamCount(
          category || undefined
        );
        setTotalCount(total);
        setHasMore(result.length === examsPerPage);
      } catch (error) {
        console.error("Error loading exams:", error);
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [exams, examsPerPage]
  );

  const loadMoreExams = () => {
    if (hasMore && !isLoadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadExams(nextPage, selectedCategory || null, true);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await loadExams(1, selectedCategory || null, false);
    setRefreshing(false);
  };

  useEffect(() => {
    const initializeApp = async () => {
      await localLearningService.initialize();
      loadCategoryCounts();
      loadExams();
    };

    initializeApp();
  }, [loadCategoryCounts, loadExams]);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title">Exams</ThemedText>
          <ThemedText style={styles.subtitle}>
            Practice German language exams
          </ThemedText>
        </View>
        <SkeletonList count={5} showAvatar={false} lines={3} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {selectedCategory ? (
        // Show exams for selected category with lazy loading
        <View style={styles.categoryExamsView}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() =>
                selectedCategory ? handleBackToCategories() : router.back()
              }
              style={styles.backButton}
            >
              <IconSymbol name="chevron.left" size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <ThemedText style={[styles.title, { color: colors.text }]}>
                {getCategoryInfo(selectedCategory).name}
              </ThemedText>
              <ThemedText
                style={[styles.subtitle, { color: colors.textMuted }]}
              >
                {exams.length} of {totalCount} exams loaded
              </ThemedText>
            </View>
          </View>

          <FlatList
            data={exams}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item }) => (
              <ExamCard exam={item} onStart={handleStartExam} />
            )}
            onEndReached={loadMoreExams}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            ListFooterComponent={() =>
              isLoadingMore ? (
                <View style={styles.loadingMoreContainer}>
                  <IconSymbol
                    name="hourglass"
                    size={24}
                    color={colors.textMuted}
                  />
                  <ThemedText
                    style={[
                      styles.loadingMoreText,
                      { color: colors.textMuted },
                    ]}
                  >
                    Loading more exams...
                  </ThemedText>
                </View>
              ) : hasMore ? null : (
                <View style={styles.endOfListContainer}>
                  <ThemedText
                    style={[styles.categoryCount, { color: colors.textMuted }]}
                  >
                    {categoryCounts[selectedCategory] || 0} exams
                  </ThemedText>
                </View>
              )
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.examsList}
          />
        </View>
      ) : (
        // Show categories with ScrollView (no FlatList here)
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <IconSymbol name="chevron.left" size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <ThemedText style={[styles.title, { color: colors.text }]}>
                German Exams
              </ThemedText>
              <ThemedText
                style={[styles.subtitle, { color: colors.textMuted }]}
              >
                {Object.values(categoryCounts).reduce(
                  (sum, count) => sum + count,
                  0
                ) || totalCount}{" "}
                total exams available
              </ThemedText>
            </View>
          </View>

          {/* Random Test Button */}
          <TouchableOpacity
            style={[
              styles.randomTestButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={handleRandomTest}
          >
            <IconSymbol name="shuffle" size={20} color="#ffffff" />
            <ThemedText style={[styles.randomTestText, { color: "#ffffff" }]}>
              Random Test
            </ThemedText>
          </TouchableOpacity>

          {exams.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="doc.text" size={64} color={colors.textMuted} />
              <ThemedText
                style={[styles.emptyText, { color: colors.textMuted }]}
              >
                No exams available
              </ThemedText>
              <ThemedText
                style={[styles.emptySubtext, { color: colors.textMuted }]}
              >
                Check back later for new assessments
              </ThemedText>
            </View>
          ) : (
            // Show categories
            <View style={styles.categorizedExams}>
              {Object.entries(getExamsByCategory()).map(
                ([category, categoryExams]) => {
                  const categoryInfo = getCategoryInfo(category);
                  return (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryCard,
                        { borderColor: colors.border },
                      ]}
                      onPress={() => handleCategorySelect(category)}
                    >
                      <View style={styles.categoryHeader}>
                        <View style={styles.categoryTitleContainer}>
                          <IconSymbol
                            name={categoryInfo.icon as any}
                            size={24}
                            color={categoryInfo.color}
                          />
                          <ThemedText
                            style={[
                              styles.categoryTitle,
                              { color: colors.text },
                            ]}
                          >
                            {categoryInfo.name}
                          </ThemedText>
                        </View>
                        <ThemedText
                          style={[
                            styles.categoryCount,
                            { color: colors.textMuted },
                          ]}
                        >
                          {categoryCounts[category] !== undefined
                            ? `${categoryCounts[category]} exams`
                            : "Loading..."}
                        </ThemedText>
                      </View>

                      <View style={styles.categoryPreview}>
                        {categoryExams.slice(0, 2).map((exam, index) => (
                          <View key={exam.id} style={styles.previewItem}>
                            <IconSymbol
                              name="doc.fill"
                              size={12}
                              color={colors.textMuted}
                            />
                            <ThemedText
                              style={[
                                styles.previewText,
                                { color: colors.textMuted },
                              ]}
                              numberOfLines={1}
                            >
                              {exam.title}
                            </ThemedText>
                          </View>
                        ))}
                        {categoryExams.length > 2 && (
                          <ThemedText
                            style={[
                              styles.previewMore,
                              { color: colors.primary },
                            ]}
                          >
                            +{categoryExams.length - 2} more
                          </ThemedText>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  backButton: {
    padding: Spacing.sm,
    marginTop: Spacing.xs,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: Typography.sizes["4xl"],
    fontWeight: Typography.weights.extrabold,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    opacity: 0.8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.sizes.base,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
  },
  emptySubtext: {
    fontSize: Typography.sizes.sm,
    opacity: 0.8,
    textAlign: "center",
  },
  examsList: {
    gap: Spacing.md,
  },
  categorizedExams: {
    gap: Spacing.lg,
  },
  categorySection: {
    gap: Spacing.md,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  categoryTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  categoryTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
  },
  categoryCount: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  categoryExamsList: {
    gap: Spacing.sm,
  },
  seeMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: Spacing.sm,
  },
  seeMoreText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    marginRight: Spacing.xs,
  },
  // New styles for pagination and random test
  randomTestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: 12,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  randomTestText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
  categoryCard: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  categoryExamsView: {
    flex: 1,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  paginationButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    gap: Spacing.xs,
    minWidth: 80,
    justifyContent: "center",
  },
  paginationText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  pageIndicator: {
    flex: 1,
    alignItems: "center",
  },
  pageText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
  categoryPreview: {
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  previewItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  previewText: {
    fontSize: Typography.sizes.xs,
    flex: 1,
  },
  previewMore: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    marginTop: Spacing.xs,
  },
  // Lazy loading styles
  loadingMoreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  loadingMoreText: {
    fontSize: Typography.sizes.sm,
  },
  endOfListContainer: {
    alignItems: "center",
    padding: Spacing.lg,
  },
  endOfListText: {
    fontSize: Typography.sizes.sm,
    fontStyle: "italic",
  },
});
