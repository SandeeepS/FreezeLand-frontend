import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { MechanicVerificationValidationSchema } from "../../components/Common/Validations";
import { RootState } from "../../App/store";
import { useSelector } from "react-redux";
import { getAllDevices } from "../../Api/mech";

interface Device {
  _id: string;
  name: string;
  isBlocked?: boolean;
  isDeleted?: boolean;
}

interface MechanicForm {
  name: string;
  phone: string;
  address: string;
  mechanicType: string[];
  photo: File | null;
  adharProof: File | null;
  employeeLicense: File | null;
}

const VerifyMechanic: React.FC = () => {
  const mechanic = useSelector((state: RootState) => state.auth.mechData);
  console.log("mech data is ", mechanic?.data);
  const mech = mechanic?.data;
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const allDevices = await getAllDevices();
      console.log("All Devices from the backend is ", allDevices);
      setDevices(allDevices?.data ?? []);
    };

    fetchData();
  }, []);
  console.log("only devices is ", devices);

  const handleSubmit = (values: MechanicForm) => {
    values.name = mech.name;
    values.phone = mech.phone;
    console.log(values);
    // Add submission logic here
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-32">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">
          Mechanic Verification
        </h2>
        <Formik
          initialValues={{
            name: "",
            phone: "",
            address: "",
            mechanicType: [],
            photo: null,
            adharProof: null,
            employeeLicense: null,
          }}
          validationSchema={MechanicVerificationValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, handleChange }) => (
            <Form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  value={mech.name}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <Field
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={mech.phone}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mechanic Type
                </label>
                <div className="mt-2 space-y-2">
                  {devices.map((device) => (
                    <div key={device._id} className="flex items-center">
                      <Field
                        type="checkbox"
                        id={device._id}
                        name="mechanicType"
                        value={device._id}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={device._id}
                        className="ml-2 block text-sm text-gray-900"
                      >
                        {device.name}
                      </label>
                    </div>
                  ))}
                  <ErrorMessage
                    name="mechanicType"
                    component="small"
                    className="text-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Photo
                </label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setFieldValue("photo", file || null);
                  }}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-indigo-100"
                />
                <ErrorMessage
                  name="photo"
                  component="small"
                  className="text-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Adhar Proof
                </label>
                <input
                  type="file"
                  name="adharProof"
                  accept="image/*,.pdf"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setFieldValue("adharProof", file || null);
                  }}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-indigo-100"
                />
                <ErrorMessage
                  name="adharProof"
                  component="small"
                  className="text-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employee License
                </label>
                <input
                  type="file"
                  name="employeeLicense"
                  accept="image/*,.pdf"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setFieldValue("employeeLicense", file || null);
                  }}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-indigo-100"
                />
                <ErrorMessage
                  name="employeeLicense"
                  component="small"
                  className="text-red-500"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Register
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default VerifyMechanic;
