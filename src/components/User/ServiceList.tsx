import React, { useEffect, useState } from "react";
import { getAllServices } from "../../Api/admin";
import { useNavigate } from "react-router-dom";

interface ServiceData {
  _id: string;
  name: string;
  discription: string;
  status: boolean;
  isDeleted: boolean;
}

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<ServiceData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllServices();
        if (result) {
          console.log(result.data);
          setServices(result?.data.data.services);
          console.log(services);
        }
      } catch (error) {
        console.log(error as Error);
      }
    };

    fetchData();
  }, []);

  const handleClick = (_id:string) => {
      console.log("clicked id is ",_id);
      navigate(`/user/service/${_id}`);

  }

  return (
    <div className="w-full bg-white h-[600px]">
      <h1 className="text-5xl m-12">OUR SERVICES</h1>
      <div className="flex m-12 space-x-10 cursor-pointer">
        {services.map((service) => (
          <div onClick={() => handleClick(service._id)} className="max-w-xs h-64 rounded overflow-hidden shadow-lg bg-[#078FDC]">
            <img
              className="w-full"
              src="/src/Images/AC service.jpg"
              alt="Sunset in the mountains"
            />
            <div className="flex items-center justify-center mt-2">
              <h3 className=" text-xl mb-2 text-center">{service.name}</h3>
            </div>
          </div>
        ))}

     
      </div>
    </div>
  );
};

export default ServiceList;
