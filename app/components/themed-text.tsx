import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
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
  headerTitle: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.semibold,
    flex: 1,
    textAlign: "center",
    marginHorizontal: Spacing.sm,
    marginTop: -35,
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
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 100, // Reduced for modern header
    gap: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.lg,
    backgroundColor: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    // borderWidth: 1, // Remove border for cleaner look
    // borderColor: "rgba(255,255,255,0.1)", // Remove border for cleaner look
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.md,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#3B82F6",
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: Typography.sizes.sm,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 20,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
    marginTop: Spacing.md,
  },
  mapButtonText: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.md,
  },
  mapButtonTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    // color: "#FFFFFF", // Remove hardcoded color
    marginBottom: 4,
  },
  mapButtonSubtitle: {
    fontSize: Typography.sizes.sm,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 18,
  },
});

export default function CommunityScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme(); // Add theme hook
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  useEffect(() => {
    // Fade in animation
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChanged = () => {
      forceUpdate();
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [i18n]);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }]}
      key={i18n.language}
    >
      {/* Page Header */}
      <PageHeader
        title="Community"
        showBackButton={true}
        onBackPress={() => router.back()}
        height="medium"
      />

      {/* Card-based Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[{ opacity: fadeAnim }]}>
          <ThemedView
            style={[
              styles.card,
              {
                backgroundColor: colors.card as any,
              },
            ]}
          >
            <ThemedText
              type="heading"
              style={[styles.cardTitle, { color: colors.text as any }]}
            >
              Connect & Grow Together
            </ThemedText>
            <ThemedText
              style={{
                fontSize: Typography.sizes.sm,
                color: colors.textMuted as any,
                lineHeight: 20,
                marginBottom: Spacing.md,
              }}
            >
              Join a vibrant community of Farsi speakers in Germany. Find
              support, share experiences, and build meaningful connections.
            </ThemedText>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <IconSymbol name="person.2.fill" size={20} color="#3B82F6" />
              </View>
              <View style={styles.featureText}>
                <ThemedText
                  style={[styles.featureTitle, { color: colors.text as any }]}
                >
                  Mentor & Buddy Program
                </ThemedText>
                <ThemedText style={{ color: colors.textMuted as any }}>
                  Find volunteers and mentors who can support you with practical
                  questions and integration.
                </ThemedText>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <IconSymbol name="location.fill" size={20} color="#3B82F6" />
              </View>
              <View style={styles.featureText}>
                <ThemedText
                  style={[styles.featureTitle, { color: colors.text as any }]}
                >
                  Local Meetups
                </ThemedText>
                <ThemedText style={{ color: colors.textMuted as any }}>
                  Discover community events and gatherings in your area.
                  Practice language skills and make new friends.
                </ThemedText>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <IconSymbol name="bubble.left.fill" size={20} color="#3B82F6" />
              </View>
              <View style={styles.featureText}>
                <ThemedText
                  style={[styles.featureTitle, { color: colors.text as any }]}
                >
                  Discussion Forums
                </ThemedText>
                <ThemedText style={{ color: colors.textMuted as any }}>
                  Share experiences, ask questions, and get advice from
                  community members who understand your journey.
                </ThemedText>
              </View>
            </View>

            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => router.push("/(tabs)/community-map")}
            >
              <IconSymbol name="map.fill" size={24} color={colors.text} />
              <View style={styles.mapButtonText}>
                <ThemedText
                  style={[styles.mapButtonTitle, { color: colors.text as any }]}
                >
                  {t("home.communityMapButton")}
                </ThemedText>
                <ThemedText style={{ color: colors.textMuted as any }}>
                  {t("home.communityMapDesc")}
                </ThemedText>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.text} />
            </TouchableOpacity>
          </ThemedView>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

CommunityScreen.options = {
  title: "Community",
};
