import { ImagePicker } from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ErrorHandler } from "../utils/error-handler";

export interface UploadedImage {
  id: string;
  uri: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  documentId?: string;
  userId: string;
  url?: string;
}

export interface ImageUploadOptions {
  allowMultiple?: boolean;
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
  quality?: number; // 0-1
  maxWidth?: number;
  maxHeight?: number;
}

class ImageUploadService {
  private static instance: ImageUploadService;
  private errorHandler: ErrorHandler;
  private uploadQueue: UploadedImage[] = [];

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
  }

  static getInstance(): ImageUploadService {
    if (!ImageUploadService.instance) {
      ImageUploadService.instance = new ImageUploadService();
    }
    return ImageUploadService.instance;
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        const { status: cameraStatus } =
          await ImagePicker.requestCameraPermissionsAsync();
        return cameraStatus === "granted";
      }
      return true;
    } catch (error) {
      console.error("ImageUploadService.requestPermissions error:", error);
      return false;
    }
  }

  async pickImage(options: ImageUploadOptions = {}): Promise<UploadedImage[]> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error("Camera and media library permissions are required");
      }

      const pickerOptions: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: options.allowMultiple || false,
        quality: options.quality || 0.8,
        maxWidth: options.maxWidth || 1024,
        maxHeight: options.maxHeight || 1024,
      };

      const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return [];
      }

      const uploadedImages: UploadedImage[] = [];

      for (const asset of result.assets) {
        if (!asset.uri) continue;

        // Validate file size
        if (
          options.maxFileSize &&
          asset.fileSize &&
          asset.fileSize > options.maxFileSize
        ) {
          console.warn(`Image ${asset.fileName} exceeds maximum file size`);
          continue;
        }

        // Validate file type
        if (
          options.allowedTypes &&
          asset.mimeType &&
          !options.allowedTypes.includes(asset.mimeType)
        ) {
          console.warn(`Image ${asset.fileName} has unsupported type`);
          continue;
        }

        const uploadedImage: UploadedImage = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          type: asset.mimeType || "image/jpeg",
          size: asset.fileSize || 0,
          uploadedAt: new Date(),
          userId: "current-user", // This should come from auth context
        };

        uploadedImages.push(uploadedImage);
      }

      return uploadedImages;
    } catch (error) {
      this.errorHandler.handleNetworkError(
        error,
        "ImageUploadService.pickImage"
      );
      return [];
    }
  }

  async takePhoto(
    options: ImageUploadOptions = {}
  ): Promise<UploadedImage | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error("Camera permission is required");
      }

      const pickerOptions: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: options.quality || 0.8,
        maxWidth: options.maxWidth || 1024,
        maxHeight: options.maxHeight || 1024,
      };

      const result = await ImagePicker.launchCameraAsync(pickerOptions);

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];
      if (!asset.uri) return null;

      // Validate file size
      if (
        options.maxFileSize &&
        asset.fileSize &&
        asset.fileSize > options.maxFileSize
      ) {
        throw new Error("Image exceeds maximum file size");
      }

      const uploadedImage: UploadedImage = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        uri: asset.uri,
        name: asset.fileName || `photo_${Date.now()}.jpg`,
        type: asset.mimeType || "image/jpeg",
        size: asset.fileSize || 0,
        uploadedAt: new Date(),
        userId: "current-user", // This should come from auth context
      };

      return uploadedImage;
    } catch (error) {
      this.errorHandler.handleNetworkError(
        error,
        "ImageUploadService.takePhoto"
      );
      return null;
    }
  }

  async uploadImage(
    image: UploadedImage,
    documentId?: string
  ): Promise<UploadedImage> {
    try {
      // In a real app, this would upload to a server
      // For now, we'll simulate the upload and store locally

      const uploadData = {
        ...image,
        documentId,
        url: `https://api.simorgh-connect.com/uploads/${image.id}`,
      };

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store in upload queue for sync
      this.uploadQueue.push(uploadData);
      await this.saveUploadQueue();

      return uploadData;
    } catch (error) {
      this.errorHandler.handleNetworkError(
        error,
        "ImageUploadService.uploadImage"
      );
      throw error;
    }
  }

  async uploadMultipleImages(
    images: UploadedImage[],
    documentId?: string
  ): Promise<UploadedImage[]> {
    try {
      const uploadPromises = images.map((image) =>
        this.uploadImage(image, documentId)
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      this.errorHandler.handleNetworkError(
        error,
        "ImageUploadService.uploadMultipleImages"
      );
      throw error;
    }
  }

  async deleteImage(imageId: string): Promise<void> {
    try {
      // In a real app, this would delete from the server
      // For now, we'll remove from local storage and queue

      this.uploadQueue = this.uploadQueue.filter((img) => img.id !== imageId);
      await this.saveUploadQueue();
    } catch (error) {
      this.errorHandler.handleNetworkError(
        error,
        "ImageUploadService.deleteImage"
      );
      throw error;
    }
  }

  async getUploadedImages(documentId?: string): Promise<UploadedImage[]> {
    try {
      const images = this.uploadQueue.filter(
        (img) => !documentId || img.documentId === documentId
      );
      return images;
    } catch (error) {
      this.errorHandler.handleNetworkError(
        error,
        "ImageUploadService.getUploadedImages"
      );
      return [];
    }
  }

  async compressImage(
    imageUri: string,
    quality: number = 0.8
  ): Promise<string> {
    try {
      // In a real app, you would use a library like react-native-image-resizer
      // For now, we'll just return the original URI
      return imageUri;
    } catch (error) {
      console.error("ImageUploadService.compressImage error:", error);
      return imageUri;
    }
  }

  async getImageInfo(imageUri: string): Promise<{
    width: number;
    height: number;
    size: number;
    type: string;
  }> {
    try {
      // In a real app, you would get actual image dimensions
      // For now, we'll return mock data
      return {
        width: 1024,
        height: 768,
        size: 1024 * 1024, // 1MB
        type: "image/jpeg",
      };
    } catch (error) {
      console.error("ImageUploadService.getImageInfo error:", error);
      return {
        width: 0,
        height: 0,
        size: 0,
        type: "unknown",
      };
    }
  }

  private async saveUploadQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        "image_upload_queue",
        JSON.stringify(this.uploadQueue)
      );
    } catch (error) {
      console.error("Failed to save upload queue:", error);
    }
  }

  private async loadUploadQueue(): Promise<void> {
    try {
      const queue = await AsyncStorage.getItem("image_upload_queue");
      if (queue) {
        this.uploadQueue = JSON.parse(queue);
      }
    } catch (error) {
      console.error("Failed to load upload queue:", error);
    }
  }

  async syncUploads(): Promise<void> {
    try {
      // In a real app, this would sync pending uploads to the server
      console.log(`Syncing ${this.uploadQueue.length} pending uploads...`);

      // Simulate sync process
      for (const image of this.uploadQueue) {
        if (!image.url) {
          image.url = `https://api.simorgh-connect.com/uploads/${image.id}`;
        }
      }

      await this.saveUploadQueue();
    } catch (error) {
      this.errorHandler.handleNetworkError(
        error,
        "ImageUploadService.syncUploads"
      );
    }
  }

  async clearUploadQueue(): Promise<void> {
    try {
      this.uploadQueue = [];
      await AsyncStorage.removeItem("image_upload_queue");
    } catch (error) {
      this.errorHandler.handleNetworkError(
        error,
        "ImageUploadService.clearUploadQueue"
      );
    }
  }

  getUploadStats(): {
    totalImages: number;
    totalSize: number;
    pendingUploads: number;
  } {
    const totalImages = this.uploadQueue.length;
    const totalSize = this.uploadQueue.reduce((sum, img) => sum + img.size, 0);
    const pendingUploads = this.uploadQueue.filter((img) => !img.url).length;

    return { totalImages, totalSize, pendingUploads };
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  async initialize(): Promise<void> {
    await this.loadUploadQueue();
  }
}

export default ImageUploadService;
