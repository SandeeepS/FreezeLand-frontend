import React, { useState, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface RequirementsFormProps {
  formData: {
    name: string;
    discription: string;
    files: File[];
  };
  formErrors: {
    name: string;
    discription: string;
  };
  onFormChange: (field: string, value: string) => void;
  onFileChange: (files: File[]) => void;
}

interface ImagePreview {
  file: File;
  preview: string;
  id: string;
}

const RequirementsForm: React.FC<RequirementsFormProps> = ({
  formData,
  formErrors,
  onFormChange,
  onFileChange,
}) => {
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentCropImage, setCurrentCropImage] = useState<ImagePreview | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Create previews for new files
    const newPreviews: ImagePreview[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${Date.now()}-${Math.random()}`,
    }));

    const updatedPreviews = [...imagePreviews, ...newPreviews];
    setImagePreviews(updatedPreviews);
    
    // Update parent component
    const allFiles = updatedPreviews.map((preview) => preview.file);
    onFileChange(allFiles);
  };

  const handleRemoveImage = (id: string) => {
    const updatedPreviews = imagePreviews.filter((preview) => {
      if (preview.id === id) {
        URL.revokeObjectURL(preview.preview);
        return false;
      }
      return true;
    });
    
    setImagePreviews(updatedPreviews);
    
    // Update parent component
    const allFiles = updatedPreviews.map((preview) => preview.file);
    onFileChange(allFiles);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openCropModal = (imagePreview: ImagePreview) => {
    setCurrentCropImage(imagePreview);
    setCropModalOpen(true);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  const closeCropModal = () => {
    setCropModalOpen(false);
    setCurrentCropImage(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  const getCroppedImg = async (): Promise<File | null> => {
    if (!completedCrop || !imgRef.current || !currentCropImage) {
      return null;
    }

    const canvas = document.createElement("canvas");
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null);
          return;
        }
        const croppedFile = new File([blob], currentCropImage.file.name, {
          type: currentCropImage.file.type,
          lastModified: Date.now(),
        });
        resolve(croppedFile);
      }, currentCropImage.file.type);
    });
  };

  const handleCropSave = async () => {
    if (!currentCropImage) return;

    const croppedFile = await getCroppedImg();
    if (!croppedFile) return;

    // Update the preview with cropped image
    const updatedPreviews = imagePreviews.map((preview) => {
      if (preview.id === currentCropImage.id) {
        URL.revokeObjectURL(preview.preview);
        return {
          ...preview,
          file: croppedFile,
          preview: URL.createObjectURL(croppedFile),
        };
      }
      return preview;
    });

    setImagePreviews(updatedPreviews);
    
    // Update parent component
    const allFiles = updatedPreviews.map((preview) => preview.file);
    onFileChange(allFiles);
    
    closeCropModal();
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.preview);
      });
    };
  }, []);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Full Name*
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onFormChange("name", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your full name"
        />
        {formErrors.name && (
          <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description*
        </label>
        <textarea
          value={formData.discription}
          onChange={(e) => onFormChange("discription", e.target.value)}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe your service requirements in detail..."
        />
        {formErrors.discription && (
          <p className="text-red-500 text-sm mt-1">{formErrors.discription}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Upload Images (Optional)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
        {imagePreviews.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            {imagePreviews.length} file(s) selected
          </p>
        )}

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imagePreviews.map((imagePreview) => (
              <div
                key={imagePreview.id}
                className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all"
              >
                <img
                  src={imagePreview.preview}
                  alt="Preview"
                  className="w-full h-32 object-cover"
                />
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => openCropModal(imagePreview)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                    title="Crop image"
                  >
                    <svg
                      className="w-5 h-5 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
                      />
                    </svg>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(imagePreview.id)}
                    className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    title="Remove image"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                
                {/* File name tooltip */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                  <p className="text-xs text-white truncate" title={imagePreview.file.name}>
                    {imagePreview.file.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Crop Modal */}
      {cropModalOpen && currentCropImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Crop Image
              </h3>
              <button
                onClick={closeCropModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={undefined}
              >
                <img
                  ref={imgRef}
                  src={currentCropImage.preview}
                  alt="Crop preview"
                  className="max-w-full h-auto"
                />
              </ReactCrop>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={closeCropModal}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCropSave}
                disabled={!completedCrop}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequirementsForm;