import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { Screen } from "../../components/ui/Screen";
import { germanyJobs } from "../../services/germany-data";

export default function JobDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id;

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const job = useMemo(() => germanyJobs.find((j) => j.id === id), [id]);

  return (
    <Screen>
      <PageHeader title="Job" subtitle={job ? job.title : "Not found"} />

      {!job ? (
        <Card>
          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            Job not found.
          </Text>
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
              {job.title}
            </Text>
            <Text
              style={{
                fontSize: Typography.sizes.bodySecondary,
                color: palette.textSecondary,
                lineHeight: 22,
              }}
            >
              {job.company} · {job.city}
              {"\n"}
              {job.type} · Suggested German level: {job.level}
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
              Description
            </Text>
            <Text
              style={{
                fontSize: Typography.sizes.bodySecondary,
                color: palette.textSecondary,
                lineHeight: 22,
              }}
            >
              {job.description}
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
              Requirements
            </Text>
            {job.requirements.map((req) => (
              <Text
                key={req}
                style={{
                  fontSize: Typography.sizes.bodySecondary,
                  color: palette.textSecondary,
                  lineHeight: 22,
                }}
              >
                • {req}
              </Text>
            ))}
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
              Benefits
            </Text>
            {job.benefits.map((benefit) => (
              <Text
                key={benefit}
                style={{
                  fontSize: Typography.sizes.bodySecondary,
                  color: palette.textSecondary,
                  lineHeight: 22,
                }}
              >
                • {benefit}
              </Text>
            ))}
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
              How to apply
            </Text>
            {job.howToApply.map((step) => (
              <Text
                key={step}
                style={{
                  fontSize: Typography.sizes.bodySecondary,
                  color: palette.textSecondary,
                  lineHeight: 22,
                }}
              >
                • {step}
              </Text>
            ))}
          </Card>

          <Button title="Apply (mock)" onPress={() => {}} />
        </>
      )}
    </Screen>
  );
}
