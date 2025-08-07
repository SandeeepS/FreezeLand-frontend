import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";
import { getImageUrl } from "../../Api/user";
import { ServiceListingCardProps } from "../../interfaces/IComponents/Common/ICommonInterfaces";

const ServiceListingCard: React.FC<ServiceListingCardProps> = ({ data }) => {
  const [image, setImage] = React.useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getImageUrl(data.imageKey, "service");
        if (result) {
          setImage(result.data.url);
        }
      } catch (error) {
        console.log(error as Error);
      }
    };
    fetchData();
  });

  const navigate = useNavigate();
  const handleClick = (_id: string) => {
    console.log("clicked id is ", _id);
    navigate(`/user/serviceDetails/${_id}`);
  };

  return (
    <motion.div
      onClick={() => handleClick(data._id)}
      className="w-full xs:w-56 sm:w-60 bg-white rounded-xl  min-h-[22rem]  cursor-pointer m-2 sm:m-4 shadow-md hover:shadow-lg transition-shadow"
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      whileInView={"show"}
      whileHover={{
        scale: 1.03,
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="p-2">
        {image ? (
          <img
            className="w-full h-64 object-cover rounded-t-lg"
            src={image}
            alt={data.name}
          />
        ) : (
          <img
            className="w-full h-40 object-cover rounded-t-lg"
            src="/Images/AC service.jpg"
            alt="Default service"
          />
        )}
      </div>

      <div className="p-2">
        <div className=" flex flex-col items-center">
          <h3 className=" font-exo text-sm sm:text-base font-semibold text-gray-800 mb-2 line-clamp-2">
            {data.name}
          </h3>
        </div>

        {/* Price and button container */}
        <div className="flex flex-col sm:flex-row justify-between  sm:items-center gap-2 ">
          <button className="w-full  px-3 py-2 bg-freeze-color text-white text-xs sm:text-sm rounded hover:bg-blue-700 transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceListingCard;
