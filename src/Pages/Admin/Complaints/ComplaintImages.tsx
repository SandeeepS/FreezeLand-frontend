import { useEffect, useState } from "react";
import { getImageUrl } from "../../../Api/admin";

interface ComplaintImagesProps {
  images: string[];
}

const ComplaintImages = ({ images }: ComplaintImagesProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  console.log("images are in the complaintImages component", images);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (images.length) {
          const result = await getImageUrl(images[0], "complaint images");
          console.log("result reached in the frontend", result);
          setSelectedImage(result?.data?.data?.images);
        } else {
          return;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [images]);
  if (!images || images.length === 0) return null;

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-3 mb-4">
        Complaint Images
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="cursor-pointer rounded-lg overflow-hidden bg-gray-100 aspect-square"
            onClick={() => handleImageClick(image)}
          >
            {selectedImage !== null ? (
              <img
                src={selectedImage}
                alt={`Complaint image ${index + 1}`}
                className="w-full h-full object-cover hover:opacity-90 transition"
              />
            ) : (
              <img
                src={image}
                alt={`Complaint image ${index + 1}`}
                className="w-full h-full object-cover hover:opacity-90 transition"
              />
            )}
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Enlarged complaint image"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition"
              onClick={closeModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
        </div>
      )}
    </div>
  );
};

export default ComplaintImages;
