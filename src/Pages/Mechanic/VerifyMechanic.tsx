import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import { MechanicVerificationValidationSchema } from "../../components/Common/Validations";
import { RootState } from "../../App/store";
import { useSelector } from "react-redux";
import {
  getAllDevices,
  getS3SingUrlForMechCredinential,
  verifyMechanic,
} from "../../Api/mech";
import toast from "react-hot-toast";
import {
  Device,
  MechanicForm,
} from "../../interfaces/IPages/Mechanic/IMechanicInterfaces";
import {
  FiUpload,
  FiX,
  FiFileText,
  FiImage,
  FiUser,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// Enhanced types for better type safety
interface FileWithPreview {
  file: File;
  preview: string;
  type: "image" | "pdf";
}

interface FileUploadState {
  photo: FileWithPreview | null;
  adharProof: FileWithPreview | null;
  employeeLicense: FileWithPreview | null;
}

interface UploadResponse {
  data: {
    uploadURL: string;
    key: string;
  };
}

interface MechanicData {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

interface FileUploadItem {
  file: File;
  fileName: string;
  fileType: string;
  name: string;
}

export interface IinitalValues {
  name: string;
  id: string;
  mechanicType: string[];
  photo: string | null;
  adharProof: string | null;
  employeeLicense: string | null;
}
const VerifyMechanic: React.FC = () => {
  const mechanic = useSelector(
    (state: RootState) => state.auth.mechData
  ) as MechanicData;
  console.log("mechData is ", mechanic);
  const mechId = mechanic.id;
  console.log("MechanicId is ", mechId);
  const [devices, setDevices] = useState<Device[]>([]);
  const [fileStates, setFileStates] = useState<FileUploadState>({
    photo: null,
    adharProof: null,
    employeeLicense: null,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const allDevices = await getAllDevices();
        setDevices(allDevices?.data ?? []);
      } catch (error) {
        console.error("Failed to fetch devices:", error);
        toast.error("Failed to load device types");
      }
    };

    fetchDevices();
  }, []);

  const createFilePreview = (file: File): FileWithPreview => {
    const preview = URL.createObjectURL(file);
    const type = file.type.startsWith("image/") ? "image" : "pdf";
    return { file, preview, type };
  };

  const handleFileChange = (
    fieldName: keyof FileUploadState,
    file: File | null,
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    if (file) {
      const fileWithPreview = createFilePreview(file);
      setFileStates((prev) => ({
        ...prev,
        [fieldName]: fileWithPreview,
      }));
      setFieldValue(fieldName, file);
    } else {
      // Clean up previous preview URL
      if (fileStates[fieldName]?.preview) {
        URL.revokeObjectURL(fileStates[fieldName]!.preview);
      }
      setFileStates((prev) => ({
        ...prev,
        [fieldName]: null,
      }));
      setFieldValue(fieldName, null);
    }
  };

  const removeFile = (
    fieldName: keyof FileUploadState,
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    if (fileStates[fieldName]?.preview) {
      URL.revokeObjectURL(fileStates[fieldName]!.preview);
    }
    setFileStates((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
    setFieldValue(fieldName, null);
  };

  const uploadFileToS3 = async (
    file: File,
    fileName: string,
    fileType: string,
    name: string
  ): Promise<string> => {
    try {
      const response = await getS3SingUrlForMechCredinential(
        fileName,
        fileType,
        name
      );

      if (!response) {
        throw new Error("Failed to get presigned URL: response is undefined");
      }

      const uploadResponseData = response as UploadResponse;

      if (uploadResponseData?.data.uploadURL) {
        const uploadResponse = await fetch(uploadResponseData.data.uploadURL, {
          method: "PUT",
          headers: {
            "Content-Type": fileType,
          },
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new Error(
            `Upload failed with status: ${uploadResponse.status}`
          );
        }

        return uploadResponseData.data.key;
      }
      throw new Error("Failed to get presigned URL");
    } catch (error) {
      console.error("S3 upload error:", error);
      throw error;
    }
  };

  const handleSubmit = async (values: MechanicForm) => {
    setIsSubmitting(true);
    try {
      // Prepare form data
      const formData: MechanicForm = {
        ...values,
        name: mechanic.name,
        id: mechanic.id as string,
      };

      // Prepare files for upload
      const filesToUpload: FileUploadItem[] = [
        {
          file: values.adharProof as File,
          fileName:
            values.adharProof instanceof File ? values.adharProof.name : "",
          fileType:
            values.adharProof instanceof File ? values.adharProof.type : "",
          name: mechanic.name,
        },
        {
          file: values.photo as File,
          fileName: values.photo instanceof File ? values.photo.name : "",
          fileType: values.photo instanceof File ? values.photo.type : "",
          name: mechanic.name,
        },
        {
          file: values.employeeLicense as File,
          fileName:
            values.employeeLicense instanceof File
              ? values.employeeLicense.name
              : "",
          fileType:
            values.employeeLicense instanceof File
              ? values.employeeLicense.type
              : "",
          name: mechanic.name,
        },
      ];

      toast.loading("Uploading documents...", { id: "upload" });

      // Upload all files concurrently
      const keys = await Promise.all(
        filesToUpload.map(({ file, fileName, fileType, name }) =>
          uploadFileToS3(file, fileName, fileType, name)
        )
      );

      // Update form data with S3 keys
      formData.adharProof = keys[0] as string;
      formData.photo = keys[1] as string;
      formData.employeeLicense = keys[2] as string;

      toast.dismiss("upload");
      toast.loading("Submitting verification...", { id: "submit" });

      // Submit verification
      const response = await verifyMechanic(formData);
      console.log("Verification response:", response);

      toast.dismiss("submit");
      toast.success("Verification submitted successfully!");

      console.log("Verification response:", response);
      navigate("/mech/homepage");
    } catch (error) {
      toast.dismiss();
      console.error("Verification error:", error);
      toast.error("Failed to submit verification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(fileStates).forEach((fileState) => {
        if (fileState?.preview) {
          URL.revokeObjectURL(fileState.preview);
        }
      });
    };
  }, [fileStates]);

  const FileUploadField: React.FC<{
    name: keyof FileUploadState;
    label: string;
    accept: string;
    icon: React.ReactNode;
    setFieldValue: (field: string, value: unknown) => void;
    error?: string;
  }> = ({ name, label, accept, icon, setFieldValue, error }) => {
    const fileState = fileStates[name];

    return (
      <div className="space-y-3">
        <label className="flex items-center text-sm font-semibold text-gray-700">
          {icon}
          <span className="ml-2">{label}</span>
          <span className="text-red-500 ml-1">*</span>
        </label>

        {!fileState ? (
          <div className="relative">
            <input
              type="file"
              accept={accept}
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                handleFileChange(name, file, setFieldValue);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id={name}
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                {accept.includes("image") ? "PNG, JPG" : "PDF, PNG, JPG"} up to
                10MB
              </p>
            </div>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {fileState.type === "image" ? (
                  <img
                    src={fileState.preview}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded"
                  />
                ) : (
                  <div className="h-16 w-16 bg-red-100 rounded flex items-center justify-center">
                    <FiFileText className="h-8 w-8 text-red-600" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {fileState.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(fileState.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(name, setFieldValue)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center text-red-600 text-sm">
            <FiAlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Mechanic Verification
          </h1>
          <p className="mt-2 text-gray-600">
            Complete your profile verification to start receiving service
            requests
          </p>
        </div>

        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className=" bg-freeze-color px-8 py-6">
            <h2 className="text-xl font-semibold text-white">
              Verification Details
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Please provide all required documents for verification
            </p>
          </div>

          <div className="p-8">
            <Formik
              initialValues={
                {
                  name: mechanic.name || "",
                  id: mechanic.id,
                  mechanicType: [] as string[],
                  photo: "",
                  adharProof: "",
                  employeeLicense: "",
                } as MechanicForm
              }
              validationSchema={MechanicVerificationValidationSchema}
              onSubmit={handleSubmit}
            >
              {({
                setFieldValue,
                errors,
                touched,
              }: FormikProps<MechanicForm>) => (
                <Form className="space-y-8">
                  {/* Personal Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiUser className="mr-2" />
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                          <FiUser className="mr-2" />
                          Full Name
                        </label>
                        <Field
                          type="text"
                          name="name"
                          value={mechanic.name}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                          <FiPhone className="mr-2" />
                          Phone Number
                        </label>
                        <Field
                          type="tel"
                          name="phoneNumber"
                          value={mechanic.phone}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div> */}
                    </div>
                  </div>

                  {/* Specialization */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Areas of Specialization
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {devices.map((device) => (
                        <label
                          key={device._id}
                          className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-white hover:border-blue-300 cursor-pointer transition-colors"
                        >
                          <Field
                            type="checkbox"
                            name="mechanicType"
                            value={device._id}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm font-medium text-gray-700">
                            {device.name}
                          </span>
                        </label>
                      ))}
                    </div>
                    <ErrorMessage
                      name="mechanicType"
                      component="div"
                      className="mt-2 text-red-600 text-sm flex items-center"
                    />
                  </div>

                  {/* Document Uploads */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Required Documents
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <FileUploadField
                        name="photo"
                        label="Profile Photo"
                        accept="image/*"
                        icon={<FiImage />}
                        setFieldValue={setFieldValue}
                        error={
                          touched.photo && errors.photo
                            ? String(errors.photo)
                            : undefined
                        }
                      />

                      <FileUploadField
                        name="adharProof"
                        label="Aadhaar Proof"
                        accept="image/*,.pdf"
                        icon={<FiFileText />}
                        setFieldValue={setFieldValue}
                        error={
                          touched.adharProof && errors.adharProof
                            ? String(errors.adharProof)
                            : undefined
                        }
                      />
                    </div>

                    <FileUploadField
                      name="employeeLicense"
                      label="Professional License"
                      accept="image/*,.pdf"
                      icon={<FiFileText />}
                      setFieldValue={setFieldValue}
                      error={
                        touched.employeeLicense && errors.employeeLicense
                          ? String(errors.employeeLicense)
                          : undefined
                      }
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex items-center justify-center px-6 py-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white transition-colors ${
                        isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FiCheckCircle className="mr-2" />
                          Submit for Verification
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyMechanic;
