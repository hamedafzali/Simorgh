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
        subtitle="Guides, events, documents, and local help"
      />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          Germany-first help hub for Iranian newcomers. More countries can be
          added later.
        </Text>
      </Card>

      <ListItem
        title="Guides"
        subtitle="Residency, registration, banking, health"
        onPress={() => router.push("/guides" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Locations"
        subtitle="Find local services and offices"
        onPress={() => router.push("/locations" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="FAQ"
        subtitle="Quick answers to common questions"
        onPress={() => router.push("/faq" as any)}
        right={<Chevron />}
      />

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
      <View style={{ height: Spacing.lg }} />
    </Screen>
  );
}
