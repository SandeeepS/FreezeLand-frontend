import React, { useEffect, useState } from "react";
import { getAllServices } from "../../Api/admin";
import { useNavigate } from "react-router-dom";

interface ServiceData {
  _id: string;
  name: string;
  discription: string;
  status: boolean;
  isDeleted: boolean;
  image: string;
}

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<ServiceData[]>([]);
  const navigate = useNavigate();
  // function to fetch all the service data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllServices();
        if (result) {
          console.log(result.data);
          setServices(result?.data.data.services);
          console.log("all services are ", services);
        }
      } catch (error) {
        console.log(error as Error);
      }
    };

    fetchData();
  }, []);

  const handleClick = (_id: string) => {
    console.log("clicked id is ", _id);
    navigate(`/user/service/${_id}`);
  };

  return (
    <div className="w-full bg-white ">
      <h1 className="md:text-5xl text-3xl m-12 ml-36 md:text-left  text-center ">OUR SERVICES</h1>
      <div className=" flex-row m-28   cursor-pointer justify-center items-center md:flex ">
        {services.map((service) => (
          <div
            onClick={() => handleClick(service._id)}
            className="max-w-xs m-4 h-60 rounded overflow-hidden shadow-lg bg-[#078FDC] flex flex-col"
          >
            {service.image ? (
              <img
                className="w-full h-[85%] object-cover"
                src={service.image}
                alt={service.name} // Added alt text for accessibility
              />
            ) : (
              <img
                className="w-full h-[85%] object-cover"
                src="/Images/AC service.jpg" // Correct path to the image
                alt="Default service" // Added alt text for fallback image
              />
            )}

            <div className="flex items-center justify-center mt-auto p-2 bg-[#078FDC]">
              <h3 className="text-xl mb-2 text-center text-white">
                {service.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
