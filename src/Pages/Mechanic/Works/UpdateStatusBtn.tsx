import React, { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { updateComplaintStatus } from "../../../Api/mech";

interface UpdateStatusBtnProps {
  complaintId: string;
  currentStatus?: string;
  onStatusChange?: (newStatus: string) => void;
}

const UpdateStatusBtn: React.FC<UpdateStatusBtnProps> = ({
  complaintId,
  currentStatus = "pending",
  onStatusChange,
}) => {
  const [status, setStatus] = useState<string>(currentStatus || "pending");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [nextStatus, setNextStatus] = useState<string>("");

  // Update internal state when prop changes
  useEffect(() => {
    if (currentStatus) {
      setStatus(currentStatus);
    }
  }, [currentStatus]);

  // Define the next status in the sequence
  const getNextStatus = (currentStatus: string): string => {
    switch (currentStatus.toLowerCase()) {
      case "pending":
        return "on process";
      case "on process":
        return "completed";
      default:
        return "completed";
    }
  };

  const handleOpenConfirmDialog = () => {
    // Don't open dialog if already completed
    if (status.toLowerCase() === "completed") {
      return;
    }

    const next = getNextStatus(status);
    setNextStatus(next);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const updateStatusInDatabase = async () => {
    handleCloseConfirmDialog();
    setIsUpdating(true);

    try {
      const response = await updateComplaintStatus(complaintId, nextStatus);
      console.log("response is ", response);

      if (!response || !response.data || !response.data.result) {
        throw new Error("Failed to update status");
      }

      setStatus(response.data.result.status);

      if (onStatusChange) {
        onStatusChange(response.data.result.status);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Get the correct status configuration based on current status
  const getStatusConfig = (currentStatus: string) => {
    const normalizedStatus = currentStatus.toLowerCase().replace(/\s+/g, "");

    if (normalizedStatus === "pending") {
      return {
        color: "bg-yellow-500 hover:bg-yellow-600",
        icon: <HourglassEmptyIcon className="mr-1" />,
        text: "Pending - Update Status",
      };
    } else if (
      normalizedStatus === "onprocess" ||
      normalizedStatus === "on process"
    ) {
      return {
        color: "bg-blue-500 hover:bg-blue-600",
        icon: <SettingsIcon className="mr-1" />,
        text: "On Process - Update Status",
      };
    } else if (normalizedStatus === "completed") {
      return {
        color: "bg-green-500", // Remove hover effect for completed status
        icon: <CheckCircleIcon className="mr-1" />,
        text: "Completed",
      };
    }

    // Default fallback
    return {
      color: "bg-yellow-500 hover:bg-yellow-600",
      icon: <HourglassEmptyIcon className="mr-1" />,
      text: "Pending - Update Status",
    };
  };

  // Get current configuration
  const currentConfig = getStatusConfig(status);

  // Helper function to format status text for display
  const formatStatusText = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const isCompleted = status.toLowerCase() === "completed";

  return (
    <div>
      {isCompleted ? (
        // For completed status - just a static display with no click handler
        <div
          className={`${currentConfig.color} text-white font-bold py-2 px-4 rounded flex items-center`}
        >
          {currentConfig.icon}
          {currentConfig.text}
        </div>
      ) : (
        // For other statuses - clickable button
        <button
          onClick={handleOpenConfirmDialog}
          disabled={isUpdating}
          className={`${
            currentConfig.color
          } text-white font-bold py-2 px-4 rounded flex items-center ${
            isUpdating ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {currentConfig.icon}
          {isUpdating ? "Updating..." : currentConfig.text}
        </button>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Update Complaint Status"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to update the status from{" "}
            <strong>{formatStatusText(status)}</strong> to{" "}
            <strong>{formatStatusText(nextStatus)}</strong>?
            {nextStatus.toLowerCase() === "completed" && (
              <p className="mt-2 text-red-500">
                Note: Once marked as Completed, the status cannot be changed
                again.
              </p>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={updateStatusInDatabase}
            color="primary"
            variant="contained"
            autoFocus
          >
            Confirm Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UpdateStatusBtn;
