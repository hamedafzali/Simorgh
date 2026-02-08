import React, { useState } from "react";
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

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  category: string;
  description: string;
  requirements: string[];
  salary?: string;
  postedAt: Date;
  deadline?: Date;
  language: string;
  contactEmail: string;
  website?: string;
}

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Software Developer",
    company: "Tech Solutions GmbH",
    location: "Berlin",
    type: "full-time",
    category: "IT/Technology",
    description:
      "We are looking for an experienced software developer to join our growing team.",
    requirements: [
      "3+ years experience",
      "German B1 level",
      "React/Node.js knowledge",
    ],
    salary: "€60,000 - €75,000",
    postedAt: new Date(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    language: "German/English",
    contactEmail: "jobs@techsolutions.de",
    website: "https://techsolutions.de",
  },
  {
    id: "2",
    title: "Marketing Assistant",
    company: "Global Marketing AG",
    location: "Munich",
    type: "part-time",
    category: "Marketing",
    description:
      "Join our marketing team to help promote Iranian-German business connections.",
    requirements: [
      "Marketing experience",
      "German B2 level",
      "Social media skills",
    ],
    salary: "€35,000 - €45,000",
    postedAt: new Date(),
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    language: "German/English/Farsi",
    contactEmail: "hr@globalmarketing.de",
  },
  {
    id: "3",
    title: "Customer Service Representative",
    company: "Service Plus GmbH",
    location: "Frankfurt",
    type: "full-time",
    category: "Customer Service",
    description:
      "Provide excellent customer service in German and English for our diverse client base.",
    requirements: [
      "Customer service experience",
      "German C1 level",
      "Problem-solving skills",
    ],
    salary: "€40,000 - €50,000",
    postedAt: new Date(),
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    language: "German/English",
    contactEmail: "careers@serviceplus.de",
  },
];

