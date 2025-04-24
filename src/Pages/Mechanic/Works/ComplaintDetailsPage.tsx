import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import ServiceDetailsComponent from "./ServiceDetailsComponent";
import CustomerDetailsComponent from "./CustomerDetailsComponent";
import StatusInfoComponent from "./StatusInfoComponent";

import { getComplaintDetails } from "../../../Api/mech";
import LocationDetail from "./LocationDetail";
import GoogleMapLocation from "./GoogleMapLocation";
import AccecptBtn from "./AccecptBtn";
import UpdateStatusBtn from "./UpdateStatusBtn";
import { ComplaintDetails } from "../../../interfaces/IPages/Mechanic/IMechanicInterfaces";
import { ComplaintStatus } from "../../../Enums/StatusEnums";

const ComplaintDetailsPage: React.FC = () => {
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

  // Fetch complaint details - extract to reusable function for refreshing data
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
      setError(
        "Failed to load service request data. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Initial data fetch
  useEffect(() => {
    fetchComplaintDetails();
  }, [fetchComplaintDetails]);

  // Handle status changes
  const handleStatusChange = useCallback((newStatus: ComplaintStatus) => {
    // Update local state immediately for better UX
    if (complaint) {
      setComplaint({
        ...complaint,
        status: newStatus
      });
    }
    
    // Optionally refresh data from server to ensure everything is in sync
    fetchComplaintDetails();
  }, [complaint, fetchComplaintDetails]);

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6 mt-32">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
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

  if (!complaint) {
    return (
      <div className="px-4 py-6 mt-32">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>
            Complaint not found. The requested service request may have been
            removed or you don't have permission to view it.
          </p>
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

  // Check if complaint is accepted or in progress
  const isAccepted = complaint.status !== ComplaintStatus.PENDING;

  return (
    <div className="px-4 py-6 bg-gray-50 min-h-screen mt-32">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="mr-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-3 rounded-full flex items-center"
        >
          <ArrowBackIcon fontSize="small" />
        </button>
        
        <h1 className="text-2xl font-bold flex-grow">
          Service Request Details
        </h1>

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

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Service info */}
        {isAccepted && (
          <ServiceDetailsComponent
            complaint={complaint}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formatDate={formatDate}
          />
        )}

        {/* Right column - Customer and status info */}
        <div className={`lg:col-span-${isAccepted ? 1 : 3}`}>
          {/* Status info card */}
          {complaint.status && complaint.priority && (
            <StatusInfoComponent
              status={complaint.status}
              priority={complaint.priority}
            />
          )}

          {/* Customer info card */}
          <CustomerDetailsComponent
            complaint={complaint}
            formatDate={formatDate}
          />

          {/* Location details */}
          <LocationDetail location={complaint.locationName} />
          <GoogleMapLocation location={complaint.locationName} />
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsPage;