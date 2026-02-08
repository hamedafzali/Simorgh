import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  category:
    | "cultural"
    | "professional"
    | "educational"
    | "social"
    | "religious";
  language: string;
  maxAttendees?: number;
  currentAttendees: number;
  price?: number;
  imageUrl?: string;
  contactInfo: {
    email: string;
    phone?: string;
  };
  tags: string[];
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Iranian New Year Celebration",
    description:
      "Join us for a traditional Nowruz celebration with music, food, and community gathering.",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    location: "Berlin Cultural Center",
    organizer: "Iranian Community Association",
    category: "cultural",
    language: "Farsi/German/English",
    maxAttendees: 200,
    currentAttendees: 145,
    price: 15,
    contactInfo: {
      email: "events@iranian-berlin.de",
      phone: "+49 30 12345678",
    },
    tags: ["nowruz", "celebration", "culture", "family"],
  },
  {
    id: "2",
    title: "German Language Workshop",
    description:
      "Improve your German language skills with professional instructors and native speakers.",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    location: "Munich Language School",
    organizer: "German Learning Center",
    category: "educational",
    language: "German/English",
    maxAttendees: 30,
    currentAttendees: 22,
    price: 25,
    contactInfo: {
      email: "workshop@german-learning.de",
    },
    tags: ["language", "workshop", "education", "german"],
  },
  {
    id: "3",
    title: "Professional Networking Evening",
    description:
      "Connect with Iranian professionals working in Germany. Share experiences and opportunities.",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    location: "Frankfurt Business Center",
    organizer: "Iranian Professionals Network",
    category: "professional",
    language: "English/Farsi",
    maxAttendees: 50,
    currentAttendees: 28,
    price: 0,
    contactInfo: {
      email: "networking@iranian-pro.de",
    },
    tags: ["networking", "professional", "career", "business"],
  },
  {
    id: "4",
    title: "Persian Cooking Class",
    description:
      "Learn to make authentic Persian dishes with experienced chef Maryam.",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    location: "Hamburg Culinary School",
    organizer: "Cultural Kitchen",
    category: "social",
    language: "Farsi/English",
    maxAttendees: 15,
    currentAttendees: 12,
    price: 45,
    contactInfo: {
      email: "cooking@cultural-kitchen.de",
    },
    tags: ["cooking", "food", "culture", "hands-on"],
  },
];

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const categories = [
    "All",
    "cultural",
    "professional",
    "educational",
    "social",
    "religious",
  ];

  React.useEffect(() => {
    let filtered = mockEvents;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (event) => event.category === selectedCategory
      );
    }

    setFilteredEvents(filtered);
  }, [selectedCategory]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "cultural":
        return theme.success;
      case "professional":
        return theme.accent;
      case "educational":
        return theme.warning;
      case "social":
        return theme.error;
      case "religious":
        return theme.textSecondary;
      default:
        return theme.textSecondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "cultural":
        return "musical-notes-outline";
      case "professional":
        return "briefcase-outline";
      case "educational":
        return "school-outline";
      case "social":
        return "people-outline";
      case "religious":
        return "home-outline";
      default:
        return "calendar-outline";
    }
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isEventFull = (event: Event) => {
    return event.maxAttendees
      ? event.currentAttendees >= event.maxAttendees
      : false;
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={[
        styles.eventCard,
        { backgroundColor: theme.cardBackground, borderColor: theme.border },
      ]}
      onPress={() => setSelectedEvent(item)}
    >
      <View style={styles.eventHeader}>
        <View style={styles.eventInfo}>
          <Text style={[styles.eventTitle, { color: theme.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.eventOrganizer, { color: theme.textSecondary }]}>
            {item.organizer}
          </Text>
        </View>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(item.category) },
          ]}
        >
          <Ionicons
            name={getCategoryIcon(item.category) as any}
            size={16}
            color="#FFFFFF"
          />
        </View>
      </View>

      <View style={styles.eventMeta}>
        <View style={styles.metaItem}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={theme.textSecondary}
          />
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            {formatDate(item.date)}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            {formatTime(item.date)}
          </Text>
        </View>
      </View>

      <View style={styles.eventMeta}>
        <View style={styles.metaItem}>
          <Ionicons
            name="location-outline"
            size={16}
            color={theme.textSecondary}
          />
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            {item.location}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons
            name="people-outline"
            size={16}
            color={theme.textSecondary}
          />
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            {item.currentAttendees}
            {item.maxAttendees && `/${item.maxAttendees}`}
          </Text>
        </View>
      </View>

      <Text
        style={[styles.eventDescription, { color: theme.textSecondary }]}
        numberOfLines={2}
      >
        {item.description}
      </Text>

      <View style={styles.eventFooter}>
        <View style={styles.eventTags}>
          {item.tags.slice(0, 2).map((tag, index) => (
            <Text
              key={index}
              style={[
                styles.eventTag,
                { backgroundColor: theme.border, color: theme.text },
              ]}
            >
              #{tag}
            </Text>
          ))}
        </View>
        {item.price !== undefined && (
          <Text style={[styles.eventPrice, { color: theme.success }]}>
            {item.price === 0 ? "Free" : `€${item.price}`}
          </Text>
        )}
      </View>

      {isEventFull(item) && (
        <View style={styles.fullBadge}>
          <Text style={styles.fullText}>Fully Booked</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (selectedEvent) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.background, paddingTop: insets.top },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.detailHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedEvent(null)}
            >
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.detailTitle, { color: theme.text }]}>
              Event Details
            </Text>
          </View>

          <View
            style={[
              styles.eventDetailCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.detailHeaderSection}>
              <Text style={[styles.detailEventTitle, { color: theme.text }]}>
                {selectedEvent.title}
              </Text>
              <Text
                style={[styles.detailOrganizer, { color: theme.textSecondary }]}
              >
                Organized by {selectedEvent.organizer}
              </Text>
              <View style={styles.detailCategory}>
                <View
                  style={[
                    styles.categoryBadge,
                    {
                      backgroundColor: getCategoryColor(selectedEvent.category),
                    },
                  ]}
                >
                  <Ionicons
                    name={getCategoryIcon(selectedEvent.category) as any}
                    size={16}
                    color="#FFFFFF"
                  />
                </View>
                <Text
                  style={[styles.categoryText, { color: theme.textSecondary }]}
                >
                  {selectedEvent.category.charAt(0).toUpperCase() +
                    selectedEvent.category.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.detailDateLocation}>
              <View style={styles.detailItem}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={theme.accent}
                />
                <Text style={[styles.detailItemText, { color: theme.text }]}>
                  {formatDate(selectedEvent.date)}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={20} color={theme.accent} />
                <Text style={[styles.detailItemText, { color: theme.text }]}>
                  {formatTime(selectedEvent.date)}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={theme.accent}
                />
                <Text style={[styles.detailItemText, { color: theme.text }]}>
                  {selectedEvent.location}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                About This Event
              </Text>
              <Text
                style={[styles.sectionContent, { color: theme.textSecondary }]}
              >
                {selectedEvent.description}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Event Details
              </Text>
              <View style={styles.detailGrid}>
                <View style={styles.detailGridItem}>
                  <Text
                    style={[
                      styles.detailGridLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Language
                  </Text>
                  <Text style={[styles.detailGridValue, { color: theme.text }]}>
                    {selectedEvent.language}
                  </Text>
                </View>
                {selectedEvent.price !== undefined && (
                  <View style={styles.detailGridItem}>
                    <Text
                      style={[
                        styles.detailGridLabel,
                        { color: theme.textSecondary },
                      ]}
                    >
                      Price
                    </Text>
                    <Text
                      style={[styles.detailGridValue, { color: theme.success }]}
                    >
                      {selectedEvent.price === 0
                        ? "Free"
                        : `€${selectedEvent.price}`}
                    </Text>
                  </View>
                )}
                {selectedEvent.maxAttendees && (
                  <View style={styles.detailGridItem}>
                    <Text
                      style={[
                        styles.detailGridLabel,
                        { color: theme.textSecondary },
                      ]}
                    >
                      Attendees
                    </Text>
                    <Text
                      style={[styles.detailGridValue, { color: theme.text }]}
                    >
                      {selectedEvent.currentAttendees}/
                      {selectedEvent.maxAttendees}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Tags
              </Text>
              <View style={styles.tagsContainer}>
                {selectedEvent.tags.map((tag, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.eventTag,
                      { backgroundColor: theme.border, color: theme.text },
                    ]}
                  >
                    #{tag}
                  </Text>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Contact Information
              </Text>
              <TouchableOpacity style={styles.contactItem}>
                <Ionicons name="mail-outline" size={20} color={theme.accent} />
                <Text style={[styles.contactText, { color: theme.accent }]}>
                  {selectedEvent.contactInfo.email}
                </Text>
              </TouchableOpacity>
              {selectedEvent.contactInfo.phone && (
                <TouchableOpacity style={styles.contactItem}>
                  <Ionicons
                    name="call-outline"
                    size={20}
                    color={theme.accent}
                  />
                  <Text style={[styles.contactText, { color: theme.accent }]}>
                    {selectedEvent.contactInfo.phone}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.registerButton,
                {
                  backgroundColor: isEventFull(selectedEvent)
                    ? theme.textSecondary
                    : theme.accent,
                },
              ]}
              disabled={isEventFull(selectedEvent)}
            >
              <Text style={styles.registerButtonText}>
                {isEventFull(selectedEvent)
                  ? "Event Fully Booked"
                  : "Register Now"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: insets.top },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            Community Events
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Connect with the Iranian community in Germany
          </Text>
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === category
                      ? theme.accent
                      : theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Ionicons
                name={getCategoryIcon(category) as any}
                size={16}
                color={
                  selectedCategory === category
                    ? "#FFFFFF"
                    : theme.textSecondary
                }
                style={styles.categoryChipIcon}
              />
              <Text
                style={[
                  styles.categoryChipText,
                  {
                    color:
                      selectedCategory === category ? "#FFFFFF" : theme.text,
                  },
                ]}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Events List */}
        <FlatList
          data={filteredEvents}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          style={styles.eventsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="calendar-outline"
                size={48}
                color={theme.textSecondary}
              />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No events found
              </Text>
            </View>
          }
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryChipIcon: {
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  eventsList: {
    flex: 1,
  },
  eventCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    position: "relative",
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  eventInfo: {
    flex: 1,
    marginRight: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  eventOrganizer: {
    fontSize: 14,
    fontWeight: "400",
  },
  categoryBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  eventMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "400",
    marginLeft: 4,
  },
  eventDescription: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    marginBottom: 12,
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  eventTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  eventTag: {
    fontSize: 10,
    fontWeight: "500",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 2,
  },
  eventPrice: {
    fontSize: 14,
    fontWeight: "600",
  },
  fullBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(220, 53, 69, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  fullText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
  },
  backButton: {
    marginRight: 16,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  eventDetailCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
  },
  detailHeaderSection: {
    marginBottom: 24,
  },
  detailEventTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  detailOrganizer: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 12,
  },
  detailCategory: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  detailDateLocation: {
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailItemText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailGridItem: {
    width: "50%",
    marginBottom: 16,
  },
  detailGridLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  detailGridValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  registerButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 12,
  },
});
