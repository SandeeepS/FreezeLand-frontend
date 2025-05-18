import React from "react";
import { useParams } from "react-router-dom";
import { Formik } from "formik";
import { AddressValidation } from "../Common/Validations";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import {
  AddAddress,
  AddAddress as AddAddressInterface,
} from "../../interfaces/AddAddress";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../Api/user";
import { EditExistAddress } from "../../Api/user";
import Footer from "./Footer";

export const EditAddress: React.FC = () => {
  const { id } = useParams();

  const [userProfile, setUserProfile] = useState<AddAddressInterface | null>(
    null
  );
  const [address, setAddress] = useState<AddAddress>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getProfile(id as string);
        const user = response?.data.data;
        console.log(
          "User details from the backend in the EditAddress is ",
          user
        );
        setUserProfile(user);
        const addressFound = user.address.find(
          (addr: AddAddress) => addr._id === id
        );
        console.log("adress while finded is ", addressFound);
        setAddress(addressFound);
      } catch (error) {
        console.log(
          "Failed to fetch the user Details from the Account section",
          error
        );
      }
    };
    fetchUserDetails();
  }, [id]);

  console.log("id from the kslfgnlgj", id);
  return (
    <div className="bg-white h-full rounded-lg shadow-md flex flex-col space-y-12 overflow-y-auto mt-32">
      <div className="flex flex-col justify-center items-center my-6">
        <h1>
          Your Account {">"} Your Address {">"} Edit Address
        </h1>
        <h1 className="font-exo text-2xl font-bold my-3">Edit Your Address</h1>
      </div>

      <div>
        {
          <Formik
            initialValues={{
              name: address?.name || "",
              phone: address?.phone || 0,
              email: address?.email || "",
              state: address?.state || "",
              pin: address?.pin || 0,
              district: address?.district || "",
              landMark: address?.landMark || "",
            }}
            validationSchema={AddressValidation}
            enableReinitialize={true}
            onSubmit={async (values) => {
              console.log("Submited addressDetails ", values);
              let _id: string | undefined = "";
              if (userProfile) {
                _id = userProfile._id;
              }
              const result = await EditExistAddress(_id, address?._id, values);
              if (result) {
                console.log("result reached the frontend");
                navigate("/user/account/address");
              }
            }}
          >
            {(formik) => (
              <form action="" className="mx-48 " onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="username"
                  >
                    Enter your name
                  </label>
                  <input
                    className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="name"
                    id="username"
                    type="text"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.name && (
                    <small className="text-red-500">{formik.errors.name}</small>
                  )}
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
                    name="phone"
                    type="number"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.phone && (
                    <small className="text-red-500">
                      {formik.errors.phone}
                    </small>
                  )}
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
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.email && (
                    <small className="text-red-500">
                      {formik.errors.email}
                    </small>
                  )}
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
                    name="state"
                    type="text"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.state && (
                    <small className="text-red-500">
                      {formik.errors.state}
                    </small>
                  )}
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
                    name="pin"
                    type="number"
                    value={formik.values.pin}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.pin&&(
                    <small className="text-red-500">{formik.errors.pin}</small>
                  )}
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
                    name="district"
                    type="text"
                    value={formik.values.district}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.district && (
                    <small className="text-red-500">
                      {formik.errors.district}
                    </small>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Landmark
                  </label>
                  <textarea
                    rows={4} // Number of lines visible in textarea
                    className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="landMark"
                    value={formik.values.landMark}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.landMark && (
                    <small className="text-red-500">
                      {formik.errors.landMark}
                    </small>
                  )}
                </div>
                <div className="my-5">
                  <Button
                    type="submit"
                    variant="contained"
                    color="warning"
                    className="w-full"
                  >
                    Add Address
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        }
      </div>
      <div>
        <Footer/>
      </div>
    </div>
  );
};
