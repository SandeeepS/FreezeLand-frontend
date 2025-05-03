import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBack, Warning } from "@mui/icons-material";
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

const ComplaintDetail: React.FC = () => {
  // Existing code...
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [complaint, setComplaint] = useState<IComplaintDetails>();
  const [mechanicDetails, setMechanicDetails] =
    useState<IMechanicDetails | null>(null);

  // Existing useEffects...
  useEffect(() => {
    const fetchComplaintDetail = async () => {
      try {
        setLoading(true);
        const result = await getUserRegisteredServiceDetailsById(id as string);
        console.log("result from the backend is ", result);
        if (result?.data.result[0]) setComplaint(result.data.result[0]);
      } catch (error) {
        console.error("Error fetching complaint details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchComplaintDetail();

    // Set up polling for real-time updates every 30 seconds
    const pollingInterval = setInterval(async () => {
      try {
        const result = await getUserRegisteredServiceDetailsById(id as string);
        if (result?.data.result[0]) setComplaint(result.data.result[0]);
      } catch (error) {
        console.error("Error polling complaint details:", error);
      }
    }, 30000);

    return () => clearInterval(pollingInterval);
  }, [id]);

  // Mechanic details fetch
  useEffect(() => {
    const fetchMechanicDetails = async () => {
      if (complaint?.currentMechanicId) {
        try {
          const result = await getMechanicDetails(complaint.currentMechanicId);
          const mechanic = result?.data.result;
          if (mechanic) {
            setMechanicDetails({
              ...mechanic,
              acceptedAt: complaint.acceptedAt,
            });
          }
        } catch (error) {
          console.error("Error fetching mechanic details:", error);
        }
      }
    };

    fetchMechanicDetails();
  }, [complaint?.currentMechanicId, complaint?.acceptedAt]);

  // Loading and error handling...
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

  const serviceDetails = complaint.serviceDetails?.[0] || {};
  const userDetails = complaint.userDetails?.[0] || {};
  const deviceImages = complaint?.deviceImages || [];

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Status Progress Bar */}
        <div className="px-6 py-3 border-t border-b border-gray-100 bg-gray-50">
          <StatusProgressBar
            currentStatus={complaint.status || "pending"}
            compact={false}
            className="max-w-3xl mx-auto"
          />
        </div>

        <ComplaintHeader
          image={serviceDetails.image || "/api/placeholder/60/60"}
          name={serviceDetails.name || "Unknown Service"}
          requestId={complaint._id}
          status={complaint.status || "pending"}
        />
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6">
            <ComplaintInfo
              serviceDetails={serviceDetails}
              complaint={complaint}
              deviceImages={deviceImages}
            />
          </div>
          <div className="md:col-span-6 grid grid-cols-1 gap-6">
            <CustomerInfo
              userDetails={userDetails}
              fallbackName={complaint.name}
            />
            {complaint.currentMechanicId && (
              <MechanicInfo mechanicDetails={mechanicDetails} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
