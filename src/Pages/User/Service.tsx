import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllAddressOfUser,
  getProfile,
  getS3SingUrl,
  getService,
  registerComplaint,
  getImageUrl,
} from "../../Api/user";
import Footer from "../../components/User/Footer";
import { Formik } from "formik";
import { Iconcern } from "../../interfaces/Iconcern";
import { ServiceFormValidation } from "../../components/Common/Validations";
import { useSelector } from "react-redux";
import { RootState } from "../../App/store";
import ConformationModal from "../../components/Common/ConformationModal";
import UserData from "../../interfaces/UserData";
import ServiceDetails from "../../components/User/UserServiceRegistration/ServiceDetails";
import ServiceForm from "../../components/User/UserServiceRegistration/ServiceForm";
import AddressWarningModal from "../../components/User/UserServiceRegistration/AddressWarningModal";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

interface LocationData {
  address: string;
  latitude: number | null;
  longitude: number | null;
}

interface Address {
  _id: string;
  fullAddress: string;
  houseNumber: string;
  longitude: number;
  latitude: number;
  landmark: string;
  isDeleted: boolean;
  isDefaultAddress: boolean;
}

const Service: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userData = useSelector((state: RootState) => state.auth.userData);
  const userId = userData?.id;

  const [service, setService] = useState<Iconcern>();
  const [serviceAmount, setServiceAmount] = useState<number>();
  const [userProfile, setUserProfile] = useState<UserData>();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [defaultAddress, setDefaultAddress] = useState<string>("");
  const [serviceImage, setServiceImage] = useState<string>("");
  const [locationError, setLocationError] = useState<string>("");

  const [locationName, setLocationName] = useState<LocationData>({
    address: "",
    latitude: null,
    longitude: null,
  });

  const [showModal, setShowModal] = useState(false);
  const [showAddressWarningModal, setShowAddressWarningModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLocationOptions, setShowLocationOptions] = useState(false);

  useEffect(() => {
    if (!id || !userId) return;

    const fetchData = async () => {
      try {
        const [serviceRes, profileRes, addressRes] = await Promise.all([
          getService(id),
          getProfile(userId),
          getAllAddressOfUser(userId),
        ]);

        if (serviceRes?.data) {
          const serviceData = serviceRes.data;
          setService(serviceData);
          setServiceAmount(serviceData.serviceCharge);

          if (serviceData.imageKey) {
            const imgRes = await getImageUrl(serviceData.imageKey, "service");
            if (imgRes?.data?.url) setServiceImage(imgRes.data.url);
          }
        }

        if (profileRes?.data?.data?.data) {
          setUserProfile(profileRes.data.data.data);
        }

        if (addressRes?.data?.result) {
          const addressList = addressRes.data.result;
          setAddresses(addressList);

          if (addressList.length === 0) {
            setShowAddressWarningModal(true);
          } else {
            setShowAddressWarningModal(false);
            const defaultAddr = addressList.find(
              (addr: Address) => addr.isDefaultAddress
            );
            if (defaultAddr) setDefaultAddress(defaultAddr._id);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setShowAddressWarningModal(true);
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

          if (data.results?.length > 0) {
            setLocationName({
              address: data.results[0].formatted_address,
              latitude,
              longitude,
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
    setLocationName({ address: "", longitude: null, latitude: null });
    setShowLocationOptions(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  const handleCloseAddressWarningModal = () => {
    setShowAddressWarningModal(false);
    navigate("/");
  };

  const handleAddAddress = () => {
    setShowAddressWarningModal(false);
    navigate("/user/AddAddress");
  };

  const hasAddresses = addresses.length > 0;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 mt-12">
        {/* Header */}
        <div className="pt-14 pb-4 bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {service?.name || "Service Registration"}
            </h1>
            <p className="text-lg text-gray-600">
              Schedule your service with professional care
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ServiceDetails
            serviceImage={serviceImage}
            discription={service?.discription}
            serviceAmount={serviceAmount}
          />

          {/* Registration Form Section */}
          {hasAddresses && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-freeze-color px-8 py-4">
                <h2 className="text-2xl font-semibold text-white">
                  Service Registration Details
                </h2>
                <p className="text-black mt-1 py-4">
                  Please provide the necessary information to schedule your
                  service
                </p>
              </div>

              <div className="flex flex-col justify-center items-center w-full">
                <div className="p-8 mt-6 w-full">
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

                        const locationValidation =
                          validateLocationName(locationName);
                        if (!locationValidation.ok) {
                          setLocationError(locationValidation.message || "");
                          setIsSubmitting(false);
                          return;
                        }

                        if (!defaultAddress) {
                          console.error("Default address is required");
                          setIsSubmitting(false);
                          return;
                        }

                        setLocationError("");
                        let imageKeys: string[] = [];

                        if (values.files?.length > 0) {
                          const folderName = "ServiceComplaints";
                          const uploadPromises = values.files.map(
                            async (file) => {
                              const res = await getS3SingUrl(
                                file.name,
                                file.type,
                                folderName
                              );
                              if (res?.data?.uploadURL) {
                                await fetch(res.data.uploadURL, {
                                  method: "PUT",
                                  headers: { "Content-Type": file.type },
                                  body: file,
                                });
                                return res.data.key;
                              }
                              return null;
                            }
                          );
                          const uploadResults = await Promise.all(uploadPromises);
                          imageKeys = uploadResults.filter(
                            (key): key is string => key !== null
                          );
                        }

                        const combinedData: Iconcern = {
                          name: values.name,
                          image: imageKeys,
                          defaultAddress,
                          discription: values.discription,
                          locationName,
                          userId,
                          serviceId: service?._id,
                          serviceCharge: service?.serviceCharge,
                        };

                        const result = await registerComplaint(combinedData);
                        if (result) setShowModal(true);
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
                        userProfile={userProfile ?? { address: [] }}
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
            </div>
          )}

          {/* Loading skeleton when fetching profile */}
          {!hasAddresses && !showAddressWarningModal && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Loading Your Profile
              </h3>
              <p className="text-gray-500">
                Please wait while we fetch your account information...
              </p>
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
