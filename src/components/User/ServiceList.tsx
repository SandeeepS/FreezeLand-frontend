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
          console.log(result.data);
          setServices(result?.data.data.services);
        }
      } catch (error) {
        console.log(error as Error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full bg-freeze-color h-screen overflow-hidden ">
      <motion.div
      
        variants={fadeIn("up", 0.1)}
        initial="hidden"
        whileInView={"show"}
        className="flex items-center justify-center pt-6"
      >
        <h1 className="md:text-5xl text-3xl pt-12 pl-6  md:text-left text-center  font-poppins font-semibold text-white">
          OUR SERVICES
        </h1>
      </motion.div>
      <div className=" flex-row m-28 mt-12  cursor-pointer justify-center items-center md:flex">
        {services.map((service) => (
          <>
            <ServiceListingCard data={service} />
          </>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
