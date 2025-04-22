import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProfile, getService } from "../../Api/user";
import { AddAddress } from "../../interfaces/AddAddress";
import Footer from "../../components/User/Footer";
import { Formik } from "formik";
import { UserData } from "../../interfaces/UserData";
import { Iconcern } from "../../interfaces/Iconcern";
import { ServiceFormValidation } from "../../components/Common/Validations";
import { registerComplaint } from "../../Api/user";
import { useSelector } from "react-redux";
import { RootState } from "../../App/store";
import { getImageUrl } from "../../Api/user";
import ServiceDetails from "../../components/User/UserServiceRegisteration/ServiceDetails";
import ServiceForm from "../../components/User/UserServiceRegisteration/ServiceForm";
import AboutTheService from "../../components/User/UserServiceRegisteration/AboutTheService";
import ConformationModal from "../../components/Common/ConformationModal";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

const Service: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = useSelector((state: RootState) => state.auth.userData?._id);
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
  const [locationError, setLocationError] = useState<string | undefined>("");
  const [serviceImage, setServiceImage] = useState<string | undefined>("");
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
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
        const [serviceResult, profileResult] = await Promise.all([
          getService(id),
          getProfile(userId),
        ]);
        if (serviceResult) {
          setServices(serviceResult.data);

          const result = await getImageUrl(
            serviceResult.data.imageKey,
            "service"
          );
          if (result) {
            setServiceImage(result.data.url);
          }
        }

        if (profileResult) {
          const profileData = profileResult.data.data.data;
          setUserProfile(profileData);
          const defaultAdd = profileData.address.find(
            (addr: AddAddress) => addr._id == profileData.defaultAddress
          );
          setDefaultAddress(defaultAdd?._id || "");
          setDefaultAddressDetails(defaultAdd);
        }
      } catch (error) {
        console.log(error as Error);
      }
    };

    fetchData();
  }, [id]);

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
        }
      },
      (error) => {
        console.error("Error fetching location:", error);
      },
      { enableHighAccuracy: true }
    );
  };

  const validateLocationName = (value: any) => {
    if (!value.address || !value.latitude || !value.longitude) {
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

  return (
    <>
      <div className="flex flex-col mt-36 overflow-hidden ">
        <div className="flex flex-col justify-center items-center my-4">
          <h2 className="font-bold font-sans text-lg ">{service?.name}</h2>
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
        <div className="flex flex-col justify-center items-center my-4">
          <h3 className="font-bold font-sans text-lg ">
            Enter More Details Here
          </h3>
        </div>
        <div className="w-full md:w-1/2 transition-all duration-500 ease-in-out mr-12 md:pl-36 pl-6 ">
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
              const isLocation = validateLocationName(locationName);
              if (!isLocation.ok) {
                setLocationError(isLocation.message);
              } else {
                setLocationError("");
                const combinedData: Iconcern = {
                  name: values.name,
                  image: values?.file?.name,
                  defaultAddress: defaultAddress,
                  discription: values.discription,
                  locationName: locationName,
                  userId: userId,
                  serviceId: service?._id,
                };
                console.log("wrokinggndlkgnsldng");
                const result = await registerComplaint(combinedData);
                if (result) {
                  console.log("Result from backend:", result);
                  setShowModal(true);
                }
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
              />
            )}
          </Formik>
        </div>

        <ConformationModal show={showModal} onClose={handleCloseModal} />
      </div>
      <Footer />
    </>
  );
};

export default Service;
