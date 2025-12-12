import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@/contexts/theme-context";

export default function EventsScreen() {
  const { colors } = useTheme();

  const events = [
    {
      id: 1,
      title: "Community Gathering",
      date: "Dec 15, 2024",
      location: "Community Center",
    },
    {
      id: 2,
      title: "Cultural Festival",
      date: "Dec 20, 2024",
      location: "Downtown Park",
    },
    {
      id: 3,
      title: "Language Exchange",
      date: "Dec 22, 2024",
      location: "Library",
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>Events</Text>
      {events.map((event) => (
        <View
          key={event.id}
          style={[
            styles.eventCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.eventTitle, { color: colors.text }]}>
            {event.title}
          </Text>
          <Text style={[styles.eventDate, { color: colors.textMuted }]}>
            {event.date}
          </Text>
          <Text style={[styles.eventLocation, { color: colors.textMuted }]}>
            {event.location}
          </Text>
        </View>
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
  eventCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 14,
  },
});
