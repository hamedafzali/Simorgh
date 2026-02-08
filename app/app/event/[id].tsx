import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Header } from "../../components/ui/Header";
import { Screen } from "../../components/ui/Screen";
import { germanyEvents } from "../../services/germany-data";

export default function EventDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id;

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const event = useMemo(() => germanyEvents.find((e) => e.id === id), [id]);

  return (
    <Screen>
      <Header
        title="Event"
        subtitle={event ? event.title : "Not found"}
        showBack
      />

      {!event ? (
        <Card>
          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            Event not found.
          </Text>
          <View style={{ height: Spacing.md }} />
          <Button
            title="Back"
            variant="secondary"
            onPress={() => router.back()}
          />
        </Card>
      ) : (
        <>
          <Card>
            <Text
              style={{
                fontSize: Typography.sizes.headingM,
                fontWeight: Typography.fontWeight.bold,
                color: palette.textPrimary,
                marginBottom: Spacing.xs,
              }}
            >
              {event.title}
            </Text>
            <Text
              style={{
                fontSize: Typography.sizes.bodySecondary,
                color: palette.textSecondary,
                lineHeight: 22,
              }}
            >
              {event.city} · {event.date} · {event.time}
            </Text>
          </Card>

          <Card>
            <Text
              style={{
                fontSize: Typography.sizes.headingM,
                fontWeight: Typography.fontWeight.bold,
                color: palette.textPrimary,
                marginBottom: Spacing.sm,
              }}
            >
              Details
            </Text>
            <Text
              style={{
                fontSize: Typography.sizes.bodySecondary,
                color: palette.textSecondary,
                lineHeight: 22,
              }}
            >
              {event.description}
            </Text>
            <View style={{ height: Spacing.sm }} />
            <Text
              style={{
                fontSize: Typography.sizes.bodySecondary,
                color: palette.textSecondary,
                lineHeight: 22,
              }}
            >
              Venue: {event.venue}
              {"\n"}Language: {event.language}
              {"\n"}Price: {event.price}
            </Text>
          </Card>

          <Button title="RSVP (mock)" onPress={() => {}} />
          <View style={{ height: Spacing.sm }} />
          <Button
            title="Back"
            variant="secondary"
            onPress={() => router.back()}
          />
        </>
      )}
    </Screen>
  );
}
