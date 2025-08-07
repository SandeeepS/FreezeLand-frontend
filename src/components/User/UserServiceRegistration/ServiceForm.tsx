import React, { useRef } from "react";
import { FiMapPin, FiPlus } from "react-icons/fi";
import { AddAddress } from "../../../interfaces/AddAddress";
import { FormikProps } from "formik";
import ImagePreview from "./ImagePreview";

interface ServiceFormValues {
  name: string;
  discription: string;
  files: File[];
  defaultAddress: string;
  location: string;
}

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
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return "Image size must be less than 10MB";
    }
    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const currentFiles = formik.values.files || [];

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

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = formik.values.files.filter((_, i) => i !== index);
    formik.setFieldValue("files", updatedFiles);
  };

  return (
    <form className="w-full flex flex-col" onSubmit={formik.handleSubmit}>
      {/* Name Field */}
      <div className="w-full mb-6">
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 focus:outline-none focus:bg-white"
          value={formik.values.name}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        {formik.touched.name && formik.errors.name && (
          <small className="text-red-500">{formik.errors.name}</small>
        )}
      </div>

      {/* Description Field */}
      <div className="w-full mb-6">
        <label
          htmlFor="discription"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Complaint Description *
        </label>
        <textarea
          id="discription"
          name="discription"
          rows={4}
          placeholder="Describe your complaint here..."
          className="w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 focus:outline-none focus:bg-white"
          value={formik.values.discription}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        ></textarea>
        {formik.touched.discription && formik.errors.discription && (
          <small className="text-red-500">{formik.errors.discription}</small>
        )}
      </div>

      {/* Image Upload */}
      <div className="w-full mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Upload Images* (Max 5 images, 10MB each)
        </label>
        <label
          htmlFor="files"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
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

        {formik.values.files?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
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
      </div>

      {/* Default Address */}
      <div className="w-full mb-6">
        <label
          htmlFor="defaultAddress"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Default Address *
        </label>
        <select
          id="defaultAddress"
          name="defaultAddress"
          className="w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 focus:outline-none focus:bg-white"
          value={defaultAddress}
          onChange={(e) => {
            const selected = e.target.value;
            formik.setFieldValue("defaultAddress", selected);
            setDefaultAddress(selected);
          }}
          onBlur={formik.handleBlur}
        >
          <option value="">Select Address</option>
          {userProfile?.address?.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}, {item.district}, {item.state}
            </option>
          ))}
        </select>
        {formik.touched.defaultAddress && formik.errors.defaultAddress && (
          <small className="text-red-500">{formik.errors.defaultAddress}</small>
        )}
      </div>

      {/* Location Section */}
      <div className="w-full mb-6">
        <label
          htmlFor="location"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Update Location *
        </label>
        <button
          type="button"
          onClick={() => setShowLocationOptions(!showLocationOptions)}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          {locationName.longitude !== null
            ? `Location: ${locationName.address}`
            : "Please enter your location"}
        </button>

        {showLocationOptions && locationName.longitude === null && (
          <button
            type="button"
            onClick={handleFetchLocation}
            className="mt-2 w-full bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 flex items-center"
          >
            <FiMapPin className="mr-2" />
            Use Current Location
          </button>
        )}

        {locationName.longitude !== null && (
          <button
            type="button"
            onClick={handleRemoveLocation}
            className="mt-2 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Remove Location
          </button>
        )}
        {locationError && (
          <div className="text-red-500 mt-2">{locationError}</div>
        )}
      </div>

      {/* Submit Button */}
      <div className="w-full my-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white font-medium rounded-lg px-5 py-2.5 ${
            isSubmitting ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;
