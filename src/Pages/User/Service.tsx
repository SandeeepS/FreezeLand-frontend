import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/User/Header";
import { useParams } from "react-router-dom";
import { getService } from "../../Api/admin";
import { FiMapPin } from "react-icons/fi";
import { getProfile } from "../../Api/user";
import { Card, CardContent, Typography } from "@mui/material";
import { AddAddress } from "../../interfaces/AddAddress";
import Footer from "../../components/User/Footer";
import { Formik } from "formik";
import { UserData } from "../../interfaces/UserData";
import { Iconcern } from "../../interfaces/Iconcern";
import { ServiceFormValidation } from "../../components/Common/Validations";
import PreviewImage from "../../components/User/PreviewImage";
import { registerComplaint } from "../../Api/user";
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

//interface used for validating the lcoation
interface Location {
  address: string;
  latitude: number | null;
  longitude: number | null;
}

//for used for vlaidating the result
type ValidationResult = {
  ok: boolean;
  message?: string;
};

const Service: React.FC = () => {
  const { id } = useParams();
  console.log("id from the userHome page is ", id);
  const [service, setServices] = useState<Iconcern>();
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [locationName, setLocationName] = useState({
    address: "",
    latitude: null,
    longitude: null,
  });
  const [userProfile, setUserProfile] = useState<UserData>();
  const [defaultAddress, setDefaultAddress] = useState<string>("");
  const [defaultAddressDetails, setDefaultAddressDetails] =
    useState<AddAddress>();
  const [locationError, setLocationError] = useState<string| undefined>("");

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceResult, profileResult] = await Promise.all([
          getService(id),
          getProfile(),
        ]);
        if (serviceResult) {
          console.log("Service result from the backend", serviceResult.data);
          setServices(serviceResult.data);
        }

        if (profileResult) {
          console.log("Profile Result is  from the backend is ", profileResult);
          const profileData = profileResult.data.data.data;
          console.log("Profile reuslt from the backend", profileData);
          setUserProfile(profileData);
          const defaultAdd = profileData.address.find(
            (addr: AddAddress) => addr._id == profileData.defaultAddress
          );
          if (!defaultAdd) {
            console.log("Default address not found, check if IDs match.");
          } else {
            console.log("Default address found:", defaultAdd);
          }
          setDefaultAddress(defaultAdd._id);
          setDefaultAddressDetails(defaultAdd);
        }
      } catch (error) {
        console.log(error as Error);
      }
    };

    fetchData();
  }, [id]);

  // Handle location fetching
  const handleFetchLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
          );
          const data = await response.json();
          console.log("Geocoding respose is ", data);
          if (data.results && data.results.length > 0){
            setLocationName({
              address: data.results[0].formatted_address,
              latitude: data.results[0].geometry.location.lat,
              longitude: data.results[0].geometry.location.lng,
            });
            setLocationError("");

          } else {
            console.log("No results found for location");
          }
        } catch (error) {
          console.error("Error fetching location name:", error);
        }
      },
      (error) => {
        console.error("Error fetching location:", error);
      },
      { enableHighAccuracy: true }
    );
  };

  const validateLocationName = (value: Location): ValidationResult => {
    if (!value.address || !value.latitude || !value.longitude) {
      return { ok: false, message: "Location is required" };
    }
    // Additional checks can be added here if needed
    return { ok: true };
  };

  // Handle primary button click to show location options
  const handleLocationClick = () => {
    if (showLocationOptions == false) {
      setShowLocationOptions(true);
    } else {
      setShowLocationOptions(false);
    }
  };

  // Remove location data
  const handleRemoveLocation = () => {
    setLocationName({
      address: "",
      longitude: null,
      latitude: null,
    });
    setShowLocationOptions(false);
  };

  return (
    <div className="flex flex-col">
      <Header />
      <div className="md:flex md:justify-between mt-20 md:pl-32 mx-6 md:w-full">
        <div className="md:w-[40%]">
          <div className="md:mb-12 flex justify-center">
            <img src={service?.image} alt="" />
          </div>
          <div className="mb-12 flex justify-center my-5">
            <h1 className="font-Metal text-xl">{service?.discription}</h1>
          </div>
        </div>
        <div className="w-[30%] my-10"></div>
        <div className="w-full ">
          {
            <Formik
              initialValues={{
                name: "",
                discription: "",
                location: "",
                file: null,
                defaultAddress: "",
              }}
              validationSchema={ServiceFormValidation}
              enableReinitialize={true}
              onSubmit={async (values) => {
                console.log("submited complaint details is", values);
                const isLocation = validateLocationName(locationName);
                console.log("location gnglsdfnlsd ", isLocation);
                if (isLocation.ok == false) {
                  console.log("Error message ");
                  setLocationError(isLocation.message);
                  
                } else {
                  setLocationError("");
                  const combinedData:Iconcern = {
                  
                    name:values.name,
                    image:values?.file?.name,
                    defaultAddress:defaultAddress,
                    discription:values.discription,
                    locationName:locationName
                  };
                  console.log(
                    "complaint details after combining the addres adn location ",
                    combinedData
                  );
                  const result = await registerComplaint(combinedData);
                  if(result){
                    console.log("result reached in the frontend is ",result)
                  }
                }
              }}
            >
              {(formik) => (
                <form
                  className="w-full max-w-lg flex-row items-center justify-center"
                  onSubmit={formik.handleSubmit}
                >
                  <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="grid-first-name"
                      >
                        Name *
                      </label>
                      <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        id="name"
                        type="text"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.name && (
                        <small className="text-red-500">
                          {formik.errors.name}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="grid-complaint"
                      >
                        Complaint Description *
                      </label>
                      <textarea
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="discription"
                        placeholder="Describe your complaint here..."
                        rows={4}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      ></textarea>
                      {formik.errors.discription && (
                        <small className="text-red-500">
                          {formik.errors.discription}
                        </small>
                      )}
                    </div>
                  </div>

                  {/**providing space for inserting the device image*/}
                  <label
                    htmlFor=""
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  >
                    Upload Image*
                  </label>
                  <div className="flex items-center justify-center w-full mb-5">
                    <input
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      id="multiple_files"
                      ref={fileRef}
                      type="file"
                      name="file"
                      multiple
                      onBlur={formik.handleBlur}
                      onChange={(event) => {
                        formik.setFieldValue("file", event.target.files[0]);
                      }}
                    />
                  </div>
                  {formik.errors.file && (
                    <small className="text-red-500">{formik.errors.file}</small>
                  )}
                  {/**providing space for inserting the device image*/}
                  <div>
                    {formik.values.file && (
                      <PreviewImage file={formik.values.file} />
                    )}
                  </div>
                  {/**Adding  address with addaddress option. */}
                  <div className="flex flex-wrap">
                    {/* adding address Button and Options */}
                  </div>

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
                          formik.setFieldValue(
                            "defaultAddress",
                            event.target.value
                          );
                          setDefaultAddress(event.target.value);
                        }}
                      >
                        <option value="">Select Address</option>
                        {userProfile?.address.map((item: AddAddress) => (
                          <option key={item._id} value={item._id}>
                            {item.name}, {item.district}, {item.state}
                          </option>
                        ))}
                      </select>
                      {formik.errors.defaultAddress && (
                        <small className="text-red-500">
                          {formik.errors.defaultAddress}
                        </small>
                      )}
                    </div>
                  </div>
                  {/**code for selecting the current location of the user*/}
                  <div className="flex flex-wrap  ">
                    {/* Location Button and Options */}
                    <div className="w-full  mb-6 my-5">
                      <label
                        htmlFor=""
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      >
                        update location*
                      </label>
                      <button
                        type="button"
                        onClick={handleLocationClick}
                        className={`flex items-center px-4 py-2 rounded w-full bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
                       }`}
                      >
                        {locationName.longitude !== null
                          ? `Location: ${locationName?.address}`
                          : "Please enter your location"}
                      </button>

                      {showLocationOptions &&
                        locationName.longitude == null && (
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
                          type="submit"
                          onClick={handleRemoveLocation}
                          className="mt-2 flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none w-full"
                        >
                          Remove Location
                        </button>
                      )}
                    </div>
                  </div>
                  {/**code for selecting the current location of the user will end here*/}
                  {locationError && (
                    <div className="text-red-500 mt-2">{locationError}</div>
                  )}

                  <div className="w-full my-2 ">
                    <button
                      type="submit"
                      className="focus:outline-none text-white bg-green-400 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 w-full"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          }
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Service;
