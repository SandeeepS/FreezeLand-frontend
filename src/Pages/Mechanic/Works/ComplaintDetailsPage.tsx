import React, { useEffect, useState, useCallback } from "react";
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

const ComplaintDetailsPage: React.FC = () => {
  // Existing state...
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<ComplaintDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("details");

  // Format date function
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

  // Fetch complaint details
  const fetchComplaintDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (id) {
        const result = await getComplaintDetails(id);

        if (result && result.data.result && result.data.result.length > 0) {
          const complaintData = result.data.result[0];
          setComplaint(complaintData);
        } else {
          setError("No data found for this service request.");
        }
      }
    } catch (error) {
      console.error("Error fetching complaint details:", error);
      setError("Failed to load service request data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Initial data fetch
  useEffect(() => {
    fetchComplaintDetails();

    // Set up polling for real-time updates every 30 seconds
    const pollingInterval = setInterval(() => {
      fetchComplaintDetails();
    }, 30000);

    return () => clearInterval(pollingInterval);
  }, [fetchComplaintDetails]);

  // Handle status changes
  const handleStatusChange = useCallback(
    (newStatus: ComplaintStatus) => {
      // Update local state immediately for better UX
      if (complaint) {
        setComplaint({
          ...complaint,
          status: newStatus,
        });
      }

      // Refresh data from server to ensure everything is in sync
      fetchComplaintDetails();
    },
    [complaint, fetchComplaintDetails]
  );

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };

  // Loading and error handling...
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

  const isAccepted = complaint.status !== ComplaintStatus.PENDING;

  return (
    <div className="px-4 py-4 bg-gray-50 min-h-screen mt-32">
      {/**Heading  */}
      <div className="flex justify-center items-center mb-8 font-exo text-xl font-bold">
      <h1>Registered Complaint Details </h1>

      </div>
      {/* Header section with status progress bar and accept / update button*/}
      <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
        {/* Status Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <StatusProgressBar
            currentStatus={complaint.status}
            className="max-w-3xl mx-auto"
          />
        </div>

        <div className="flex items-center p-4 border-b border-gray-100 justify-end">
          {/* Show UpdateBtn if currentMechanicId exists, otherwise show AcceptBtn */}
          {complaint.currentMechanicId ? (
            <UpdateStatusBtn
              complaintId={complaint._id}
              currentStatus={complaint.status}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <AccecptBtn
              complaintId={complaint._id}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </div>

      {/* Main content with conditional layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Google Map (Always shows on the left in the new layout) */}
        <div className="lg:col-span-1">
          <GoogleMapLocation location={complaint.locationName} />
        </div>

        {/* Right column - Service info, Customer info, and Location details */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          {/* Service details component (only if accepted) */}
          {isAccepted && (
            <ServiceDetailsComponent
              complaint={complaint}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              formatDate={formatDate}
            />
          )}

          {/* Customer info card */}
          <CustomerDetailsComponent
            complaint={complaint}
            formatDate={formatDate}
          />

          {/* Location details */}
          <LocationDetail location={complaint.locationName} />
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsPage;
