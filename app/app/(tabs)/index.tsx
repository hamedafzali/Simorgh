import React from "react";
import { Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Feather } from "@expo/vector-icons";
import { GlassCard } from "../../components/ui/GlassCard";
import { GlassWidget } from "../../components/ui/GlassWidget";
import { PageHeader } from "../../components/ui/PageHeader";
import { SyncButton } from "../../components/ui/SyncButton";
import { Screen } from "../../components/ui/Screen";
import {
  getHomeMenuHighlightColor,
  getHomeMenuIconStyle,
  getHomeMenuItemStyle,
  getHomeMenuShadeColor,
  homeStyles,
} from "../../styles";

export default function HomeTab() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const now = new Date();
  const weekday = now.toLocaleDateString(undefined, { weekday: "long" });
  const dayMonth = now.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
  });

  const persianDate = (() => {
    try {
      return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(now);
    } catch {
      return now.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  })();

  const menuItems = [
    {
      key: "learn",
      label: "Learn",
      icon: "book-open" as const,
      onPress: () => router.push("/(tabs)/learn" as any),
    },
    {
      key: "vocab",
      label: "Vocabulary",
      icon: "type" as const,
      onPress: () => router.push("/learn/vocabulary" as any),
    },
    {
      key: "flashcards",
      label: "Flashcards",
      icon: "layers" as const,
      onPress: () => router.push("/learn/flashcards" as any),
    },
    {
      key: "practice",
      label: "Practice",
      icon: "check-square" as const,
      onPress: () => router.push("/learn/practice" as any),
    },
    {
      key: "exams",
      label: "Exams",
      icon: "edit-3" as const,
      onPress: () => router.push("/learn/exams" as any),
    },
    {
      key: "jobs",
      label: "Jobs",
      icon: "briefcase" as const,
      onPress: () => router.push("/(tabs)/jobs" as any),
    },
    {
      key: "events",
      label: "Events",
      icon: "calendar" as const,
      onPress: () => router.push("/events" as any),
    },
    {
      key: "documents",
      label: "Documents",
      icon: "file-text" as const,
      onPress: () => router.push("/documents" as any),
    },
    {
      key: "countries",
      label: "Countries",
      icon: "globe" as const,
      onPress: () => router.push("/countries" as any),
    },
    {
      key: "timeline",
      label: "Timeline",
      icon: "clock" as const,
      onPress: () => router.push("/timeline" as any),
    },
    {
      key: "services",
      label: "Services",
      icon: "help-circle" as const,
      onPress: () => router.push("/services" as any),
    },
    {
      key: "checklist",
      label: "Checklist",
      icon: "check-circle" as const,
      onPress: () => router.push("/checklist" as any),
    },
    {
      key: "deadlines",
      label: "Deadlines",
      icon: "calendar" as const,
      onPress: () => router.push("/deadlines" as any),
    },
    {
      key: "documents-tracker",
      label: "Doc Tracker",
      icon: "file-text" as const,
      onPress: () => router.push("/documents-tracker" as any),
    },
    {
      key: "phrasebook",
      label: "Phrasebook",
      icon: "message-square" as const,
      onPress: () => router.push("/phrasebook" as any),
    },
    {
      key: "forms",
      label: "Form Helper",
      icon: "clipboard" as const,
      onPress: () => router.push("/forms" as any),
    },
    {
      key: "emergency",
      label: "Emergency",
      icon: "alert-triangle" as const,
      onPress: () => router.push("/emergency" as any),
    },
    {
      key: "guides",
      label: "Guides",
      icon: "map" as const,
      onPress: () => router.push("/guides" as any),
    },
    {
      key: "locations",
      label: "Locations",
      icon: "map-pin" as const,
      onPress: () => router.push("/locations" as any),
    },
    {
      key: "chat",
      label: "Chat",
      icon: "message-circle" as const,
      onPress: () => router.push("/chat" as any),
    },
    {
      key: "settings",
      label: "Settings",
      icon: "settings" as const,
      onPress: () => router.push("/settings" as any),
    },
  ];

  return (
    <Screen>
      <GlassCard
        onPress={() => router.push("/events" as any)}
        style={homeStyles.topCard}
      >
        <View style={homeStyles.topRow}>
          <View style={homeStyles.topLeft}>
            <Text style={[homeStyles.topKicker, { color: palette.textMuted }]}>
              {weekday}
            </Text>
            <Text
              style={[homeStyles.topPrimary, { color: palette.textPrimary }]}
            >
              {dayMonth}
            </Text>
            <Text
              style={[homeStyles.persianDate, { color: palette.textSecondary }]}
            >
              {persianDate}
            </Text>
          </View>

          <View
            style={[
              homeStyles.divider,
              { backgroundColor: palette.borderLight },
            ]}
          />

          <View style={homeStyles.topRight}>
            <View style={homeStyles.weatherRow}>
              <Feather name="cloud" size={18} color={palette.primary} />
              <Text style={[homeStyles.temp, { color: palette.textPrimary }]}>
                12°
              </Text>
            </View>
            <Text
              style={[homeStyles.weatherHint, { color: palette.textSecondary }]}
            >
              Mostly cloudy
            </Text>

            {/* Sync Button */}
            <View style={{ marginTop: Spacing.xs }}>
              <SyncButton size="small" />
            </View>
          </View>
        </View>
      </GlassCard>

      <GlassCard style={homeStyles.menuCard}>
        <Text style={[homeStyles.sectionTitle, { color: palette.textPrimary }]}>
          Menu
        </Text>
        <View style={homeStyles.menuGrid}>
          {menuItems.map((item) => (
            <Pressable
              key={item.key}
              onPress={item.onPress}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              style={({ pressed }) => [
                homeStyles.menuItemBase,
                getHomeMenuItemStyle({
                  colorScheme,
                  pressed,
                }),
                pressed ? homeStyles.menuPressed : null,
              ]}
            >
              <View
                pointerEvents="none"
                style={[
                  homeStyles.menuHighlight,
                  { backgroundColor: getHomeMenuHighlightColor(colorScheme) },
                ]}
              />
              <View
                pointerEvents="none"
                style={[
                  homeStyles.menuShade,
                  { backgroundColor: getHomeMenuShadeColor(colorScheme) },
                ]}
              />
              <View
                style={[
                  homeStyles.menuIconBase,
                  getHomeMenuIconStyle({ colorScheme }),
                ]}
              >
                <Feather name={item.icon} size={18} color={palette.primary} />
              </View>
              <Text
                style={[homeStyles.menuLabel, { color: palette.textPrimary }]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </GlassCard>

      <View style={homeStyles.widgetGrid}>
        <View style={homeStyles.col}>
          <GlassWidget
            title="Continue"
            value="Vocabulary"
            subtitle="Start a 2‑min session"
            icon="play"
            onPress={() => router.push("/(tabs)/learn" as any)}
          />
          <GlassWidget
            title="Level"
            value="A1"
            subtitle="Up next: basics"
            icon="award"
            onPress={() => router.push("/(tabs)/learn" as any)}
          />
        </View>
        <View style={homeStyles.col}>
          <GlassWidget
            title="Streak"
            value="0"
            subtitle="Build consistency"
            icon="zap"
            onPress={() => router.push("/(tabs)/learn" as any)}
          />
          <GlassWidget
            title="Reviews"
            value="0"
            subtitle="Due today"
            icon="repeat"
            onPress={() => router.push("/(tabs)/learn" as any)}
          />
        </View>
      </View>

      <GlassCard>
        <Text style={[homeStyles.sectionTitle, { color: palette.textPrimary }]}>
          Quick actions
        </Text>
        <Text
          style={[homeStyles.sectionHint, { color: palette.textSecondary }]}
        >
          Everything you need—one tap away.
        </Text>

        <View style={homeStyles.quickRow}>
          <GlassWidget
            title="Jobs"
            subtitle="Browse"
            icon="briefcase"
            onPress={() => router.push("/(tabs)/jobs" as any)}
            style={homeStyles.quickItem}
          />
          <GlassWidget
            title="Events"
            subtitle="Nearby"
            icon="calendar"
            onPress={() => router.push("/events" as any)}
            style={homeStyles.quickItem}
          />
        </View>
        <View style={homeStyles.quickRow}>
          <GlassWidget
            title="Documents"
            subtitle="Guides"
            icon="file-text"
            onPress={() => router.push("/documents" as any)}
            style={homeStyles.quickItem}
          />
          <GlassWidget
            title="Community"
            subtitle="Chat"
            icon="message-circle"
            onPress={() => router.push("/(tabs)/community" as any)}
            style={homeStyles.quickItem}
          />
        </View>
        <View style={homeStyles.quickRow}>
          <GlassWidget
            title="Guides"
            subtitle="Essentials"
            icon="map"
            onPress={() => router.push("/guides" as any)}
            style={homeStyles.quickItem}
          />
          <GlassWidget
            title="Locations"
            subtitle="Nearby"
            icon="map-pin"
            onPress={() => router.push("/locations" as any)}
            style={homeStyles.quickItem}
          />
        </View>
        <View style={homeStyles.quickRow}>
          <GlassWidget
            title="Countries"
            subtitle="Starter packs"
            icon="globe"
            onPress={() => router.push("/countries" as any)}
            style={homeStyles.quickItem}
          />
          <GlassWidget
            title="Timeline"
            subtitle="90 days"
            icon="clock"
            onPress={() => router.push("/timeline" as any)}
            style={homeStyles.quickItem}
          />
        </View>
        <View style={homeStyles.quickRow}>
          <GlassWidget
            title="Services"
            subtitle="Trusted"
            icon="help-circle"
            onPress={() => router.push("/services" as any)}
            style={homeStyles.quickItem}
          />
        </View>
        <View style={homeStyles.quickRow}>
          <GlassWidget
            title="Checklist"
            subtitle="Progress"
            icon="check-circle"
            onPress={() => router.push("/checklist" as any)}
            style={homeStyles.quickItem}
          />
          <GlassWidget
            title="Form Helper"
            subtitle="Guided"
            icon="clipboard"
            onPress={() => router.push("/forms" as any)}
            style={homeStyles.quickItem}
          />
        </View>
        <View style={homeStyles.quickRow}>
          <GlassWidget
            title="Emergency"
            subtitle="Numbers"
            icon="alert-triangle"
            onPress={() => router.push("/emergency" as any)}
            style={homeStyles.quickItem}
          />
        </View>
      </GlassCard>
    </Screen>
  );
}
