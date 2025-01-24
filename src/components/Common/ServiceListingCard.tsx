import React from "react";
import { useNavigate } from "react-router-dom";
import {motion} from "framer-motion";
import { fadeIn } from "../../variants";
interface ServiceListingCardProps {
  data: {
    _id: string;
    image: string;
    title?: string;
    name?: string;
    discription?: string;
  };
}

const ServiceListingCard: React.FC<ServiceListingCardProps> = ({ data }) => {
  const navigate = useNavigate();
  const handleClick = (_id: string) => {
    console.log("clicked id is ", _id);
    navigate(`/user/service/${_id}`);
  };

  return (
    <motion.div
      onClick={() => handleClick(data._id)}
      className="w-60 bg-white rounded-xl h-96 cursor-pointer  m-4  "
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      whileInView={"show"}
      whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)" }}

    >
      <div className="m-2">
        {data.image ? (
          <img
            className="h-40 object-cover rounded-xl"
            src={data.image}
            alt={data.name} // Added alt text for accessibility
          />
        ) : (
          <img
            className="h-40 object-cover rounded-xl"
            src="/Images/AC service.jpg" // Correct path to the image
            alt="Default service" // Added alt text for fallback image
          />
        )}
      </div>

      <div className="">
        <h3 className="text-xl mb-2 text-center text-black">{data.name}</h3>
        {data.discription && (
          <p className="text-sm p-2 text-center text-gray-900">{data.discription}</p>
        )}
      </div>
    </motion.div>
  );
};

export default ServiceListingCard;
