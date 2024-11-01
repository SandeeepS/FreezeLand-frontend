import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import AdminHeader from "../../components/Admin/AdminHeader";
import { ServiceListingValidation } from "../../components/Common/Validations";
import { addService } from "../../Api/admin";
import { useNavigate } from "react-router-dom";

export interface InewService {
  name: string;
  discription: string;
}

const NewService: React.FC = () => {
  const navigate = useNavigate();
  const [isFormDirty, setIsFormDirty] = useState(false);

  const handleSubmit = async (values: InewService) => {
    console.log("Submitted values:", values);
    const result = await addService(values);
    if (result) {
      setIsFormDirty(false); // Reset dirty flag on successful submit
      navigate('/admin/services');
    }
  };

  // Add event listener to prevent page unload with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isFormDirty) {
        event.preventDefault();
        event.returnValue = ""; // Show a confirmation dialog
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFormDirty]);

  return (
    <div>
      <AdminHeader heading="Adding New Service" />
      <div className="flex justify-center items-center py-10 h-screen">
        <Formik
          initialValues={{
            name: "",
            discription: "",
          }}
          validationSchema={ServiceListingValidation}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
            <form
              className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg"
              onSubmit={(e) => {
                setIsFormDirty(false); // Reset dirty flag on submit
                handleSubmit(e);
              }}
              onChange={() => setIsFormDirty(true)} // Mark form as dirty on change
            >
              <h2 className="text-2xl font-bold text-center mb-6">New Service</h2>
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
                    setIsFormDirty(true);
                  }}
                  onBlur={handleBlur}
                  placeholder="Enter service name"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 ${
                    errors.name && touched.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && touched.name && (
                  <small className="text-red-500">{errors.name}</small>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="discription"
                >
                  Description
                </label>
                <textarea
                  id="discription"
                  value={values.discription}
                  onChange={(e) => {
                    handleChange(e);
                    setIsFormDirty(true);
                  }}
                  onBlur={handleBlur}
                  placeholder="Enter a brief description of the service"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 ${
                    errors.discription && touched.discription ? "border-red-500" : "border-gray-300"
                  }`}
                  rows={4}
                ></textarea>
                {errors.discription && touched.discription && (
                  <small className="text-red-500">{errors.discription}</small>
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

export default NewService;
