import React, { useEffect, useState } from "react";
import Header from "../../components/User/Header";
import { useParams } from "react-router-dom";
import { getService } from "../../Api/admin";
import { FiMapPin } from "react-icons/fi";
import { getProfile } from "../../Api/user";
import { Card, CardContent, Typography } from "@mui/material";
import { AddAddress } from "../../interfaces/AddAddress";
import Footer from "../../components/User/Footer";
import { Formik } from "formik";
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

interface ServiceData {
  _id: string;
  name: string;
  image:string;
  discription: string;
  status: boolean;
  isDeleted: boolean;
}

const Service: React.FC = () => {
  const { id } = useParams();
  console.log("id from the userHome page is ", id);
  const [service, setServices] = useState<ServiceData>();
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [locationName, setLocationName] = useState({
    address:"",
    latitude:null,
    longitude:null
  });
  const [isAddressClicked, setIsAddressClicked] = useState(false);
  const [userProfile, setUserProfile] = useState("");
  const [defaultAddress, setDefaultAddress] = useState<AddAddress>();
  const [selectedOption, setSelectedOption] = useState<
    "default" | "current" | null
  >(null);

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
          setDefaultAddress(defaultAdd);
        }
      } catch (error){
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
          if (data.results && data.results.length > 0) {
            setLocationName({
              address: data.results[0].formatted_address,
              latitude: data.results[0].geometry.location.lat,
              longitude: data.results[0].geometry.location.lng,
            });

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
      { enableHighAccuracy:true}
    );
  };

  // Handle primary button click to show location options
  const handleLocationClick = () => {
    setSelectedOption("current");
    if (showLocationOptions == false) {
      setShowLocationOptions(true);
    } else {
      setShowLocationOptions(false);
    }
  };

  const handleAddressClick = () => {
    setSelectedOption("default");
    if (isAddressClicked == false) {
      setIsAddressClicked(true);
    } else {
      setIsAddressClicked(false);
    }
  };

  // Remove location data
  const handleRemoveLocation = () => {
    setLocationName({
      address:"",
      longitude:null,
      latitude:null,
    });
    setShowLocationOptions(false);
  };

  const handleSelectedAddress = (item: object) => {
    console.log("item when clicking is ", item);
    setDefaultAddress(item);
    console.log("after changing the default addres is ", defaultAddress);
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
                complaintDiscription: "",
                image: "",
                selectedAddress: {},
                location: "",
              }}
              enableReinitialize={true}
              onSubmit={async (values) => {
                console.log("submited complaint details is", values);
                const combinedData = {
                  ...values,
                  ...defaultAddress,
                  locationName: locationName
                  
                }
                console.log("complaint details after combining the addres adn location ", combinedData);
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
                        id="complaintDiscription"
                        placeholder="Describe your complaint here..."
                        rows={4}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      ></textarea>
                      {formik.errors.complaintDiscription && (
                        <small className="text-red-500">
                          {formik.errors.complaintDiscription}
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
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full  border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id="image"
                        type="file"
                        className="hidden"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      {formik.errors.image && (
                        <small className="text-red-500">
                          {formik.errors.image}
                        </small>
                      )}
                    </label>
                  </div>
                  {/**providing space for inserting the device image*/}

                  {/**Adding  address with addaddress option. */}
                  <div className="flex flex-wrap  ">
                    {/* adding address Button and Options */}
                    <div className="w-full mb-6 my-5">
                      <button
                        type="button"
                        onClick={handleAddressClick}
                        className={`flex items-center px-4 py-2 rounded w-full  bg-blue-500 text-white hover:bg-blue-600 focus:ring-2
                  }`}
                      >
                        {isAddressClicked
                          ? `Click to remove`
                          : "Select Address"}
                      </button>

                      {isAddressClicked && (
                        <div>
                          <div className="">
                            <p className="text-rose-500	text-sm	">
                              By default the Default address is selected , you
                              can change it if you needed
                            </p>
                          </div>

                          <div className="flex w-full ">
                            <div className="m-3 w-[40%]">
                              {/**Default address card */}

                              <Card
                                sx={{
                                  maxWidth: 140,
                                  height: 180,
                                  border: `1px solid blue`,
                                }}
                                className="mx-2"
                              >
                                <CardContent>
                                  <p className="text-sm font-bold">
                                    Default Address
                                  </p>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary" }}
                                  >
                                    {defaultAddress?.name}
                                    <br />
                                    {defaultAddress?.email}
                                    <br />
                                    {defaultAddress?.district}
                                    <br />
                                    {defaultAddress?.landMark}
                                    <br />
                                    {defaultAddress?.state}
                                    <br />
                                    {defaultAddress?.phone}
                                    <br />
                                  </Typography>
                                </CardContent>
                              </Card>
                            </div>
                            <div className="flex overflow-x-auto m-5 space-x-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                              {/* Repeatable Card Section */}
                              {userProfile?.address.map((item, index) => (
                                <div
                                  onClick={() => handleSelectedAddress(item)}
                                >
                                  <Card
                                    key={index}
                                    sx={{
                                      maxWidth: 120,
                                      height: 180,
                                      transition: {
                                        transform: "scale(1.05)", // Slightly enlarge the card
                                        boxShadow:
                                          "0px 4px 15px rgba(0, 0, 0, 0.2)", // Add a shadow on hover
                                      },
                                    }}
                                    className="flex-shrink-0 mx-2 cursor-pointer border border-gray-300 hover:border-blue-500 rounded-lg"
                                  >
                                    <CardContent>
                                      <Typography
                                        variant="body2"
                                        sx={{ color: "text.secondary" }}
                                      >
                                        {item?.name}
                                        <br />
                                        {item?.email}
                                        <br />
                                        {item?.district}
                                        <br />
                                        {item?.landMark}
                                        <br />
                                        {item?.state}
                                        <br />
                                        {item?.phone}
                                        <br />
                                      </Typography>
                                    </CardContent>
                                  </Card>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/**code for selecting the current location of the user*/}
                  <div className="flex flex-wrap  ">
                    {/* Location Button and Options */}
                    <div className="w-full  mb-6 my-5">
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

                      {showLocationOptions && locationName.longitude == null && (
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
