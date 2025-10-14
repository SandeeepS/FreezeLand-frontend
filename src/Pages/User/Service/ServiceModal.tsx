// ServiceModal.tsx
import React, { useEffect, useState } from "react";
import { getImageUrl, getService } from "../../../Api/user";
import { ServiceData } from "../../../interfaces/IComponents/User/IUserInterfaces";
import { X } from "lucide-react";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  onRegisterComplaint: (serviceId: string) => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ 
  isOpen, 
  onClose, 
  serviceId,
  onRegisterComplaint 
}) => {
  const [service, setService] = useState<ServiceData | null>(null);
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Fetch service data
  useEffect(() => {
    if (!isOpen || !serviceId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getService(serviceId);
        if (result) {
          setService(result.data);
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [serviceId, isOpen]);

  // Fetch image after service is loaded
  useEffect(() => {
    if (!service?.imageKey) return;

    const fetchImage = async () => {
      try {
        const result = await getImageUrl(service.imageKey, "service");
        if (result) {
          setImage(result.data.url);
        }
      } catch (error) {
        console.error("Error fetching image URL:", error);
      }
    };
    fetchImage();
  }, [service]);

  const handleRegisterComplaint = () => {
    if (service?._id) {
      onRegisterComplaint(service._id);
      onClose();
    }
  };

  // Close modal on escape key and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <div className="text-center text-gray-500">
              Loading service details...
            </div>
          </div>
        ) : service ? (
          <div className="p-6 md:p-10">
            <div className="flex flex-col  gap-8 items-start">
              {/* Image Section */}
              <div className="w-full ">
                <img
                  src={image || "https://via.placeholder.com/500"}
                  alt={service.name}
                  className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
                />
              </div>

              {/* Details Section */}
              <div className="w-full  flex flex-col justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    {service.name}
                  </h1>
                  <p className="text-gray-600 text-justify mb-4">
                    {service.discription}
                  </p>
                  <p className="text-2xl font-semibold text-green-600 mb-4">
                    ₹ {service.serviceCharge}
                  </p>
                </div>
                <button
                  onClick={handleRegisterComplaint}
                  className="w-full md:w-auto mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300"
                >
                  Register Complaint
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-20">
            <div className="text-center text-gray-500">
              Service not found
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceModal;