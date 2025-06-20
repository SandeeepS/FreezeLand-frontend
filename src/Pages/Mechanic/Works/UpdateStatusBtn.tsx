import React, { useState } from "react";
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
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [nextStatus, setNextStatus] = useState<ComplaintStatus>(ComplaintStatus.PENDING);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const status = currentStatus as ComplaintStatus;
  const statusConfig = getStatusConfig(status);
  const updateAllowed = isStatusUpdateAllowed(status);

  const handleOpenConfirmDialog = () => {
    setUpdateError(null);
    
    if (!isStatusUpdateAllowed(status)) {
      console.log("Status update not allowed for:", status);
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

    // Optimistic update
    if (onStatusChange) {
      onStatusChange(nextStatus);
    }

    try {
      const response = await updateComplaintStatus(complaintId, nextStatus);
      
      if (!response?.data?.result) {
        throw new Error("Failed to update status - no valid response");
      }

      const updatedStatus = response.data.result.status as ComplaintStatus;
      console.log("Status updated successfully to:", updatedStatus);
    } catch (error) {
      console.error("Error updating status:", error);
      setUpdateError("Failed to update status. Please try again.");
      // Roll back optimistic update on error
      if (onStatusChange) {
        onStatusChange(status);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const renderIcon = () => {
    switch (statusConfig.icon) {
      case "CheckCircle": return <CheckCircleIcon className="mr-1" />;
      case "Settings": return <SettingsIcon className="mr-1" />;
      case "HourglassEmpty": return <HourglassEmptyIcon className="mr-1" />;
      case "Cancel": return <CancelIcon className="mr-1" />;
      case "Block": return <BlockIcon className="mr-1" />;
      case "ThumbUp": return <ThumbUpIcon className="mr-1" />;
      default: return <HelpIcon className="mr-1" />;
    }
  };

  return (
    <div>
      {!updateAllowed ? (
        <div className={`${statusConfig.color} text-white font-bold py-2 px-4 rounded flex items-center`}>
          {renderIcon()}
          {statusConfig.text}
        </div>
      ) : (
        <button
          onClick={handleOpenConfirmDialog}
          disabled={isUpdating}
          className={`${statusConfig.color} text-white font-bold py-2 px-4 rounded flex items-center ${
            isUpdating ? "opacity-75 cursor-not-allowed" : "hover:opacity-90"
          }`}
        >
          {isUpdating ? <CircularProgress size={20} color="inherit" className="mr-2" /> : renderIcon()}
          {isUpdating ? "Updating..." : `${statusConfig.text} - Update Status`}
        </button>
      )}

      {updateError && (
        <div className="mt-2 text-red-500 text-sm">{updateError}</div>
      )}

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth
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
                <strong>Note:</strong> Once marked as Completed, the status cannot be changed again.
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
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Confirm Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UpdateStatusBtn;