import React from "react";
import { Button } from "@mui/material";
import { Formik } from "formik";
// import { AddMechanicAddress, getMechanicProfile } from "../../Api/mechanic";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AddressValidation } from "../../Common/Validations";
import { RootState } from "../../../App/store";
import { AddMechAddress } from "../../../Api/mech";

const MechAddAddress: React.FC = () => {

  const mechanicData = useSelector((state: RootState) => state.auth.mechData);
  const mechId = mechanicData?.id;

  const navigate = useNavigate();

  //   useEffect(() => {
  //     setMechanicProfile(mechanicData);

  //     const fetchMechanicDetails = async () => {
  //       try {
  //         const mechanicId = mechanicData?.id;
  //         if (mechanicId) {
  //           const response = await getMechanicDetails(mechanicId);
  //           console.log("Mechanic details from the backend in the MechAddAddress.tsx",response);
  //           const mechanic = response?.data.data.data;
  //           setMechanicProfile(mechanic);
  //         }
  //       } catch (error) {
  //         console.error("Failed to fetch mechanic details", error);
  //       }
  //     };

  //     fetchMechanicDetails();
  //   }, [mechanicData]);

  return (
    <div className="h-full bg-white rounded-lg shadow-md flex flex-col mt-24">
      <div className="flex flex-col justify-center items-center my-6">
        <h1>
          Your Account {">"} Your Address {">"} Add Address
        </h1>
        <h1 className="font-exo text-2xl font-bold my-3">Add Your Address</h1>
      </div>

      <div>
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
            console.log("vales for updation is ", values);
            const result = await AddMechAddress(mechId, { ...values, isDeleted: false });
            console.log("result after addin the address");
            if (result) {
              navigate("/mech/profile");
            }
          }}
        >
          {(formik) => (
            <form className="mx-48" onSubmit={formik.handleSubmit}>
              {/* same fields as before */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Enter your name
                </label>
                <input
                  className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700"
                  name="name"
                  type="text"
                  placeholder="Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.name && (
                  <small className="text-red-500">{formik.errors.name}</small>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Enter your phone number
                </label>
                <input
                  className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700"
                  name="phone"
                  type="number"
                  placeholder="Phone number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.phone && (
                  <small className="text-red-500">{formik.errors.phone}</small>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Enter your email
                </label>
                <input
                  className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700"
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.email && (
                  <small className="text-red-500">{formik.errors.email}</small>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Enter your state
                </label>
                <input
                  className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700"
                  name="state"
                  type="text"
                  placeholder="State"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.state && (
                  <small className="text-red-500">{formik.errors.state}</small>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Enter your pincode
                </label>
                <input
                  className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700"
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
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Enter your district
                </label>
                <input
                  className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700"
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
                  rows={4}
                  className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700"
                  name="landMark"
                  placeholder="Landmark"
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
      </div>
    </div>
  );
};

export default MechAddAddress;
