import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllAddressOfUser,
  getProfile,
  getS3SingUrl,
  getService,
  registerComplaint,
  getImageUrl,
  AddUserAddress,
  removeUserAddress,
  setDefaultAddress,
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
import {
  IAddress,
  IAddressResponse,
} from "../../interfaces/IComponents/Common/ICommonInterfaces";
import { MdCheckCircle } from "react-icons/md";
import ConfirmModal from "../../components/Common/Modal/ConfirmModal";
import toast from "react-hot-toast";
import AddAddressForm from "../../components/Common/Profile/AddAddressForm";

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

const Service: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userData = useSelector((state: RootState) => state.auth.userData);
  const userId = userData?.id;

  const [service, setService] = useState<Iconcern>();
  const [serviceAmount, setServiceAmount] = useState<number>();
  const [_, setUserProfile] = useState<UserData>();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [serviceImage, setServiceImage] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address management states
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [formMode] = useState<"add" | "edit">("add");
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
  const [addressRefreshKey, setAddressRefreshKey] = useState(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "remove" | "setDefault";
    address: Address | null;
  }>({ type: "remove", address: null });

  // Fetch initial data
  useEffect(() => {
    if (!id || !userId) return;

    const fetchData = async () => {
      try {
        const [serviceRes, profileRes] = await Promise.all([
          getService(id),
          getProfile(userId),
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, userId]);

  // Fetch addresses
  const fetchAddresses = async () => {
    if (!userId) return;

    try {
      const addressRes = await getAllAddressOfUser(userId);
      if (addressRes?.data?.result) {
        const addressList = addressRes.data.result;

        // Sort addresses: default first
        const sortedAddresses = addressList.sort(
          (a: Address, b: Address) =>
            (b.isDefaultAddress ? 1 : 0) - (a.isDefaultAddress ? 1 : 0)
        );

        setAddresses(sortedAddresses);

        // Auto-select default address
        const defaultAddr = sortedAddresses.find(
          (addr: Address) => addr.isDefaultAddress
        );
        if (defaultAddr) {
          setSelectedAddress(defaultAddr._id);
        } else if (sortedAddresses.length > 0) {
          setSelectedAddress(sortedAddresses[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [userId, addressRefreshKey]);

  // Handle save address
  const handleSaveAddress = async (
    addr: IAddress
  ): Promise<IAddressResponse> => {
    try {
      const response = await AddUserAddress(addr);
      if (response?.data?.result) {
        toast.success(
          formMode === "add"
            ? "Address added successfully"
            : "Address updated successfully"
        );
        setAddressRefreshKey((prev) => prev + 1);
        setShowAddAddressForm(false);
        setEditingAddress(null);
      }
      return response?.data as IAddressResponse;
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
      throw error;
    }
  };

  // Confirm action
  const handleConfirmAction = async () => {
    if (!confirmAction.address) return;

    try {
      if (confirmAction.type === "remove") {
        const result = await removeUserAddress(
          userId!,
          confirmAction.address._id
        );
        if (result && result.data && result.data.success) {
          toast.success("Address removed successfully");
          setAddressRefreshKey((prev) => prev + 1);
        }
      } else if (confirmAction.type === "setDefault") {
        const result = await setDefaultAddress(
          userId!,
          confirmAction.address._id
        );
        if (result && result.data && result.data.success) {
          toast.success("Default address updated successfully");
          setAddressRefreshKey((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error performing action:", error);
      toast.error("Failed to perform action");
    } finally {
      setIsConfirmModalOpen(false);
      setConfirmAction({ type: "remove", address: null });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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

          {/* Address Selection Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
            <div className=" px-8">
              <p className="text-black mt-1 py-4">
                Choose an address where you need the service
              </p>
            </div>

            <div className="p-8">
              {/* Address List */}
              {addresses.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                  <p className="text-gray-500 text-lg">No address added yet.</p>
                  <p className="text-gray-400 text-sm">
                    Please add an address to continue with the service booking
                  </p>
                </div>
              ) : (
                <div
                  className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
    md:max-h-[400px] md:overflow-y-auto
    scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
                >
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddress(addr._id)}
                      className={`relative cursor-pointer p-4 rounded-xl border transition-all ${
                        selectedAddress === addr._id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 bg-gray-50 hover:border-blue-300"
                      } `}
                    >
                      {/* Selection Indicator */}
                      {selectedAddress === addr._id && (
                        <div className="absolute top-2 right-2">
                          <MdCheckCircle className="text-blue-500 text-2xl" />
                        </div>
                      )}

                      {/* Default Badge */}
                      {addr.isDefaultAddress && (
                        <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-tr-lg rounded-bl-lg">
                          Default
                        </div>
                      )}

                      {/* Address Details */}
                      <div className="mt-6 mb-4">
                        <p className="font-medium text-gray-800 line-clamp-3">
                          {addr.fullAddress}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          {addr.landmark}, {addr.houseNumber}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {addr.addressType}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Registration Form Section */}
          {addresses.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className=" px-8 py-4">
                <p className="text-black mt-1 py-4">
                  Please provide the necessary information to schedule your
                  service
                </p>
              </div>

              <div className="p-8">
                <Formik
                  initialValues={{
                    name: "",
                    discription: "",
                    files: [] as File[],
                  }}
                  validationSchema={ServiceFormValidation}
                  enableReinitialize={true}
                  onSubmit={async (values) => {
                    try {
                      console.log("cliked submit bunnn");
                      setIsSubmitting(true);
                      if (!selectedAddress) {
                        toast.error("Please select an address");
                        setIsSubmitting(false);
                        return;
                      }

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
                        address: selectedAddress,
                        discription: values.discription,
                        userId,
                        serviceId: service?._id,
                        serviceCharge: service?.serviceCharge,
                      };

                      const result = await registerComplaint(combinedData);
                      if (result) setShowModal(true);
                    } catch (error) {
                      console.error("Error submitting form:", error);
                      toast.error("Failed to submit service request");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  {(formik) => (
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                      {/* Service Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter service name"
                        />
                        {formik.touched.name && formik.errors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {formik.errors.name}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          name="discription"
                          value={formik.values.discription}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Describe your service requirements"
                        />
                        {formik.touched.discription &&
                          formik.errors.discription && (
                            <p className="text-red-500 text-sm mt-1">
                              {formik.errors.discription}
                            </p>
                          )}
                      </div>

                      {/* File Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Images (Optional)
                        </label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            formik.setFieldValue("files", files);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-center pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting || !selectedAddress}
                          className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
                            isSubmitting || !selectedAddress
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
                          }`}
                        >
                          {isSubmitting
                            ? "Submitting..."
                            : "Submit Service Request"}
                        </button>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {showAddAddressForm && (
          <AddAddressForm
            role="user"
            mode={formMode}
            initialData={editingAddress || undefined}
            onClose={() => {
              setShowAddAddressForm(false);
              setEditingAddress(null);
            }}
            onSave={handleSaveAddress}
          />
        )}

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          title={
            confirmAction.type === "remove"
              ? "Remove Address"
              : "Set Default Address"
          }
          message={
            confirmAction.type === "remove"
              ? "Are you sure you want to delete this address?"
              : "Do you want to set this as your default address?"
          }
          onConfirm={handleConfirmAction}
          onCancel={() => setIsConfirmModalOpen(false)}
        />

        <ConformationModal show={showModal} onClose={handleCloseModal} />
      </div>
      <Footer />
    </>
  );
};

export default Service;
