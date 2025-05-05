import React, { useState } from "react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";


interface TabsComponentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  complaint: {
    createdAt: string;
    lastUpdated?: string;
    estimatedCompletionDate?: string;
    completionPercentage: number;
    status?: string; // Made optional to handle cases where it might be missing
    currentMechanicId?: string; // Added currentMechanic field
    workHistory?: {
      date: string;
      action: string;
      notes: string;
      completionPercentage: number;
    }[];
  };
  formatDate: (dateString: string) => string;
}

const TabsComponent: React.FC<TabsComponentProps> = ({
  activeTab,
  setActiveTab,
  complaint,
  formatDate,
}) => {
  const [complaintItems, setComplaintItems] = useState<
    { description: string; amount: number }[]
  >([]);
  const [newDescription, setNewDescription] = useState("");
  const [newAmount, setNewAmount] = useState<number>(0);
  // If currentMechanic or status is not present, don't render the component
  if (!complaint.currentMechanicId) {
    return null;
  }

  const handleAddComplaint = () => {
    if (newDescription.trim() === "" || isNaN(newAmount)) return;
    setComplaintItems([
      ...complaintItems,
      { description: newDescription, amount: newAmount },
    ]);
    setNewDescription("");
    setNewAmount(0);
  };

  const handleRemoveComplaint = (index: number) => {
    setComplaintItems(complaintItems.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="border-b border-gray-200 bg-gray-200">
        <nav className="flex">
          <button
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === "details"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Service Details
          </button>
          <button
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === "worklog"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("worklog")}
          >
            Work Details
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === "details" ? (
          <div>
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-3">Service Timeline</h3>
              <div className="flex flex-col space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <CalendarTodayIcon className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Created</p>
                    <p className="text-gray-600">
                      {formatDate(complaint.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <CalendarTodayIcon className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-gray-600">
                      {formatDate(complaint.lastUpdated || complaint.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <CalendarTodayIcon className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Estimated Completion</p>
                    <p className="text-gray-600">
                      {formatDate(complaint.estimatedCompletionDate || "")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="font-semibold text-lg mb-4">
              Complaint Descriptions
            </h3>

            {/* Inputs and Add Button */}
            <div className="mb-6 flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter complaint description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(parseFloat(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Amount"
                />
              </div>
              <div>
                <button
                  onClick={handleAddComplaint}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Display List */}
            {complaintItems.length > 0 ? (
              <div className="space-y-4">
                {complaintItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-4 rounded-md shadow flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {item.description}
                      </p>
                      <p className="text-sm text-gray-600">
                        Amount: ₹{item.amount}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveComplaint(index)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                No complaint details added yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabsComponent;
