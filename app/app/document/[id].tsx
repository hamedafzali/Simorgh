import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Header } from "../../components/ui/Header";
import { Screen } from "../../components/ui/Screen";
import { mockDocuments } from "../../services/mock-data";

export default function DocumentDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id;

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const doc = useMemo(() => mockDocuments.find((d) => d.id === id), [id]);

  return (
    <Screen>
      <Header title="Document" subtitle={doc ? doc.title : "Not found"} />

      {!doc ? (
        <Card>
          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            Document not found.
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
              {doc.title}
            </Text>
            <Text
              style={{
                fontSize: Typography.sizes.bodySecondary,
                color: palette.textSecondary,
                lineHeight: 22,
              }}
            >
              Category: {doc.category}
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
              Guidance
            </Text>
            <Text
              style={{
                fontSize: Typography.sizes.bodySecondary,
                color: palette.textSecondary,
                lineHeight: 22,
              }}
            >
              {doc.description}
            </Text>
          </Card>

          <Button title="Save (mock)" onPress={() => {}} />
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
