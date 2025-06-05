import React, { useState, useEffect } from "react";
import { FaCamera, FaTimes } from "react-icons/fa";

interface ImageUploadProfileProps {
  currentImage?: string;
  onImageChange: (file: File | null, fileName: string, fileType: string) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  disabled?: boolean;
  showInstructions?: boolean;
}

const ImageUploadProfile: React.FC<ImageUploadProfileProps> = ({
  currentImage,
  onImageChange,
  size = 'md',
  className = '',
  disabled = false,
  showInstructions = true
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [hasNewImage, setHasNewImage] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Size configurations
  const sizeConfig = {
    sm: { container: 'w-16 h-16', button: 'w-6 h-6', icon: 12, removeIcon: 8 },
    md: { container: 'w-24 h-24', button: 'w-7 h-7', icon: 14, removeIcon: 9 },
    lg: { container: 'w-32 h-32', button: 'w-8 h-8', icon: 14, removeIcon: 10 },
    xl: { container: 'w-40 h-40', button: 'w-10 h-10', icon: 16, removeIcon: 12 }
  };

  const config = sizeConfig[size];

  useEffect(() => {
    if (currentImage && !hasNewImage) {
      setPreviewImage(currentImage);
    }
  }, [currentImage, hasNewImage]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || disabled) return;

    setHasNewImage(true);
    setImageError(false);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Pass file details to parent
    onImageChange(file, file.name, file.type);
  };

  const handleImageRemove = () => {
    if (disabled) return;
    
    setHasNewImage(false);
    setImageError(false);
    
    // Reset to original image or null
    if (currentImage) {
      setPreviewImage(currentImage);
    } else {
      setPreviewImage(null);
    }

    // Notify parent of removal
    onImageChange(null, "", "");
  };

  const getDisplayImage = () => {
    if (previewImage && !imageError) return previewImage;
    return "https://cdn-icons-png.flaticon.com/128/64/64572.png";
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative group">
        {/* Main Profile Image Container */}
        <div className={`${config.container} rounded-full overflow-hidden border-4 border-white bg-white shadow-lg relative`}>
          <img
            className="w-full h-full object-cover transition-all duration-200"
            src={getDisplayImage()}
            onError={() => setImageError(true)}
            alt="Profile"
          />
          
          {/* Overlay for better UX when hovering */}
          {!disabled && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              <FaCamera 
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                size={config.icon} 
              />
            </div>
          )}
        </div>

        {/* Camera Icon for Upload */}
        {!disabled && (
          <div className="absolute bottom-1 right-1">
            <label className={`flex items-center justify-center ${config.button} bg-blue-600 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 text-white`}>
              <FaCamera size={config.icon - 2} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Remove Button - Only show when there's a new uploaded image */}
        {hasNewImage && !disabled && (
          <button
            type="button"
            onClick={handleImageRemove}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105"
            title="Remove uploaded image"
          >
            <FaTimes size={config.removeIcon} />
          </button>
        )}
      </div>

      {/* Image Upload Status */}
      {hasNewImage && (
        <div className="mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
          New image selected
        </div>
      )}

      {/* Upload Instructions */}
      {showInstructions && !disabled && (
        <p className="mt-2 text-xs text-gray-500 text-center max-w-xs">
          Click the camera icon to upload a new profile picture
        </p>
      )}
    </div>
  );
};

export default ImageUploadProfile;