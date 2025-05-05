import React, { useEffect, useState } from "react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Pencil, Trash2 } from "lucide-react";

interface TabsComponentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  complaint: {
    createdAt: string;
    lastUpdated?: string;
    estimatedCompletionDate?: string;
    completionPercentage: number;
    status?: string;
    currentMechanicId?: string;
    workHistory?: {
      date: string;
      action: string;
      notes: string;
      completionPercentage: number;
    }[];
    serviceDetails: {
      serviceName?: string;
      serviceCharge?: number;
      [key: string]: any;
    };
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
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [serviceDetails, setServiceDetails] = useState<{
    serviceName?: string;
    serviceCharge?: number;
  }>({});

  useEffect(() => {
    setServiceDetails(complaint.serviceDetails || {});
  }, [complaint.serviceDetails]);

  // If currentMechanic or status is not present, don't render the component
  if (!complaint.currentMechanicId) {
    return null;
  }

  const calculateTotal = () => {
    const serviceCharge = serviceDetails?.serviceCharge || 0;
    const otherCharges = complaintItems.reduce((sum, item) => sum + item.amount, 0);
    return serviceCharge + otherCharges;
  };

  const handleAddComplaint = () => {
    if (newDescription.trim() === "" || isNaN(newAmount)) return;

    if (editIndex !== null) {
      const updatedItems = [...complaintItems];
      updatedItems[editIndex] = { description: newDescription, amount: newAmount };
      setComplaintItems(updatedItems);
      setEditIndex(null);
    } else {
      setComplaintItems([
        ...complaintItems,
        { description: newDescription, amount: newAmount },
      ]);
    }

    setNewDescription("");
    setNewAmount(0);
  };

  const handleEditComplaint = (index: number) => {
    const item = complaintItems[index];
    setNewDescription(item.description);
    setNewAmount(item.amount);
    setEditIndex(index);
  };

  const handleRemoveComplaint = (index: number) => {
    setComplaintItems(complaintItems.filter((_, i) => i !== index));
    if (editIndex === index) {
      setEditIndex(null);
      setNewDescription("");
      setNewAmount(0);
    }
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setNewDescription("");
    setNewAmount(0);
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
            <h3 className="font-semibold text-lg mb-4">Complaint Descriptions</h3>

            {/* Inputs and Add/Update Button */}
            <div className="mb-6 flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter complaint description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(parseFloat(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Amount"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddComplaint}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow"
                >
                  {editIndex !== null ? "Update" : "Add"}
                </button>
                {editIndex !== null && (
                  <button
                    onClick={cancelEdit}
                    className="inline-flex items-center px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 shadow"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Bill-like UI */}
            {(serviceDetails.serviceCharge || complaintItems.length > 0) ? (
              <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 bg-gray-100 border-b border-gray-300 font-medium text-gray-700">
                  <div className="col-span-6 p-3">DESCRIPTION</div>
                  <div className="col-span-3 p-3 text-right">AMOUNT</div>
                  <div className="col-span-3 p-3 text-center">ACTIONS</div>
                </div>

                <div className="divide-y divide-gray-200">
                  {serviceDetails.serviceCharge && (
                    <div className="grid grid-cols-12 py-3 items-center bg-white">
                      <div className="col-span-6 px-3">
                        <p className="text-sm font-medium">
                          {serviceDetails.serviceName || "Service Charge"}
                        </p>
                      </div>
                      <div className="col-span-3 px-3 text-right">
                        <p className="text-sm">₹{serviceDetails.serviceCharge.toFixed(2)}</p>
                      </div>
                      <div className="col-span-3 px-3 text-center text-gray-400 italic">—</div>
                    </div>
                  )}

                  {complaintItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 py-3 items-center hover:bg-gray-50">
                      <div className="col-span-6 px-3">
                        <p className="text-sm">{item.description}</p>
                      </div>
                      <div className="col-span-3 px-3 text-right">
                        <p className="text-sm">₹{item.amount.toFixed(2)}</p>
                      </div>
                      <div className="col-span-3 px-3 flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditComplaint(index)}
                          className="p-1 text-blue-600 hover:text-blue-800 rounded"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleRemoveComplaint(index)}
                          className="p-1 text-red-600 hover:text-red-800 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-100 border-t border-gray-300 grid grid-cols-12 py-3 font-medium">
                  <div className="col-span-6 px-3 text-right">TOTAL</div>
                  <div className="col-span-3 px-3 text-right">₹{calculateTotal().toFixed(2)}</div>
                  <div className="col-span-3" />
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">No complaint details added yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabsComponent;
