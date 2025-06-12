import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Warning, Report as ReportIcon } from "@mui/icons-material";
import { Button, Snackbar, Alert } from "@mui/material";
import {
  createReport,
  getMechanicDetails,
  getUserRegisteredServiceDetailsById,
} from "../../../../Api/user";
import ComplaintHeader from "./ComplaintHeader";
import ComplaintInfo from "./ComplaintInfo";
import CustomerInfo from "./CustomerInfo";
import MechanicInfo from "./MechanicInfo";
import {
  IComplaintDetails,
  IMechanicDetails,
} from "../../../../interfaces/IComponents/User/IUserInterfaces";
import StatusProgressBar from "../../../Common/StatusProgressBar";
import FloatingChat from "../../../Common/Chat/FloatingChat";
import WorkDetailsBill from "./WorkDetailsBill";
import PaymentButton from "./PaymentButton";
import ServiceCancelBtn from "../../../Common/ServiceCancelBtn";
import ReportModal from "../../../Common/Report/ReportModal";
import InvoiceDownloadButton from "../../../Common/generateInvoicePDF";
import { IUserData } from "../../../../interfaces/IUserData";

interface IServiceDetails {
  image?: string;
  name: string;
}



/**
 * ComplaintDetail component displays detailed information about a service complaint
 * including customer information, mechanic details, work details bill and complaint status
 */

const ComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [complaint, setComplaint] = useState<IComplaintDetails | undefined>(
    undefined
  );
  const [mechanicDetails, setMechanicDetails] =
    useState<IMechanicDetails | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Report modal states
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);

  // Fetch complaint details and set up polling for real-time updates
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout;

    const fetchComplaintDetail = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const result = await getUserRegisteredServiceDetailsById(id);

        if (result?.data?.result?.[0]) {
          setComplaint(result.data.result[0]);
        }
      } catch (error) {
        console.error("Error fetching complaint details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const setupPolling = () => {
      // Poll for updates every 30 seconds
      pollingInterval = setInterval(async () => {
        if (!id) return;

        try {
          const result = await getUserRegisteredServiceDetailsById(id);
          if (result?.data?.result?.[0]) {
            setComplaint(result.data.result[0]);
          }
        } catch (error) {
          console.error("Error polling complaint details:", error);
        }
      }, 30000);
    };

    fetchComplaintDetail();
    setupPolling();

    // Clean up interval on component unmount
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [id]);

  // Fetch mechanic details when complaint or mechanic ID changes
  useEffect(() => {
    const fetchMechanicDetails = async () => {
      if (!complaint?.currentMechanicId) return;

      try {
        const result = await getMechanicDetails(complaint.currentMechanicId);
        const mechanic = result?.data?.result;

        if (mechanic) {
          setMechanicDetails({
            ...mechanic,
            acceptedAt: complaint.acceptedAt,
          });
        }
      } catch (error) {
        console.error("Error fetching mechanic details:", error);
      }
    };

    fetchMechanicDetails();
  }, [complaint?.currentMechanicId, complaint?.acceptedAt]);



  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state if complaint not found
  if (!complaint) {
    return (
      <div className="container mx-auto px-4 py-8">
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

  // Extract data from complaint
  const serviceDetails: IServiceDetails = complaint.serviceDetails?.[0] || {};
  const userDetails: IUserData = complaint.userDetails
    ? complaint.userDetails
    : { name: "", email: "", phone: "" };
  const deviceImages = complaint.deviceImages || [];
  const status = complaint.status || "pending";

  // Check if work has started (mechanic assigned and has added some work details)
  const hasWorkDetails =
    complaint.workDetails && complaint.workDetails.length > 0;
  const workStarted =
    complaint.currentMechanicId &&
    (complaint.status === "accepted" ||
      complaint.status === "onProcess" ||
      complaint.status === "completed" ||
      hasWorkDetails);

  //  show the cancel button (only when status is exactly "accepted")
  const showCancelButton = status === "accepted" || status === "pending";

  // for  show the report button (only when mechanic is assigned)
  const showReportButton = complaint.currentMechanicId && mechanicDetails;

   //  payment is completed and invoice can be downloaded after completed 
  const isPaymentCompleted = status === "completed" && complaint.orderId !== null;

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Status Progress Bar */}
        <div className="px-6 py-3 border-t border-b border-gray-100 ">
          <StatusProgressBar
            currentStatus={status}
            compact={false}
            className="max-w-3xl mx-auto"
          />
        </div>

        {/*Service Cancel Button if status is "accepted" */}
        {showCancelButton && (
          <div className="mt-4 flex justify-center pb-4">
            <ServiceCancelBtn complaintId={complaint._id} userRole="user" />
          </div>
        )}

        <ComplaintHeader
          image={serviceDetails.image || "/api/placeholder/60/60"}
          name={serviceDetails.name || "Unknown Service"}
          requestId={complaint._id}
          status={status}
        />

        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left column - Complaint information */}
          <div className="md:col-span-6">
            <ComplaintInfo
              serviceDetails={serviceDetails}
              complaint={complaint}
              deviceImages={deviceImages}
            />
          </div>

          {/* Right column - Customer and mechanic information */}
          <div className="md:col-span-6 grid grid-cols-1 gap-6">
            <CustomerInfo
              userDetails={userDetails}
              fallbackName={complaint.name}
            />

            {complaint.currentMechanicId && mechanicDetails && (
              <MechanicInfo mechanicDetails={mechanicDetails} />
            )}
          </div>
        </div>
      </div>

      <div>
        {/* Work Details Bill if work has started */}
        {workStarted && (
          <WorkDetailsBill
            complaint={complaint}
            setTotalAmount={setTotalAmount}
          />
        )}
      </div>

      <div>
        {status == "completed" && complaint.orderId == null && (
          <PaymentButton
            complaintId={complaint._id}
            status={status}
            mechanicId={mechanicDetails?._id as string}
            serviceId={complaint.serviceDetails?.[0]?._id}
            amount={totalAmount}
          />
        )}
      </div>

      {/* Invoice Download , when payment is completed */}
      {isPaymentCompleted && (
        <InvoiceDownloadButton
          complaint={complaint}
          mechanicDetails={mechanicDetails ?? undefined}
          totalAmount={totalAmount}
        />
      )}

      {/* Report Button Section */}
      {showReportButton && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Having issues with the service?
            </h3>
            <p className="text-gray-600 mb-4">
              If you experienced any problems with the mechanic or service
              quality, you can report it to help us improve.
            </p>
            <Button
              variant="outlined"
              color="error"
              startIcon={<ReportIcon />}
              onClick={() => setShowReportModal(true)}
              className="min-w-32"
            >
              Report Mechanic
            </Button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={createReport}
        reporterRole="user"
        targetRole="mechanic"
        targetId={mechanicDetails?._id || ""}
        targetName={mechanicDetails?.name || ""}
        reporterId={userDetails._id || ""}
        complaintId={complaint._id}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={reportSuccess}
        autoHideDuration={6000}
        onClose={() => setReportSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setReportSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Report submitted successfully. Our team will review it shortly.
        </Alert>
      </Snackbar>

      {/* Add Floating Chat component only if the complaint has been accepted */}
      {complaint._id && complaint.userId && complaint.currentMechanicId && (
        <FloatingChat
          complaintId={complaint._id}
          userId={complaint.userId}
          mechanicId={complaint.currentMechanicId}
          roomId={complaint.chatId}
          senderType="User"
        />
      )}
    </div>
  );
};

export default ComplaintDetail;
