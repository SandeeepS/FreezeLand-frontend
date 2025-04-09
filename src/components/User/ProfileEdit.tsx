import React, { useEffect, useState } from "react";
import { FaCamera, FaTrash, FaUserCircle } from "react-icons/fa";
import { Formik, Form, Field } from "formik";
import { object, string } from "yup";
import { useNavigate } from "react-router-dom";
import { getProfile, EditUserDetails } from "../../Api/user";

interface UserProfile {
  _id?: string;
  name?: string;
  phone?: string;
  email?: string;
  image?: string;
}


const validationSchema = object({
  name: string().required("Name is required"),
  phone: string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be 10 digits"),
});

const DEFAULT_PROFILE_IMAGE = "https://via.placeholder.com/150";

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getProfile();
        setUserProfile(response?.data.data.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        
        
      }
    };
    fetchUserProfile();
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserProfile((prev) =>
        prev ? { ...prev, image: reader.result as string } : null
      );
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setUserProfile((prev) =>
      prev ? { ...prev, image: DEFAULT_PROFILE_IMAGE } : null
    );
    setImageFile(null);
  };

  if (!userProfile) {
    return <div className="text-center p-4">Loading user profile...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white p-8 shadow-md rounded-lg border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Edit Profile
      </h1>

      <Formik
        initialValues={{
          _id: userProfile._id || "",
          name: userProfile.name || "",
          phone: userProfile.phone || "",
        }}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={async (values) => {
          try {
            setIsSubmitting(true);
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
          <Form className="flex flex-col gap-8">
            <input type="hidden" name="_id" />

            <div className="flex flex-col items-center">
              {userProfile.image ? (
                <img
                  className="w-32 h-32 rounded-full object-cover border-2 border-blue-500"
                  src={userProfile.image}
                  alt="Profile"
                />
              ) : (
                <FaUserCircle className="w-32 h-32 text-gray-400" />
              )}

              <p className="mt-4 text-gray-600 font-semibold">
                Email: {userProfile.email}
              </p>

              <div className="flex gap-4 mt-4">
                <label className="cursor-pointer text-blue-600 flex items-center">
                  <FaCamera className="mr-2" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  Change Photo
                </label>

                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="text-red-600 flex items-center"
                  disabled={!imageFile}
                >
                  <FaTrash className="mr-2" />
                  Remove Photo
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Name
                </label>
                <Field
                  name="name"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
                {errors.name && touched.name && (
                  <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Phone Number
                </label>
                <Field
                  name="phone"
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
                {errors.phone && touched.phone && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.phone}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileEdit;
