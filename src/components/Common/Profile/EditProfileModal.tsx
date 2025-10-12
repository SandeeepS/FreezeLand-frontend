import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { object, string } from "yup";
import ImageUploadProfile from "../ProfileImage/ImageUploadProfile";
import { getS3SingUrl } from "../../../Api/user";

interface EditProfileModalProps {
  role: "user" | "mech";
  currentData: {
    _id: string;
    name: string;
    phone: string;
    email: string;
    profile_picture: string;
  };
  currentImage: string;
  onClose: () => void;
  onSave: (values: any) => Promise<any>;
}

const validationSchema = object({
  name: string()
    .required("Name is required")
    .trim()
    .strict(true)
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must not exceed 50 characters")
    .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
    .notOneOf([""], "Name cannot be empty or only spaces"),
  phone: string()
    .required("Phone number is required")
    .matches(
      /^[6-9]\d{9}$/,
      "Phone number must be 10 digits and start with 6-9"
    ),
});

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  currentData,
  currentImage,
  onClose,
  onSave,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");

  const handleImageUpload = (file: File | null, name: string, type: string) => {
    setImageFile(file);
    setFileName(name);
    setFileType(type);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-freeze-color text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <Formik
            initialValues={{
              _id: currentData._id,
              name: currentData.name,
              phone: currentData.phone,
              profile_picture: currentData.profile_picture,
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              try {
                setIsSubmitting(true);

                // Handle image upload to S3 if a new image is selected
                if (imageFile) {
                  const folderName = "UserProfile";
                  const response = await getS3SingUrl(
                    fileName,
                    fileType,
                    folderName
                  );

                  if (response?.data.uploadURL) {
                    // Upload the image to S3
                    await fetch(response.data.uploadURL, {
                      method: "PUT",
                      headers: {
                        "Content-Type": fileType,
                      },
                      body: imageFile,
                    });
                    // Update the profile_picture in the values
                    values.profile_picture = response.data.key;
                  }
                }

                const result = await onSave(values);
                if (result?.status || result?.data?.result) {
                  onClose();
                  // Reload the page to reflect changes
                  window.location.reload();
                }
              } catch (error) {
                console.error("Failed to update profile:", error);
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            {({ errors, touched }) => (
              <Form>
                {/* Profile Image Section */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-32 h-32 rounded-full mb-12">
                    <ImageUploadProfile
                      currentImage={currentImage}
                      onImageChange={handleImageUpload}
                      size="lg"
                    />
                  </div>
                  {/* <p className="mt-4 text-gray-600 font-medium">
                    {currentData.email}
                  </p> */}

                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
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

                    {/* Phone Field */}
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

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-4 border-t">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      disabled={isSubmitting}
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
  );
};

export default EditProfileModal;
