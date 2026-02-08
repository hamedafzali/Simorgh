import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import ImageUpload from "../../components/ImageUpload";
import { UploadedImage } from "../../services/image-upload-service";

// Type assertion for Ionicons to fix TypeScript errors
const Icon = Ionicons as any;

// Type assertions to fix React Native component JSX errors
const RNScrollView = ScrollView as any;
const RNView = View as any;
const RNText = Text as any;
const RNTouchableOpacity = TouchableOpacity as any;
const RNFlatList = FlatList as any;
const RNImage = Image as any;

interface Document {
  id: string;
  title: string;
  description: string;
  category:
    | "immigration"
    | "legal"
    | "education"
    | "health"
    | "employment"
    | "housing"
    | "finance";
  type: "pdf" | "doc" | "link" | "form";
  language: string;
  size?: string;
  url?: string;
  downloadUrl?: string;
  uploadedAt: Date;
  uploadedBy: string;
  tags: string[];
  isRequired?: boolean;
  priority: "low" | "medium" | "high";
  images?: UploadedImage[];
}

const mockDocuments: Document[] = [
  {
    id: "1",
    title: "German Residence Permit Application",
    description:
      "Complete guide and forms for applying for German residence permit (Aufenthaltserlaubnis)",
    category: "immigration",
    type: "form",
    language: "German/English",
    size: "2.4 MB",
    downloadUrl: "https://example.com/residence-permit.pdf",
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    uploadedBy: "Immigration Office",
    tags: ["residence", "permit", "immigration", "official"],
    isRequired: true,
    priority: "high",
  },
  {
    id: "2",
    title: "German Language Course Enrollment",
    description:
      "Information about German language courses and enrollment forms for integration courses",
    category: "education",
    type: "pdf",
    language: "German/Farsi/English",
    size: "1.8 MB",
    downloadUrl: "https://example.com/language-course.pdf",
    uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    uploadedBy: "Language Center",
    tags: ["language", "course", "integration", "education"],
    isRequired: false,
    priority: "medium",
  },
  {
    id: "3",
    title: "Health Insurance Guide",
    description:
      "Comprehensive guide to German health insurance system for immigrants",
    category: "health",
    type: "pdf",
    language: "German/English",
    size: "3.2 MB",
    downloadUrl: "https://example.com/health-insurance.pdf",
    uploadedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    uploadedBy: "Health Authority",
    tags: ["health", "insurance", "medical", "guide"],
    isRequired: true,
    priority: "high",
  },
  {
    id: "4",
    title: "Job Application Template",
    description:
      "Professional German CV and cover letter templates for job applications",
    category: "employment",
    type: "doc",
    language: "German/English",
    size: "856 KB",
    downloadUrl: "https://example.com/job-template.docx",
    uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    uploadedBy: "Employment Agency",
    tags: ["job", "cv", "resume", "template"],
    isRequired: false,
    priority: "medium",
  },
  {
    id: "5",
    title: "Rental Agreement Guide",
    description: "Understanding German rental agreements and tenant rights",
    category: "housing",
    type: "link",
    language: "German/English",
    url: "https://example.com/rental-guide",
    uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    uploadedBy: "Housing Authority",
    tags: ["rental", "housing", "agreement", "rights"],
    isRequired: false,
    priority: "low",
  },
];

