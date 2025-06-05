import React from "react";
import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { adminLogout } from "../../Api/admin";
import { adLogout } from "../../App/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import Card from "../Common/HeaderDropDown";
import { CgProfile } from "react-icons/cg";
import { MdContactless } from "react-icons/md";
import { MdEventNote } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";

const AdminMainHeader: React.FC = () => {
  const navigate = useNavigate();
  const [nav, setNav] = useState(true);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const navigateTo = "/admin/login";

   const adminNavigationItems = [
      {
        icon: <CgProfile className="mr-2" />,
        label: "Profile",
        path: "/admin/account",
      },
      {
        icon: <MdContactless className="mr-2" />,
        label: "Contact",
        path: "/admin/contact",
      },
      {
        icon: <MdEventNote className="mr-2" />,
        label: "Address",
        path: "/admin/address",
      },
      {
        icon: <IoIosSettings className="mr-2" />,
        label: "Settings",
        path: "/admin/settings",
      },
    ];

  const handleNav = () => {
    setNav(!nav);
  };



  const toggleCard = () => {
    setIsCardOpen(!isCardOpen);
  };

  return (
    <>
      <div className="text-white font-bold h-[110px] flex justify-between w-full z-10 bg-freeze-color">
        <h1 className="w-full text-3xl text-black font-exo p-10">
          FREEZE <span className="text-white font-exo">LAND</span>
        </h1>
        {/* Desktop Menu */}
        <ul className="p-8 hidden md:flex">
          <li
            className="p-4 cursor-pointer"
            onClick={() => navigate("/admin/dashboard")}
          >
            HOME
          </li>

          {/* <li className="p-4 cursor-pointer">SERVICES</li> */}
          {/* <li
            className="p-4 cursor-pointer"
            onClick={() => navigate("/admin/queue")}
          >
            QUEUE
          </li> */}

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
                logout={adminLogout}
                authLogout={adLogout}
                navigateTo={navigateTo}
                coverImage={"https://example.com/user-cover.jpg"}
                profileImage={"https://example.com/user-profile.jpg"}
                userName={"Admin"}
                userRole={"Admin"}
                navigationItems={adminNavigationItems}
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
              ? "fixed left-0 top-0 w-[60%] border-r h-full border-r-gray-900 bg-[#4B4B4B] ease-in-out duration-500"
              : "fixed left-[-100%]"
          }
        >
          <h1 className="w-full text-3xl text-freeze-color font-exo p-10">
            FREEZE <span className="text-white font-exo">LAND</span>
          </h1>
          <ul className="text-white pl-6">
            <li className="p-4 border-b border-black cursor-pointer">HOME</li>
            <li className="p-4 border-b border-black  cursor-pointer">
              ACCOUNT
            </li>
            <li className="p-4 border-b border-black  cursor-pointer">
              DASHBOARD
            </li>
            <li className="p-4 border-b border-black  cursor-pointer">USERS</li>
            <li className="p-4 border-b border-black  cursor-pointer">
              MECHANICS
            </li>
            <li className="p-4 border-b border-black  cursor-pointer">
              DEVICES
            </li>
            <li className="p-4 border-b border-black  cursor-pointer">
              SERVICES
            </li>
            <li className="p-4 border-b border-black  cursor-pointer">
              CONTACT
            </li>
            <li className="p-4 border-b border-black  cursor-pointer">QUEUE</li>
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

export default AdminMainHeader;
