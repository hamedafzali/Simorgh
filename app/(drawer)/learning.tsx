import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AudioPronunciation from "../../components/AudioPronunciation";

interface Word {
  id: string;
  german: string;
  english: string;
  farsi: string;
  article?: string;
  wordType: string;
  level: string;
  pronunciation?: string;
  definition?: string;
  example?: string;
}

const mockWords: Word[] = [
  {
    id: "1",
    german: "das Haus",
    english: "house",
    farsi: "خانه",
    article: "das",
    wordType: "noun",
    level: "A1",
    pronunciation: "/haʊs/",
    definition: "A building for human habitation",
    example: "Ich wohne in einem großen Haus.",
  },
  {
    id: "2",
    german: "gehen",
    english: "to go",
    farsi: "رفتن",
    wordType: "verb",
    level: "A1",
    pronunciation: "/ˈɡeːən/",
    definition: "To move or travel",
    example: "Ich gehe zur Schule.",
  },
  {
    id: "3",
    german: "schön",
    english: "beautiful",
    farsi: "زیبا",
    wordType: "adjective",
    level: "A1",
    pronunciation: "/ʃøːn/",
    definition: "Pleasing to the senses or mind",
    example: "Das Wetter ist heute schön.",
  },
];

export default function LearningScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [searchText, setSearchText] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedWordType, setSelectedWordType] = useState("All");
  const [filteredWords, setFilteredWords] = useState<Word[]>(mockWords);

  const levels = ["All", "A1", "A2", "B1", "B2", "C1", "C2"];
  const wordTypes = [
    "All",
    "noun",
    "verb",
    "adjective",
    "adverb",
    "preposition",
  ];

  useEffect(() => {
    let filtered = mockWords;

    if (searchText) {
      filtered = filtered.filter(
        (word) =>
          word.german.toLowerCase().includes(searchText.toLowerCase()) ||
          word.english.toLowerCase().includes(searchText.toLowerCase()) ||
          word.farsi.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedLevel !== "All") {
      filtered = filtered.filter((word) => word.level === selectedLevel);
    }

    if (selectedWordType !== "All") {
      filtered = filtered.filter((word) => word.wordType === selectedWordType);
    }

    setFilteredWords(filtered);
  }, [searchText, selectedLevel, selectedWordType]);

  const renderWordItem = ({ item }: { item: Word }) => (
    <TouchableOpacity
      style={[
        styles.wordCard,
        { backgroundColor: theme.cardBackground, borderColor: theme.border },
      ]}
      onPress={() => router.push(`/learning/word/${item.id}`)}
    >
      <View style={styles.wordHeader}>
        <View style={styles.wordTitleContainer}>
          <Text style={[styles.germanWord, { color: theme.text }]}>
            {item.article && `${item.article} `}
            {item.german}
          </Text>
          <AudioPronunciation
            word={item.german}
            language="german"
            compact={true}
          />
        </View>
        <View style={styles.wordMeta}>
          <Text style={[styles.wordType, { color: theme.textSecondary }]}>
            {item.wordType}
          </Text>
          <Text style={[styles.wordLevel, { color: theme.accent }]}>
            {item.level}
          </Text>
        </View>
      </View>

      <View style={styles.translations}>
        <Text style={[styles.translation, { color: theme.text }]}>
          {item.english}
        </Text>
        <Text style={[styles.translation, { color: theme.textSecondary }]}>
          {item.farsi}
        </Text>
      </View>

      {item.pronunciation && (
        <Text style={[styles.pronunciation, { color: theme.textSecondary }]}>
          {item.pronunciation}
        </Text>
      )}

      {item.example && (
        <Text style={[styles.example, { color: theme.textSecondary }]}>
          "{item.example}"
        </Text>
      )}
    </TouchableOpacity>
  );

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            German Vocabulary
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Learn and practice German words
          </Text>
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={theme.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search words..."
            placeholderTextColor={theme.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {levels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      selectedLevel === level
                        ? theme.accent
                        : theme.cardBackground,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => setSelectedLevel(level)}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: selectedLevel === level ? "#FFFFFF" : theme.text,
                    },
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {wordTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      selectedWordType === type
                        ? theme.accent
                        : theme.cardBackground,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => setSelectedWordType(type)}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: selectedWordType === type ? "#FFFFFF" : theme.text,
                    },
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Words List */}
        <FlatList
          data={filteredWords}
          renderItem={renderWordItem}
          keyExtractor={(item) => item.id}
          style={styles.wordsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="search-outline"
                size={48}
                color={theme.textSecondary}
              />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No words found
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filterScroll: {
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  wordsList: {
    flex: 1,
  },
  wordCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  wordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  wordTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  germanWord: {
    fontSize: 20,
    fontWeight: "600",
    flex: 1,
  },
  wordMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  wordType: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
    marginRight: 8,
  },
  wordLevel: {
    fontSize: 12,
    fontWeight: "600",
  },
  translations: {
    marginBottom: 8,
  },
  translation: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 2,
  },
  pronunciation: {
    fontSize: 14,
    fontWeight: "400",
    fontStyle: "italic",
    marginBottom: 8,
  },
  example: {
    fontSize: 14,
    fontWeight: "400",
    fontStyle: "italic",
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
