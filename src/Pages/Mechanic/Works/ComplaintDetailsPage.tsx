import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ServiceDetailsComponent from "./ServiceDetailsComponent";
import CustomerDetailsComponent from "./CustomerDetailsComponent";
import { getComplaintDetails } from "../../../Api/mech";
import LocationDetail from "./LocationDetail";
import GoogleMapLocation from "./GoogleMapLocation";
import AccecptBtn from "./AccecptBtn";
import UpdateStatusBtn from "./UpdateStatusBtn";
import { ComplaintDetails } from "../../../interfaces/IPages/Mechanic/IMechanicInterfaces";
import { ComplaintStatus } from "../../../Enums/StatusEnums";
import StatusProgressBar from "../../../components/Common/StatusProgressBar";

import { useSelector } from "react-redux"; // Import useSelector to access current user ID
import { RootState } from "../../../App/store"; // Import RootState type
import FloatingChat from "../../../components/Common/Chat/FloatingChat";

// Move formatDate outside the component to prevent recreation on each render
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ComplaintDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userComplaintDetails, setUserComplaintDetails] = useState<unknown>();

  // Get current user from Redux store
  const mechDetails = useSelector((state: RootState) => state.auth.mechData);
  const currentMechId = mechDetails?.id || "";

  const [complaintState, setComplaintState] = useState<{
    data: ComplaintDetails | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  const [activeTab, setActiveTab] = useState<string>("details");

  const { data: complaint, loading, error } = complaintState;

  // Fetch complaint details - use useCallback with proper dependencies
  const fetchComplaintDetails = useCallback(async () => {
    if (!id) return;

    setComplaintState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await getComplaintDetails(id);
      console.log("complaint details in the complaintDetailPage is ", result);
      if (result && result.data.result && result.data.result.length > 0) {
        const complaintData = result.data.result[0];
        setUserComplaintDetails(result.data.result[0]);
        setComplaintState({
          data: complaintData,
          loading: false,
          error: null,
        });
      } else {
        setComplaintState({
          data: null,
          loading: false,
          error: "No data found for this service request.",
        });
      }
    } catch (error) {
      console.error("Error fetching complaint details:", error);
      setComplaintState({
        data: null,
        loading: false,
        error: "Failed to load service request data. Please try again later.",
      });
    }
  }, [id]); // Only depends on id

  useEffect(() => {
    fetchComplaintDetails();
  }, [fetchComplaintDetails]);

  const handleStatusChange = useCallback((newStatus: ComplaintStatus) => {
    setComplaintState((prev) => {
      if (!prev.data) return prev;

      return {
        ...prev,
        data: {
          ...prev.data,
          status: newStatus,
        },
      };
    });
  }, []);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Derive computed values with useMemo to prevent recalculation
  const isAccepted = useMemo(() => {
    return complaint?.status !== ComplaintStatus.PENDING;
  }, [complaint?.status]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error || !complaint) {
    return (
      <div className="px-4 py-6 mt-32">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || "Complaint not found."}</p>
          <button
            onClick={handleBack}
            className="mt-3 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <ArrowBackIcon className="mr-1" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 bg-gray-50 min-h-screen mt-32">
      {/* Heading */}
      <div className="flex justify-center items-center mb-8 font-exo text-xl font-bold">
        <h1>Registered Complaint Details</h1>
      </div>

      {/* Header section with status progress bar and accept/update button */}
      <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
        {/* Status Progress Bar */}
        <div className="px-6 py-4 bg-gray-100">
          <StatusProgressBar
            currentStatus={complaint.status}
            className="max-w-3xl mx-auto"
          />
        </div>

        <div className="flex items-center p-4 border-b border-gray-100 justify-center">
          {complaint.currentMechanicId ? (
            <div>
              <UpdateStatusBtn
                complaintId={complaint._id}
                currentStatus={complaint.status}
                onStatusChange={handleStatusChange}
              />
            </div>
          ) : (
            <div>
              <AccecptBtn
                complaintId={complaint._id}
                userId={userComplaintDetails?.userId}
                mechId={currentMechId}
                onStatusChange={handleStatusChange}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-center pb-4">
        <button
          onClick={() => {
            // Implement your cancel request logic here
            if (
              window.confirm(
                "Are you sure you want to cancel this service request?"
              )
            ) {
              // Call your API endpoint to raise a cancel request
              // Example: cancelServiceRequest(complaint._id)
            }
          }}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded shadow-md flex items-center"
        >
          Cancel Service Request
        </button>
      </div>
      {/* Main content with conditional layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2">
          {complaint.locationName &&
          typeof complaint.locationName === "object" &&
          "address" in complaint.locationName &&
          "latitude" in complaint.locationName &&
          "longitude" in complaint.locationName ? (
            <GoogleMapLocation
              location={
                complaint.locationName as {
                  address: string;
                  latitude: number;
                  longitude: number;
                }
              }
            />
          ) : (
            <div className="text-red-500">Invalid location data</div>
          )}
        </div>

        <div className="w-full lg:w-1/2 flex flex-col space-y-6">
          {/* Customer info card */}
          <CustomerDetailsComponent
            complaint={complaint}
            formatDate={formatDate}
          />

          {/* Location details */}
          {complaint.locationName &&
          typeof complaint.locationName === "object" &&
          "address" in complaint.locationName &&
          "latitude" in complaint.locationName &&
          "longitude" in complaint.locationName ? (
            <LocationDetail
              location={
                complaint.locationName as {
                  address: string;
                  latitude: number;
                  longitude: number;
                }
              }
            />
          ) : (
            <div className="text-red-500">Invalid location data</div>
          )}
        </div>
      </div>

      <div>
        {/* Service details component (only if accepted) */}
        {isAccepted && (
          <ServiceDetailsComponent
            complaint={complaint}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formatDate={formatDate}
          />
        )}
      </div>

      {/* Add Floating Chat component only if the complaint has been accepted */}
      {isAccepted &&
        complaint._id &&
        complaint.userId &&
        complaint.currentMechanicId && (
          <FloatingChat
            complaintId={complaint._id}
            userId={complaint.userId}
            mechanicId={complaint.currentMechanicId}
            roomId={complaint.chatId}
            senderType="Mechanic"
          />
        )}
    </div>
  );
};

export default React.memo(ComplaintDetailsPage);
