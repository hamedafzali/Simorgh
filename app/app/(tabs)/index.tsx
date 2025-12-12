import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ModernAvatar } from "@/components/ui/modern-avatar";
import { ModernCard } from "@/components/ui/modern-card";
import PageHeader from "@/components/ui/page-header";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    // borderWidth: 1, // Remove border for cleaner look
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
  profileSection: {
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.sm,
  },
  profileEmail: {
    fontSize: Typography.sizes.sm,
  },
  languageRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  languageButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
  },
  languageButtonActive: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  languageText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
});

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  // Use centralized theme
  const { colors } = useTheme();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Page Header */}
      <PageHeader
        title={t("nav.profile")}
        showBackButton={true}
        onBackPress={() => router.back()}
        height="medium"
      />

      {/* Card-based Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <Animated.View style={[{ opacity: fadeAnim }]}>
          <ThemedView
            style={[
              styles.card,
              {
                backgroundColor: colors.background,
              },
            ]}
          >
            <View style={styles.profileSection}>
              <View style={styles.profileAvatar}>
                <ModernAvatar name="John Doe" size="lg" />
              </View>
              <ThemedText style={styles.profileName}>John Doe</ThemedText>
              <ThemedText style={styles.profileEmail}>
                john.doe@example.com
              </ThemedText>
            </View>
          </ThemedView>
        </Animated.View>

        {/* Region Card */}
        <Animated.View style={[{ opacity: fadeAnim }]}>
          <ThemedView
            style={[
              styles.card,
              {
                backgroundColor: colors.background,
              },
            ]}
          >
            <ThemedText type="heading" style={styles.cardTitle}>
              {t("profile.region")}
            </ThemedText>
            <ThemedText>
              Select your Bundesland and city to receive localized information
              and contacts.
            </ThemedText>
            <ModernCard
              title="Location Settings"
              variant="default"
              size="md"
              onPress={() => router.push("/(tabs)/community")}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <IconSymbol name="location" size={20} color={colors.primary} />
                <ThemedText
                  style={{ marginLeft: 8, fontSize: 16, fontWeight: "500" }}
                >
                  Location Settings
                </ThemedText>
              </View>
              <ThemedText style={{ fontSize: 14, color: colors.textMuted }}>
                Configure your region preferences and contacts.
              </ThemedText>
            </ModernCard>
          </ThemedView>
        </Animated.View>

        {/* Privacy Card */}
        <Animated.View style={[{ opacity: fadeAnim }]}>
          <ThemedView
            style={[
              styles.card,
              {
                backgroundColor: colors.background,
              },
            ]}
          >
            <ThemedText type="heading" style={styles.cardTitle}>
              {t("profile.privacy")}
            </ThemedText>
            <ThemedText>
              Control what data is stored on your device, export your data, or
              delete your profile.
            </ThemedText>
            <ModernCard
              variant="default"
              size="md"
              onPress={() => router.push("/settings")}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <IconSymbol
                  name="lock.shield"
                  size={20}
                  color={colors.primary}
                />
                <ThemedText
                  style={{ marginLeft: 8, fontSize: 16, fontWeight: "500" }}
                >
                  Privacy & Data
                </ThemedText>
              </View>
              <ThemedText style={{ fontSize: 14, color: colors.textMuted }}>
                Manage your data and privacy settings
              </ThemedText>
            </ModernCard>
          </ThemedView>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

ProfileScreen.options = {
  title: "Profile",
};
