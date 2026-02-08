import React, { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { Screen } from "../../components/ui/Screen";

type Flashcard = {
  id: string;
  front: string;
  back: string;
};

const deck: Flashcard[] = [
  { id: "f1", front: "Danke", back: "Thank you / ممنون" },
  { id: "f2", front: "Bitte", back: "Please / You’re welcome / لطفاً" },
  { id: "f3", front: "Termin", back: "Appointment / وقت" },
];

export default function FlashcardsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [i, setI] = useState(0);
  const [showBack, setShowBack] = useState(false);

  const card = useMemo(() => deck[i % deck.length], [i]);

  function next() {
    setShowBack(false);
    setI((v) => v + 1);
  }

  return (
    <Screen>
      <PageHeader title="Flashcards" subtitle="Spaced repetition scaffold" />

      <Card>
        <Text
          style={{
            fontSize: 24,
            fontWeight: Typography.fontWeight.bold,
            color: palette.textPrimary,
            textAlign: "center",
          }}
        >
          {showBack ? card.back : card.front}
        </Text>

        <View style={{ height: Spacing.lg }} />

        <Button
          title={showBack ? "Next" : "Reveal"}
          onPress={showBack ? next : () => setShowBack(true)}
        />
      </Card>

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          Next step: implement SM-2 scheduling and connect to backend
          flashcards.
        </Text>
      </Card>
    </Screen>
  );
}
