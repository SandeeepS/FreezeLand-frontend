import React, { useEffect } from "react";
import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { getImageUrl, getProfile, logout } from "../../Api/user";
import { userLogout } from "../../App/slices/AuthSlice";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "../Common/HeaderDropDown";
import { CgProfile } from "react-icons/cg";
import { MdEventNote, MdPowerSettingsNew } from "react-icons/md";
import { persistor, useAppSelector } from "../../App/store";
import { UserDetailsInProfile } from "../../interfaces/IComponents/Common/ICommonInterfaces";
import { FaHistory } from "react-icons/fa";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const userData = useAppSelector((state) => state.auth.userData);
  const [userProfileDetails, setUserProfileDetails] =
    useState<UserDetailsInProfile>();

  const navigate = useNavigate();
  const location = useLocation();
  const [nav, setNav] = useState(true);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const navigateTo = "/login";

  const userNavigationItems = [
    {
      icon: <CgProfile className="mr-2" />,
      label: "Profile",
      path: "/user/account",
    },
    {
      icon: <MdEventNote className="mr-2" />,
      label: "Address",
      path: "/user/address",
    },
    {
      icon: <FaHistory className="mr-2" />,
      label: "Service History",
      path: "/user/serviceHistory",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = userData?.id;
        const result = await getProfile(userId as string);
        setUserProfileDetails(result?.data.data.data);
      } catch (error) {
        console.log(
          "error occured while accessing the userDeatils in the Header.tsx"
        );
        throw error as Error;
      }
    };
    fetchData();
  }, [userData?.id]);

  const [image, setImage] = React.useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userProfileDetails?.profile_picture) {
          const result = await getImageUrl(
            userProfileDetails.profile_picture,
            "service"
          );
          if (result) {
            setImage(result.data.url);
          }
        }
      } catch (error) {
        console.log(error as Error);
      }
    };
    fetchData();
  }, [userProfileDetails]);

  const handleNav = () => {
    setNav(!nav);
  };

  const toggleCard = () => {
    setIsCardOpen(!isCardOpen);
  };

  const handleServicesClick = () => {
    // Close mobile menu when an item is clicked
    setNav(true);

    if (location.pathname === "/user/homepage") {
      const serviceElement = document.getElementById("serviceList");
      if (serviceElement) {
        serviceElement.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/user/homepage");
      setTimeout(() => {
        const serviceElement = document.getElementById("serviceList");
        if (serviceElement) {
          serviceElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  const handleMobileNavigation = (path: string) => {
    setNav(true); // Close the mobile menu
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };



  const handleLogout = async () => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          logout().then(() => console.log(""));
          dispatch(userLogout());
          persistor.purge();
          toast.success("You are logged out!");
          navigate(navigateTo);
        }
      });
    } catch (error) {
      console.log(error as Error);
    }
  };

  return (
    <>
      <div className="text-white font-bold h-[90px] flex justify-between w-full bg-freeze-color">
        <h1 className="w-full text-3xl text-black font-exo p-6">
          FREEZE <span className="text-white font-exo">LAND</span>
        </h1>
        {/* Desktop Menu */}
        <ul className="p-4 hidden md:flex">
          <li
            className="p-4 cursor-pointer"
            onClick={() => {
              navigate("/user/homepage");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            HOME
          </li>

          <li className="p-4 cursor-pointer" onClick={handleServicesClick}>
            SERVICES
          </li>

          <li
            className="p-4 cursor-pointer"
            onClick={() => navigate("/user/queue")}
          >
            QUEUE
          </li>

          <li className="p-2 cursor-pointer">
            <button
              className=" flex w-10 h-10 items-center rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={toggleCard}
            >
              <img
                src={
                  imageError || !image
                    ? "https://cdn-icons-png.flaticon.com/128/64/64572.png"
                    : image
                }
                alt="User profile"
                className="h-10 w-10 rounded-full object-cover"
                onError={() => setImageError(true)}
              />
            </button>

            {/* Card */}
            <div className="">
              <Card
                isOpen={isCardOpen}
                onClose={toggleCard}
                logout={logout}
                authLogout={userLogout}
                navigateTo={navigateTo}
                coverImage={image || "https://example.com/user-cover.jpg"}
                profileImage={image || "https://example.com/user-profile.jpg"}
                userName={userProfileDetails?.name || "Name"}
                navigationItems={userNavigationItems}
                userRole="user"
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
              ? "fixed left-0 top-0 w-[60%] border-r h-full border-r-gray-900 bg-[#078FDC] ease-in-out duration-500 z-50"
              : "fixed left-[-100%]"
          }
        >
          <h1 className="w-full text-3xl text-black font-exo p-10">
            FREEZE <span className="text-white font-exo">LAND</span>
          </h1>
          <ul className="text-black pl-6">
            <li
              className="p-4 border-b cursor-pointer"
              onClick={() => handleMobileNavigation("/user/homepage")}
            >
              HOME
            </li>
            <li
              className="p-4 border-b cursor-pointer"
              onClick={() => handleMobileNavigation("/user/account")}
            >
              ACCOUNT
            </li>
            <li
              className="p-4 border-b cursor-pointer"
              onClick={handleServicesClick}
            >
              SERVICES
            </li>
            <li
              className="p-4 border-b cursor-pointer"
              onClick={() => handleMobileNavigation("/user/queue")}
            >
              QUEUE
            </li>
                 <li
              className="p-4 border-b cursor-pointer"
              onClick={() => handleMobileNavigation("/user/account")}
            >
              ACCOUNT
            </li>
                 <li
              className="p-4 border-b cursor-pointer"
              onClick={() => handleMobileNavigation("/user/address")}
            >
              ADDRESS
            </li>
                 <li
              className="p-4 border-b cursor-pointer"
              onClick={() => handleMobileNavigation("/user/serviceHistory")}
            >
              SERVICE HISTORY
            </li>
            {/* Logout Button */}
            <li className="p-4 border-b">
              <button
                className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded w-full"
                onClick={handleLogout}
              >
                <MdPowerSettingsNew className="mr-2" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;