export default function DocumentsScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredDocuments, setFilteredDocuments] =
    useState<Document[]>(mockDocuments);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  const categories = [
    "All",
    "immigration",
    "legal",
    "education",
    "health",
    "employment",
    "housing",
    "finance",
  ];

  React.useEffect(() => {
    let filtered = mockDocuments;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((doc) => doc.category === selectedCategory);
    }

    setFilteredDocuments(filtered);
  }, [selectedCategory]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "immigration":
        return theme.error;
      case "legal":
        return theme.accent;
      case "education":
        return theme.success;
      case "health":
        return theme.warning;
      case "employment":
        return theme.textSecondary;
      case "housing":
        return theme.text;
      case "finance":
        return theme.primary;
      default:
        return theme.textSecondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "immigration":
        return "card-outline";
      case "legal":
        return "gavel-outline";
      case "education":
        return "school-outline";
      case "health":
        return "medical-outline";
      case "employment":
        return "briefcase-outline";
      case "housing":
        return "home-outline";
      case "finance":
        return "wallet-outline";
      default:
        return "document-outline";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return "document-text-outline";
      case "doc":
        return "document-outline";
      case "link":
        return "link-outline";
      case "form":
        return "create-outline";
      default:
        return "document-outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return theme.error;
      case "medium":
        return theme.warning;
      case "low":
        return theme.success;
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

  const handleDocumentAction = (document: Document) => {
    if (document.type === "link" && document.url) {
      Alert.alert(
        "External Link",
        "This document is available as an external link. Would you like to open it in your browser?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open",
            onPress: () => console.log("Opening URL:", document.url),
          },
        ]
      );
    } else if (document.downloadUrl) {
      Alert.alert(
        "Download Document",
        `Download "${document.title}" (${document.size})?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Download",
            onPress: () => console.log("Downloading:", document.downloadUrl),
          },
        ]
      );
    }
  };

  const renderDocumentItem = ({ item }: { item: Document }) => (
    <RNTouchableOpacity
      style={[
        styles.documentCard,
        { backgroundColor: theme.cardBackground, borderColor: theme.border },
      ]}
      onPress={() => setSelectedDocument(item)}
    >
      <RNView style={styles.documentHeader}>
        <RNView style={styles.documentInfo}>
          <RNView style={styles.documentTitleRow}>
            <RNText style={[styles.documentTitle, { color: theme.text }]}>
              {item.title}
            </RNText>
            {item.isRequired && (
              <RNView
                style={[styles.requiredBadge, { backgroundColor: theme.error }]}
              >
                <RNText style={styles.requiredText}>Required</RNText>
              </RNView>
            )}
          </RNView>
          <RNText
            style={[styles.documentDescription, { color: theme.textSecondary }]}
            numberOfLines={2}
          >
            {item.description}
          </RNText>
        </RNView>
        <RNView style={styles.documentType}>
          <Icon
            name={getTypeIcon(item.type) as any}
            size={24}
            color={getCategoryColor(item.category)}
          />
        </RNView>
      </RNView>

      {item.images && item.images.length > 0 && (
        <RNView style={styles.documentImages}>
          <RNText style={[styles.imagesLabel, { color: theme.textSecondary }]}>
            Attached Images ({item.images.length})
          </RNText>
          <RNScrollView horizontal showsHorizontalScrollIndicator={false}>
            <RNView style={styles.imagesList}>
              {item.images.slice(0, 3).map((image) => (
                <RNView
                  key={image.id}
                  style={[styles.imageThumbnail, { borderColor: theme.border }]}
                >
                  <RNImage
                    source={{ uri: image.uri }}
                    style={styles.thumbnailImage}
                  />
                </RNView>
              ))}
              {item.images.length > 3 && (
                <RNView
                  style={[
                    styles.moreImagesIndicator,
                    { backgroundColor: theme.background },
                  ]}
                >
                  <RNText
                    style={[
                      styles.moreImagesText,
                      { color: theme.textSecondary },
                    ]}
                  >
                    +{item.images.length - 3}
                  </RNText>
                </RNView>
              )}
            </RNView>
          </RNScrollView>
        </RNView>
      )}

      <RNView style={styles.documentMeta}>
        <RNView style={styles.metaItem}>
          <Icon
            name={getCategoryIcon(item.category) as any}
            size={16}
            color={theme.textSecondary}
          />
          <RNText style={[styles.metaText, { color: theme.textSecondary }]}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </RNText>
        </RNView>
        <RNView style={styles.metaItem}>
          <Icon name="flag-outline" size={16} color={theme.textSecondary} />
          <RNText style={[styles.metaText, { color: theme.textSecondary }]}>
            {item.language}
          </RNText>
        </RNView>
        {item.size && (
          <RNView style={styles.metaItem}>
            <Icon name="folder-outline" size={16} color={theme.textSecondary} />
            <RNText style={[styles.metaText, { color: theme.textSecondary }]}>
              {item.size}
            </RNText>
          </RNView>
        )}
      </RNView>

      <RNView style={styles.documentFooter}>
        <RNView style={styles.documentLeft}>
          <RNView
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(item.priority) },
            ]}
          >
            <RNText style={styles.priorityText}>
              {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}{" "}
              Priority
            </RNText>
          </RNView>
          <RNText style={[styles.uploadedDate, { color: theme.textSecondary }]}>
            {formatDate(item.uploadedAt)}
          </RNText>
        </RNView>
        <RNTouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.accent }]}
          onPress={() => handleDocumentAction(item)}
        >
          <Icon
            name={item.type === "link" ? "open-outline" : "download-outline"}
            size={16}
            color="#FFFFFF"
          />
        </RNTouchableOpacity>
      </RNView>

      <RNView style={styles.documentTags}>
        {item.tags.slice(0, 3).map((tag, index) => (
          <RNText
            key={index}
            style={[
              styles.documentTag,
              { backgroundColor: theme.border, color: theme.text },
            ]}
          >
            #{tag}
          </RNText>
        ))}
      </RNView>
    </RNTouchableOpacity>
  );

  if (selectedDocument) {
    return (
      <RNView
        style={[
          styles.container,
          { backgroundColor: theme.background, paddingTop: insets.top },
        ]}
      >
        <RNScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <RNView style={styles.detailHeader}>
            <RNTouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedDocument(null)}
            >
              <Icon name="arrow-back" size={24} color={theme.text} />
            </RNTouchableOpacity>
            <RNText style={[styles.detailTitle, { color: theme.text }]}>
              Document Details
            </RNText>
          </RNView>

          <RNView
            style={[
              styles.documentDetailCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <RNView style={styles.detailHeaderSection}>
              <RNView style={styles.detailTitleRow}>
                <RNText
                  style={[styles.detailDocumentTitle, { color: theme.text }]}
                >
                  {selectedDocument.title}
                </RNText>
                {selectedDocument.isRequired && (
                  <RNView
                    style={[
                      styles.requiredBadge,
                      { backgroundColor: theme.error },
                    ]}
                  >
                    <RNText style={styles.requiredText}>Required</RNText>
                  </RNView>
                )}
              </RNView>
              <RNText
                style={[
                  styles.detailDescription,
                  { color: theme.textSecondary },
                ]}
              >
                {selectedDocument.description}
              </RNText>
            </RNView>

            <RNView style={styles.detailMeta}>
              <RNView style={styles.detailMetaItem}>
                <Icon
                  name={getCategoryIcon(selectedDocument.category) as any}
                  size={20}
                  color={getCategoryColor(selectedDocument.category)}
                />
                <RNText style={[styles.detailMetaText, { color: theme.text }]}>
                  {selectedDocument.category.charAt(0).toUpperCase() +
                    selectedDocument.category.slice(1)}
                </RNText>
              </RNView>
              <RNView style={styles.detailMetaItem}>
                <Icon
                  name={getTypeIcon(selectedDocument.type) as any}
                  size={20}
                  color={theme.accent}
                />
                <RNText style={[styles.detailMetaText, { color: theme.text }]}>
                  {selectedDocument.type.toUpperCase()}
                </RNText>
              </RNView>
              <RNView style={styles.detailMetaItem}>
                <Icon
                  name="flag-outline"
                  size={20}
                  color={theme.textSecondary}
                />
                <RNText style={[styles.detailMetaText, { color: theme.text }]}>
                  {selectedDocument.language}
                </RNText>
              </RNView>
            </RNView>

            <RNView style={styles.section}>
              <RNText style={[styles.sectionTitle, { color: theme.text }]}>
                Document Information
              </RNText>
              <RNView style={styles.infoGrid}>
                {selectedDocument.size && (
                  <RNView style={styles.infoItem}>
                    <RNText
                      style={[styles.infoLabel, { color: theme.textSecondary }]}
                    >
                      File Size
                    </RNText>
                    <RNText style={[styles.infoValue, { color: theme.text }]}>
                      {selectedDocument.size}
                    </RNText>
                  </RNView>
                )}
                <RNView style={styles.infoItem}>
                  <RNText
                    style={[styles.infoLabel, { color: theme.textSecondary }]}
                  >
                    Priority
                  </RNText>
                  <RNView
                    style={[
                      styles.priorityBadge,
                      {
                        backgroundColor: getPriorityColor(
                          selectedDocument.priority
                        ),
                      },
                    ]}
                  >
                    <RNText style={styles.priorityText}>
                      {selectedDocument.priority.charAt(0).toUpperCase() +
                        selectedDocument.priority.slice(1)}
                    </RNText>
                  </RNView>
                </RNView>
                <RNView style={styles.infoItem}>
                  <RNText
                    style={[styles.infoLabel, { color: theme.textSecondary }]}
                  >
                    Uploaded By
                  </RNText>
                  <RNText style={[styles.infoValue, { color: theme.text }]}>
                    {selectedDocument.uploadedBy}
                  </RNText>
                </RNView>
                <RNView style={styles.infoItem}>
                  <RNText
                    style={[styles.infoLabel, { color: theme.textSecondary }]}
                  >
                    Upload Date
                  </RNText>
                  <RNText style={[styles.infoValue, { color: theme.text }]}>
                    {selectedDocument.uploadedAt.toLocaleDateString()}
                  </RNText>
                </RNView>
              </RNView>
            </RNView>

            <RNView style={styles.section}>
              <RNText style={[styles.sectionTitle, { color: theme.text }]}>
                Tags
              </RNText>
              <RNView style={styles.tagsContainer}>
                {selectedDocument.tags.map((tag, index) => (
                  <RNText
                    key={index}
                    style={[
                      styles.documentTag,
                      { backgroundColor: theme.border, color: theme.text },
                    ]}
                  >
                    #{tag}
                  </RNText>
                ))}
              </RNView>
            </RNView>

            <RNTouchableOpacity
              style={[
                styles.actionButtonLarge,
                { backgroundColor: theme.accent },
              ]}
              onPress={() => handleDocumentAction(selectedDocument)}
            >
              <Icon
                name={
                  selectedDocument.type === "link"
                    ? "open-outline"
                    : "download-outline"
                }
                size={20}
                color="#FFFFFF"
                style={styles.actionButtonIcon}
              />
              <RNText style={styles.actionButtonTextLarge}>
                {selectedDocument.type === "link"
                  ? "Open Document"
                  : "Download Document"}
              </RNText>
            </RNTouchableOpacity>
          </RNView>
        </RNScrollView>
      </RNView>
    );
  }

  return (
    <RNView
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: insets.top },
      ]}
    >
      <RNScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <RNView style={styles.header}>
          <RNText style={[styles.title, { color: theme.text }]}>
            Important Documents
          </RNText>
          <RNText style={[styles.subtitle, { color: theme.textSecondary }]}>
            Essential forms and guides for Iranian community in Germany
          </RNText>
        </RNView>

        {/* Category Filters */}
        <RNScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <RNTouchableOpacity
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
              <Icon
                name={getCategoryIcon(category) as any}
                size={16}
                color={
                  selectedCategory === category
                    ? "#FFFFFF"
                    : theme.textSecondary
                }
                style={styles.categoryChipIcon}
              />
              <RNText
                style={[
                  styles.categoryChipText,
                  {
                    color:
                      selectedCategory === category ? "#FFFFFF" : theme.text,
                  },
                ]}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </RNText>
            </RNTouchableOpacity>
          ))}
        </RNScrollView>

        {/* Documents List */}
        <RNFlatList
          data={filteredDocuments}
          renderItem={renderDocumentItem}
          keyExtractor={(item) => item.id}
          style={styles.documentsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <RNView style={styles.emptyContainer}>
              <Icon
                name="folder-outline"
                size={48}
                color={theme.textSecondary}
              />
              <RNText
                style={[styles.emptyText, { color: theme.textSecondary }]}
              >
                No documents found
              </RNText>
            </RNView>
          }
        />
      </RNScrollView>
    </RNView>
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
  documentsList: {
    flex: 1,
  },
  documentCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  documentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  documentInfo: {
    flex: 1,
    marginRight: 12,
  },
  documentTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  requiredBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  requiredText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  documentDescription: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  documentType: {
    alignItems: "flex-end",
  },
  documentMeta: {
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
  documentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  documentLeft: {
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  priorityText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  uploadedDate: {
    fontSize: 12,
    fontWeight: "400",
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  documentTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  documentTag: {
    fontSize: 10,
    fontWeight: "500",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 2,
  },
  documentImages: {
    marginVertical: 12,
  },
  imagesLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
  },
  imagesList: {
    flexDirection: "row",
    gap: 8,
  },
  imageThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  moreImagesIndicator: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  moreImagesText: {
    fontSize: 12,
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
  documentDetailCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
  },
  detailHeaderSection: {
    marginBottom: 24,
  },
  detailTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailDocumentTitle: {
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  detailDescription: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  detailMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  detailMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  detailMetaText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoItem: {
    width: "50%",
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  actionButtonLarge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 16,
  },
  actionButtonIcon: {
    marginRight: 8,
  },
  actionButtonTextLarge: {
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
