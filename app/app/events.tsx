import React from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Screen } from "../components/ui/Screen";
import { ListItem } from "../components/ui/ListItem";
import { Chevron } from "../components/ui/Chevron";
import { mockEvents } from "../services/mock-data";

export default function EventsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Screen>
      <PageHeader
        title="Events"
        subtitle="Community gatherings and workshops"
      />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          Event list (mock). Next step: wire to backend events service.
        </Text>
      </Card>

      {mockEvents.map((e) => (
        <ListItem
          key={e.id}
          title={e.title}
          subtitle={`${e.city} · ${e.date}`}
          onPress={() => router.push(`/event/${e.id}` as any)}
          right={<Chevron />}
        />
      ))}
    </Screen>
  );
}
