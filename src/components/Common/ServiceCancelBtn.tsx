import React, { useState } from "react";
import { cancelComplaint } from "../../Api/admin";
import ConfirmationModal2 from "./ConfirmationModal2";
import SuccessModal from "./Modal/SuccessModal";
import { useNavigate } from "react-router-dom";

interface ServiceCancelBtnProps {
  complaintId: string;
  userRole?: "user" | "mechanic";
}

const ServiceCancelBtn: React.FC<ServiceCancelBtnProps> = ({
  complaintId,
  userRole = "user",
}) => {
  const navigate = useNavigate();
  let redirectLink : string;
  if(userRole == "user"){
     redirectLink = "/";
  }else if(userRole == "mechanic"){
     redirectLink = "/mech/homepage"
  }
  
  const [showModal, setShowModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const reasonsByRole = {
    user: [
      "Issue resolved",
      "Service not needed anymore",
      "Booked by mistake",
      "Found another provider",
    ],
    mechanic: [
      "Unavailable currently",
      "Incorrect service request",
      "Location too far",
      "Duplicate request",
    ],
  };

  const handleServiceCancel = async (reason: string) => {
    try {
      console.log(
        `Canceling complaint ID: ${complaintId} as ${userRole}, reason: ${reason}`
      );
      const result = await cancelComplaint(complaintId, userRole, reason);
      console.log("Backend result:", result);
      
      // Set success status and message
      setIsSuccess(true);
      setStatusMessage("Service request cancelled successfully!");
      setShowStatusModal(true);
    } catch (error) {
      console.error("Error cancelling service request:", error);
      
      // Set error status and message
      setIsSuccess(false);
      setStatusMessage("Failed to cancel service request. Please try again.");
      setShowStatusModal(true);
    } finally {
      setShowModal(false);
    }
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
      if (isSuccess && redirectLink) {
    navigate(redirectLink);
  }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-md flex items-center"
      >
        Cancel Service
      </button>

      <ConfirmationModal2
        isOpen={showModal}
        title="Cancel Service"
        message="Are you sure you want to cancel this service request?"
        reasons={reasonsByRole[userRole]}
        onConfirm={handleServiceCancel}
        onCancel={() => setShowModal(false)}
      />

      <SuccessModal
        isOpen={showStatusModal}
        message={statusMessage}
        onClose={closeStatusModal}
        isSuccess={isSuccess}
      />
    </>
  );
};

export default ServiceCancelBtn;