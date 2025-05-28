import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProfile, getService } from "../../Api/user";
import { AddAddress } from "../../interfaces/AddAddress";
import Footer from "../../components/User/Footer";
import { Formik } from "formik";
import { Iconcern } from "../../interfaces/Iconcern";
import { ServiceFormValidation } from "../../components/Common/Validations";
import { registerComplaint } from "../../Api/user";
import { useSelector } from "react-redux";
import { RootState } from "../../App/store";
import { getImageUrl } from "../../Api/user";
import { getS3SingUrl } from "../../Api/admin";
import ConformationModal from "../../components/Common/ConformationModal";
import UserData from "../../interfaces/UserData";
import ServiceDetails from "../../components/User/UserServiceRegistration/ServiceDetails";
import ServiceForm from "../../components/User/UserServiceRegistration/ServiceForm";
import AboutTheService from "../../components/User/UserServiceRegistration/AboutTheService";
import AddressWarningModal from "../../components/User/UserServiceRegistration/AddressWarningModal";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

// Define LocationData interface
interface LocationData {
  address: string;
  latitude: number | null;
  longitude: number | null;
}

const Service: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userData = useSelector((state: RootState) => state.auth.userData);
  const userId = userData?.id;
  const [service, setServices] = useState<Iconcern | undefined>();
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [locationName, setLocationName] = useState<LocationData>({
    address: "",
    latitude: null,
    longitude: null,
  });
  const [userProfile, setUserProfile] = useState<UserData | undefined>();
  const [defaultAddress, setDefaultAddress] = useState<string>("");
  const [defaultAddressDetails, setDefaultAddressDetails] = useState<
    AddAddress | undefined
  >();
  const [locationError, setLocationError] = useState<string>("");
  const [serviceImage, setServiceImage] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAddressWarningModal, setShowAddressWarningModal] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // These services should probably come from the backend/API
  const services = [
    "Applicable for both window & Split ACs",
    "Advanced Foam-jet cleaning of indoor unit",
    "Jet-spray cleaning of outer unit",
    "Final checks & post-service cleaning",
  ];

  useEffect(() => {
    // Fetching data
    const fetchData = async () => {
      try {
        if (!id || !userId) {
          console.error("Missing id or userId");
          return;
        }

        const [serviceResult, profileResult] = await Promise.all([
          getService(id),
          getProfile(userId),
        ]);

        if (serviceResult && serviceResult.data) {
          setServices(serviceResult.data);

          if (serviceResult.data.imageKey) {
            const result = await getImageUrl(
              serviceResult.data.imageKey,
              "service"
            );
            if (result && result.data && result.data.url) {
              setServiceImage(result.data.url);
            }
          }
        }

        if (profileResult && profileResult.data && profileResult.data.data) {
          const profileData = profileResult.data.data.data;
          console.log("Profile data fetched:", profileData);

          if (profileData) {
            setUserProfile(profileData);

            // Check if address array exists and has addresses
            if (profileData.address && profileData.address.length > 0) {
              const defaultAdd = profileData.address.find(
                (addr: AddAddress) => addr._id === profileData.defaultAddress
              );

              if (defaultAdd) {
                setDefaultAddress(defaultAdd._id);
                setDefaultAddressDetails(defaultAdd);
              } else {
                // If no default address is set, use the first address
                setDefaultAddress(profileData.address[0]._id);
                setDefaultAddressDetails(profileData.address[0]);
              }
            } else {
              // No addresses found - show warning modal
              console.log("No addresses found for user");
              setShowAddressWarningModal(true);
            }
          } else {
            console.error("Profile data is missing");
            setShowAddressWarningModal(true);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, userId]);

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
            setLocationError("");
          }
        } catch (error) {
          console.error("Error fetching location name:", error);
          setLocationError("Failed to fetch location. Please try again.");
        }
      },
      (error) => {
        console.error("Error fetching location:", error);
        setLocationError(
          "Failed to get your location. Please enable location services."
        );
      },
      { enableHighAccuracy: true }
    );
  };

  const validateLocationName = (value: LocationData) => {
    if (!value.address || value.latitude === null || value.longitude === null) {
      return { ok: false, message: "Location is required" };
    }
    return { ok: true };
  };

  const handleRemoveLocation = () => {
    setLocationName({
      address: "",
      longitude: null,
      latitude: null,
    });
    setShowLocationOptions(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/user/homepage");
  };

  const handleCloseAddressWarningModal = () => {
    setShowAddressWarningModal(false);
    // Navigate back to previous page or homepage
    navigate("/user/homepage");
  };

  const handleAddAddress = () => {
    setShowAddressWarningModal(false);
    // Navigate to add address page
    navigate("/user/AddAddress");
  };

  // Check if user has addresses before rendering the form
  const hasAddresses = userProfile?.address && userProfile.address.length > 0;

  return (
    <>
      <div className="flex flex-col mt-36 overflow-hidden">
        <div className="flex flex-col justify-center items-center my-4">
          <h2 className="font-bold font-sans text-lg">{service?.name}</h2>
        </div>

        {/* Main Content */}
        <div className="md:flex md:justify-between mt-10 md:pl-32 mx-6 md:w-full">
          {/* Service Details */}
          <div className={`transition-all duration-500 ease-in-out md:w-full`}>
            <ServiceDetails serviceImage={serviceImage} />
          </div>

          <div className="mr-24">
            <AboutTheService title="About the service" points={services} />
          </div>
        </div>

        {/* Only show form if user has addresses */}
        {hasAddresses && (
          <>
            <div className="flex flex-col justify-center items-center my-4">
              <h3 className="font-bold font-sans text-lg">
                Enter More Details Here
              </h3>
            </div>

            <div className="w-full md:w-1/2 transition-all duration-500 ease-in-out mr-12 md:pl-36 pl-6">
              <Formik
                initialValues={{
                  name: "",
                  discription: "",
                  location: "",
                  file: null as File | null,
                  defaultAddress: defaultAddress,
                }}
                validationSchema={ServiceFormValidation}
                enableReinitialize={true}
                onSubmit={async (values) => {
                  try {
                    setIsSubmitting(true);

                    // Validate location
                    const locationValidation =
                      validateLocationName(locationName);
                    if (!locationValidation.ok) {
                      setLocationError(locationValidation.message);
                      setIsSubmitting(false);
                      return;
                    }

                    // Validate defaultAddress
                    if (!defaultAddress) {
                      console.error("Default address is required");
                      setIsSubmitting(false);
                      return;
                    }

                    setLocationError("");
                    let imageKey = "";

                    // Process image upload if file exists
                    if (values.file) {
                      const folderName = "ServiceComplaints";
                      try {
                        const fileName = values.file.name || "";
                        const fileType = values.file.type;

                        const response = await getS3SingUrl(
                          fileName,
                          fileType,
                          folderName
                        );

                        if (response?.data?.uploadURL) {
                          // Upload the image to S3
                          await fetch(response.data.uploadURL, {
                            method: "PUT",
                            headers: {
                              "Content-Type": fileType,
                            },
                            body: values.file,
                          });

                          // Save the imageKey
                          imageKey = response.data.key;
                          console.log("Image key saved:", imageKey);
                        }
                      } catch (error) {
                        console.error("Failed to upload image:", error);
                      }
                    }

                    // Prepare data for submission
                    const combinedData: Iconcern = {
                      name: values.name,
                      image: imageKey ? [imageKey] : [],
                      defaultAddress: defaultAddress,
                      discription: values.discription,
                      locationName: locationName,
                      userId: userId,
                      serviceId: service?._id,
                    };

                    console.log("Submitting data:", combinedData);

                    // Register complaint
                    const result = await registerComplaint(combinedData);
                    if (result) {
                      console.log("Result from backend:", result);
                      setShowModal(true);
                    }
                  } catch (error) {
                    console.error("Error submitting form:", error);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                {(formik) => (
                  <ServiceForm
                    formik={formik}
                    userProfile={userProfile}
                    defaultAddress={defaultAddress}
                    setDefaultAddress={setDefaultAddress}
                    locationName={locationName}
                    locationError={locationError}
                    validateLocationName={validateLocationName}
                    handleFetchLocation={handleFetchLocation}
                    handleRemoveLocation={handleRemoveLocation}
                    showLocationOptions={showLocationOptions}
                    setShowLocationOptions={setShowLocationOptions}
                    isSubmitting={isSubmitting}
                  />
                )}
              </Formik>
            </div>
          </>
        )}

        {/* Show loading message if addresses are being fetched */}
        {!hasAddresses && !showAddressWarningModal && (
          <div className="flex flex-col justify-center items-center my-8">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
              </div>
              <p className="text-gray-600 mt-4">Loading your profile...</p>
            </div>
          </div>
        )}

        {/* Address Warning Modal */}
        <AddressWarningModal
          show={showAddressWarningModal}
          onClose={handleCloseAddressWarningModal}
          onAddAddress={handleAddAddress}
          userName={userProfile?.name || userData?.name}
        />

        {/* Confirmation Modal */}
        <ConformationModal show={showModal} onClose={handleCloseModal} />
      </div>
      <Footer />
    </>
  );
};

export default Service;
