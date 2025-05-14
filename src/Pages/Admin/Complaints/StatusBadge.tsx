interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  
  switch (status.toLowerCase()) {
    case "pending":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      break;
    case "in_progress":
    case "inprogress":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      break;
    case "completed":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      break;
    case "cancelled":
    case "canceled":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      break;
    case "accepted":
      bgColor = "bg-purple-100";
      textColor = "text-purple-800";
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  );
};

export default StatusBadge;