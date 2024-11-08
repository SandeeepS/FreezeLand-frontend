import React, { useEffect, useState } from "react";
import Header from "../../components/User/Header";
import { useParams } from "react-router-dom";
import { getService } from "../../Api/admin";
import { FiMapPin } from "react-icons/fi";
import { getProfile } from "../../Api/user";
import { Card, CardContent, Typography } from "@mui/material";
import { AddAddress } from "../../interfaces/AddAddress";

interface ServiceData {
  _id: string;
  name: string;
  discription: string;
  status: boolean;
  isDeleted: boolean;
}

const Service: React.FC = () => {
  const { id } = useParams();
  console.log("id from the userHome page is ", id);
  const [service, setServices] = useState<ServiceData>();
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [userProfile, setUserProfile] = useState("");
  const [defaultAddress, setDefaultAddress] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceResult, profileResult] = await Promise.all([
          getService(id),
          getProfile(),
        ]);
        if (serviceResult) {
          console.log(
            "Service result from the backend is ",
            serviceResult.data
          );
          setServices(serviceResult.data.data);
        }

        if (profileResult) {
          const profileData = profileResult.data.data.data;
          console.log("Profile reuslt from the backend", profileData);
          setUserProfile(profileResult.data.data.data);

          const defaultAdd = profileData.address.find(
            (addr: AddAddress) => addr._id == profileData.defaultAddress
          );
          if (!defaultAdd) {
            console.log("Default address not found, check if IDs match.");
          } else {
            console.log("Default address found:", defaultAdd);
          }
          setDefaultAddress(defaultAdd);
        }
      } catch (error) {
        console.log(error as Error);
      }
    };

    fetchData();
  }, [id]);

  const handleLocationClick = () => {
    setShowLocationOptions(!showLocationOptions);
  };

  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex justify-between mt-40 mx-12 ">
        <div>
          <div>
            <h1 className=" font-Metal text-xl">{service?.discription}</h1>
          </div>
          <div>
            <h2>Image </h2>
          </div>
        </div>
        <div>
          <form className="w-full max-w-lg ">
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-first-name"
                  type="text"
                  value={userProfile.name}
                />
                <p className="text-red-500 text-xs italic">
                  Please fill out this field.
                </p>
              </div>
              {/* <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-device"
                >
                  Device
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-device"
                  type="text"
                  placeholder="Device name provide dynamic"
                />
              </div> */}
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-complaint"
                >
                  Complaint Description
                </label>
                <textarea
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-complaint"
                  placeholder="Describe your complaint here..."
                  rows={4}
                ></textarea>
                <p className="text-gray-600 text-xs italic">
                  Provide a detailed description of the complaint.
                </p>
              </div>
            </div>

            {/**provide the default address  */}
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-complaint"
            >
              Current Address
            </label>
            {defaultAddress && (
              <Card sx={{ maxWidth: 1000 }} className="flex justify-between">
                <CardContent>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Name: {defaultAddress?.name}
                    <br />
                    Email: {defaultAddress?.email}
                    <br />
                  </Typography>
                </CardContent>
              </Card>
            )}
            {/**provide the default address  */}

            <div className="flex flex-wrap -mx-3 mb-2 my-5">
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-city"
                >
                  District
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-city"
                  type="text"
                  value={defaultAddress.district}
                />
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-state"
                >
                  State
                </label>
                <div className="relative">
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type=""
                    value={defaultAddress.state}
                  />
                </div>
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-zip"
                >
                  Pin
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-zip"
                  type="text"
                  value={defaultAddress.pin}
                />
              </div>

              {/* Current Location Button */}
              <div className="w-full px-3 mb-6 my-5">
                <button
                  type="button"
                  onClick={handleLocationClick}
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
                >
                  <FiMapPin className="mr-2" /> Please enter your location
                </button>
                {showLocationOptions && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => console.log("Using current location")}
                      className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none  w-full"
                    >
                      <FiMapPin className="mr-2" /> Use Current Location
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Service;
