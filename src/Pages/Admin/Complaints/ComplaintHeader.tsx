import { format } from "date-fns";
import StatusBadge from "./StatusBadge";

interface ComplaintHeaderProps {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const ComplaintHeader = ({ id, status, createdAt, updatedAt }: ComplaintHeaderProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP 'at' p");
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Complaint Details</h1>
          <p className="text-gray-600 mt-1">Complaint ID: <span className="font-medium text-blue-700">{id}</span></p>
        </div>
        <div className="mt-4 md:mt-0">
          <StatusBadge status={status} />
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <p>Created: <span className="font-medium">{formatDate(createdAt)}</span></p>
        </div>
        <div>
          <p>Last Updated: <span className="font-medium">{formatDate(updatedAt)}</span></p>
        </div>
      </div>
    </div>
  );
};

export default ComplaintHeader;