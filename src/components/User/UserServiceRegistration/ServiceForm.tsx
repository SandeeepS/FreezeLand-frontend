import React, { useRef} from "react";
import { FiMapPin, FiPlus } from "react-icons/fi";
import { AddAddress } from "../../../interfaces/AddAddress";
import { FormikProps } from "formik";
import ImagePreview from "./ImagePreview";

// Define the shape of your form values
interface ServiceFormValues {
  name: string;
  discription: string;
  files: File[];
  defaultAddress: string;
  location?:string;
}

// Define ServiceFormProps interface properly
interface ServiceFormProps {
  formik: FormikProps<ServiceFormValues>;
  userProfile: { address?: AddAddress[] };
  defaultAddress: string;
  setDefaultAddress: (address: string) => void;
  locationName: {
    address: string;
    latitude: number | null;
    longitude: number | null;
  };
  locationError: string;
  validateLocationName: (location: {
    address: string;
    latitude: number | null;
    longitude: number | null;
  }) => { ok: boolean; message?: string };
  handleFetchLocation: () => void;
  handleRemoveLocation: () => void;
  showLocationOptions: boolean;
  setShowLocationOptions: (show: boolean) => void;
  isSubmitting: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  formik,
  userProfile,
  defaultAddress,
  setDefaultAddress,
  locationName,
  locationError,
  handleFetchLocation,
  handleRemoveLocation,
  showLocationOptions,
  setShowLocationOptions,
  isSubmitting,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);

  // Validate image file
  const validateImage = (file: File): string | null => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return "Only JPEG, PNG, GIF, and WebP images are allowed";
    }

    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return "Image size must be less than 10MB";
    }

    return null;
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const currentFiles = formik.values.files || [];

    // Check if adding new files would exceed the limit
    if (currentFiles.length + selectedFiles.length > 5) {
      alert(
        `You can only upload up to 5 images. Currently you have ${currentFiles.length} images.`
      );
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    selectedFiles.forEach((file) => {
      const error = validateImage(file);
      if (error) {
        errors.push(`File ${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert(`Some files were not added:\n${errors.join("\n")}`);
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...currentFiles, ...validFiles];
      formik.setFieldValue("files", updatedFiles);
    }

    // Clear the input
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    const updatedFiles = formik.values.files.filter((_, i) => i !== index);
    formik.setFieldValue("files", updatedFiles);
  };

  return (
    <>
      <form
        className="w-full max-w-lg flex-row items-center justify-center"
        onSubmit={formik.handleSubmit}
      >
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="name"
            >
              Name *
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="name"
              name="name"
              type="text"
              value={formik.values.name}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            {formik.touched.name && formik.errors.name && (
              <small className="text-red-500">{formik.errors.name}</small>
            )}
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="discription"
            >
              Complaint Description *
            </label>
            <textarea
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="discription"
              name="discription"
              placeholder="Describe your complaint here..."
              rows={4}
              value={formik.values.discription}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            ></textarea>
            {formik.touched.discription && formik.errors.discription && (
              <small className="text-red-500">
                {formik.errors.discription}
              </small>
            )}
          </div>
        </div>

        {/* Multiple Image Upload */}
        <div className="mb-6">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Upload Images* (Max 5 images, 10MB each)
          </label>

          {/* File Input */}
          <div className="flex items-center justify-center w-full mb-3">
            <label
              htmlFor="files"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiPlus className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> images
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF, WebP (MAX 10MB each)
                </p>
                <p className="text-xs text-gray-400">
                  {formik.values.files?.length || 0}/5 images uploaded
                </p>
              </div>
              <input
                id="files"
                name="files"
                ref={fileRef}
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={formik.values.files?.length >= 5}
              />
            </label>
          </div>

          {/* Image Previews */}
          {formik.values.files && formik.values.files.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-3">
              {formik.values.files.map((file, index) => (
                <ImagePreview
                  key={`${file.name}-${index}`}
                  file={file}
                  index={index}
                  onRemove={handleRemoveImage}
                />
              ))}
            </div>
          )}

          {formik.touched.files && formik.errors.files && (
            <small className="text-red-500">
              {typeof formik.errors.files === "string"
                ? formik.errors.files
                : Array.isArray(formik.errors.files)
                ? formik.errors.files
                    .map((err) =>
                      typeof err === "string"
                        ? err
                        : typeof err === "object" && err !== null
                        ? JSON.stringify(err)
                        : ""
                    )
                    .join(", ")
                : ""}
            </small>
          )}
        </div>

        {/* Default Address */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              htmlFor="defaultAddress"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Default Address *
            </label>
            <select
              className="appearance-none cursor-pointer block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="defaultAddress"
              name="defaultAddress"
              value={defaultAddress}
              onChange={(event) => {
                const selectedValue = event.target.value;
                formik.setFieldValue("defaultAddress", selectedValue);
                setDefaultAddress(selectedValue);
              }}
              onBlur={formik.handleBlur}
            >
              <option value="">Select Address</option>
              {userProfile?.address?.map((item: AddAddress) => (
                <option key={item._id} value={item._id}>
                  {item.name}, {item.district}, {item.state}
                </option>
              ))}
            </select>
            {formik.touched.defaultAddress && formik.errors.defaultAddress && (
              <small className="text-red-500">
                {formik.errors.defaultAddress}
              </small>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-wrap">
          <div className="w-full mb-6 my-5">
            <label
              htmlFor="location"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Update Location*
            </label>
            <button
              type="button"
              onClick={() => setShowLocationOptions(!showLocationOptions)}
              className={`flex items-center px-4 py-2 rounded w-full bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300`}
            >
              {locationName.longitude !== null
                ? `Location: ${locationName?.address}`
                : "Please enter your location"}
            </button>

            {showLocationOptions && locationName.longitude === null && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleFetchLocation}
                  className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none w-full"
                >
                  <FiMapPin className="mr-2" />
                  Use Current Location
                </button>
              </div>
            )}

            {locationName.longitude !== null && (
              <button
                type="button"
                onClick={handleRemoveLocation}
                className="mt-2 flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none w-full"
              >
                Remove Location
              </button>
            )}
          </div>
        </div>
        {locationError && (
          <div className="text-red-500 mt-2">{locationError}</div>
        )}

        {/* Submit Button */}
        <div className="w-full my-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`focus:outline-none text-white ${
              isSubmitting ? "bg-gray-400" : "bg-green-400 hover:bg-green-700"
            } focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 w-full`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </>
  );
};

export default ServiceForm;
