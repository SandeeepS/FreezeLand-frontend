import React, { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import BlockIcon from "@mui/icons-material/Block";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import HelpIcon from "@mui/icons-material/Help";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { updateComplaintStatus } from "../../../Api/mech";
import { ComplaintStatus, getNextStatus, getStatusConfig, isStatusUpdateAllowed } from "../../../Enums/StatusEnums";

interface UpdateStatusBtnProps {
  complaintId: string;
  currentStatus: string;
  onStatusChange?: (newStatus: ComplaintStatus) => void;
}

const UpdateStatusBtn: React.FC<UpdateStatusBtnProps> = ({
  complaintId,
  currentStatus = ComplaintStatus.PENDING,
  onStatusChange,
}) => {
  const [status, setStatus] = useState<ComplaintStatus>(currentStatus as ComplaintStatus);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [nextStatus, setNextStatus] = useState<ComplaintStatus>(ComplaintStatus.PENDING);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Update internal state when prop changes
  useEffect(() => {
    if (currentStatus) {
      setStatus(currentStatus as ComplaintStatus);
    }
  }, [currentStatus]);

  const handleOpenConfirmDialog = () => {
    // Don't open dialog if status update not allowed
    if (!isStatusUpdateAllowed(status)) {
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
    setUpdateError(null);

    try {
      const response = await updateComplaintStatus(complaintId, nextStatus);
      
      if (!response || !response.data || !response.data.result) {
        throw new Error("Failed to update status");
      }

      const updatedStatus = response.data.result.status as ComplaintStatus;
      setStatus(updatedStatus);

      if (onStatusChange) {
        onStatusChange(updatedStatus);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setUpdateError("Failed to update status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Get status configuration
  const statusConfig = getStatusConfig(status);

  // Helper function to render the correct icon
  const renderIcon = () => {
    switch (statusConfig.icon) {
      case "CheckCircle":
        return <CheckCircleIcon className="mr-1" />;
      case "Settings":
        return <SettingsIcon className="mr-1" />;
      case "HourglassEmpty":
        return <HourglassEmptyIcon className="mr-1" />;
      case "Cancel":
        return <CancelIcon className="mr-1" />;
      case "Block":
        return <BlockIcon className="mr-1" />;
      case "ThumbUp":
        return <ThumbUpIcon className="mr-1" />;
      default:
        return <HelpIcon className="mr-1" />;
    }
  };

  const updateAllowed = isStatusUpdateAllowed(status);

  return (
    <div>
      {!updateAllowed ? (
        // For completed/canceled/blocked status - just a static display with no click handler
        <div className={`${statusConfig.color} text-white font-bold py-2 px-4 rounded flex items-center`}>
          {renderIcon()}
          {statusConfig.text}
        </div>
      ) : (
        // For other statuses - clickable button
        <button
          onClick={handleOpenConfirmDialog}
          disabled={isUpdating}
          className={`${statusConfig.color} text-white font-bold py-2 px-4 rounded flex items-center ${
            isUpdating ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {isUpdating ? <CircularProgress size={20} color="inherit" className="mr-2" /> : renderIcon()}
          {isUpdating ? "Updating..." : `${statusConfig.text} - Update Status`}
        </button>
      )}

      {/* Error message */}
      {updateError && (
        <div className="mt-2 text-red-500 text-sm">{updateError}</div>
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
            <strong>{getStatusConfig(status).text}</strong> to{" "}
            <strong>{getStatusConfig(nextStatus).text}</strong>?
            {nextStatus === ComplaintStatus.COMPLETED && (
              <p className="mt-2 text-red-500">
                Note: Once marked as Completed, the status cannot be changed again.
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