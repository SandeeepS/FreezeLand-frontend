import React, { useRef } from "react";
import { FiMapPin } from "react-icons/fi";
import PreviewImage from "../../User/PreviewImage";
import { AddAddress } from "../../../interfaces/AddAddress";

// Define ServiceFormProps interface properly
interface ServiceFormProps {
  formik: any; 
  userProfile: any;
  defaultAddress: string;
  setDefaultAddress: (address: string) => void;
  locationName: {
    address: string;
    latitude: number | null;
    longitude: number | null;
  };
  locationError: string;
  validateLocationName: (location: any) => { ok: boolean; message?: string };
  handleFetchLocation: () => void;
  handleRemoveLocation: () => void;
  showLocationOptions: boolean;
  setShowLocationOptions: (show: boolean) => void;
  isSubmitting: boolean; // Add isSubmitting prop
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  formik,
  userProfile,
  defaultAddress,
  setDefaultAddress,
  locationName,
  locationError,
  validateLocationName,
  handleFetchLocation,
  handleRemoveLocation,
  showLocationOptions,
  setShowLocationOptions,
  isSubmitting, // Use this prop to disable the submit button
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  
  return (
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
            name="name" // Adding name attribute for formik
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
            name="discription" // Adding name attribute for formik
            placeholder="Describe your complaint here..."
            rows={4}
            value={formik.values.discription}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          ></textarea>
          {formik.touched.discription && formik.errors.discription && (
            <small className="text-red-500">{formik.errors.discription}</small>
          )}
        </div>
      </div>

      {/* Upload Image */}
      <label
        htmlFor="file"
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
      >
        Upload Image*
      </label>
      <div className="flex items-center justify-center w-full mb-5">
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file"
          name="file"
          ref={fileRef}
          type="file"
          accept="image/*" // Restrict to image files
          onBlur={formik.handleBlur}
          onChange={(event) => {
            const file = event.target.files?.[0] || null;
            formik.setFieldValue("file", file);
          }}
        />
      </div>
      {formik.touched.file && formik.errors.file && (
        <small className="text-red-500">{formik.errors.file}</small>
      )}
      {formik.values.file && <PreviewImage file={formik.values.file} />}

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
              type="button" // Changed from submit to button
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
  );
};

export default ServiceForm;