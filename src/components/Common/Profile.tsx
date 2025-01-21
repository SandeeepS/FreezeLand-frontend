import React, { useState } from "react";
import Header from "../User/Header";
import InfoCard from "./InfoCard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../App/store";

interface UserDetails {
  name: string;
  email: string;
  phone: number;
  address?: string;
  location?: string;
}

const Profile: React.FC = () => {
  const userData = useSelector((state: RootState) => state.auth.userData);
  console.log("userData form the stroe is ", userData);
  const userId = userData?.id;
  console.log("user id from the stroe is ", userId);
  const navigate = useNavigate();
  // Mock data - in real app this would come from props or context
  const [userDetails] = useState<UserDetails>({
    name: "John Doe",
    email: "john@example.com",
    phone: 1234567890,
    location: "New York",
    address: "123 Main St, New York, NY 10001",
  });

  //impliment useEffect to fetch the userDetails

  // const handleEditProfile = () => {
  //   // In real app this would use proper navigation
  //   console.log('Edit profile clicked');
  // };

  return (
    <div className="flex flex-col  bg-gray-100">
      <div className="fixed top-0 z-10 w-full">
        <Header />
      </div>

      <div className="md:relative flex-col mt-48">
        <div className="md:absolute md:-bottom-16 md:right-10 ">
          <div className="bg-white p-4 rounded-lg shadow-xl">
            <div className="w-32 h-32 mx-auto mb-4">
              <img
                src="/src/Images/businessman.png"
                alt="Profile"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            {/* <button 
                onClick={handleEditProfile} 
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
              >
                Edit Profile
              </button> */}
          </div>
        </div>
        <div className="flex justify-center m-4 space-x-4 md:justify-start md:ml-12">
          <InfoCard />
          <InfoCard />
        </div>
      </div>

      <div className="space-y-8 p-10 mt-20">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                value={userDetails.name}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="number"
                value={userDetails.phone}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="text"
                value={userDetails.email}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                value={userDetails.location || "Add Location!"}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800">Address</h2>
          <textarea
            value={userDetails.address || "Address is not Added"}
            readOnly
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div className="md:flex md:justify-center">
          <button
            className=" w-full md:w-[65%]  bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            onClick={() => navigate("/user/editProfile")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
