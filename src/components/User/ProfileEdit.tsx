import React, { useEffect, useState } from "react";
import { FaCamera, FaTrash } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { getProfile } from "../../Api/user";
import { Formik } from "formik";
import { EditUserValidation } from "../Common/Validations";
import { useNavigate } from "react-router-dom";
import { EditUserDetails } from "../../Api/user";

// interface initialVal {
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
//   cpassword: string;
// }

interface UserProfile {
  _id?: string;
  name?: string;
  phone?: string;
  email?: string;
  image?: string;
  address?: string;
  location?: string;
}

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getProfile();
        const user = response?.data.data.data;
        console.log("User details from the backend in the Account is ", user);
        setUserProfile(user);
      } catch (error) {
        console.log(
          "Failed to fetch the user Details from the Account section",
          error
        );
      }
    };
    fetchUserDetails();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile({ ...userProfile, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setUserProfile({
      ...userProfile,
      image: "https://via.placeholder.com/150",
    });
    setImageFile(null);
  };

  return (
    <div className="flex flex-col h-screen bg-white p-8 shadow-md rounded-lg border border-gray-200 justify-center w-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit Profile</h2>
      </div>
      {userProfile ? (
        <Formik
          initialValues={{
            _id: userProfile._id || "",
            name: userProfile.name || "",
            phone: userProfile.phone || "",
          }}
          validationSchema={EditUserValidation}
          enableReinitialize={true} // This will reinitialize form with new values when userProfile updates
          onSubmit={async (values) => {
            console.log("Submited the userdetails", values);
            setIsSaving(true);
       
            try {
              const formData = {
                _id: values._id,
                name: values.name,
                phone: values.phone,
              };
              console.log("form data is ",formData);
              const result = await EditUserDetails(formData);
              if (result?.status) {
                console.log("resulte reached the fronend");
                setIsSaving(false);
                navigate("/user/account");
              }
              console.log("Result from the edit form is ", result);
            } catch (error) {
              console.log(error);
            } finally {
              setIsSaving(false);
            }
          }}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col gap-8">
                {/* Hidden input for user id */}
                <input type="hidden" name="_id" value={formik.values._id} />

                {/* Profile edit section */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  {userProfile.image ? (
                    <img
                      className="w-32 h-32 rounded-full object-cover border-2 border-blue-500"
                      src={userProfile.image}
                      alt="Profile"
                    />
                  ) : (
                    <div>
                      <FaUserCircle className="w-32 h-32 rounded-full object-cover border-2 border-blue-500" />
                    </div>
                  )}

                  <p className="mt-4 text-gray-600 font-semibold text-lg">
                    Email: {userProfile.email}
                  </p>

                  <label className="mt-4 cursor-pointer text-blue-600 flex items-center">
                    <FaCamera className="mr-2" size={24} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    Change Photo
                  </label>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="mt-2 text-red-600 hover:underline flex items-center"
                    disabled={!imageFile}
                  >
                    <FaTrash className="mr-2" size={24} />
                    Remove Photo
                  </button>
                </div>

                {/* form to edit the user */}
                <div className="flex-grow">
                  <div className="mb-6">
                    <label
                      className="block text-gray-700 font-semibold mb-2"
                      htmlFor="name"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      placeholder="Enter your name"
                    />
                    {formik.errors.name && (
                      <small className="text-red-500">
                        {formik.errors.name}
                      </small>
                    )}
                  </div>

                  <div className="mb-6">
                    <label
                      className="block text-gray-700 font-semibold mb-2"
                      htmlFor="phone"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.phone}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      placeholder="Enter your phone number"
                    />
                    {formik.errors.phone && (
                      <small className="text-red-500">
                        {formik.errors.phone}
                      </small>
                    )}
                  </div>

                  <button
                    type="submit"
                    className={`mt-4 px-6 py-3 w-full bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none ${
                      isSaving ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </Formik>
      ) : (
        <div>
          <p>UserDetails are loading...</p>
        </div>
      )}
    </div>
  );
};

export default ProfileEdit;
