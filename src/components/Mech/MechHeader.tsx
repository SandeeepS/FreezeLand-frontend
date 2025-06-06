import React, { useEffect } from "react";
import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { mechLogout } from "../../App/slices/AuthSlice";
import Card from "../Common/HeaderDropDown";
import { CgProfile } from "react-icons/cg";
import { MdEventNote } from "react-icons/md";
import { useAppSelector } from "../../App/store";
import { getImageUrl, getMechanicDetails, mLogout } from "../../Api/mech";
import { MechDetails2 } from "../../interfaces/IComponents/Mechanic/IMechanicInterface";
import toast from "react-hot-toast";
import { FaRegAddressBook } from "react-icons/fa";
const MechHeader: React.FC = () => {
  const mechData = useAppSelector((state) => state.auth.mechData);
  const [mechProfileDetails, setMechProfileDetails] = useState<MechDetails2>();
  const [image, setImage] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const navigate = useNavigate();
  const [nav, setNav] = useState(true);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const navigateTo = "/mech/login";

  const mechNavigationItems = [
    {
      icon: <CgProfile className="mr-2" />,
      label: "Profile",
      path: "/mech/profile",
    },
    {
      icon: <MdEventNote className="mr-2" />,
      label: "Service History",
      path: "/mech/serviceHistory",
    },
    {
      icon: <FaRegAddressBook className="mr-2" />,
      label: "Address",
      path: "/mech/mechAddress",
    },
    // Add more mechanic-specific navigation items
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mechId = mechData?.id;
        const result = await getMechanicDetails(mechId as string);
        console.log("mechDetails in the mechHeader", result);
        setMechProfileDetails(result?.data.result);
        setIsVerified(result?.data?.result.isVerified);
      } catch (error) {
        console.log(
          "error occurred while accessing the mechDetails in the MechHeader.tsx"
        );
        throw error as Error;
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (mechProfileDetails?.photo) {
          const result = await getImageUrl(
            mechProfileDetails.photo,
            "mechanic"
          );
          console.log("imageUrld", result);
          if (result) {
            setImage(result.data.url);
          }
        }
      } catch (error) {
        console.log(error as Error);
      }
    };
    fetchData();
  }, [mechProfileDetails]);

  const handleNavigationClick = (path: string) => {
    if (!isVerified) {
      toast("Complete the Verification first !!");
      return;
    }
    navigate(path);
  };

  const handleMobileNavClick = (action?: () => void) => {
    if (!isVerified) {
      toast("Complete the Verification first !!");
      return;
    }
    if (action) {
      action();
    }
  };

  const handleNav = () => {
    setNav(!nav);
  };

  const toggleCard = () => {
    setIsCardOpen(!isCardOpen);
  };

  return (
    <>
      <div className="text-white font-bold h-[100px] flex justify-between w-full bg-freeze-color ">
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
            onClick={() => handleNavigationClick("/mech/homepage")}
          >
            HOME
          </li>

          <li
            className="p-4 cursor-pointer"
            onClick={() => handleNavigationClick("/mech/allWorks")}
          >
            WORKS
          </li>

          <li
            className="p-4 cursor-pointer"
            onClick={() => handleNavigationClick("/mech/queue")}
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
                  image || "https://cdn-icons-png.flaticon.com/128/64/64572.png"
                }
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
                coverImage={image || "https://example.com/mechanic-cover.jpg"}
                profileImage={
                  image || "https://example.com/mechanic-profile.jpg"
                }
                userName={mechProfileDetails?.name || "Mechanic Name"}
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

          {/* Verification Status in Mobile Menu */}
          {!isVerified && (
            <div className="px-6 mb-4">
              <div className="bg-yellow-500 text-black text-sm px-3 py-2 rounded">
                ⚠️ Account not verified
              </div>
            </div>
          )}

          <ul className="text-black pl-6">
            <li
              className={`p-4 border-b cursor-pointer transition-opacity ${
                !isVerified ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() =>
                handleMobileNavClick(() => navigate("/mech/homepage"))
              }
            >
              HOME
            </li>
            <li
              className={`p-4 border-b cursor-pointer transition-opacity ${
                !isVerified ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() =>
                handleMobileNavClick(() => navigate("/mech/profile"))
              }
            >
              ACCOUNT
            </li>
            <li
              className={`p-4 border-b cursor-pointer transition-opacity ${
                !isVerified ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() =>
                handleMobileNavClick(() => navigate("/mech/allWorks"))
              }
            >
              SERVICES
            </li>
            <li
              className={`p-4 border-b cursor-pointer transition-opacity ${
                !isVerified ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() =>
                handleMobileNavClick(() => navigate("/mech/contact"))
              }
            >
              CONTACT
            </li>
            <li
              className={`p-4 border-b cursor-pointer transition-opacity ${
                !isVerified ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() =>
                handleMobileNavClick(() => navigate("/mech/queue"))
              }
            >
              QUEUE
            </li>
            {/* Logout Button - Always accessible */}
            <li className="p-4 border-b">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                onClick={() => {
                  // Logout functionality - always allow logout
                  mLogout();
                  mechLogout();
                  navigate(navigateTo);
                }}
              >
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
