import React from "react";
import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { mLogout } from "../../Api/mech";
import { useNavigate } from "react-router-dom";
import { mechLogout } from "../../App/slices/AuthSlice";
import Card from "../Common/HeaderDropDown";
import { CgProfile } from "react-icons/cg";
import { MdContactless } from "react-icons/md";
import { MdEventNote } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";

const MechHeader: React.FC = () => {
  const navigate = useNavigate();
  const [nav, setNav] = useState(true);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const navigateTo = "/mech/login";

  const mechNavigationItems = [
    {
      icon: <CgProfile className="mr-2" />,
      label: "Mechanic Profile",
      path: "/mechanic/profile",
    },
    {
      icon: <MdEventNote className="mr-2" />,
      label: "Service History",
      path: "/mechanic/services",
    },
    // Add more mechanic-specific navigation items
  ];

  const handleNav = () => {
    setNav(!nav);
  };

  const toggleCard = () => {
    setIsCardOpen(!isCardOpen);
  };

  return (
    <>
      <div className="text-white font-bold h-[100px] flex justify-between w-full bg-freeze-color">
        <div className="flex-col">
          <h1 className="w-full text-3xl text-black font-exo p-8 pt-5 pb-0">
            FREEZE <span className="text-white font-exo">LAND</span>
          </h1>
          <h4 className="text-white pl-8">Mechanic Portal</h4>
        </div>
        {/* Desktop Menu */}
        <ul className="p-6 hidden md:flex">
          <li
            className="p-4 cursor-pointer"
            onClick={() => navigate("/mech/homepage")}
          >
            HOME
          </li>

          <li className="p-4 cursor-pointer">SERVICES</li>
          <li
            className="p-4 cursor-pointer"
            onClick={() => navigate("/mech/allWorks")}
          >
            WORKS
          </li>

          <li className="p-2 cursor-pointer">
            <button
              className=" flex w-10 h-10 items-center rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={toggleCard}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/64/64572.png"
                alt="Profile Avatar"
                className="h-10 w-10 rounded-full object-cover"
              />
            </button>

            {/* Card */}
            <div className="">
              <Card
                isOpen={isCardOpen}
                onClose={toggleCard}
                logout={mLogout}
                authLogout={mechLogout}
                navigateTo={navigateTo}
                coverImage="https://example.com/mechanic-cover.jpg"
                profileImage="https://example.com/mechanic-profile.jpg"
                userName="John Doe"
                userRole="Professional Mechanic"
                navigationItems={mechNavigationItems}
              />
            </div>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <div className="p-11 block md:hidden" onClick={handleNav}>
          {!nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={25} />}
        </div>

        {/* Mobile Menu */}
        <div
          className={
            !nav
              ? "fixed left-0 top-0 w-[60%] border-r h-full border-r-gray-900 bg-[#078FDC] ease-in-out duration-500"
              : "fixed left-[-100%]"
          }
        >
          <h1 className="w-full text-3xl text-black font-exo p-10">
            FREEZE <span className="text-white font-exo">LAND</span>
          </h1>
          <ul className="text-black pl-6">
            <li className="p-4 border-b cursor-pointer">HOME</li>
            <li className="p-4 border-b cursor-pointer">ACCOUNT</li>
            <li className="p-4 border-b cursor-pointer">SERVICES</li>
            <li className="p-4 border-b cursor-pointer">CONTACT</li>
            <li className="p-4 border-b cursor-pointer">QUEUE</li>
            {/* Logout Button */}
            <li className="p-4 border-b">
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MechHeader;
