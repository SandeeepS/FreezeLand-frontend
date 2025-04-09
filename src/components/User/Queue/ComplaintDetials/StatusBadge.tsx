import React from "react";
import { AccessTime, CheckCircle, Warning } from "@mui/icons-material";
import { StatusBadgeProps } from "../../../../interfaces/IComponents/User/IUserInterfaces";



const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "completed":
      return (
        <span className="px-3 py-1 text-sm rounded-full bg-green-500 text-black flex items-center">
          <CheckCircle className="w-4 h-4 mr-1" /> Completed
        </span>
      );
    case "pending":
      return (
        <span className="px-3 py-1 text-sm rounded-full bg-yellow-400 text-black flex items-center">
          <AccessTime className="w-4 h-4 mr-1" /> Pending
        </span>
      );
    case "accepted":
      return (
        <span className="px-3 py-1 text-sm rounded-full bg-orange-600 text-black flex items-center">
          <AccessTime className="w-4 h-4 mr-1" /> Accepted
        </span>
      );
    case "canceled":
      return (
        <span className="px-3 py-1 text-sm rounded-full bg-red-700 text-black flex items-center">
          <Warning className="w-4 h-4 mr-1" /> Canceled
        </span>
      );
    case "onprocess":
      return (
        <span className="px-3 py-1 text-sm rounded-full bg-blue-800 text-black flex items-center">
          <AccessTime className="w-4 h-4 mr-1" /> On process
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 flex items-center">
          <AccessTime className="w-4 h-4 mr-1" /> {status}
        </span>
      );
  }
};

export default StatusBadge;
