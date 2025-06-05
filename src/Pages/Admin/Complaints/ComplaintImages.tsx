import { useEffect, useState } from "react";
import { getImageUrl } from "../../../Api/admin";

interface ComplaintImagesProps {
  images: string[];
}

interface ImageData {
  original: string;
  url: string;
  loading: boolean;
  error: boolean;
}

const ComplaintImages = ({ images }: ComplaintImagesProps) => {
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  console.log("images are in the complaintImages component", images);

  useEffect(() => {
    const fetchAllImages = async () => {
      if (!images || images.length === 0) return;

      // Initialize image data with loading states
      const initialImageData: ImageData[] = images.map(img => ({
        original: img,
        url: '',
        loading: true,
        error: false
      }));
      
      setImageData(initialImageData);

      // Fetch URLs for all images
      const promises = images.map(async (image, index) => {
        try {
          const result = await getImageUrl(image, "complaint images");
          const imageUrl = result?.data?.data?.images;
          
          return {
            original: image,
            url: imageUrl || image, // fallback to original if URL fetch fails
            loading: false,
            error: !imageUrl
          };
        } catch (error) {
          console.error(`Error fetching image ${index}:`, error);
          return {
            original: image,
            url: image, // fallback to original
            loading: false,
            error: true
          };
        }
      });

      try {
        const results = await Promise.all(promises);
        setImageData(results);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchAllImages();
  }, [images]);

  if (!images || images.length === 0) return null;

  const handleImageClick = (imageUrl: string, index: number) => {
    setSelectedImage(imageUrl);
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : imageData.length - 1;
      setSelectedIndex(prevIndex);
      setSelectedImage(imageData[prevIndex]?.url);
    } else {
      const nextIndex = selectedIndex < imageData.length - 1 ? selectedIndex + 1 : 0;
      setSelectedIndex(nextIndex);
      setSelectedImage(imageData[nextIndex]?.url);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-800">
          Complaint Images
        </h3>
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          {images.length} image{images.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {imageData.map((imageItem, index) => (
          <div
            key={index}
            className="relative cursor-pointer rounded-lg overflow-hidden bg-slate-100 aspect-square group"
            onClick={() => !imageItem.loading && handleImageClick(imageItem.url, index)}
          >
            {imageItem.loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-300 border-t-slate-600"></div>
              </div>
            ) : imageItem.error ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">Failed to load</span>
              </div>
            ) : (
              <>
                <img
                  src={imageItem.url}
                  alt={`Complaint image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to original path if processed URL fails
                    const target = e.target as HTMLImageElement;
                    if (target.src !== imageItem.original) {
                      target.src = imageItem.original;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200"></div>
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {index + 1}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Image Modal with Navigation */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-5xl max-h-full flex items-center justify-center">
            
            {/* Navigation Arrows */}
            {imageData.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-3 transition-all duration-200 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-3 transition-all duration-200 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Main Image */}
            <div
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Enlarged complaint image"
                className="max-w-full max-h-[85vh] object-contain"
              />
              
              {/* Image Counter */}
              {imageData.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                  {selectedIndex + 1} of {imageData.length}
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all duration-200"
              onClick={closeModal}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintImages;