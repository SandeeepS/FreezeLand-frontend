import React from "react";
import { Formik } from "formik";
import AdminHeader from "./AdminHeader";
import { DeviceListingValidation } from "../Common/Validations";
import { addDevice } from "../../Api/admin";
import { useNavigate } from "react-router-dom";

export interface InewDevice {
  name: string;

}

const AddNewDevice: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values : InewDevice) => {
        console.log("device name from the form is ",values.name);
        const result = await addDevice(values.name);
        if(result) {
            navigate('/admin/devices');
        }
    }
  return (
    <div>
      <AdminHeader heading="Adding New Service" />
      <div className="flex justify-center items-center py-10 h-screen">
        <Formik
          initialValues={{
            name: "",
          }}
          validationSchema={DeviceListingValidation}
          onSubmit={handleSubmit}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
          }) => (
            <form
              className="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl"
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <h2 className="text-2xl font-bold text-center mb-6">
                New Service
              </h2>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Service Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={values.name}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  placeholder="Enter service name"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 ${
                    errors.name && touched.name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.name && touched.name && (
                  <small className="text-red-500">{errors.name}</small>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow focus:outline-none focus:ring focus:ring-blue-300"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddNewDevice;
