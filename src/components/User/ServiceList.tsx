import React, { useEffect, useState } from "react";
import { getAllServices } from "../../Api/user";
import ServiceListingCard from "../Common/ServiceListingCard";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";
import { ServiceData } from "../../interfaces/IComponents/User/IUserInterfaces";

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<ServiceData[]>([]);
  
  // function to fetch all the service data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllServices();
        if (result) {
          console.log("service lists from the backend is ",result.data);
          setServices(result?.data.data.services);
        }
      } catch (error) {
        console.log(error as Error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full bg-freeze-color min-h-screen  overflow-hidden">
      <motion.div
        variants={fadeIn("up", 0.1)}
        initial="hidden"
        whileInView={"show"}
        className="flex items-center justify-center pt-6"
      >
        <h1 className="md:text-5xl text-3xl pt-12 pl-6 md:text-left text-center font-poppins font-semibold text-white">
          OUR SERVICES
        </h1>
      </motion.div>
      
      {/* Updated container with responsive grid and spacing */}
      <div className="px-4 md:px-28 mt-8 md:mt-12 pb-8 md:pb-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 justify-items-center cursor-pointer">
          {services.map((service, index) => (
            <div key={ index} className="w-full max-w-xs">
              <ServiceListingCard data={service} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceList;