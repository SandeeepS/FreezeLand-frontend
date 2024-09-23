import React, { useState } from "react";
import { RiArrowRightDoubleFill } from "react-icons/ri";

const AdminListing: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("");
  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };
  return (
    <>
        {/* Side Bar */}
        <div className="w-1/4 bg-[#4B4B4B]">
          {/* Heading */}
          <div className="text-center">
            <h1 className="w-full text-2xl text-freeze-color font-exo p-10">
              FREEZE <span className="text-white font-exo">LAND</span>
            </h1>
          </div>

          {/* Profile */}
          <div className="rounded-full overflow-hidden flex justify-center items-center">
            <img
              src="/src/Images/businessman.png"
              alt="User profile picture"
              className="object-cover w-16 h-16"
            />
          </div>
          <h2 className="text-white text-center">Sandeep S</h2>

          {/* Listing */}
          <div className="mx-12 mt-8 space-y-5">
            {[
              { name: "Dashboard", icon: "/src/Images/dashboard.png"},
              { name: "Users", icon: "/src/Images/teamwork.png"},
              { name: "Mechanics", icon: "/src/Images/support.png" },
            ].map((item) => (
              <div
                key={item.name}
                className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer group 
                ${activeItem === item.name ? "bg-gray-600" : ""}
                hover:bg-gray-500`}
                onClick={() => handleItemClick(item.name)}
              >
                <img
                  src={item.icon}
                  alt={`${item.name} Icon`}
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                />
                <h4 className="text-white group-hover:text-gray-300">
                  {item.name}
                </h4>
                <RiArrowRightDoubleFill className="text-white group-hover:text-gray-300" />
              </div>
            ))}
          </div>
        </div>
        {/* Contents
        <div className="w-3/4 bg-[#DFECF8]">
              <div></div>
        </div> */}
    </>
  );
};

export default AdminListing;
