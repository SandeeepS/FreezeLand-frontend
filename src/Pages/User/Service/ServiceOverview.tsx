import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getImageUrl, getService } from "../../../Api/user";
import { ServiceData } from "../../../interfaces/IComponents/User/IUserInterfaces";
import Header from "../../../components/User/Header";

const ServiceOverview: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceData | null>(null);
  const [image, setImage] = useState<string>("");

  // Fetch service data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getService(id as string);
        if (result) {
          setService(result.data);
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };
    fetchData();
  }, [id]);

  // Fetch image after service is loaded
  useEffect(() => {
    const fetchImage = async () => {
      if (service?.imageKey) {
        try {
          const result = await getImageUrl(service.imageKey, "service");
          if (result) {
            setImage(result.data.url);
          }
        } catch (error) {
          console.error("Error fetching image URL:", error);
        }
      }
    };
    fetchImage();
  }, [service]);

  const handleClick = () => {
    if (service?._id) {
      navigate(`/user/service/${service._id}`);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-5xl  rounded-xl p-6 md:p-10">
          {service ? (
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Image Section */}
              <div className="w-full md:w-1/2">
                <img
                  src={image || "https://via.placeholder.com/500"}
                  alt={service.name}
                  className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
                />
              </div>

              {/* Details Section */}
              <div className="w-full md:w-1/2 flex flex-col justify-between">
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
                  onClick={handleClick}
                  className="w-full md:w-auto mt-9 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300"
                >
                  Register Complaint
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Loading service details...
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ServiceOverview;
