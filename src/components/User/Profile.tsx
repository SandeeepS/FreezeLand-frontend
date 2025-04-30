import React, { useEffect, useState } from "react";
import Header from "./Header";
import InfoCard from "../Common/InfoCard";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../App/store";
import { UserDetails } from "../../interfaces/IComponents/Common/ICommonInterfaces";
import { getImageUrl, getProfile } from "../../Api/user";

const Profile: React.FC = () => {
  const userData = useAppSelector((state) => state.auth.userData);

  const [image, setImage] = React.useState<string>("");

  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: "",
    phone: "",
    email: "",
    location: "",
    address: "",
    profile_picture: "",
    defaultAddressDetails: {
      district: "",
      state: "",
      pin: "",
      landMark: "",
    },
  });

  const navigate = useNavigate();

  // useEffect to fetch the userDetails
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("triggered the fetch data function");
        const userId = userData.toString();
        const result = await getProfile(userId);
        console.log("User profile details from the backend is ", result);
        if (result) {
          const data = result.data.data.data;
          setUserDetails({
            ...data,
            defaultAddressDetails: data.defaultAddressDetails || {
              district: "",
              state: "",
              pin: "",
              landMark: "",
            },
          });
        }
      } catch (error) {
        console.log("error occurred while fetching the userDetails", error);
        throw error as Error;
      }
    };

    fetchData();
  }, [userData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userDetails.profile_picture) {
          const result = await getImageUrl(
            userDetails.profile_picture,
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
  }, [userDetails]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="fixed top-0 z-10 w-full">
        <Header />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Profile Header Section */}
        <div className="relative bg-white rounded-lg shadow-md mb-8">
          <div className="h-20 bg-gradient-to-r from-black to-freeze-color rounded-t-lg"></div>

          <div className="flex flex-col md:flex-row items-center md:items-end px-6 relative">
            <div className="absolute -top-16 md:relative md:-top-10 bg-white p-2 rounded-full shadow-lg border-4 border-white">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden">
                <img
                  src={image}
                  alt="/src/Images/businessman.png"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="mt-16 md:mt-0 md:ml-6 pb-6 flex-grow">
              <h1 className="text-2xl font-bold text-gray-800">
                {userDetails.name}
              </h1>
              <p className="text-gray-600">
                {userDetails.location || "Location"}
              </p>
            </div>

            <div className="mb-6 md:mb-0 mt-4 md:mt-0">
              <button
                onClick={() => navigate("/user/editProfile")}
                className="flex items-center px-4 py-2 bg-freeze-color hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Personal Information
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={userDetails.name}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={userDetails.phone}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Contact Information
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={userDetails.email}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={userDetails.location || "Add Location!"}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Default Address
            </h2>
            <button
              onClick={() => navigate("/user/addresses")}
              className="flex items-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              View All Addresses
            </button>
          </div>
          <div>
            <textarea
              value={
                userDetails.defaultAddressDetails
                  ? `                    District: ${
                      userDetails.defaultAddressDetails.district || "N/A"
                    }
                    State: ${userDetails.defaultAddressDetails.state || "N/A"}
                    Pin: ${userDetails.defaultAddressDetails.pin || "N/A"}
                    Landmark: ${
                      userDetails.defaultAddressDetails.landMark || "N/A"
                    }`
                  : "Address is not Added"
              }
              readOnly
              rows={3}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
