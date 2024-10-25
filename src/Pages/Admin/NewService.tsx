import React from "react";
import { Formik } from "formik";
import AdminHeader from "../../components/Admin/AdminHeader";
import { ServiceListingValidation } from "../../components/Common/Validations";
import { addService } from "../../Api/admin";

export interface InewService {
  name: string;
  description: string; // Fixed the spelling from 'discription' to 'description'
}

const NewService: React.FC = () => {


  const handleSubmit = async (values: InewService) => {
    console.log("Submitted values:", values);
    const result = await addService(values);
    console.log(result);

  };

  return (
    <div>
      <AdminHeader heading="Adding New Service" />
      <div className="flex justify-center items-center py-10 h-screen">
        <Formik
          initialValues={{
            name: "",
            description: "",
          }}
          validationSchema={ServiceListingValidation}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
            <form
              className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg"
              onSubmit={handleSubmit}
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
                  onChange={handleChange}
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

              {/* Uncomment and implement image upload as needed
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="image"
                >
                  Upload Image
                </label>
                <input
                  id="image"
                  type="file"
                  accept=".jpg"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                  required
                />
              </div>
              */}

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter a brief description of the service"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 ${
                    errors.description && touched.description ? "border-red-500" : "border-gray-300"
                  }`}
                  rows={4}
                ></textarea>
                {errors.description && touched.description && (
                  <small className="text-red-500">{errors.description}</small>
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
