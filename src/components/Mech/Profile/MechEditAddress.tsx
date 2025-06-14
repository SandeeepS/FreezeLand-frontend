import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { Button } from "@mui/material";
import { useAppSelector } from "../../../App/store";
import { AddAddress } from "../../../interfaces/AddAddress";
import { AddressValidation } from "../../Common/Validations";
import { EditExistingMechAddress, getMechanicDetails } from "../../../Api/mech";
import Footer from "../../User/Footer";
import { MechDetails } from "../../../interfaces/IComponents/Mechanic/IMechanicInterface";

export const MechEditAddress: React.FC = () => {
  const mechData = useAppSelector((state) => state.auth.mechData);
  const mechId = mechData?.id;
  const { id } = useParams();
  const [mechProfile, setMechProfile] = useState<MechDetails>();
  const [address, setAddress] = useState<AddAddress | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        if (!mechId) {
          console.error("Mechanic  ID is not available");
          return;
        }

        const response = await getMechanicDetails(mechId);
        console.log("Full API response:", response);
        
        if (!response?.data?.result) {
          console.error("Failed to get mech profile data", response?.data);
          return;
        }

        const mech = response.data.result;
        console.log("Mechanic details from the backend in the EditAddress is ", mech);
        setMechProfile(mech);

        // Find the address with the matching ID
        if (!Array.isArray(mech.address)) {
          console.error("Address data is not an array:", mech.address);
          return;
        }
        
        const addressFound = mech.address.find(
          (addr: AddAddress) => addr._id === id
        );
        
        console.log("Address found:", addressFound);
        if (addressFound) {
          setAddress(addressFound);
        } else {
          console.error("Address not found with ID:", id);
        }
      } catch (error) {
        console.error("Failed to fetch mechanic details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (mechId && id) {
      fetchUserDetails();
    }
  }, [mechId, id]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading address details...</div>;
  }

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-bold text-red-500">Address not found</h2>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate("/mech/showAllAddress")}
          className="mt-4"
        >
          Back to Addresses
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white h-full rounded-lg shadow-md flex flex-col space-y-12 overflow-y-auto mt-32">
      <div className="flex flex-col justify-center items-center my-6">
        <h1>
          Your Account {">"} Your Address {">"} Edit Address
        </h1>
        <h1 className="font-exo text-2xl font-bold my-3">Edit Your Address</h1>
      </div>

      <div>
        <Formik
          initialValues={{
            name: address.name || "",
            phone: address.phone || 0,
            email: address.email || "",
            state: address.state || "",
            pin: address.pin || 0,
            district: address.district || "",
            landMark: address.landMark || "",
          }}
          validationSchema={AddressValidation}
          enableReinitialize={true}
          onSubmit={async (values) => {
            console.log("Submitted address details:", values);
            if (!mechProfile?.id || !address?._id) {
              console.error("Missing mech ID or address ID");
              return;
            }

            try {
              const result = await EditExistingMechAddress(mechId, address._id, {
                ...values,
                isDeleted: address.isDeleted ?? false,
              });
              if (result) {
                console.log("Address successfully updated");
                navigate("/mech/showAllAddress");
              }
            } catch (error) {
              console.error("Failed to update address:", error);
            }
          }}
        >
          {(formik) => (
            <form action="" className="mx-48" onSubmit={formik.handleSubmit}>
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
                {formik.touched.name && formik.errors.name && (
                  <small className="text-red-500">{formik.errors.name}</small>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="phone"
                >
                  Enter your phone number
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
                {formik.touched.phone && formik.errors.phone && (
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
                  Enter your email
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
                {formik.touched.email && formik.errors.email && (
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
                  Enter your State
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
                {formik.touched.state && formik.errors.state && (
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
                  Enter your Pincode
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
                {formik.touched.pin && formik.errors.pin && (
                  <small className="text-red-500">{formik.errors.pin}</small>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="district"
                >
                  Enter your District
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
                {formik.touched.district && formik.errors.district && (
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
                  rows={4}
                  className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  name="landMark"
                  value={formik.values.landMark}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.landMark && formik.errors.landMark && (
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
                  Update Address
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default MechEditAddress;