import React, { useState } from "react";
import {  FiX } from "react-icons/fi";

// Image Preview Component
interface ImagePreviewProps {
  file: File;
  index: number;
  onRemove: (index: number) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ file, index, onRemove }) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  React.useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="relative group">
      <img
        src={imageUrl}
        alt={`Preview ${index + 1}`}
        className="w-24 h-24 object-cover rounded-lg border border-gray-300"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center gap-2">
     
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
          title="Remove Image"
        >
          <FiX size={16} />
        </button>
      </div>
      <div className="mt-1 text-xs text-gray-600 truncate">
        {file.name}
      </div>
      <div className="text-xs text-gray-500">
        {(file.size / (1024 * 1024)).toFixed(2)} MB
      </div>
    </div>
  );
};

export default ImagePreview;