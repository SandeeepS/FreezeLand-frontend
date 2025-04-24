import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import BlockIcon from "@mui/icons-material/Block";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import FlagIcon from "@mui/icons-material/Flag";
import HelpIcon from "@mui/icons-material/Help";
import { ComplaintStatus, getStatusConfig } from "../../../Enums/StatusEnums";

interface StatusInfoComponentProps {
  status: string;
  priority: string;
}

const StatusInfoComponent: React.FC<StatusInfoComponentProps> = ({
  status,
  priority,
}) => {
  const statusConfig = getStatusConfig(status as ComplaintStatus);

  // Priority configuration
  const getPriorityConfig = (priority: string) => {
    const normalizedPriority = priority.toLowerCase();
    
    if (normalizedPriority === "high") {
      return {
        icon: <ErrorIcon className="mr-2" />,
        text: "High Priority",
        color: "text-red-600",
        bgColor: "bg-red-100",
      };
    } else if (normalizedPriority === "medium") {
      return {
        icon: <WarningIcon className="mr-2" />,
        text: "Medium Priority",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      };
    } else {
      return {
        icon: <FlagIcon className="mr-2" />,
        text: "Normal Priority",
        color: "text-green-600",
        bgColor: "bg-green-100",
      };
    }
  };

  const priorityConfig = getPriorityConfig(priority);

  // Render status icon based on status
  const renderStatusIcon = () => {
    switch (statusConfig.icon) {
      case "CheckCircle":
        return <CheckCircleIcon className="mr-2" />;
      case "Settings":
        return <SettingsIcon className="mr-2" />;
      case "HourglassEmpty":
        return <HourglassEmptyIcon className="mr-2" />;
      case "Cancel":
        return <CancelIcon className="mr-2" />;
      case "Block":
        return <BlockIcon className="mr-2" />;
      case "ThumbUp":
        return <ThumbUpIcon className="mr-2" />;
      default:
        return <HelpIcon className="mr-2" />;
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Status Information</h2>
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className={`flex items-center ${statusConfig.bgColor} ${statusConfig.textColor} p-3 rounded-md mb-3 md:mb-0 md:flex-1`}>
          {renderStatusIcon()}
          <span className="font-semibold">{statusConfig.text}</span>
        </div>
        <div className={`flex items-center ${priorityConfig.bgColor} ${priorityConfig.color} p-3 rounded-md md:flex-1`}>
          {priorityConfig.icon}
          <span className="font-semibold">{priorityConfig.text}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusInfoComponent;