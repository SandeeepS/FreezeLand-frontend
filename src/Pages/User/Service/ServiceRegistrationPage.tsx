import React, { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getAllAddressOfUser,
  getImageUrl,
  getS3SingUrl,
  getService,
  registerComplaint,
} from "../../../Api/user";
import { Iconcern } from "../../../interfaces/Iconcern";
import SuccessModal from "../../../components/Common/Modal/SuccessModal";
import {
  nextStep,
  previousStep,
  resetRegistration,
  setFormData,
  setImageUrl,
  setSelectedAddress,
  setServiceData,
} from "../../../App/slices/ServiceRegistrationSlice";
import ProgressBar from "../../../components/User/UserServiceRegistration/ProgressBar";
import ServiceDetails from "../../../components/User/UserServiceRegistration/ServiceDetails";
import RequirementsForm from "../../../components/User/UserServiceRegistration/RequirementsForm";
import AddressSelection from "../../../components/User/UserServiceRegistration/AddressSelection";
import { RootState } from "../../../App/store";

interface Address {
  _id: string;
  userId: string;
  fullAddress: string;
  addressType: "Home" | "Work";
  longitude: number;
  latitude: number;
  landmark: string;
  houseNumber: string;
  isDeleted: boolean;
  isDefaultAddress: boolean;
}

const ServiceRegistrationPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const userData = useSelector((state: RootState) => state.auth.userData);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { currentStep, formData, selectedAddress, serviceData, imageUrl } =
    useSelector((state: RootState) => state.serviceRegistration);

  // Local state
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [formErrors, setFormErrors] = useState({
    name: "",
    discription: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const userId = userData?.id;
  // Fetch service data
  useEffect(() => {
    console.log("service id is",serviceId);

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getService(serviceId as string);
        const imageResult = await getImageUrl(result?.data.imageKey, "service");

        if (result && result.data) {
          dispatch(setServiceData(result.data));
          dispatch(setImageUrl(imageResult?.data?.url || ""));
        } else {
          toast.error("Service not found");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        toast.error("Failed to load service details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [serviceId, dispatch, navigate]);

  // Fetch addresses
  useEffect(() => {
    if (!userId) return;

    const fetchAddresses = async () => {
      try {
        const addressRes = await getAllAddressOfUser(userId);
        setAddresses(addressRes?.data.result || []);

        const defaultAddr = addressRes?.data.result?.find(
          (addr: Address) => addr.isDefaultAddress
        );
        if (defaultAddr) {
          dispatch(setSelectedAddress(defaultAddr._id));
        } else if (
          addressRes?.data.result &&
          addressRes.data.result.length > 0
        ) {
          dispatch(setSelectedAddress(addressRes.data.result[0]._id));
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddresses();
  }, [userId, dispatch]);

  // Validation
  const validateStep = (step: number): boolean => {
    if (step === 2) {
      const errors = { name: "", discription: "" };
      let isValid = true;

      if (!formData.name.trim()) {
        errors.name = "Service name is required";
        isValid = false;
      }

      if (!formData.discription.trim()) {
        errors.discription = "Description is required";
        isValid = false;
      } else if (formData.discription.length < 10) {
        errors.discription = "Description must be at least 10 characters";
        isValid = false;
      }

      setFormErrors(errors);
      return isValid;
    }

    if (step === 3) {
      return selectedAddress !== "";
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      dispatch(nextStep());
    }
  };

  const handleBack = () => {
    dispatch(previousStep());
  };

  const handleFormChange = (field: string, value: string) => {
    dispatch(setFormData({ [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (files: File[]) => {
    dispatch(setFormData({ files }));
  };

  const handleAddressSelect = (addressId: string) => {
    dispatch(setSelectedAddress(addressId));
  };

  const handleSubmit = async () => {
    if (!validateStep(3) || !serviceData) return;

    setIsSubmitting(true);
    try {
      const folderName = "ServiceComplaints";
      let imageKeys: string[] = [];

      // Upload images
      const uploadPromises = formData.files.map(async (file: File) => {
        const res = await getS3SingUrl(file.name, file.type, folderName);
        if (res?.data?.uploadURL) {
          await fetch(res.data.uploadURL, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });
          return res.data.key;
        }
        return null;
      });
      const uploadResults = await Promise.all(uploadPromises);
      imageKeys = uploadResults.filter(
        (key: string): key is string => key !== null
      );

      // Submit complaint
      const combinedData: Iconcern = {
        name: formData.name,
        image: imageKeys,
        address: selectedAddress,
        discription: formData.discription,
        userId,
        serviceId: serviceData._id,
        serviceCharge: serviceData.serviceCharge,
      };

      const result = await registerComplaint(combinedData);

      if (result?.data.success) {
        setIsSuccess(true);
        setStatusMessage("Service registered successfully!");
        setShowStatusModal(true);
      } else {
        toast.error("Service registration failed!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("An error occurred during submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    if (isSuccess) {
      dispatch(resetRegistration());
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-xl text-gray-600">
            Loading service details...
          </div>
        </div>
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-xl text-gray-600">Service not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressBar currentStep={currentStep} />

      <div className="px-4 py-8">
        <div className="bg-white  ">
          {currentStep === 1 && (
            <ServiceDetails service={serviceData} imageUrl={imageUrl} />
          )}

          {currentStep === 2 && (
            <RequirementsForm
              formData={formData}
              formErrors={formErrors}
              onFormChange={handleFormChange}
              onFileChange={handleFileChange}
            />
          )}

          {currentStep === 3 && (
            <AddressSelection
              addresses={addresses}
              selectedAddress={selectedAddress}
              onAddressSelect={handleAddressSelect}
            />
          )}
        </div>

        {/* Navigation Footer */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg px-8 md:px-96 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedAddress}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  isSubmitting || !selectedAddress
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            )}
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showStatusModal}
        message={statusMessage}
        onClose={closeStatusModal}
        isSuccess={isSuccess}
      />
    </div>
  );
};

export default ServiceRegistrationPage;
