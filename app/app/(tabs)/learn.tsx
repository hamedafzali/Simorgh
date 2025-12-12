import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/theme-context";

export default function LearnScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const learnOptions = [
    {
      id: "practice",
      title: "Daily Practice",
      description: "Improve your language skills with daily exercises",
      route: "learn-practice",
    },
    {
      id: "quiz",
      title: "Quiz",
      description: "Test your knowledge with interactive quizzes",
      route: "learn-quiz",
    },
    {
      id: "tutor",
      title: "AI Tutor",
      description: "Get personalized help from our AI tutor",
      route: "learn-tutor",
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>Learn</Text>
      {learnOptions.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.learnCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => router.push(option.route)}
        >
          <Text style={[styles.learnTitle, { color: colors.text }]}>
            {option.title}
          </Text>
          <Text style={[styles.learnDescription, { color: colors.textMuted }]}>
            {option.description}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  learnCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  learnTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  learnDescription: {
    fontSize: 14,
  },
});
