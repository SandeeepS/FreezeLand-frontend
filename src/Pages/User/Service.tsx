import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProfile, getS3SingUrl, getService } from "../../Api/user";
import { AddAddress } from "../../interfaces/AddAddress";
import Footer from "../../components/User/Footer";
import { Formik } from "formik";
import { Iconcern } from "../../interfaces/Iconcern";
import { ServiceFormValidation } from "../../components/Common/Validations";
import { registerComplaint } from "../../Api/user";
import { useSelector } from "react-redux";
import { RootState } from "../../App/store";
import { getImageUrl } from "../../Api/user";
import ConformationModal from "../../components/Common/ConformationModal";
import UserData from "../../interfaces/UserData";
import ServiceDetails from "../../components/User/UserServiceRegistration/ServiceDetails";
import ServiceForm from "../../components/User/UserServiceRegistration/ServiceForm";
// import AboutTheService from "../../components/User/UserServiceRegistration/AboutTheService";
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
  const [serviceAmount, setServiceAmount] = useState<number>();
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [locationName, setLocationName] = useState<LocationData>({
    address: "",
    latitude: null,
    longitude: null,
  });
  const [userProfile, setUserProfile] = useState<UserData | undefined>();
  const [defaultAddress, setDefaultAddress] = useState<string>("");
  const [locationError, setLocationError] = useState<string>("");
  const [serviceImage, setServiceImage] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAddressWarningModal, setShowAddressWarningModal] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id || !userId) {
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

        console.log("serivce issssss", service);
        if (profileResult && profileResult.data && profileResult.data.data) {
          const profileData = profileResult.data.data.data;

          if (profileData) {
            setUserProfile(profileData);

            if (profileData.address && profileData.address.length > 0) {
              const defaultAdd = profileData.address.find(
                (addr: AddAddress) => addr._id === profileData.defaultAddress
              );

              if (defaultAdd) {
                setDefaultAddress(defaultAdd._id);
              } else {
                setDefaultAddress(profileData.address[0]._id);
              }
            } else {
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

  useEffect(() => {
    if (service?.serviceCharge) {
      setServiceAmount(service.serviceCharge);
    }
  }, [service]);

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
  console.log("DefaultAddress is", defaultAddress);
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 mt-12">
        {/* Header Section */}
        <div className="pt-20 pb-8 bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {service?.name || "Service Registration"}
              </h1>
              <p className="text-lg text-gray-600">
                Schedule your service with professional care
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex ">
            <div className="lg:col-span-3 mb-4">
              <ServiceDetails
                serviceImage={serviceImage}
                discription={service?.discription}
                serviceAmount={serviceAmount}
              />
            </div>
          </div>

          {/* Registration Form Section */}
          {hasAddresses && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-500 px-8 py-6">
                <h2 className="text-2xl font-semibold text-white">
                  Service Registration Details
                </h2>
                <p className="text-blue-100 mt-1">
                  Please provide the necessary information to schedule your
                  service
                </p>
              </div>

              <div className="p-8">
                <Formik
                  initialValues={{
                    name: "",
                    discription: "",
                    location: "",
                    files: [] as File[],
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
                        setLocationError(locationValidation.message || "");
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
                      let imageKeys: string[] = [];

                      // Process image upload if file exists
                      if (values.files && values.files.length > 0) {
                        const folderName = "ServiceComplaints";

                        try {
                          // Upload all files concurrently
                          const uploadPromises = values.files.map(
                            async (file) => {
                              const fileName = file.name || "";
                              const fileType = file.type;

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
                                  body: file,
                                });

                                return response.data.key;
                              }
                              return null;
                            }
                          );

                          // Wait for all uploads to complete
                          const uploadResults = await Promise.all(
                            uploadPromises
                          );
                          imageKeys = uploadResults.filter(
                            (key): key is string => key !== null
                          );

                          console.log("Image keys saved:", imageKeys);
                        } catch (error) {
                          console.error("Failed to upload images:", error);
                        }
                      }

                      // Prepare data for submission
                      const combinedData: Iconcern = {
                        name: values.name,
                        image: imageKeys,
                        defaultAddress: defaultAddress,
                        discription: values.discription,
                        locationName: locationName,
                        userId: userId,
                        serviceId: service?._id,
                        serviceCharge: service?.serviceCharge,
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
            </div>
          )}

          {/* Loading State */}
          {!hasAddresses && !showAddressWarningModal && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Loading Your Profile
                </h3>
                <p className="text-gray-500">
                  Please wait while we fetch your account information...
                </p>
                <div className="mt-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-1/2 mx-auto animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-2/3 mx-auto animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <AddressWarningModal
          show={showAddressWarningModal}
          onClose={handleCloseAddressWarningModal}
          onAddAddress={handleAddAddress}
          userName={userProfile?.name || userData?.name}
        />

        <ConformationModal show={showModal} onClose={handleCloseModal} />
      </div>
      <Footer />
    </>
  );
};

export default Service;
