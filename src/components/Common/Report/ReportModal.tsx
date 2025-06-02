import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
  IconButton,
  Alert,
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import { Close, Report } from "@mui/icons-material";
import { createReport } from "../../../Api/mech";
import toast from "react-hot-toast";

interface IReportModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reportData: IReportData) => Promise<void>;
  reporterRole: "user" | "mechanic";
  targetRole: "mechanic" | "user" | "service";
  targetId: string;
  reporterId: string;
  targetName: string;
  complaintId: string;
}

export interface IReportData {
  reason?: string;
  discription?: string;
  reporterRole: "user" | "mechanic";
  targetId: string;
  targetRole: "mechanic" | "user" | "service";
  reporterId: string;
  targetName: string;
  complaintId: string;
}

// Predefined reasons for users
const USER_REPORT_REASONS = [
  "Mechanic arrived late",
  "Poor quality of work",
  "Overcharging/Price manipulation",
  "Unprofessional behavior",
  "Did not complete the work",
  "Damaged my vehicle/device",
  "Safety concerns",
  "Communication issues",
  "Other",
];

// Predefined reasons for mechanics
const MECHANIC_REPORT_REASONS = [
  "Customer not available at location",
  "Provided wrong/incomplete information",
  "Refused to pay agreed amount",
  "Abusive/inappropriate behavior",
  "Unsafe working conditions",
  "Property access issues",
  "Customer cancelled last minute",
  "Payment disputes",
  "Other",
];

const ReportModal: React.FC<IReportModalProps> = ({
  open,
  onClose,
  onSubmit,
  reporterRole,
  targetRole,
  reporterId,
  targetId,
  targetName,
  complaintId,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customDescription, setCustomDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Get appropriate reasons based on reporter type
  const reasons =
    reporterRole === "user" ? USER_REPORT_REASONS : MECHANIC_REPORT_REASONS;

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (open) {
      setSelectedReason("");
      setCustomDescription("");
      setError("");
    }
  }, [open]);

  const handleSubmit = async () => {
    // Validation
    if (!selectedReason) {
      setError("Please select a reason for reporting");
      return;
    }

    if (selectedReason === "Other" && !customDescription.trim()) {
      setError("Please provide a description when selecting 'Other'");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const reportData: IReportData = {
        reason: selectedReason,
        discription: customDescription.trim(),
        reporterRole,
        targetId,
        targetRole,
        reporterId,
        targetName,
        complaintId,
      };
      console.log("report details for submisstion is ", reportData);
      const restult = await createReport(reportData);
      console.log("result after createing the from the backend is ",restult);
      if(restult?.data.success){
        toast.success("Report Submitted successfully");
      }else{
        toast.error("Report submission failed");
      }
      onClose();
    } catch (error) {
      setError("Failed to submit report. Please try again.");
      console.error("Error submitting report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const getModalTitle = () => {
    const targetLabel =
      targetRole === "mechanic"
        ? "Mechanic"
        : targetRole === "user"
        ? "Customer"
        : "Service";
    return `Report ${targetLabel}${targetName ? ` - ${targetName}` : ""}`;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: { borderRadius: 12 },
      }}
    >
      <DialogTitle>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Report className="text-red-500" />
            <Typography variant="h6" component="div">
              {getModalTitle()}
            </Typography>
          </div>
          <IconButton onClick={handleClose} disabled={isSubmitting}>
            <Close />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent dividers>
        <div className="space-y-4">
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" className="mb-2">
              <Typography variant="subtitle1" fontWeight="medium">
                What is the issue you want to report?
              </Typography>
            </FormLabel>
            <RadioGroup
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
            >
              {reasons.map((reason) => (
                <FormControlLabel
                  key={reason}
                  value={reason}
                  control={<Radio />}
                  label={reason}
                  className="mb-1"
                />
              ))}
            </RadioGroup>
          </FormControl>

          <TextField
            label={
              selectedReason === "Other"
                ? "Please describe the issue *"
                : "Additional details (optional)"
            }
            multiline
            rows={4}
            fullWidth
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            placeholder={
              selectedReason === "Other"
                ? "Please provide details about the issue..."
                : "Any additional information you'd like to share..."
            }
            variant="outlined"
            required={selectedReason === "Other"}
            disabled={isSubmitting}
          />

          <Typography variant="body2" color="text.secondary" className="mt-2">
            Your report will be reviewed by our team. False reports may result
            in account restrictions.
          </Typography>
        </div>
      </DialogContent>

      <DialogActions className="p-4">
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedReason}
          variant="contained"
          color="error"
          startIcon={isSubmitting ? <CircularProgress size={16} /> : <Report />}
        >
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportModal;
