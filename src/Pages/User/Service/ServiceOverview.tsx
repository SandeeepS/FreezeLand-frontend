import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getImageUrl, getService } from "../../../Api/user";
import { ServiceData } from "../../../interfaces/IComponents/User/IUserInterfaces";

const ServiceOverview: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceData[]>([]);
  const [image, setImage] = React.useState<string>("");

  // function to fetch all the service data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getService(id as string);
        if (result) {
          console.log("service lists from the backend is ", result.data);
          setServices([result?.data]);
        }
      } catch (error) {
        console.log(error as Error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getImageUrl(services[0].imageKey, "service");
        if (result) {
          setImage(result.data.url);
        }
      } catch (error) {
        console.log(error as Error);
      }
    };
    fetchData();
  });

  const handleClick = (_id: string) => {
    console.log("clicked id is ", _id);
    navigate(`/user/service/${_id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 md:p-10">
        {services.length > 0 ? (
          services.map((service) => (
            <div
              key={service._id}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div>
                <img
                  src={image || "https://via.placeholder.com/400"}
                  alt={service.name}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    {service.name}
                  </h2>
                  <p className="text-gray-700 mb-4 text-justify">
                    {service.discription}
                  </p>
                  <p className="text-xl font-semibold text-green-600">
                    ₹ {service.serviceCharge}
                  </p>
                </div>
                <button
                  onClick={() => handleClick(service._id)}
                  className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Register Complaint
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            Loading service details...
          </p>
        )}
      </div>
    </div>
  );
};

export default ServiceOverview;
