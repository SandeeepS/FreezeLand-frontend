import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Warning } from "@mui/icons-material";

import {
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

interface IServiceDetails {
  image?: string;
  name?: string;
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
  const userDetails = complaint.userDetails?.[0] || {};
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

  // Check if we should show the cancel button (only when status is exactly "accepted")
  const showCancelButton = status === "accepted" || status === "pending";

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
            <ServiceCancelBtn complaintId={complaint._id} userRole="user"  />
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
        {status == "completed" && (
          <PaymentButton
            complaintId={complaint._id}
            status={status}
            mechanicId={mechanicDetails?._id as string}
            serviceId={complaint.serviceDetails?.[0]?._id}
            amount={totalAmount}
          />
        )}
      </div>

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
