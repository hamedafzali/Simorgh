import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/theme-context";

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const onboardingSteps = [
    {
      title: "Welcome to Simorgh",
      description: "Connect with the Afghan community in your area",
    },
    {
      title: "Find Events",
      description: "Discover cultural events and gatherings near you",
    },
    {
      title: "Job Opportunities",
      description: "Explore job postings and career opportunities",
    },
    {
      title: "Learn & Grow",
      description: "Access educational resources and AI tutoring",
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Welcome to Simorgh
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Your Afghan community connection platform
        </Text>

        {onboardingSteps.map((step, index) => (
          <View key={index} style={styles.step}>
            <View
              style={[styles.stepNumber, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>
                {step.title}
              </Text>
              <Text
                style={[styles.stepDescription, { color: colors.textMuted }]}
              >
                {step.description}
              </Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.getStartedButton, { backgroundColor: colors.primary }]}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  stepNumberText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
  },
  getStartedButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  getStartedText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
