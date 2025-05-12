import React, { useState, useEffect } from "react";
import { PreviewImageProps } from "../../interfaces/IComponents/User/IUserInterfaces";

const PreviewImage: React.FC<PreviewImageProps> = ({ file }) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreview(reader.result as string);
    };

    return () => {
      // Clean up to prevent memory leaks
      reader.onload = null;
    };
  }, [file]);

  return (
    <div>
      {preview ? (
        <img src={preview} alt="Preview" className="w-32 h-32" />
      ) : (
        <p>No file selected</p>
      )}
    </div>
  );
};

export default PreviewImage;
