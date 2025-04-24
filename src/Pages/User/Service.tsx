import React, { useEffect, useState } from "react";
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
import { getS3SingUrl } from "../../Api/admin"; // Import the getS3SingUrl function
import ServiceDetails from "../../components/User/UserServiceRegisteration/ServiceDetails";
import ServiceForm from "../../components/User/UserServiceRegisteration/ServiceForm";
import AboutTheService from "../../components/User/UserServiceRegisteration/AboutTheService";
import ConformationModal from "../../components/Common/ConformationModal";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

const Service: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userData = useSelector((state: RootState) => state.auth.userData);
  const userId = userData.toString();
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
  // Add these states for image handling
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          console.log("Profile data fetched:", profileData);
          if (profileData && profileData.address) {
            setUserProfile(profileData);
            const defaultAdd = profileData.address.find(
              (addr: AddAddress) => addr._id == profileData.defaultAddress
            );
            setDefaultAddress(defaultAdd?._id || "");
            setDefaultAddressDetails(defaultAdd);
          } else {
            console.error("Address data missing in profile");
          }
        }
      } catch (error) {
        console.log(error as Error);
      }
    };

    fetchData();
  }, [id]);

  // Add function to handle image changes
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setFileName(file.name);
    setFileType(file.type);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Add function to remove selected image
  const handleImageRemove = () => {
    setPreviewImage(null);
    setImageFile(null);
    setFileName("");
    setFileType("");
  };

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
              try {
                setIsSubmitting(true);
                const isLocation = validateLocationName(locationName);
                if (!isLocation.ok) {
                  setLocationError(isLocation.message);
                  setIsSubmitting(false);
                  return;
                }

                setLocationError("");
                let imageKey = "";

                // Use the file from formik values instead of imageFile state
                if (values.file) {
                  const folderName = "ServiceComplaints";
                  try {
                    const fileName = values.file.name ;
                    const fileType = values.file.type;

                    const response = await getS3SingUrl(
                      fileName,
                      fileType,
                      folderName
                    );
                    console.log("response after getting s3SignedURL", response);
                    if (response?.data.uploadURL) {
                      // Upload the image to S3
                      await fetch(response.data.uploadURL, {
                        method: "PUT",
                        headers: {
                          "Content-Type": fileType,
                        },
                        body: values.file, // Use the file from formik values
                      });

                      // Save the imageKey
                      imageKey = response.data.key;
                      console.log("image key saved:", imageKey);
                    }
                  } catch (error) {
                    console.error("Failed to upload image:", error);
                  }
                }

                const combinedData: Iconcern = {
                  name: values.name,
                  image: imageKey ? [imageKey] : [], // Use an empty array if no imageKey
                  defaultAddress: defaultAddress,
                  discription: values.discription,
                  locationName: locationName,
                  userId: userId,
                  serviceId: service?._id,
                };

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
              <>
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
              </>
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
