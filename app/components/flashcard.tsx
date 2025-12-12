import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

interface FlashcardProps {
  front: string;
  back: string;
  isFlipped?: boolean;
  onFlip?: () => void;
}

export default function Flashcard({
  front,
  back,
  isFlipped = false,
  onFlip,
}: FlashcardProps) {
  const backgroundColor = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "border");

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor, borderColor }]}
      onPress={onFlip}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={[styles.text, { color: textColor }]}>
          {isFlipped ? back : front}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    minHeight: 150,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "500",
  },
});