export default function JobsScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const categories = [
    "All",
    "IT/Technology",
    "Marketing",
    "Customer Service",
    "Sales",
    "Healthcare",
    "Education",
  ];
  const jobTypes = ["All", "full-time", "part-time", "contract", "internship"];

  React.useEffect(() => {
    let filtered = mockJobs;

    if (searchText) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchText.toLowerCase()) ||
          job.company.toLowerCase().includes(searchText.toLowerCase()) ||
          job.location.toLowerCase().includes(searchText.toLowerCase()) ||
          job.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((job) => job.category === selectedCategory);
    }

    if (selectedType !== "All") {
      filtered = filtered.filter((job) => job.type === selectedType);
    }

    setFilteredJobs(filtered);
  }, [searchText, selectedCategory, selectedType]);

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return theme.success;
      case "part-time":
        return theme.warning;
      case "contract":
        return theme.accent;
      case "internship":
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const renderJobItem = ({ item }: { item: Job }) => (
    <TouchableOpacity
      style={[
        styles.jobCard,
        { backgroundColor: theme.cardBackground, borderColor: theme.border },
      ]}
      onPress={() => setSelectedJob(item)}
    >
      <View style={styles.jobHeader}>
        <View style={styles.jobInfo}>
          <Text style={[styles.jobTitle, { color: theme.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.companyName, { color: theme.textSecondary }]}>
            {item.company}
          </Text>
        </View>
        <View style={styles.jobTypeContainer}>
          <View
            style={[
              styles.jobTypeBadge,
              { backgroundColor: getJobTypeColor(item.type) },
            ]}
          >
            <Text style={styles.jobTypeText}>
              {item.type.replace("-", " ").toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.jobMeta}>
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
            name="briefcase-outline"
            size={16}
            color={theme.textSecondary}
          />
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            {item.category}
          </Text>
        </View>
        {item.salary && (
          <View style={styles.metaItem}>
            <Ionicons
              name="cash-outline"
              size={16}
              color={theme.textSecondary}
            />
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              {item.salary}
            </Text>
          </View>
        )}
      </View>

      <Text
        style={[styles.jobDescription, { color: theme.textSecondary }]}
        numberOfLines={2}
      >
        {item.description}
      </Text>

      <View style={styles.jobFooter}>
        <Text style={[styles.postedDate, { color: theme.textSecondary }]}>
          Posted {formatDate(item.postedAt)}
        </Text>
        <View style={styles.languageContainer}>
          <Text style={[styles.languageText, { color: theme.accent }]}>
            {item.language}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (selectedJob) {
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
              onPress={() => setSelectedJob(null)}
            >
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.detailTitle, { color: theme.text }]}>
              Job Details
            </Text>
          </View>

          <View
            style={[
              styles.jobDetailCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.detailJobTitle, { color: theme.text }]}>
              {selectedJob.title}
            </Text>
            <Text
              style={[styles.detailCompany, { color: theme.textSecondary }]}
            >
              {selectedJob.company}
            </Text>

            <View style={styles.detailMeta}>
              <View style={styles.metaItem}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={theme.textSecondary}
                />
                <Text style={[styles.detailMetaText, { color: theme.text }]}>
                  {selectedJob.location}
                </Text>
              </View>
              <View
                style={[
                  styles.jobTypeBadge,
                  { backgroundColor: getJobTypeColor(selectedJob.type) },
                ]}
              >
                <Text style={styles.jobTypeText}>
                  {selectedJob.type.replace("-", " ").toUpperCase()}
                </Text>
              </View>
            </View>

            {selectedJob.salary && (
              <View style={styles.salaryContainer}>
                <Text
                  style={[styles.salaryLabel, { color: theme.textSecondary }]}
                >
                  Salary Range:
                </Text>
                <Text style={[styles.salaryValue, { color: theme.success }]}>
                  {selectedJob.salary}
                </Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Description
              </Text>
              <Text
                style={[styles.sectionContent, { color: theme.textSecondary }]}
              >
                {selectedJob.description}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Requirements
              </Text>
              {selectedJob.requirements.map((requirement, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={16}
                    color={theme.success}
                  />
                  <Text
                    style={[
                      styles.requirementText,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {requirement}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Language Requirements
              </Text>
              <Text
                style={[styles.sectionContent, { color: theme.textSecondary }]}
              >
                {selectedJob.language}
              </Text>
            </View>

            {selectedJob.deadline && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Application Deadline
                </Text>
                <Text
                  style={[
                    styles.sectionContent,
                    { color: theme.textSecondary },
                  ]}
                >
                  {selectedJob.deadline.toLocaleDateString()}
                </Text>
              </View>
            )}

            <View style={styles.contactSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Contact Information
              </Text>
              <TouchableOpacity style={styles.contactItem}>
                <Ionicons name="mail-outline" size={20} color={theme.accent} />
                <Text style={[styles.contactText, { color: theme.accent }]}>
                  {selectedJob.contactEmail}
                </Text>
              </TouchableOpacity>
              {selectedJob.website && (
                <TouchableOpacity style={styles.contactItem}>
                  <Ionicons
                    name="globe-outline"
                    size={20}
                    color={theme.accent}
                  />
                  <Text style={[styles.contactText, { color: theme.accent }]}>
                    {selectedJob.website}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: theme.accent }]}
            >
              <Text style={styles.applyButtonText}>Apply Now</Text>
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
            Job Opportunities
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Find opportunities for the Iranian community in Germany
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
            placeholder="Search jobs..."
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
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
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
                <Text
                  style={[
                    styles.filterText,
                    {
                      color:
                        selectedCategory === category ? "#FFFFFF" : theme.text,
                    },
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {jobTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      selectedType === type
                        ? theme.accent
                        : theme.cardBackground,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => setSelectedType(type)}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: selectedType === type ? "#FFFFFF" : theme.text,
                    },
                  ]}
                >
                  {type.replace("-", " ").charAt(0).toUpperCase() +
                    type.slice(1).replace("-", " ")}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Jobs List */}
        <FlatList
          data={filteredJobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
          style={styles.jobsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="briefcase-outline"
                size={48}
                color={theme.textSecondary}
              />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No jobs found
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
  jobsList: {
    flex: 1,
  },
  jobCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
    marginRight: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    fontWeight: "400",
  },
  jobTypeContainer: {
    alignItems: "flex-end",
  },
  jobTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  jobTypeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  jobMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
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
  jobDescription: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    marginBottom: 12,
  },
  jobFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  postedDate: {
    fontSize: 12,
    fontWeight: "400",
  },
  languageContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  languageText: {
    fontSize: 10,
    fontWeight: "500",
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
  jobDetailCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
  },
  detailJobTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  detailCompany: {
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 20,
  },
  detailMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  detailMetaText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  salaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    marginBottom: 20,
  },
  salaryLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  salaryValue: {
    fontSize: 18,
    fontWeight: "700",
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
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 16,
    fontWeight: "400",
    marginLeft: 8,
    flex: 1,
  },
  contactSection: {
    marginBottom: 24,
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
  applyButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  applyButtonText: {
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
