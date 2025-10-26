// Image storage utility for handling file uploads and storage
export interface StoredImage {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
  category: 'logo' | 'gallery' | 'portfolio' | 'blog' | 'general';
}

export class ImageStorage {
  private static readonly STORAGE_KEY = 'uploaded_images';
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  // Convert file to base64 data URL
  static async fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Validate file before upload
  static validateFile(file: File): { valid: boolean; error?: string } {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Please upload JPG, PNG, GIF, or WebP images.' };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: 'File size too large. Maximum size is 5MB.' };
    }

    return { valid: true };
  }

  // Compress image if needed
  static async compressImage(file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataURL = canvas.toDataURL(file.type, quality);
        resolve(compressedDataURL);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // Upload and store image
  static async uploadImage(file: File, category: StoredImage['category'] = 'general'): Promise<StoredImage> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Compress image for better performance
    const dataURL = await this.compressImage(file);

    const storedImage: StoredImage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: dataURL,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      category
    };

    // Save to localStorage
    const existingImages = this.getAllImages();
    const updatedImages = [...existingImages, storedImage];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedImages));

    return storedImage;
  }

  // Get all stored images
  static getAllImages(): StoredImage[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading images:', error);
      return [];
    }
  }

  // Get images by category
  static getImagesByCategory(category: StoredImage['category']): StoredImage[] {
    return this.getAllImages().filter(img => img.category === category);
  }

  // Delete image
  static deleteImage(id: string): boolean {
    try {
      const images = this.getAllImages();
      const updatedImages = images.filter(img => img.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedImages));
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  // Get storage usage
  static getStorageInfo(): { totalImages: number; totalSize: number; formattedSize: string } {
    const images = this.getAllImages();
    const totalSize = images.reduce((sum, img) => sum + img.size, 0);
    
    const formatSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return {
      totalImages: images.length,
      totalSize,
      formattedSize: formatSize(totalSize)
    };
  }
}