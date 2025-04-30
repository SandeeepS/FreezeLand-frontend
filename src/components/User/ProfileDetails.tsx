import React, { useState } from 'react';
import AntarticaImage from "../../Images/Antartica.jpg";
import { userDetails } from '../../interfaces/IComponents/User/IUserInterfaces';




const ProfileDetails: React.FC = () => {
  // Mock data - in real app this would come from props or context
  const [userDetails] = useState<userDetails>({
    name: "John Doe",
    email: "john@example.com",
    phone: 1234567890,
    location: "New York",
    address: "123 Main St, New York, NY 10001"
  });

  // const handleEditProfile = () => {
  //   // In real app this would use proper navigation
  //   console.log('Edit profile clicked');
  // };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="relative">
        <div 
          className="w-full h-64 bg-cover bg-center"
          style={{
            backgroundImage: `url(${AntarticaImage})`,
          }}
        >
          <div className="absolute -bottom-16 right-10">
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
        </div>
      </div>

      <div className="space-y-8 p-10 mt-20">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={userDetails.name}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
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
          <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="text"
                value={userDetails.email}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
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
      </div>
    </div>
  );
};

export default ProfileDetails;