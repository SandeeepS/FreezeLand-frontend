import { format } from "date-fns";

interface WorkDetailsProps {
  workDetails: Array<{
    addedAt: Date;
    amount: number;
    description: string;
    _id: string;
  }>;
}

const WorkDetails = ({ workDetails }: WorkDetailsProps) => {
  if (!workDetails || workDetails.length === 0) return null;

  const formatDate = (date: Date) => {
    try {
      return format(date, "PPP 'at' p");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const totalAmount = workDetails.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-3 mb-4">
        Work Details
      </h2>

      <div className="space-y-4">
        {workDetails.map((item) => (
          <div key={item._id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-medium text-gray-800">{item.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Added on: {formatDate(item.addedAt)}
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold text-blue-700">
                  ₹{item.amount}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between items-center">
        <p className="font-medium text-gray-800">Total Additional Work Cost</p>
        <p className="text-xl font-bold text-blue-700">₹{totalAmount}</p>
      </div>
    </div>
  );
};

export default WorkDetails;
