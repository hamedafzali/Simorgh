import { useState, useEffect, useCallback } from "react";
import ImageUploadService, {
  UploadedImage,
  ImageUploadOptions,
} from "../services/image-upload-service";

export interface UseImageUploadReturn {
  pickImage: (options?: ImageUploadOptions) => Promise<UploadedImage[]>;
  takePhoto: (options?: ImageUploadOptions) => Promise<UploadedImage | null>;
  uploadImage: (
    image: UploadedImage,
    documentId?: string
  ) => Promise<UploadedImage>;
  uploadMultipleImages: (
    images: UploadedImage[],
    documentId?: string
  ) => Promise<UploadedImage[]>;
  deleteImage: (imageId: string) => Promise<void>;
  getUploadedImages: (documentId?: string) => Promise<UploadedImage[]>;
  compressImage: (imageUri: string, quality?: number) => Promise<string>;
  getImageInfo: (
    imageUri: string
  ) => Promise<{ width: number; height: number; size: number; type: string }>;
  syncUploads: () => Promise<void>;
  clearUploadQueue: () => Promise<void>;
  isLoading: boolean;
  uploadStats: {
    totalImages: number;
    totalSize: number;
    pendingUploads: number;
  } | null;
  error: string | null;
}

export function useImageUpload(): UseImageUploadReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStats, setUploadStats] = useState<{
    totalImages: number;
    totalSize: number;
    pendingUploads: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const imageUploadService = ImageUploadService.getInstance();

  useEffect(() => {
    const initializeService = async () => {
      setIsLoading(true);
      try {
        await imageUploadService.initialize();
        const stats = imageUploadService.getUploadStats();
        setUploadStats(stats);
      } catch (error) {
        setError("Failed to initialize image upload service");
      } finally {
        setIsLoading(false);
      }
    };

    initializeService();
  }, []);

  const pickImage = useCallback(
    async (options?: ImageUploadOptions): Promise<UploadedImage[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const images = await imageUploadService.pickImage(options);
        const stats = imageUploadService.getUploadStats();
        setUploadStats(stats);
        return images;
      } catch (error) {
        setError("Failed to pick images");
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const takePhoto = useCallback(
    async (options?: ImageUploadOptions): Promise<UploadedImage | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const image = await imageUploadService.takePhoto(options);
        const stats = imageUploadService.getUploadStats();
        setUploadStats(stats);
        return image;
      } catch (error) {
        setError("Failed to take photo");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const uploadImage = useCallback(
    async (
      image: UploadedImage,
      documentId?: string
    ): Promise<UploadedImage> => {
      setIsLoading(true);
      setError(null);

      try {
        const uploadedImage = await imageUploadService.uploadImage(
          image,
          documentId
        );
        const stats = imageUploadService.getUploadStats();
        setUploadStats(stats);
        return uploadedImage;
      } catch (error) {
        setError("Failed to upload image");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const uploadMultipleImages = useCallback(
    async (
      images: UploadedImage[],
      documentId?: string
    ): Promise<UploadedImage[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const uploadedImages = await imageUploadService.uploadMultipleImages(
          images,
          documentId
        );
        const stats = imageUploadService.getUploadStats();
        setUploadStats(stats);
        return uploadedImages;
      } catch (error) {
        setError("Failed to upload images");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteImage = useCallback(async (imageId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await imageUploadService.deleteImage(imageId);
      const stats = imageUploadService.getUploadStats();
      setUploadStats(stats);
    } catch (error) {
      setError("Failed to delete image");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUploadedImages = useCallback(
    async (documentId?: string): Promise<UploadedImage[]> => {
      try {
        return await imageUploadService.getUploadedImages(documentId);
      } catch (error) {
        setError("Failed to get uploaded images");
        return [];
      }
    },
    []
  );

  const compressImage = useCallback(
    async (imageUri: string, quality?: number): Promise<string> => {
      try {
        return await imageUploadService.compressImage(imageUri, quality);
      } catch (error) {
        setError("Failed to compress image");
        return imageUri;
      }
    },
    []
  );

  const getImageInfo = useCallback(
    async (
      imageUri: string
    ): Promise<{
      width: number;
      height: number;
      size: number;
      type: string;
    }> => {
      try {
        return await imageUploadService.getImageInfo(imageUri);
      } catch (error) {
        setError("Failed to get image info");
        return { width: 0, height: 0, size: 0, type: "unknown" };
      }
    },
    []
  );

  const syncUploads = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await imageUploadService.syncUploads();
      const stats = imageUploadService.getUploadStats();
      setUploadStats(stats);
    } catch (error) {
      setError("Failed to sync uploads");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearUploadQueue = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await imageUploadService.clearUploadQueue();
      setUploadStats({ totalImages: 0, totalSize: 0, pendingUploads: 0 });
    } catch (error) {
      setError("Failed to clear upload queue");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    pickImage,
    takePhoto,
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    getUploadedImages,
    compressImage,
    getImageInfo,
    syncUploads,
    clearUploadQueue,
    isLoading,
    uploadStats,
    error,
  };
}
