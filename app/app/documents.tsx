import React from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { ListItem } from "../components/ui/ListItem";
import { Screen } from "../components/ui/Screen";
import { Chevron } from "../components/ui/Chevron";
import { mockDocuments } from "../services/mock-data";

export default function DocumentsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Screen>
      <PageHeader title="Documents" subtitle="Forms and guidance" />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          Document guides (mock). Next step: implement real document form flows.
        </Text>
      </Card>

      {mockDocuments.map((d) => (
        <ListItem
          key={d.id}
          title={d.title}
          subtitle={d.category}
          onPress={() => router.push(`/document/${d.id}` as any)}
          right={<Chevron />}
        />
      ))}
    </Screen>
  );
}
