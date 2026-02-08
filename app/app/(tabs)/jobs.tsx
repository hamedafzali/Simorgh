import React from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { Screen } from "../../components/ui/Screen";
import { ListItem } from "../../components/ui/ListItem";
import { Chevron } from "../../components/ui/Chevron";
import { mockJobs } from "../../services/mock-data";

export default function JobsTab() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Screen>
      <PageHeader
        title="Jobs"
        subtitle="Find opportunities in Germany"
        showBack={true}
        onBackPress={() => router.push("/(tabs)" as any)}
      />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          Jobs list (mock). Next step: wire to backend `GET /api/jobs`.
        </Text>
        <View style={{ height: Spacing.md }} />
        <Button title="Refresh" onPress={() => {}} />
        <View style={{ height: Spacing.sm }} />
        <Button title="Create alert" variant="secondary" onPress={() => {}} />
      </Card>

      {mockJobs.map((job) => (
        <ListItem
          key={job.id}
          title={`${job.title}`}
          subtitle={`${job.company} · ${job.city} · ${job.type} · ${job.level}`}
          onPress={() => router.push(`/job/${job.id}` as any)}
          right={<Chevron />}
        />
      ))}

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.headingM,
            fontWeight: Typography.fontWeight.bold,
            color: palette.textPrimary,
            marginBottom: Spacing.sm,
          }}
        >
          Suggested next steps
        </Text>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          1) Implement backend jobs endpoints.
          {"\n"}2) Add filters (city, category, level).
          {"\n"}3) Add job detail + apply flow.
        </Text>
      </Card>
    </Screen>
  );
}
