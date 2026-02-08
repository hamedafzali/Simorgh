import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/use-theme";
import { useImageUpload } from "../hooks/use-image-upload";
import { UploadedImage } from "../services/image-upload-service";

interface ImageUploadProps {
  onImagesSelected?: (images: UploadedImage[]) => void;
  onImageUploaded?: (image: UploadedImage) => void;
  documentId?: string;
  maxImages?: number;
  showUploadButton?: boolean;
  compact?: boolean;
  allowedTypes?: string[];
  maxFileSize?: number; // in bytes
  quality?: number;
}

export default function ImageUpload({
  onImagesSelected,
  onImageUploaded,
  documentId,
  maxImages = 5,
  showUploadButton = true,
  compact = false,
  allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  maxFileSize = 5 * 1024 * 1024, // 5MB
  quality = 0.8,
}: ImageUploadProps) {
  const { theme } = useTheme();
  const {
    pickImage,
    takePhoto,
    uploadImage,
    deleteImage,
    isLoading,
    uploadStats,
    error,
  } = useImageUpload();

  const [selectedImages, setSelectedImages] = useState<UploadedImage[]>([]);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(
    new Set()
  );

  const handlePickImages = async () => {
    try {
      const images = await pickImage({
        allowMultiple: true,
        maxFileSize,
        allowedTypes,
        quality,
      });

      if (images.length > 0) {
        const totalImages = selectedImages.length + images.length;
        if (totalImages > maxImages) {
          Alert.alert(
            "Limit Exceeded",
            `You can only upload up to ${maxImages} images.`
          );
          return;
        }

        const newImages = [...selectedImages, ...images];
        setSelectedImages(newImages);
        onImagesSelected?.(newImages);

        // Auto-upload images
        for (const image of images) {
          await handleUploadImage(image);
        }
      }
    } catch (error) {
      console.error("Failed to pick images:", error);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const image = await takePhoto({
        maxFileSize,
        allowedTypes,
        quality,
      });

      if (image) {
        if (selectedImages.length >= maxImages) {
          Alert.alert(
            "Limit Exceeded",
            `You can only upload up to ${maxImages} images.`
          );
          return;
        }

        const newImages = [...selectedImages, image];
        setSelectedImages(newImages);
        onImagesSelected?.(newImages);

        // Auto-upload photo
        await handleUploadImage(image);
      }
    } catch (error) {
      console.error("Failed to take photo:", error);
    }
  };

  const handleUploadImage = async (image: UploadedImage) => {
    setUploadingImages((prev) => new Set(prev).add(image.id));

    try {
      const uploadedImage = await uploadImage(image, documentId);

      // Update the image in the selected images
      setSelectedImages((prev) =>
        prev.map((img) => (img.id === image.id ? uploadedImage : img))
      );

      onImageUploaded?.(uploadedImage);
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setUploadingImages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(image.id);
        return newSet;
      });
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    Alert.alert("Delete Image", "Are you sure you want to delete this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteImage(imageId);
            const newImages = selectedImages.filter(
              (img) => img.id !== imageId
            );
            setSelectedImages(newImages);
            onImagesSelected?.(newImages);
          } catch (error) {
            console.error("Failed to delete image:", error);
          }
        },
      },
    ]);
  };

  const renderCompactView = () => (
    <TouchableOpacity
      style={[
        styles.compactButton,
        { backgroundColor: theme.cardBackground, borderColor: theme.border },
      ]}
      onPress={() => setShowPickerModal(true)}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={theme.accent} />
      ) : (
        <Ionicons name="camera-outline" size={20} color={theme.accent} />
      )}
    </TouchableOpacity>
  );

  const renderFullView = () => (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.cardBackground, borderColor: theme.border },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Images ({selectedImages.length}/{maxImages})
        </Text>
        {showUploadButton && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.accent }]}
            onPress={() => setShowPickerModal(true)}
            disabled={isLoading || selectedImages.length >= maxImages}
          >
            <Ionicons name="add" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {selectedImages.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.imageList}>
            {selectedImages.map((image) => (
              <View
                key={image.id}
                style={[styles.imageContainer, { borderColor: theme.border }]}
              >
                <Image source={{ uri: image.uri }} style={styles.image} />

                {uploadingImages.has(image.id) && (
                  <View style={styles.uploadingOverlay}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  </View>
                )}

                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    { backgroundColor: theme.error },
                  ]}
                  onPress={() => handleDeleteImage(image.id)}
                >
                  <Ionicons name="close" size={12} color="#FFFFFF" />
                </TouchableOpacity>

                <View style={styles.imageInfo}>
                  <Text
                    style={[styles.imageName, { color: theme.text }]}
                    numberOfLines={1}
                  >
                    {image.name}
                  </Text>
                  <Text
                    style={[styles.imageSize, { color: theme.textSecondary }]}
                  >
                    {formatFileSize(image.size)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <TouchableOpacity
          style={[styles.emptyContainer, { backgroundColor: theme.background }]}
          onPress={() => setShowPickerModal(true)}
        >
          <Ionicons
            name="images-outline"
            size={48}
            color={theme.textSecondary}
          />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Tap to add images
          </Text>
        </TouchableOpacity>
      )}

      {error && (
        <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
      )}
    </View>
  );

  const renderPickerModal = () => (
    <Modal
      visible={showPickerModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        style={[styles.modalContainer, { backgroundColor: theme.background }]}
      >
        <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={() => setShowPickerModal(false)}>
            <Ionicons name="close-outline" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            Add Images
          </Text>
          <View style={styles.modalSpacer} />
        </View>

        <View style={styles.modalContent}>
          <TouchableOpacity
            style={[
              styles.pickerOption,
              { backgroundColor: theme.cardBackground },
            ]}
            onPress={() => {
              setShowPickerModal(false);
              handlePickImages();
            }}
          >
            <Ionicons name="images-outline" size={24} color={theme.accent} />
            <View style={styles.pickerOptionContent}>
              <Text style={[styles.pickerOptionTitle, { color: theme.text }]}>
                Choose from Library
              </Text>
              <Text
                style={[
                  styles.pickerOptionSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Select multiple photos from your gallery
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.pickerOption,
              { backgroundColor: theme.cardBackground },
            ]}
            onPress={() => {
              setShowPickerModal(false);
              handleTakePhoto();
            }}
          >
            <Ionicons name="camera-outline" size={24} color={theme.accent} />
            <View style={styles.pickerOptionContent}>
              <Text style={[styles.pickerOptionTitle, { color: theme.text }]}>
                Take Photo
              </Text>
              <Text
                style={[
                  styles.pickerOptionSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Use your camera to take a new photo
              </Text>
            </View>
          </TouchableOpacity>

          <View
            style={[
              styles.infoSection,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={[styles.infoTitle, { color: theme.text }]}>
              Upload Guidelines
            </Text>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              • Maximum {maxImages} images per document
            </Text>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              • Maximum file size: {formatFileSize(maxFileSize)}
            </Text>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              • Supported formats: JPEG, PNG, WebP
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (compact) {
    return (
      <>
        {renderCompactView()}
        {renderPickerModal()}
      </>
    );
  }

  return (
    <>
      {renderFullView()}
      {renderPickerModal()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  imageList: {
    flexDirection: "row",
    gap: 12,
  },
  imageContainer: {
    width: 100,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: 80,
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  imageInfo: {
    padding: 4,
  },
  imageName: {
    fontSize: 10,
    fontWeight: "500",
  },
  imageSize: {
    fontSize: 8,
  },
  emptyContainer: {
    height: 120,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
  },
  compactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalSpacer: {
    width: 24,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  pickerOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  pickerOptionContent: {
    marginLeft: 16,
    flex: 1,
  },
  pickerOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  pickerOptionSubtitle: {
    fontSize: 14,
  },
  infoSection: {
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
});
