import React, { useEffect, useState } from "react";
import { FaCamera, FaTrash } from "react-icons/fa";
import { Formik, Form, Field } from "formik";
import { object, string } from "yup";
import { useNavigate } from "react-router-dom";
import {
  getImageUrl,
  getMechanicDetails,
  getS3SingUrlForMechCredinential,
  updateMechanicDetails,
} from "../../../Api/mech";
import { useAppSelector } from "../../../App/store";

interface MechanicProfile {
  _id?: string;
  name?: string;
  phone?: string;
  email?: string;
  imageKey?: string;
  isVerified?: boolean;
}

const validationSchema = object({
  name: string().required("Name is required"),
  phone: string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be 10 digits"),
});

const DEFAULT_PROFILE_IMAGE = "/src/Images/businessman.png";

const MechanicProfileEdit: React.FC = () => {
  const mechData = useAppSelector((state) => state.auth.mechData);
  const navigate = useNavigate();
  const [mechProfile, setMechProfile] = useState<MechanicProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");

  useEffect(() => {
    const fetchMechanicProfile = async () => {
      try {
        const mechId = mechData?.id;
        if (!mechId) return;

        const response = await getMechanicDetails(mechId);
        const profileData = response?.data?.result;
        setMechProfile(profileData);
        setPreviewImage(profileData?.photo || DEFAULT_PROFILE_IMAGE);
      } catch (error) {
        console.error("Failed to fetch mechanic profile:", error);
      }
    };
    fetchMechanicProfile();
  }, [mechData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (mechProfile && mechProfile.imageKey) {
          const result = await getImageUrl(mechProfile.imageKey, "mechProfile");
          if (result) {
            setProfileImage(result.data.url);
          }
        }
      } catch (error) {
        console.log(error as Error);
      }
    };
    fetchData();
  }, [mechProfile]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setFileName(file.name);
    setFileType(file.type);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setPreviewImage(DEFAULT_PROFILE_IMAGE);
    setImageFile(null);
    setFileName("");
    setFileType("");
  };

  if (!mechProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
          <p className="text-center mt-4 text-gray-600">
            Loading mechanic profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 mt-8">
      <div className="container mx-auto  pt-24 pb-12 w-full">
        <div className=" mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mx-5 h-screen ">
            <div className="h-24 bg-gradient-to-r from-black to-freeze-color"></div>
            <Formik
              initialValues={{
                _id: mechProfile._id || "",
                name: mechProfile.name || "",
                phone: mechProfile.phone || "",
                imageKey: mechProfile.imageKey || "",
              }}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={async (values) => {
                try {
                  setIsSubmitting(true);
                  if (imageFile) {
                    const folderName = "MechanicProfile";
                    const response = await getS3SingUrlForMechCredinential(
                      fileName,
                      fileType,
                      folderName
                    );
                    if (response?.data.uploadURL) {
                      await fetch(response.data.uploadURL, {
                        method: "PUT",
                        headers: {
                          "Content-Type": fileType,
                        },
                        body: imageFile,
                      });
                      values.imageKey = response.data.key;
                    }
                  }
                  const result = await updateMechanicDetails(values);
                  if (result?.status) {
                    navigate("/mech/account");
                  }
                } catch (error) {
                  console.error("Failed to update profile:", error);
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              {({ errors, touched }) => (
                <Form className="p-6">
                  <input type="hidden" name="_id" />
                  <div className="flex flex-col items-center -mt-16 mb-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">
                        <img
                          className="w-full h-full object-cover"
                          src={profileImage || DEFAULT_PROFILE_IMAGE}
                          alt="Profile"
                        />
                      </div>
                      <div className="absolute bottom-0 right-0">
                        <label className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition-colors text-white">
                          <FaCamera size={14} />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    {imageFile && (
                      <button
                        type="button"
                        onClick={handleImageRemove}
                        className="mt-2 text-red-600 text-sm flex items-center hover:underline"
                      >
                        <FaTrash className="mr-1" size={12} />
                        Remove uploaded photo
                      </button>
                    )}
                    <p className="mt-4 text-gray-600 font-medium">
                      {mechProfile.email}
                    </p>
                  </div>
                  <div className="space-y-6 mt-4">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
                      Edit Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <Field
                          name="name"
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your name"
                        />
                        {errors.name && touched.name && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.name}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <Field
                          name="phone"
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your phone number"
                        />
                        {errors.phone && touched.phone && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.phone}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => navigate("/mech/account")}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
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

export default MechanicProfileEdit;
