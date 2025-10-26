import React, { useState, useRef } from 'react';
import { Upload, X, Trash2, Eye } from 'lucide-react';
import { ImageStorage, StoredImage } from '../utils/imageStorage';

interface ImageUploaderProps {
  category: StoredImage['category'];
  onImageSelect?: (imageUrl: string) => void;
  selectedImage?: string;
  maxImages?: number;
  title?: string;
  description?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  category,
  onImageSelect,
  selectedImage,
  maxImages = 10,
  title = "Upload Images",
  description = "Upload and manage your images"
}) => {
  const [images, setImages] = useState<StoredImage[]>(ImageStorage.getImagesByCategory(category));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = Array.from(files).map(file => 
        ImageStorage.uploadImage(file, category)
      );
      
      const uploadedImages = await Promise.all(uploadPromises);
      const updatedImages = ImageStorage.getImagesByCategory(category);
      setImages(updatedImages);
      
      // Auto-select the first uploaded image if callback provided
      if (onImageSelect && uploadedImages.length > 0) {
        onImageSelect(uploadedImages[0].url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = (imageId: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      ImageStorage.deleteImage(imageId);
      const updatedImages = ImageStorage.getImagesByCategory(category);
      setImages(updatedImages);
      
      // If deleted image was selected, clear selection
      const deletedImage = images.find(img => img.id === imageId);
      if (deletedImage && selectedImage === deletedImage.url && onImageSelect) {
        onImageSelect('');
      }
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    if (onImageSelect) {
      onImageSelect(selectedImage === imageUrl ? '' : imageUrl);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading || images.length >= maxImages}
        />
        
        {uploading ? (
          <div className="space-y-2">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-gray-600">Uploading images...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= maxImages}
                className="text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Click to upload images
              </button>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF, WebP up to 5MB each
              </p>
              <p className="text-xs text-gray-500">
                {images.length}/{maxImages} images uploaded
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Uploaded Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className={`relative group border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                  selectedImage === image.url
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleImageSelect(image.url)}
              >
                <div className="aspect-square">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage(image.url);
                      }}
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image.id);
                      }}
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedImage === image.url && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}

                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                  <p className="text-xs truncate">{image.name}</p>
                  <p className="text-xs text-gray-300">{formatFileSize(image.size)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Storage Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Storage Usage</span>
          <span className="font-medium text-gray-900">
            {ImageStorage.getStorageInfo().formattedSize}
          </span>
        </div>
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-700 hover:text-gray-900 z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;