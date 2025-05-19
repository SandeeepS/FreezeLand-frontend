import { useEffect, useState } from "react";
import { useAppSelector } from "../../../App/store";
import { useNavigate } from "react-router-dom";
import { getImageUrl, getMechanicDetails } from "../../../Api/mech";
import Spinner from "../../UI/Spinner";

const MechanicProfile = () => {
  const mechData = useAppSelector((state) => state.auth.mechData);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [adharImage, setAdharImage] = useState("");
  const [employeeLicense, setEmployeeLicence] = useState("");

  const [mechDetails, setMechDetails] = useState({
    name: "",
    phone: "",
    email: "",
    photo: "",
    mechanicType: [],
    isVerified: false,
    adharProof: "",
    employeeLicense: "",
    defaultAddressDetails: {
      district: "",
      state: "",
      pin: "",
      landMark: "",
    },
  });

  // useEffect to fetch the mechanic details
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const mechId = mechData?.id;
        if (!mechId) {
          setError("Mechanic ID not found");
          setLoading(false);
          return;
        }

        const response = await getMechanicDetails(mechId);
        console.log("Mechanic details from the backend:", response);

        if (response?.data?.result) {
          const mechData = response.data.result;
          setMechDetails({
            name: mechData.name || "",
            phone: mechData.phone || "",
            email: mechData.email || "",
            photo: mechData.photo || "",
            mechanicType: mechData.mechanicType || [],
            isVerified: mechData.isVerified || false,
            adharProof: mechData.adharProof || "",
            employeeLicense: mechData.employeeLicense || "",
            defaultAddressDetails: {
              district: mechData.district || "",
              state: mechData.state || "",
              pin: mechData.pin || "",
              landMark: mechData.landMark || "",
            },
          });
        }
      } catch (error) {
        console.error("Error fetching mechanic details:", error);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mechData?.id]); // Only re-run when mechData.id changes

  // Improved useEffect to fetch image URLs
  useEffect(() => {
    const fetchImageUrl = async (imageKey, type, setImageState) => {
      // Only make API call if imageKey is provided
      if (!imageKey) {
        console.log(`No ${type} image key provided, skipping fetch`);
        return;
      }
      
      try {
        const response = await getImageUrl(imageKey, type);
        if (response?.data?.url) {
          setImageState(response.data.url);
        }
      } catch (error) {
        console.error(`Error fetching ${type} image:`, error);
      }
    };
    
    // Fetch images only if the keys exist
    if (mechDetails.photo) {
      fetchImageUrl(mechDetails.photo, "mechProfile", setProfileImage);
    }
    
    if (mechDetails.adharProof) {
      fetchImageUrl(mechDetails.adharProof, "service", setAdharImage);
    }
    
    if (mechDetails.employeeLicense) {
      fetchImageUrl(mechDetails.employeeLicense, "service", setEmployeeLicence);
    }
    
  }, [mechDetails.photo, mechDetails.adharProof, mechDetails.employeeLicense]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
        <p className="ml-3 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 w-full max-w-md">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error Loading Profile
          </h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pt-28 pb-12">
        {/* Profile Header Section */}
        <div className="relative bg-white rounded-lg shadow-lg mb-8 overflow-hidden">
          <div className="h-16 bg-gradient-to-r from-black to-slate-400 rounded-t-lg"></div>

          <div className="flex flex-col md:flex-row items-center md:items-end px-6 relative">
            <div className="absolute -top-16 md:relative md:-top-10 bg-white p-2 rounded-full shadow-lg border-4 border-white">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden">
                <img
                  src={profileImage || "/src/Images/businessman.png"}
                  alt="Mechanic Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src =
                      "/src/Images/businessman.png";
                  }}
                />
              </div>
            </div>

            <div className="mt-16 md:mt-0 md:ml-6 pb-6 flex-grow">
              <div className="flex items-center mb-1">
                <h1 className="text-2xl font-bold text-gray-800 mr-2">
                  {mechDetails.name}
                </h1>
                {mechDetails.isVerified && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Verified
                  </span>
                )}
              </div>

              <div className="flex items-center mt-2 text-gray-600">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                <span>{mechDetails.email}</span>
              </div>
            </div>

            <div className="mb-6 md:mb-12 mt-4 md:mt-0">
              <button
                onClick={() => navigate("/mech/editProfile")}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Personal Information Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Personal Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                    {mechDetails.name || "Not provided"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                    {mechDetails.phone || "Not provided"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                    {mechDetails.email || "Not provided"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Status
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                    {mechDetails.isVerified ? (
                      <span className="text-green-600 font-medium flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        Verified
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-medium flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        Pending Verification
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Default Address
                </h2>
                <button
                  onClick={() => navigate("/mechanic/addresses")}
                  className="flex items-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  View All Addresses
                </button>
              </div>

              {mechDetails.defaultAddressDetails.district ||
              mechDetails.defaultAddressDetails.state ||
              mechDetails.defaultAddressDetails.pin ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                      {mechDetails.defaultAddressDetails.district ||
                        "Not provided"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                      {mechDetails.defaultAddressDetails.state ||
                        "Not provided"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PIN Code
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                      {mechDetails.defaultAddressDetails.pin || "Not provided"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Landmark
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                      {mechDetails.defaultAddressDetails.landMark ||
                        "Not provided"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  <p className="text-gray-600 mb-2">
                    No address information available
                  </p>
                  <button
                    onClick={() => navigate("/mechanic/addresses/add")}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    Add Address
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Credentials & Services */}
          <div className="lg:col-span-1">
            {/* Mechanic Credentials */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Credentials
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhar Proof
                  </label>
                  {mechDetails.adharProof ? (
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden h-36">
                      <img
                        src={adharImage || "/src/Images/document-placeholder.png"}
                        alt="Aadhar Card"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).onerror = null;
                          (e.target as HTMLImageElement).src =
                            "/src/Images/document-placeholder.png";
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button className="bg-white text-gray-800 px-3 py-1 rounded-md text-sm font-medium">
                          View Document
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500 text-sm">
                        No document uploaded
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee License
                  </label>
                  {mechDetails.employeeLicense ? (
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden h-36">
                      <img
                        src={employeeLicense || "/src/Images/document-placeholder.png"}
                        alt="Employee License"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).onerror = null;
                          (e.target as HTMLImageElement).src =
                            "/src/Images/document-placeholder.png";
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button className="bg-white text-gray-800 px-3 py-1 rounded-md text-sm font-medium">
                          View Document
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500 text-sm">
                        No document uploaded
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicProfile;