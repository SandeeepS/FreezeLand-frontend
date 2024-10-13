import React, { useState } from "react";
import { RiArrowRightDoubleFill } from "react-icons/ri";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { adminLogout } from "../../Api/admin";
import { adLogout } from "../../App/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { GiMechaHead } from "react-icons/gi";
import { Link } from "react-router-dom";

type MenuItem = {
  id: number;
  name: string;
  icon: string;
  path: string;
};

const AdminListing: React.FC = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<number>(0);
  const handleItemClick = (item: MenuItem) => {
    setActiveItem(item.id);
    navigate(item.path);
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

  const SIDEBAR_LINKS = [
    {
      name: "Dashboard",
      icon: MdOutlineSpaceDashboard,
      id: 1,
      path: "/admin/dashboard",
    },
    { name: "Users", icon: FaUsers, id: 2, path: "/admin/users" },
    { name: "Mechanics", icon: GiMechaHead, id: 3, path: "/admin/mech" },
  ];

  return (
    <>
      {/* Side Bar */}
      <div className="w-16 md:w-56 fixed text-white left-0 top-0 z-10 h-screen border-r bg-[#4B4B4B]">
        {/* Heading */}
        <div className="text-center">
          <h1 className="w-full text-xl md:text-2xl text-freeze-color font-exo p-6 md:p-10">
            FREEZE <span className="text-white font-exo">LAND</span>
          </h1>
        </div>

        {/* Profile */}
        <div className="flex justify-center items-center mt-4 md:mt-8">
          <div className="rounded-full overflow-hidden w-10 h-10 md:w-16 md:h-16">
            <img
              src="/src/Images/businessman.png"
              alt="User profile picture"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <h2 className="text-white text-center text-sm md:text-base mt-2 md:mt-4">
          Sandeep S
        </h2>

        {/* Listing */}
        <div className="mx-4 md:mx-12 mt-6 space-y-4 md:space-y-5">
          <ul className="space-y-4 md:space-y-6">
            {SIDEBAR_LINKS.map((link, index) => (
              <li
                key={index}
                className="font-medium rounded-md py-2 hover:bg-freeze-color transition-all duration-300"
              >
                <Link
                  to={link.path}
                  className="flex items-center justify-center md:justify-start md:space-x-5"
                >
                  <span>{link.icon({})}</span>
                  <span className="hidden md:inline text-sm md:text-base">
                    {link.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center items-center mt-10 md:mt-12">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 md:py-2 md:px-4 rounded transition-all duration-300"
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
