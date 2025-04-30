import React, { useState } from "react";
import SwipeRightIcon from "@mui/icons-material/SwipeRight";
import CircularProgress from "@mui/material/CircularProgress";
import ConfirmationModal from "./ConformationModal";
import { RootState, useAppSelector } from "../../../App/store";
import { updateWorkAssigned } from "../../../Api/mech";
import { useNavigate } from "react-router-dom";
import { ComplaintStatus } from "../../../Enums/StatusEnums";


interface AcceptBtnProps {
  complaintId: string;
  onStatusChange?: (newStatus: ComplaintStatus) => void;
}

const AcceptBtn: React.FC<AcceptBtnProps> = ({ complaintId, onStatusChange }) => {
  const navigate = useNavigate();
  const mechanic = useAppSelector((state: RootState) => state.auth.mechData);
  const mechanicId = mechanic?.data._id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const status = ComplaintStatus.ACCEPTED;
      const result = await updateWorkAssigned(complaintId, mechanicId, status);
      
      if (result?.data.success === true) {
        if (onStatusChange) {
          onStatusChange(ComplaintStatus.ACCEPTED);
        }
        navigate("/mech/queue");
      } else {
        throw new Error("Failed to accept the work");
      }
    } catch (error) {
      console.error("Error accepting work:", error);
      setError("Failed to accept the work. Please try again.");
    } finally {
      setIsProcessing(false);
      closeModal();
    }
  };

  return (
    <div>
      <button
        onClick={openModal}
        disabled={isProcessing}
        className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center ${
          isProcessing ? "opacity-75 cursor-not-allowed" : ""
        }`}
      >
        {isProcessing ? (
          <CircularProgress size={20} color="inherit" className="mr-2" />
        ) : (
          <SwipeRightIcon className="mr-1" />
        )}
        {isProcessing ? "Processing..." : "Accept"}
      </button>
      
      {error && (
        <div className="mt-2 text-red-500 text-sm">{error}</div>
      )}
      
      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default AcceptBtn;