import React, { useState } from "react";
import { FaPowerOff } from "react-icons/fa";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaHistory } from "react-icons/fa";
import { ImAddressBook } from "react-icons/im";
import { GrTasks } from "react-icons/gr";
import { MdOutlineUpdate } from "react-icons/md";

import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { mechLogout } from "../../App/slices/AuthSlice";
import { mechanicLogout } from "../../Api/mech";
import toast from "react-hot-toast";

const SideBar: React.FC = () => {
  const [activeLink, setActiveLink] = useState(0);
  const dispatch = useDispatch();

  const handleLinkClick = (index: number) => {
    setActiveLink(index);
  };

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
          mechanicLogout().then(() => console.log("logout"));
          dispatch(mechLogout());
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

  const SIDEBAR_LINKS = [
    {
      name: "Dashboard",
      icon: MdOutlineSpaceDashboard,
      id: 1,
      path: "",
    },
    {
      name: "Profile",
      icon: CgProfile,
      id: 2,
      path: "/mech/profile",
    },
    {
      name: "Works",
      icon: GrTasks,
      id: 3,
      path: "/mech/allWorks",
    },
    {
      name: "Accepted Services",
      icon: MdOutlineUpdate,
      id: 4,
      path: "/mech/queue",
    },
    {
      name: "Service History",
      icon: FaHistory,
      id: 4,
      path: "/mech/serviceHistory",
    },
    {
      name: "Logout",
      icon: () => <FaPowerOff className="w-4 h-4" />,
      id: 8,
      logout: true,
    },
  ];

  return (
    <>
      {/* Side Bar */}
      <div className="w-20 md:w-56  mt-24 fixed text-white left-0  h-screen border-r bg-[#4B4B4B]">
        {/* Profile */}
        {/* <div className="flex justify-center items-center mt-4 md:mt-8">
          <div className="rounded-full overflow-hidden w-10 h-10 md:w-16 md:h-16">
            <img
              src="/Images/businessman.png"
              alt="User profile picture"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <h2 className="text-white text-center text-sm md:text-base mt-2 md:mt-4">
          Sandeep S
        </h2> */}

        {/* Listing */}
        <div className="  mt-16 ">
          <ul className="space-y-4 md:space-y-6 w-full">
            {SIDEBAR_LINKS.map((link, index) => (
              <li
                key={index}
                className={`font-medium w-full md:pl-8 h-8 pt-1 hover:bg-freeze-color ${
                  link.logout ? "hover:bg-red-600" : "hover:bg-freeze-color"
                } hover:text-white transition-all duration-300 ${
                  activeLink === index && !link.logout
                    ? "text-freeze-color"
                    : ""
                }`}
              >
                {link.logout ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center md:justify-start md:space-x-5 w-full h-full text-left "
                  >
                    <span>{link.icon()}</span>
                    <span className="hidden md:inline text-sm md:text-base ml-2">
                      {link.name}
                    </span>
                  </button>
                ) : (
                  <Link
                    to={link.path as string}
                    className="flex items-center justify-center md:justify-start md:space-x-5 "
                    onClick={() => handleLinkClick(index)}
                  >
                    <span>{link.icon({})}</span>
                    <span className="hidden md:inline text-sm md:text-base">
                      {link.name}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Logout Button */}
      </div>
    </>
  );
};

export default SideBar;
