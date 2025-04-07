import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowBack,
  CalendarToday,
  Person,
  Handyman,
  LocationOn,
  Phone,
  AccessTime,
  CheckCircle,
  Warning,
} from "@mui/icons-material";
import { getUserRegisteredServiceDetailsById } from "../../../Api/user";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../App/store";
interface ComplaintDetailProps {}

const ComplaintDetail: React.FC<ComplaintDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
//   const userId = useSelector((state: RootState) => state.auth.userData?._id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [complaint, setComplaint] = useState<any>(null);

  useEffect(() => {
    const fetchComplaintDetail = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call
        const result = await getUserRegisteredServiceDetailsById(id as string);
        console.log("specified user Details from the backend is ",result);
        if (result?.data.result[0]) {
          setComplaint(result?.data.result[0]);
        }
      } catch (error) {
        console.error("Error fetching complaint details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchComplaintDetail();
    }
  }, [id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" /> Completed
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 flex items-center">
            <AccessTime className="w-4 h-4 mr-1" /> Pending
          </span>
        );
      case "delayed":
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800 flex items-center">
            <Warning className="w-4 h-4 mr-1" /> Delayed
          </span>
        );
      case "on schedule":
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 flex items-center">
            <AccessTime className="w-4 h-4 mr-1" /> On Schedule
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 flex items-center">
            <AccessTime className="w-4 h-4 mr-1" /> {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Fallback if no data is found
  if (!complaint) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 mb-4"
        >
          <ArrowBack className="w-5 h-5" />
          <span>Back to Complaints</span>
        </button>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Warning className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Complaint Not Found</h2>
          <p className="text-gray-600">
            The requested complaint details could not be found.
          </p>
        </div>
      </div>
    );
  }

  // Assuming complaint data structure based on your code
  const serviceDetails = complaint.serviceDetails?.[0] || {};
  const userDetails = complaint.userDetails?.[0] || {};
  const deviceImages = complaint.deviceImages || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 mb-4"
      >
        <ArrowBack className="w-5 h-5" />
        <span>Back to Complaints</span>
      </button>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src={serviceDetails.image || "/api/placeholder/60/60"}
                alt={serviceDetails.name}
                className="w-16 h-16 rounded-full mr-4 border"
              />
              <div>
                <h1 className="text-2xl font-bold">
                  {serviceDetails.name || "Unknown Service"}
                </h1>
                <p className="text-gray-600">Request ID: {complaint._id}</p>
              </div>
            </div>
            <div>{getStatusBadge(complaint.status || "pending")}</div>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Service Details */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Service Details</h2>
            <div className="bg-gray-50 p-5 rounded-lg mb-6">
              <div className="flex items-start mb-4">
                <Handyman className="w-5 h-5 mr-3 mt-1 text-gray-500" />
                <div>
                  <h3 className="font-medium">Service Type</h3>
                  <p>{serviceDetails.name || "Unknown"}</p>
                </div>
              </div>

              <div className="flex items-start mb-4">
                <CalendarToday className="w-5 h-5 mr-3 mt-1 text-gray-500" />
                <div>
                  <h3 className="font-medium">Request Date</h3>
                  <p>{new Date(complaint.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-start mb-4">
                <LocationOn className="w-5 h-5 mr-3 mt-1 text-gray-500" />
                <div>
                  <h3 className="font-medium">Service Location</h3>
                  <p>{complaint.locationName?.address || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Warning className="w-5 h-5 mr-3 mt-1 text-gray-500" />
                <div>
                  <h3 className="font-medium">Description</h3>
                  <p>{complaint.description || "No description provided"}</p>
                </div>
              </div>
            </div>

            {/* Device Images */}
            {deviceImages.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Device Images</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {deviceImages.map((img: string, index: number) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                    >
                      <img
                        src={img || "/api/placeholder/300/300"}
                        alt={`Device ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Completion Status</h2>
              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Progress</span>
                  <span>{complaint.completionPercentage || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${complaint.completionPercentage || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - User Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <div className="bg-gray-50 p-5 rounded-lg">
              <div className="flex items-center mb-4">
                <Person className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <h3 className="font-medium">Name</h3>
                  <p>{userDetails.name || complaint.name || "Unknown"}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <h3 className="font-medium">Contact Number</h3>
                  <p>{userDetails.phone || "Not available"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
