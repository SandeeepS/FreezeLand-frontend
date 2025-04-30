import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { MechanicVerificationValidationSchema } from "../../components/Common/Validations";
import { RootState } from "../../App/store";
import { useSelector } from "react-redux";
import {
  getAllDevices,
  getS3SingUrlForMechCredinential,
  verifyMechanic,
} from "../../Api/mech";
import toast from "react-hot-toast";
import { Device, MechanicForm } from "../../interfaces/IPages/Mechanic/IMechanicInterfaces";



const VerifyMechanic: React.FC = () => {
  const mechanic = useSelector((state: RootState) => state.auth.mechData);
  console.log("mech data is ", mechanic?.data);
  const mech = mechanic?.data;
  const [devices, setDevices] = useState<Device[]>([]);
  const [profileImageFileName, setProfileImageFileName] = useState<string>();
  const [adharImageFileName, setAdharImageFileName] = useState<string>();
  const [licenceImageFileName, setLicenceImageFileName] = useState<string>();

  const [profileImageFileType, setProfileImageFileType] = useState<string>();
  const [adharImageFileType, setAdharImageFileType] = useState<string>();
  const [licenceImageFileType, setLicenceImageFileType] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      const allDevices = await getAllDevices();
      console.log("All Devices from the backend is ", allDevices);
      setDevices(allDevices?.data ?? []);
    };

    fetchData();
  }, []);
  console.log("only devices is ", devices);

  const uploadFileToS3 = async (file: File,fileName: string, fileType: string,name:string) => {
    console.log("details from teh uploadfilTos3 function ",file,fileName,fileType,name);
    const response = await getS3SingUrlForMechCredinential(fileName, fileType,name);
    if (response?.data.uploadURL) {
      console.log("response is ", response);
      console.log("upload url is ", response.data.uploadURL);
      const uploadResponse = await fetch(response.data.uploadURL, {
        method: "PUT",
        headers: {
          "Content-Type": fileType,
        },
        body: file,
      });
      console.log("upload response is ", uploadResponse);
      return response.data.key;
    }
    throw new Error("Failed to get presigned URL");
  };

  const handleSubmit = async (values: MechanicForm) => {
    try {
      values.name = mech.name;
      values.id = mech._id;
      console.log(values);

      setAdharImageFileName(values.adharProof?.name);
      setAdharImageFileType(values.adharProof?.type);
      setLicenceImageFileName(values.employeeLicense?.name);
      setLicenceImageFileType(values.employeeLicense?.type);
      setProfileImageFileName(values.photo?.name);
      setProfileImageFileType(values.photo?.type);

      const filesToUpload = [
        { file:values.adharProof,  fileName: adharImageFileName, fileType: adharImageFileType , name:values.name },
        { file:values.photo, fileName: profileImageFileName, fileType: profileImageFileType ,name:values.name },
        { file: values.employeeLicense,fileName: licenceImageFileName, fileType: licenceImageFileType ,name:values.name },
      ];

      const keys = await Promise.all(
        filesToUpload.map(({file,  fileName, fileType,name }) => uploadFileToS3(file as File, fileName as string, fileType as string ,name))
      );

      console.log("Uploaded keys:", keys);
      values.adharProof = keys[0];
      values.photo = keys[1];
      values.employeeLicense = keys[2];

      // Add submission logic here
      const response = await verifyMechanic(values);
      console.log("response from the backend is ", response);
    } catch (error) {
      console.log(error);
      toast.error("Error Occurred !!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-32">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">Mechanic Verification</h2>
        <Formik
          initialValues={{
            name: "",
            id: "",
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