import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/theme-context";

export default function JobsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const jobs = [
    {
      id: 1,
      title: "Software Developer",
      company: "Tech Co",
      type: "Full-time",
      location: "Remote",
    },
    {
      id: 2,
      title: "Community Manager",
      company: "Local Org",
      type: "Part-time",
      location: "On-site",
    },
    {
      id: 3,
      title: "Translator",
      company: "Language Services",
      type: "Contract",
      location: "Hybrid",
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>Jobs</Text>
      {jobs.map((job) => (
        <TouchableOpacity
          key={job.id}
          style={[
            styles.jobCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => router.push(`/job/${job.id}`)}
        >
          <Text style={[styles.jobTitle, { color: colors.text }]}>
            {job.title}
          </Text>
          <Text style={[styles.jobCompany, { color: colors.textMuted }]}>
            {job.company}
          </Text>
          <View style={styles.jobMeta}>
            <Text style={[styles.jobType, { color: colors.textMuted }]}>
              {job.type}
            </Text>
            <Text style={[styles.jobLocation, { color: colors.textMuted }]}>
              {job.location}
            </Text>
          </View>
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
  jobCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 14,
    marginBottom: 8,
  },
  jobMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  jobType: {
    fontSize: 12,
  },
  jobLocation: {
    fontSize: 12,
  },
});
