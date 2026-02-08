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
import { germanyEvents } from "../services/germany-data";

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
          Germany-first community events and workshops.
        </Text>
      </Card>

      {germanyEvents.map((e) => (
        <ListItem
          key={e.id}
          title={e.title}
          subtitle={`${e.city} · ${e.date} · ${e.time}`}
          onPress={() => router.push(`/event/${e.id}` as any)}
          right={<Chevron />}
        />
      ))}
    </Screen>
  );
}
