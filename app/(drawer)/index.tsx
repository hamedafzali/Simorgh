import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const quickActions = [
    {
      title: "Continue Learning",
      subtitle: "Pick up where you left off",
      icon: "play-circle-outline" as const,
      color: theme.accent,
      onPress: () => router.push("/learning"),
    },
    {
      title: "Practice Flashcards",
      subtitle: "Review your vocabulary",
      icon: "card-outline" as const,
      color: theme.success,
      onPress: () => router.push("/flashcards"),
    },
    {
      title: "Take an Exam",
      subtitle: "Test your knowledge",
      icon: "document-text-outline" as const,
      color: theme.warning,
      onPress: () => router.push("/exams"),
    },
  ];

  const communityFeatures = [
    {
      title: "Job Listings",
      subtitle: "Find opportunities",
      icon: "briefcase-outline" as const,
      onPress: () => router.push("/jobs"),
    },
    {
      title: "Community Events",
      subtitle: "Connect with others",
      icon: "calendar-outline" as const,
      onPress: () => router.push("/events"),
    },
    {
      title: "Documents",
      subtitle: "Important resources",
      icon: "folder-outline" as const,
      onPress: () => router.push("/documents"),
    },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: insets.top },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: theme.text }]}>
            Welcome back!
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Ready to continue your German journey?
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Quick Actions
          </Text>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionCard,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
              onPress={action.onPress}
            >
              <View style={styles.actionContent}>
                <Ionicons
                  name={action.icon}
                  size={32}
                  color={action.color}
                  style={styles.actionIcon}
                />
                <View style={styles.actionText}>
                  <Text style={[styles.actionTitle, { color: theme.text }]}>
                    {action.title}
                  </Text>
                  <Text
                    style={[
                      styles.actionSubtitle,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {action.subtitle}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.textSecondary}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Community Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Community
          </Text>
          <View style={styles.featureGrid}>
            {communityFeatures.map((feature, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: theme.border,
                  },
                ]}
                onPress={feature.onPress}
              >
                <Ionicons
                  name={feature.icon}
                  size={28}
                  color={theme.accent}
                  style={styles.featureIcon}
                />
                <Text style={[styles.featureTitle, { color: theme.text }]}>
                  {feature.title}
                </Text>
                <Text
                  style={[
                    styles.featureSubtitle,
                    { color: theme.textSecondary },
                  ]}
                >
                  {feature.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Progress Overview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Your Progress
          </Text>
          <View
            style={[
              styles.progressCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.progressItem}>
              <Text style={[styles.progressNumber, { color: theme.accent }]}>
                156
              </Text>
              <Text
                style={[styles.progressLabel, { color: theme.textSecondary }]}
              >
                Words Learned
              </Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressItem}>
              <Text style={[styles.progressNumber, { color: theme.success }]}>
                12
              </Text>
              <Text
                style={[styles.progressLabel, { color: theme.textSecondary }]}
              >
                Day Streak
              </Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressItem}>
              <Text style={[styles.progressNumber, { color: theme.warning }]}>
                B1
              </Text>
              <Text
                style={[styles.progressLabel, { color: theme.textSecondary }]}
              >
                Current Level
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
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
    paddingVertical: 30,
    alignItems: "center",
  },
  greeting: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },
  actionCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 20,
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    fontWeight: "400",
  },
  featureGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "31%",
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
  },
  featureIcon: {
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  featureSubtitle: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
  },
  progressCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  progressItem: {
    alignItems: "center",
  },
  progressNumber: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "400",
  },
  progressDivider: {
    width: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
});
