import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Card } from "../../components/ui/Card";
import { Header } from "../../components/ui/Header";
import { ListItem } from "../../components/ui/ListItem";
import { Screen } from "../../components/ui/Screen";
import { Chevron } from "../../components/ui/Chevron";
import { usePreferences } from "../../contexts/PreferencesContext";
import { useFeatureFlags } from "../../contexts/FeatureFlagsContext";

export default function ProfileTab() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { language, direction, location } = usePreferences();
  const { featureFlags } = useFeatureFlags();

  const enabledFeatures = useMemo(
    () => Object.entries(featureFlags).filter(([, enabled]) => enabled).length,
    [featureFlags]
  );

  const languageLabel =
    language === "fa" ? "فارسی" : language === "de" ? "Deutsch" : "English";

  return (
    <Screen>
      <Header title="Profile" subtitle="Your preferences and rollout status" />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.headingM,
            fontWeight: Typography.fontWeight.bold,
            color: palette.textPrimary,
          }}
        >
          Simorgh account
        </Text>
        <Text
          style={{
            marginTop: Spacing.xs,
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          This MVP currently runs in guest mode. Preferences, rollout flags, and offline content stay available locally.
        </Text>
      </Card>

      <ListItem
        title="Settings"
        subtitle="Language, location, sync, and enabled features"
        onPress={() => router.push("/settings" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Language"
        subtitle={languageLabel}
        onPress={() => router.push("/settings" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Direction"
        subtitle={direction.toUpperCase()}
        onPress={() => router.push("/settings" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Location"
        subtitle={location?.city ? `${location.city}${location.state ? `, ${location.state}` : ""}` : "Set your city in Settings"}
        onPress={() => router.push("/settings" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Enabled features"
        subtitle={`${enabledFeatures} features currently enabled from backend sync`}
        onPress={() => router.push("/settings" as any)}
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
          Use Settings as the main control panel. Profile is now a quick overview of your current app state.
        </Text>
      </Card>
    </Screen>
  );
}
