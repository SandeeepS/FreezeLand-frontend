export enum ComplaintStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    ON_PROCESS = "onProcess",
    COMPLETED = "completed",
    CANCELED = "canceled",
    BLOCKED = "blocked"
  }
  
  // Helper functions for status management to set the next statess 
  export const getNextStatus = (currentStatus: ComplaintStatus): ComplaintStatus => {
    switch (currentStatus) {
      case ComplaintStatus.PENDING:
        return ComplaintStatus.ACCEPTED;
      case ComplaintStatus.ACCEPTED:
        return ComplaintStatus.ON_PROCESS;
      case ComplaintStatus.ON_PROCESS:
        return ComplaintStatus.COMPLETED;
      default:
        return currentStatus;
    }
  };
  
  export const isStatusUpdateAllowed = (currentStatus: ComplaintStatus): boolean => {
    return ![ComplaintStatus.COMPLETED, ComplaintStatus.CANCELED, ComplaintStatus.BLOCKED].includes(currentStatus);
  };
  
  export const getStatusConfig = (status: ComplaintStatus) => {
    switch (status) {
      case ComplaintStatus.PENDING:
        return {
          color: "bg-yellow-500 hover:bg-yellow-600",
          textColor: "text-yellow-900",
          bgColor: "bg-yellow-100",
          icon: "HourglassEmpty",
          text: "Pending"
        };
      case ComplaintStatus.ACCEPTED:
        return {
          color: "bg-blue-400 hover:bg-blue-500",
          textColor: "text-blue-900",
          bgColor: "bg-blue-100",
          icon: "ThumbUp",
          text: "Accepted"
        };
      case ComplaintStatus.ON_PROCESS:
        return {
          color: "bg-blue-600 hover:bg-blue-700",
          textColor: "text-blue-900",
          bgColor: "bg-blue-100",
          icon: "Settings",
          text: "On Process"
        };
      case ComplaintStatus.COMPLETED:
        return {
          color: "bg-green-500",
          textColor: "text-green-900",
          bgColor: "bg-green-100",
          icon: "CheckCircle",
          text: "Completed"
        };
      case ComplaintStatus.CANCELED:
        return {
          color: "bg-red-500",
          textColor: "text-red-900",
          bgColor: "bg-red-100",
          icon: "Cancel",
          text: "Canceled"
        };
      case ComplaintStatus.BLOCKED:
        return {
          color: "bg-gray-500",
          textColor: "text-gray-900",
          bgColor: "bg-gray-100",
          icon: "Block",
          text: "Blocked"
        };
      default:
        return {
          color: "bg-gray-500 hover:bg-gray-600",
          textColor: "text-gray-900",
          bgColor: "bg-gray-100",
          icon: "Help",
          text: "Unknown"
        };
    }
  };