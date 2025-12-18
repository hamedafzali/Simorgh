import React from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Card } from "../../components/ui/Card";
import { Header } from "../../components/ui/Header";
import { ListItem } from "../../components/ui/ListItem";
import { Screen } from "../../components/ui/Screen";
import { Chevron } from "../../components/ui/Chevron";

export default function CommunityTab() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Screen>
      <Header
        title="Community"
        subtitle="Chat, events, documents, and local information"
      />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          This is a scaffold. The backend has placeholder endpoints for chat and
          jobs.
        </Text>
      </Card>

      <ListItem
        title="Chat"
        subtitle="Ask questions and get help"
        onPress={() => router.push("/chat" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Events"
        subtitle="Workshops, meetups, and community gatherings"
        onPress={() => router.push("/events" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Documents"
        subtitle="Immigration forms and guidance"
        onPress={() => router.push("/documents" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Locations"
        subtitle="Find helpful services near you"
        onPress={() => {}}
        right={<Chevron />}
      />

      <View style={{ height: Spacing.lg }} />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.headingM,
            fontWeight: Typography.fontWeight.bold,
            color: palette.textPrimary,
            marginBottom: Spacing.xs,
          }}
        >
          RTL / LTR
        </Text>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          Next step: hook up i18next and ensure true RTL layout mirroring.
        </Text>
      </Card>
    </Screen>
  );
}
