import React from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Card } from "../../components/ui/Card";
import { Header } from "../../components/ui/Header";
import { ListItem } from "../../components/ui/ListItem";
import { Screen } from "../../components/ui/Screen";
import { usePreferences } from "../../contexts/PreferencesContext";
import { Chevron } from "../../components/ui/Chevron";

export default function ProfileTab() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { language, direction, setLanguage, setDirection } = usePreferences();

  function cycleLanguage() {
    const next = language === "fa" ? "de" : language === "de" ? "en" : "fa";
    setLanguage(next);
    setDirection(next === "fa" ? "rtl" : "ltr");
  }

  function toggleDirection() {
    setDirection(direction === "rtl" ? "ltr" : "rtl");
  }

  return (
    <Screen>
      <Header title="Profile" subtitle="Settings and learning overview" />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.headingM,
            fontWeight: Typography.fontWeight.bold,
            color: palette.textPrimary,
          }}
        >
          Guest
        </Text>
        <Text
          style={{
            marginTop: Spacing.xs,
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          Authentication is planned but not fully implemented.
        </Text>
      </Card>

      <ListItem
        title="Language"
        subtitle={
          language === "fa"
            ? "فارسی"
            : language === "de"
            ? "Deutsch"
            : "English"
        }
        onPress={cycleLanguage}
        right={<Chevron />}
      />
      <ListItem
        title="Direction"
        subtitle={direction.toUpperCase()}
        onPress={toggleDirection}
        right={<Chevron />}
      />
      <ListItem
        title="Location"
        subtitle="City and local content"
        onPress={() => router.push("/settings" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Notifications"
        subtitle="Study reminders and achievements"
        onPress={() => {}}
        right={<Chevron />}
      />
      <ListItem
        title="Offline storage"
        subtitle="SQLite sync (planned)"
        onPress={() => {}}
        right={<Chevron />}
      />

      <View style={{ height: Spacing.lg }} />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          Next step: persist preferences (AsyncStorage) and connect i18n.
        </Text>
      </Card>
    </Screen>
  );
}
