import React, { useEffect, useState } from "react";
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
import ImageUploadProfile from "../../Common/ProfileImage/ImageUploadProfile";

interface MechanicProfile {
  _id?: string;
  name?: string;
  phone?: string;
  email?: string;
  photo?: string;
  isVerified?: boolean;
}

const validationSchema = object({
  name: string().required("Name is required"),
  phone: string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be 10 digits"),
});

const MechanicProfileEdit: React.FC = () => {
  const mechData = useAppSelector((state) => state.auth.mechData);
  const navigate = useNavigate();
  const [mechProfile, setMechProfile] = useState<MechanicProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");

  const mechId = mechData?.id;

  useEffect(() => {
    const fetchMechanicProfile = async () => {
      try {
        if (!mechId) return;

        const response = await getMechanicDetails(mechId);
        console.log(
          "Mechanic details from the backend in the MechanicEditProfile page is",
          response
        );
        const profileData = response?.data?.result;
        setMechProfile(profileData);
        // Don't set previewImage here - let it be handled by profileImage
      } catch (error) {
        console.error("Failed to fetch mechanic profile:", error);
      }
    };
    fetchMechanicProfile();
  }, [mechData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (mechProfile && mechProfile.photo) {
          console.log("mechProfileDetails", mechProfile);
          const result = await getImageUrl(mechProfile.photo, "mechProfile");
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

  const handleImageUpload = (file: File | null, name: string, type: string) => {
    setImageFile(file);
    setFileName(name);
    setFileType(type);
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
      <div className="container mx-auto pt-24 pb-12 w-full">
        <div className="mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mx-5 h-screen">
            <div className="h-24 bg-gradient-to-r from-black to-freeze-color"></div>
            <Formik
              initialValues={{
                name: mechProfile.name || "",
                phone: mechProfile.phone || "",
                photo: mechProfile.photo || "",
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
                      values.photo = response.data.key;
                    }
                  }
                  console.log("Values for updating the mechDetails", values);
                  const result = await updateMechanicDetails(
                    mechId as string,
                    values
                  );
                  console.log(
                    "result from the backend after updating the mechanic details",
                    result
                  );

                  if (result?.status) {
                    navigate("/mech/profile");
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
                    <div className="relative group">
                      {/* Main Profile Image Container */}
                      <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg relative">
                        <ImageUploadProfile
                          currentImage={profileImage}
                          onImageChange={handleImageUpload}
                          size="lg"
                          className="mb-4"
                        />
                      </div>
                    </div>

                    <p className="pt-16 text-gray-600 font-medium">
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
                        onClick={() => navigate("/mech/profile")}
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
