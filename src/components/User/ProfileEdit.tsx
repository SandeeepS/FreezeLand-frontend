import React, { useEffect, useState } from "react";
import { FaCamera, FaTrash} from "react-icons/fa";
import { Formik, Form, Field } from "formik";
import { object, string } from "yup";
import { useNavigate } from "react-router-dom";
import { getProfile, EditUserDetails, getImageUrl } from "../../Api/user";
import { getS3SingUrl } from "../../Api/admin"; // Import the getS3SingUrl function
import Header from "../User/Header";
import { useAppSelector } from "../../App/store";

interface UserProfile {
  _id?: string;
  name?: string;
  phone?: string;
  email?: string;
  image?: string;
  location?: string;
  profile_picture?: string; 
}

const validationSchema = object({
  name: string().required("Name is required"),
  phone: string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be 10 digits"),
  location: string(),
});

const DEFAULT_PROFILE_IMAGE = "/src/Images/businessman.png";

const ProfileEdit: React.FC = () => {
  const userData = useAppSelector((state) => state.auth.userData);
  
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [profileImage,setProfileImage] = useState<string>("");


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = userData?.id
        const response = await getProfile(userId as string);
        const userProfileData = response?.data.data.data;
        setUserProfile(userProfileData);
        setPreviewImage(userProfileData.image || DEFAULT_PROFILE_IMAGE);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchUserProfile();
  }, [userData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if ( userProfile && userProfile.profile_picture) {
          const result = await getImageUrl(
            userProfile.profile_picture,
            "service"
          );
          if (result) {
            setProfileImage(result.data.url);
          }
        }
      } catch (error) {
        console.log(error as Error);
      }
    }
    fetchData();
  },[userProfile])



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

  if (!userProfile) {
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
          <p className="text-center mt-4 text-gray-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="fixed top-0 z-10 w-full">
        <Header />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
   
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-black to-freeze-color"></div>
          
            <Formik
              initialValues={{
                _id: userProfile._id || "",
                name: userProfile.name || "",
                phone: userProfile.phone || "",
                location: userProfile.location || "",
                profile_picture: userProfile.profile_picture || "",
              }}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={async (values) => {
                try {
                  setIsSubmitting(true);
                  
                  // Handle image upload to S3 if a new image is selected
                  if (imageFile) {
                    const folderName = "UserProfile";
                    const response = await getS3SingUrl(fileName, fileType,folderName);
                    if (response?.data.uploadURL) {
                      // Upload the image to S3
                      await fetch(response.data.uploadURL, {
                        method: "PUT",
                        headers: {
                          "Content-Type": fileType,
                        },
                        body: imageFile,
                      });
                      
                      // Update the imageKey in the values
                      values.profile_picture = response.data.key;
                    }
                  }
                  
                  console.log("Submitting values:", values);
                  const result = await EditUserDetails(values);
                  if (result?.status) {
                    navigate("/user/account");
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
                  <input type="hidden" name="imageKey" />
                  
                  <div className="flex flex-col items-center -mt-16 mb-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">
                        <img
                          className="w-full h-full object-cover"
                          src={profileImage|| DEFAULT_PROFILE_IMAGE}
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
                      {userProfile.email}
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
                          <div className="text-red-500 text-sm mt-1">{errors.name}</div>
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
                        onClick={() => navigate('/user/account')}
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

export default ProfileEdit;