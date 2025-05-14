import { format } from "date-fns";

interface WorkHistoryProps {
  workHistory: Array<{
    mechanicId: string;
    status: string;
    reason: string | null;
    canceledAt: string | null;
    _id: string;
  }>;
  currentMechanicId: string;
}

const WorkHistory = ({ workHistory, currentMechanicId }: WorkHistoryProps) => {
  if (!workHistory || workHistory.length === 0) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "PPP 'at' p");
    } catch {
      return "Invalid Date";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
      case "canceled":
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-3 mb-4">
        Mechanic Assignment History
      </h2>
      
      <div className="space-y-4">
        {workHistory.map((item, index) => (
          <div 
            key={item._id} 
            className={`p-4 rounded-lg ${
              currentMechanicId === item.mechanicId 
                ? "bg-blue-50 border border-blue-200" 
                : "bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <p className="font-medium text-gray-800">
                    Mechanic ID: <span className="text-sm text-gray-600">{item.mechanicId}</span>
                  </p>
                  {currentMechanicId === item.mechanicId && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      Current
                    </span>
                  )}
                </div>
                
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
            
            {item.reason && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Reason:</p>
                <p className="text-sm text-gray-700">{item.reason}</p>
              </div>
            )}
            
            {item.canceledAt && (
              <div className="mt-2 text-sm text-gray-500">
                Canceled at: {formatDate(item.canceledAt)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkHistory;