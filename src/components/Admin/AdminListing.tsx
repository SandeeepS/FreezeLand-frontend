import React, { useState } from "react";
import { RiArrowRightDoubleFill } from "react-icons/ri";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { adminLogout } from "../../Api/admin";
import { adLogout } from "../../App/slices/AuthSlice";

const AdminListing: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("");
  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      Swal.fire({
        title: "Logout?",
        text: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Logout",
      }).then((result) => {
        if (result.isConfirmed) {
          adminLogout().then(() => console.log("logout"));
          dispatch(adLogout());
          toast.success("You are logged out!");
          Swal.fire({
            title: "Logged Out!",
            text: "",
            icon: "success",
          });
        }
      });
    } catch (error) {
      console.log(error as Error);
    }
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
            { name: "Dashboard", icon: "/src/Images/dashboard.png" },
            { name: "Users", icon: "/src/Images/teamwork.png" },
            { name: "Mechanics", icon: "/src/Images/support.png" },
          ].map((item) => (
            <div
              key={item.name}
              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer group 
              ${
                activeItem === item.name ? "bg-gray-600" : ""
              } hover:bg-gray-500`}
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

        {/* Logout Button */}
        <div className="flex justify-center items-center mt-12">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminListing;
