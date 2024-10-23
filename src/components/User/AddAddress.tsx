import React from "react";
import { Button } from "@mui/material";

const AddAddress: React.FC = () => {
  return (
    <div className="h-full bg-white rounded-lg shadow-md flex flex-col">
      <div className="flex flex-col justify-center items-center my-6">
        <h1>
          Your Account {">"} Your Address {">"} Add Address
        </h1>
        <h1 className="font-exo text-2xl font-bold my-3">Add Your Address</h1>
      </div>

      <div>
        <form action="" className="mx-48 ">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Enter your name
            </label>
            <input
              className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phone"
            >
              Enter you phone number
            </label>
            <input
              className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              type="number"
              placeholder="Phone number"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Enter you mail id
            </label>
            <input
              className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="state"
            >
              Enter you State
            </label>
            <input
              className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="state"
              type="text"
              placeholder="State"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="pincode"
            >
              Enter you Pincode
            </label>
            <input
              className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="pin"
              type="number"
              placeholder="Pincode"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="district"
            >
              Enter you District
            </label>
            <input
              className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="district"
              type="text"
              placeholder="District"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Landmark
            </label>
            <textarea
              value=""
              rows={4} // Number of lines visible in textarea
              className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter you land mark"
            />
          </div>
          <div className="my-5">
            <Button variant="contained" color="warning" className="w-full">
              Add Address
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddress;
