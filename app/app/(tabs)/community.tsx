import { LinearGradient } from "expo-linear-gradient";
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 5,
  },
  glassHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    paddingTop: 50,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    zIndex: 20,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 40,
  },
  headerTitle: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.semibold,
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
    marginHorizontal: Spacing.sm,
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
    marginTop: -48,
    zIndex: 30,
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 120,
    gap: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.lg,
    backgroundColor: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.semibold,
    color: "#FFFFFF",
    marginBottom: Spacing.md,
  },
  mapWrapper: {
    marginTop: Spacing.md,
    height: 320,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  infoText: {
    fontSize: Typography.sizes.sm,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  footerText: {
    marginTop: Spacing.sm,
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
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
    color: "#FFFFFF",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: Typography.sizes.sm,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 20,
  },
});

export default function CommunityMapScreenWeb() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  // Simple OpenStreetMap embed centered around Berlin
  const mapUrl =
    "https://www.openstreetmap.org/export/embed.html?bbox=13.35%2C52.49%2C13.47%2C52.54&layer=mapnik&marker=52.52%2C13.405";

  useEffect(() => {
    // Fade in animation
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
    <View style={styles.container} key={i18n.language}>
      {/* Page Header */}
      <PageHeader
        title={t("nav.communityMap")}
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
          <ThemedView style={styles.card}>
            <ThemedText type="heading" style={styles.cardTitle}>
              {t("nav.communityMap")}
            </ThemedText>
            <ThemedText style={styles.infoText}>
              Interactive web map preview. For a full experience with nearby
              centers and navigation, use the native app.
            </ThemedText>
            <View style={styles.mapWrapper}>
              {/* Using iframe directly on web; react-native-web will render this only in browsers. */}
              <iframe
                src={mapUrl}
                style={{ width: "100%", height: "100%", border: "0" } as any}
                loading="lazy"
              />
            </View>
            <ThemedText style={styles.footerText}>
              Map data © OpenStreetMap contributors (demo view)
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.card}>
            <ThemedText type="heading" style={styles.cardTitle}>
              Example Centers
            </ThemedText>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <IconSymbol name="building.2.fill" size={20} color="#3B82F6" />
              </View>
              <View style={styles.featureText}>
                <ThemedText style={styles.featureTitle}>
                  Iranian Cultural Center Berlin
                </ThemedText>
                <ThemedText style={styles.featureDescription}>
                  Cultural events and advice for the Persian community
                </ThemedText>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <IconSymbol name="person.2.fill" size={20} color="#3B82F6" />
              </View>
              <View style={styles.featureText}>
                <ThemedText style={styles.featureTitle}>
                  Farsi-German Language Café
                </ThemedText>
                <ThemedText style={styles.featureDescription}>
                  Language exchange and community meetups
                </ThemedText>
              </View>
            </View>
          </ThemedView>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

CommunityMapScreenWeb.options = {
  title: "Community Map",
};
