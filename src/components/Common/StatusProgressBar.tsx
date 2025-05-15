import React from "react";
import { ComplaintStatus } from "../../Enums/StatusEnums";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BuildIcon from "@mui/icons-material/Build";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import BlockIcon from "@mui/icons-material/Block";

interface StatusProgressBarProps {
  currentStatus: string;
  className?: string;
  compact?: boolean;
}

const StatusProgressBar: React.FC<StatusProgressBarProps> = ({
  currentStatus,
  className = "",
  compact = false,
}) => {
  // Check if status is any form of canceled
  const isCanceled =
    currentStatus === ComplaintStatus.CANCELED ||
    currentStatus === "canceled_by_user" ||
    currentStatus === "canceled_by_mechanic";

  // Define the standard status steps in order
  const standardStatusSteps = [
    {
      status: ComplaintStatus.PENDING,
      label: "Pending",
      icon: <AssignmentTurnedInIcon fontSize={compact ? "small" : "medium"} />,
      color: "bg-yellow-500",
      textColor: "text-yellow-700",
    },
    {
      status: ComplaintStatus.ACCEPTED,
      label: "Accepted",
      icon: <CheckCircleIcon fontSize={compact ? "small" : "medium"} />,
      color: "bg-blue-500",
      textColor: "text-blue-700",
    },
    {
      status: ComplaintStatus.ON_PROCESS,
      label: "In Progress",
      icon: <BuildIcon fontSize={compact ? "small" : "medium"} />,
      color: "bg-purple-500",
      textColor: "text-purple-700",
    },
    {
      status: ComplaintStatus.COMPLETED,
      label: "Completed",
      icon: <DoneAllIcon fontSize={compact ? "small" : "medium"} />,
      color: "bg-green-500",
      textColor: "text-green-700",
    },
  ];

  // Create cancel step
  const cancelStep = {
    status: "CANCELED",
    label: "Canceled",
    icon: <ReportProblemIcon fontSize={compact ? "small" : "medium"} />,
    color: "bg-red-500",
    textColor: "text-red-700",
  };

  // Choose the appropriate steps based on status
  let statusSteps = [];

  if (isCanceled) {
    // For canceled status, we only show Pending -> Accepted -> Canceled
    statusSteps = [
      standardStatusSteps[0], // Pending
      standardStatusSteps[1], // Accepted
      cancelStep, // Canceled
    ];
  } else {
    // For normal flow, show all standard steps
    statusSteps = standardStatusSteps;
  }

  // Determine current step index
  let currentStepIndex;

  if (isCanceled) {
    // If canceled, set to the cancel step (last in our modified flow)
    currentStepIndex = 2;
  } else {
    // For standard statuses, find the index as normal
    currentStepIndex = statusSteps.findIndex(
      (step) => step.status === currentStatus
    );
  }

  // Handle special status (blocked)
  const isBlocked = currentStatus === ComplaintStatus.BLOCKED;

  return (
    <div className={`${className} py-2`}>
      {isBlocked ? (
        <div className="flex items-center justify-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <BlockIcon className="text-red-500 mr-2" />
          <span className="font-medium text-red-700">
            This service request has been blocked
          </span>
        </div>
      ) : (
        <div className="relative">
          {/* Status labels at top */}
          <div className="flex justify-between mb-1">
            {statusSteps.map((step, index) => {
              const isActive = index <= currentStepIndex;
              return (
                <div
                  key={`label-${step.status}`}
                  className={`text-xs font-medium ${
                    isActive ? step.textColor : "text-gray-400"
                  } ${compact ? "text-center w-16" : "w-24 text-center"}`}
                  style={{
                    transition: "all 0.3s ease",
                  }}
                >
                  {step.label}
                </div>
              );
            })}
          </div>

          {/* Progress bar container */}
          <div className="relative flex items-center justify-between">
            {/* Connecting lines */}
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-200 rounded-full z-0"></div>

            {/* Active progress line */}
            <div
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 h-1 ${
                isCanceled ? "bg-red-500" : "bg-blue-500"
              } rounded-full z-10 transition-all duration-500 ease-in-out`}
              style={{
                width:
                  currentStepIndex >= 0
                    ? `calc(${
                        (currentStepIndex / (statusSteps.length - 1)) * 100
                      }% + ${
                        currentStepIndex > 0
                          ? compact
                            ? "12px"
                            : "16px"
                          : "0px"
                      })`
                    : "0%",
              }}
            ></div>

            {/* Status circles */}
            {statusSteps.map((step, index) => {
              const isActive = index <= currentStepIndex;
              const isCurrentStep = index === currentStepIndex;

              return (
                <div
                  key={`step-${step.status}`}
                  className="z-20 flex flex-col items-center relative"
                >
                  {/* Step circle */}
                  <div
                    className={`${
                      compact ? "w-6 h-6" : "w-8 h-8"
                    } rounded-full flex items-center justify-center 
                    ${isActive ? step.color : "bg-gray-200"} 
                    ${
                      isCurrentStep
                        ? `ring-4 ring-opacity-50 ${
                            isCanceled ? "ring-red-200" : "ring-blue-200"
                          } shadow-lg scale-110`
                        : ""
                    } transition-all duration-300 ease-in-out`}
                  >
                    <div className="text-white">{step.icon}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time estimate - only shown in non-compact mode */}
          {!compact && (
            <div className="mt-4 text-xs text-gray-500 text-center">
              {getEstimatedTime(currentStatus)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to get estimated time based on status
const getEstimatedTime = (status: string): string => {
  // Check if status is any form of canceled
  const isCanceled =
    status === ComplaintStatus.CANCELED ||
    status === "canceled_by_user" ||
    status === "canceled_by_mechanic";

  if (isCanceled) {
    return "Service request has been canceled";
  }

  switch (status) {
    case ComplaintStatus.PENDING:
      return "Waiting for mechanic to accept";
    case ComplaintStatus.ACCEPTED:
      return "About 2-3 hours";
    case ComplaintStatus.ON_PROCESS:
      return "About 1 hour remaining";
    case ComplaintStatus.COMPLETED:
      return "Service completed";
    default:
      return "Timeline unavailable";
  }
};

export default StatusProgressBar;
