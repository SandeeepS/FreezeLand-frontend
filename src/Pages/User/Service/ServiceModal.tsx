import React, { useEffect, useState } from "react";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { MdCheckCircle } from "react-icons/md";
import {
  getAllAddressOfUser,
  getImageUrl,
  getS3SingUrl,
  getService,
  registerComplaint,
} from "../../../Api/user";
import { Iconcern } from "../../../interfaces/Iconcern";
import toast from "react-hot-toast";
import SuccessModal from "../../../components/Common/Modal/SuccessModal";
import { useNavigate } from "react-router-dom";

// Mock interfaces - replace with your actual imports
interface ServiceData {
  _id: string;
  name: string;
  discription: string;
  serviceCharge: number;
  imageKey: string;
}

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

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  userId?: string;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  serviceId,
  userId,
}) => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const redirectLink = "/";

  // Service data
  const [service, setService] = useState<ServiceData | null>(null);
  const [image, setImage] = useState<string>("");

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    discription: "",
    files: [] as File[],
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    discription: "",
  });

  // Address data
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen || !serviceId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getService(serviceId);
        console.log("result from the backend is ", result);
        const imageResult = await getImageUrl(result?.data.imageKey, "service");

        if (result && result.data) {
          setService(result.data);
          setImage(imageResult?.data?.url || "");
        } else {
          setService(null);
          setImage("");
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [serviceId, isOpen]);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchAddresses = async () => {
      try {
        const addressRes = await getAllAddressOfUser(userId);
        console.log("address is ", addressRes);
        setAddresses(addressRes?.data.result);
        const defaultAddr =
          addressRes && Array.isArray(addressRes)
            ? addressRes.find((addr) => addr.isDefaultAddress)
            : undefined;
        if (defaultAddr) {
          setSelectedAddress(defaultAddr._id);
        } else if (
          addressRes &&
          Array.isArray(addressRes) &&
          addressRes.length > 0
        ) {
          setSelectedAddress(addressRes[0]._id);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddresses();
  }, [userId, isOpen]);

  // Close modal handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({ name: "", discription: "", files: [] });
    setFormErrors({ name: "", discription: "" });
    setSelectedAddress("");
    onClose();
  };

  // Form validation
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
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({ ...prev, files }));
  };

  const handleSubmit = async () => {
    if (!validateStep(3) || !service) return;

    setIsSubmitting(true);
    try {
      // await onSubmit({
      //   ...formData,
      //   address: selectedAddress,
      //   serviceId: service._id,
      //   userId,
      //   serviceCharge: service.serviceCharge,
      // });

      console.log("form data is ", { ...formData });
      console.log("address is ", selectedAddress);
      console.log("serviecId is", service._id);
      console.log("userid ", userId);
      console.log("service charge", service.serviceCharge);
      const folderName = "ServiceComplaints";
      let imageKeys: string[] = [];

      const uploadPromises = formData.files.map(async (file) => {
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
      imageKeys = uploadResults.filter((key): key is string => key !== null);

      const combinedData: Iconcern = {
        name: formData.name,
        image: imageKeys,
        address: selectedAddress,
        discription: formData.discription,
        userId,
        serviceId: service?._id,
        serviceCharge: service?.serviceCharge,
      };
      const result = await registerComplaint(combinedData);
      console.log(
        "result from the backend after completing the upload ",
        result
      );
      if (result?.data.success) {
        setIsSuccess(true);
        setStatusMessage("Service registered successfully ");
        setShowStatusModal(true);
      } else {
        toast.error("Service registration failed !!");
        handleClose();
      }
    } catch (error) {
      console.error("Error submitting:", error);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Progress indicator
  const steps = [
    { number: 1, label: "Service Details" },
    { number: 2, label: "Requirements" },
    { number: 3, label: "Address" },
  ];

  const closeStatusModal = () => {
    setShowStatusModal(false);
    if (isSuccess && redirectLink) {
      navigate(redirectLink);
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <div className="relative px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-white rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Service Registration
          </h2>

          {/* Progress Steps */}
          <div className="flex items-center justify-between max-w-md">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep > step.number
                        ? "bg-green-500 text-white"
                        : currentStep === step.number
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="text-xs mt-1 text-gray-600 font-medium">
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded transition-all ${
                      currentStep > step.number ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-gray-500">
                Loading service details...
              </div>
            </div>
          ) : service ? (
            <>
              {/* Step 1: Service Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <img
                        src={image || "https://via.placeholder.com/500"}
                        alt={service.name}
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {service.discription}
                      </p>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
                        <p className="text-sm text-gray-600 mb-1">
                          Service Charge
                        </p>
                        <p className="text-3xl font-bold text-green-600">
                          ₹{service.serviceCharge}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Requirements Form */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., AC Repair for Living Room"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.discription}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          discription: e.target.value,
                        }))
                      }
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your service requirements in detail..."
                    />
                    {formErrors.discription && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.discription}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload Images (Optional)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formData.files.length > 0 && (
                      <p className="text-sm text-gray-600 mt-2">
                        {formData.files.length} file(s) selected
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Address Selection */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Select Service Location
                    </h3>
                    {addresses.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center space-y-4 py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg">
                          No address added yet.
                        </p>
                        <p className="text-gray-400 text-sm">
                          Please add an address to continue
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
                        {addresses.map((addr) => (
                          <div
                            key={addr._id}
                            onClick={() => setSelectedAddress(addr._id)}
                            className={`relative cursor-pointer p-5 rounded-xl border-2 transition-all ${
                              selectedAddress === addr._id
                                ? "border-blue-500 bg-blue-50 shadow-md"
                                : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
                            }`}
                          >
                            {selectedAddress === addr._id && (
                              <div className="absolute top-3 right-3">
                                <MdCheckCircle className="text-blue-500 text-2xl" />
                              </div>
                            )}

                            {addr.isDefaultAddress && (
                              <span className="absolute top-0 left-0 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-tl-xl rounded-br-xl">
                                Default
                              </span>
                            )}

                            <div className="mt-2">
                              <div className="flex items-start gap-3">
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800 mb-1">
                                    {addr.addressType}
                                  </p>
                                  <p className="text-gray-600 text-sm mb-2">
                                    {addr.fullAddress}
                                  </p>
                                  <p className="text-gray-500 text-xs">
                                    {addr.landmark}, {addr.houseNumber}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-gray-500">Service not found</div>
            </div>
          )}
        </div>

        {/* Footer with Navigation */}
        {!loading && service && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentStep === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
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
        )}
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

export default ServiceModal;
