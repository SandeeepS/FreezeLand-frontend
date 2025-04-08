// StatusInfoComponent.tsx
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BuildIcon from "@mui/icons-material/Build";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningIcon from "@mui/icons-material/Warning";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

interface StatusInfoProps {
  status: string;
  priority: string;
}

const StatusInfoComponent: React.FC<StatusInfoProps> = ({
  status,
  priority,
}) => {
  // Helper function to get status information
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "text-orange-500",
          bgColor: "bg-orange-100",
          icon: <AccessTimeIcon className="text-orange-500" />,
          text: "Waiting to be assigned",
        };
      case "in progress":
        return {
          color: "text-blue-500",
          bgColor: "bg-blue-100",
          icon: <BuildIcon className="text-blue-500" />,
          text: "Work in progress",
        };
      case "delayed":
        return {
          color: "text-red-500",
          bgColor: "bg-red-100",
          icon: <WarningIcon className="text-red-500" />,
          text: "Experiencing delays",
        };
      case "on schedule":
        return {
          color: "text-teal-500",
          bgColor: "bg-teal-100",
          icon: <CheckCircleIcon className="text-teal-500" />,
          text: "Proceeding as planned",
        };
      case "completed":
        return {
          color: "text-emerald-500",
          bgColor: "bg-emerald-100",
          icon: <CheckCircleIcon className="text-emerald-500" />,
          text: "Service completed",
        };
      default:
        return {
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          icon: <AccessTimeIcon className="text-gray-500" />,
          text: "Status unknown",
        };
    }
  };

  // Helper function for priority icon and color
  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          color: "text-red-500",
          bgColor: "bg-red-100",
          icon: <PriorityHighIcon className="text-red-500" />,
        };
      case "medium":
        return {
          color: "text-orange-500",
          bgColor: "bg-orange-100",
          icon: <ReportProblemIcon className="text-orange-500" />,
        };
      case "low":
        return {
          color: "text-green-500",
          bgColor: "bg-green-100",
          icon: <CheckCircleIcon className="text-green-500" />,
        };
      default:
        return {
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          icon: <ReportProblemIcon className="text-gray-500" />,
        };
    }
  };

  const statusInfo = getStatusInfo(status);
  const priorityInfo = getPriorityInfo(priority);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="font-semibold text-lg mb-4">Status Information</h3>

      <div
        className={`flex items-center p-3 rounded-lg mb-4 ${statusInfo.bgColor}`}
      >
        {statusInfo.icon}
        <div className="ml-3">
          <p className={`font-medium ${statusInfo.color}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </p>
          <p className="text-sm">{statusInfo.text}</p>
        </div>
      </div>

      <div
        className={`flex items-center p-3 rounded-lg mb-4 ${priorityInfo.bgColor}`}
      >
        {priorityInfo.icon}
        <div className="ml-3">
          <p className={`font-medium ${priorityInfo.color}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
          </p>
          <p className="text-sm">
            {priority === "high"
              ? "Requires immediate attention"
              : priority === "medium"
              ? "Should be addressed soon"
              : "Can be addressed in standard timeframe"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatusInfoComponent;
