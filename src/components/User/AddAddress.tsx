import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Formik } from "formik";
import { AddressValidation } from "../Common/Validations";
import { AddUserAddress, getProfile } from "../../Api/user";
import { useSelector } from "react-redux";
import { RootState } from "../../App/store";
import { IUserData } from "../../interfaces/IUserData";
import { useNavigate } from "react-router-dom";

const AddAddress: React.FC = () => {
  const [userProfile, setUserProfile] = useState<IUserData | null>(null);
  const userData = useSelector((state: RootState) => state.auth.userData);
  const navigate = useNavigate();

  
  console.log("userData from the store is ", userData);
  console.log("user id from the store is ", userData);
  
  useEffect(() => {
    // Set user profile from Redux store
    setUserProfile(userData);
    
    // Fetch user details from API
    const fetchUserDetails = async () => {
      try {
        const userId = userData?.id
        if (userId) {
          const response = await getProfile(userId);
          const user = response?.data.data.data;
          console.log("User details from the backend in the Account is ", user);
          setUserProfile(user);
        }
      } catch (error) {
        console.log(
          "Failed to fetch the user Details from the Account section",
          error
        );
      }
    };
    
    fetchUserDetails();
  }, [userData]);
  
  return (
    <div className="h-full bg-white rounded-lg shadow-md flex flex-col mt-36">
      <div className="flex flex-col justify-center items-center my-6">
        <h1>
          Your Account {">"} Your Address {">"} Add Address
        </h1>
        <h1 className="font-exo text-2xl font-bold my-3">Add Your Address</h1>
      </div>

      <div>
        {
          <Formik
            initialValues={{
              name: "",
              phone: 0,
              email: "",
              state: "",
              pin: 0,
              district: "",
              landMark: "",
            }}
            validationSchema={AddressValidation}
            enableReinitialize={true}
            onSubmit={async (values) => {
              console.log("Submited addressDetails ", values);
              let _id: string | undefined = "";
              if (userProfile) {
                _id = userProfile._id;
              }
              const result = await AddUserAddress(_id, values);
              if (result) {
                console.log("result reached the frontend",result);
                navigate('/user/account');
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
                    placeholder="Username"
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
                    placeholder="Phone number"
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
                    placeholder="Email"
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
                    placeholder="State"
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
                    placeholder="Pincode"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.pin && (
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
                    placeholder="District"
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
                    placeholder="Enter you land mark"
                    name="landMark"
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
    </div>
  );
};

export default AddAddress;