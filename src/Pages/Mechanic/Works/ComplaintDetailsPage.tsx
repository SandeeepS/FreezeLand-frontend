import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Report as ReportIcon } from "@mui/icons-material";
import { Button, Snackbar, Alert } from "@mui/material";
import ServiceDetailsComponent from "./ServiceDetailsComponent";
import CustomerDetailsComponent from "./CustomerDetailsComponent";
import { createReport, getComplaintDetails } from "../../../Api/mech";
import LocationDetail from "./LocationDetail";
import GoogleMapLocation from "./GoogleMapLocation";
import AccecptBtn from "./AccecptBtn";
import UpdateStatusBtn from "./UpdateStatusBtn";
import { ComplaintDetails } from "../../../interfaces/IPages/Mechanic/IMechanicInterfaces";
import StatusProgressBar from "../../../components/Common/StatusProgressBar";
import { useSelector } from "react-redux"; 
import { RootState } from "../../../App/store"; 
import FloatingChat from "../../../components/Common/Chat/FloatingChat";
import { ComplaintStatus } from "../../../Enums/StatusEnums";
import ServiceCancelBtn from "../../../components/Common/ServiceCancelBtn";
import ReportModal from "../../../components/Common/Report/ReportModal";

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
  const mechid = id as string;
  const navigate = useNavigate();
  const [userComplaintDetails, setUserComplaintDetails] = useState<ComplaintDetails | null>(null);

  const mechDetails = useSelector((state: RootState) => state.auth.mechData);
  const currentMechId = mechDetails?.id || "";

  const [complaint, setComplaint] = useState<ComplaintDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);

  const fetchComplaintDetails = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getComplaintDetails(id);
      if (result && result.data.result && result.data.result.length > 0) {
        const complaintData = result.data.result[0];
        setUserComplaintDetails(complaintData);
        setComplaint(complaintData);
      } else {
        setError("No data found for this service request.");
        setComplaint(null);
      }
    } catch (error) {
      console.error("Error fetching complaint details:", error);
      setError("Failed to load service request data. Please try again later.");
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchComplaintDetails();
  }, [fetchComplaintDetails]);

  const handleStatusChange = useCallback((newStatus: ComplaintStatus) => {
    setComplaint(prevComplaint => {
      if (!prevComplaint) return prevComplaint;
      return {
        ...prevComplaint,
        status: newStatus,
      };
    });

    setUserComplaintDetails(prevDetails => {
      if (!prevDetails) return prevDetails;
      return {
        ...prevDetails,
        status: newStatus,
      };
    });
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const isAccepted = complaint?.status !== ComplaintStatus.PENDING;
  const showCancelButton = complaint?.status === ComplaintStatus.ACCEPTED;
  const showReportButton = isAccepted && complaint?.userId && (
    complaint.status === ComplaintStatus.ACCEPTED ||
    complaint.status === ComplaintStatus.ON_PROCESS ||
    complaint.status === ComplaintStatus.COMPLETED
  );
  const customerName = complaint?.name || complaint?.userDetails?.name || "Customer";

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

  return (
    <div className="px-4 py-2 bg-gray-50 min-h-screen mt-32">
      <div className="flex justify-center items-center mb-8 font-exo text-xl font-bold">
        <h1>Registered Complaint Details</h1>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
        <div className="px-6 py-4 bg-gray-100">
          <StatusProgressBar
            currentStatus={complaint.status}
            className="max-w-3xl mx-auto"
          />
        </div>

        <div className="flex items-center p-4 border-b border-gray-100 justify-center">
          {complaint.currentMechanicId ? (
            <UpdateStatusBtn
              complaintId={complaint._id}
              currentStatus={complaint.status}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <AccecptBtn
              complaintId={complaint._id}
              userId={userComplaintDetails?.userId || ""}
              mechId={currentMechId}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </div>

      {showCancelButton && (
        <div className="mt-4 flex justify-center pb-4">
          <ServiceCancelBtn
            complaintId={complaint._id}
            userRole="mechanic"
          />
        </div>
      )}
      
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
          <CustomerDetailsComponent
            complaint={complaint}
            formatDate={formatDate}
          />

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
        <ServiceDetailsComponent
          complaint={{
            ...complaint,
            image: complaint.image ?? [],
            workDetails: complaint.workDetails && complaint.workDetails.length > 0
              ? [complaint.workDetails[0]]
              : [{
                  description: "",
                  cost: 0,
                  addedAt: new Date(),
                }],
          }}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          formatDate={formatDate}
        />
      </div>

      {showReportButton && (
        <div className="mt-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Issues with the customer?
              </h3>
              <p className="text-gray-600 mb-4">
                If you experienced any problems with the customer or service conditions, you can report it to help us improve our platform.
              </p>
              <Button
                variant="outlined"
                color="error"
                startIcon={<ReportIcon />}
                onClick={() => setShowReportModal(true)}
                className="min-w-32"
              >
                Report Customer
              </Button>
            </div>
          </div>
        </div>
      )}

      <ReportModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={createReport}
        reporterRole="mechanic"
        targetRole="user"
        reporterId={mechid}
        targetId={complaint?.userId || ""}
        targetName={customerName}
        complaintId={complaint._id}
      />

      <Snackbar
        open={reportSuccess}
        autoHideDuration={6000}
        onClose={() => setReportSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setReportSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Report submitted successfully. Our team will review it shortly.
        </Alert>
      </Snackbar>

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

export default ComplaintDetailsPage;