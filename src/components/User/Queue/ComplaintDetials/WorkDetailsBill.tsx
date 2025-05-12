import React from "react";
import { IComplaintDetails } from "../../../../interfaces/IComponents/User/IUserInterfaces";

interface IWorkDetailsBillProps {
  complaint: IComplaintDetails;
  setTotalAmount: (amount: number) => void;
}


const WorkDetailsBill: React.FC<IWorkDetailsBillProps> = ({ complaint , setTotalAmount}) => {
  const serviceDetails = complaint.serviceDetails?.[0] || {};
  const workDetails = complaint.workDetails || [];

  // Calculate total bill amount
  const calculateTotal = () => {
    const serviceCharge = serviceDetails?.serviceCharge || 0;
    const otherCharges = workDetails.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
    setTotalAmount(serviceCharge + otherCharges);
    return serviceCharge + otherCharges;
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-4">Service Bill</h3>

        {/* Bill UI */}
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 bg-gray-100 border-b border-gray-300 font-medium text-gray-700">
            <div className="col-span-8 p-3">DESCRIPTION</div>
            <div className="col-span-4 p-3 text-right">AMOUNT</div>
          </div>

          <div className="divide-y divide-gray-200">
            {/* Always display service charge row */}
            <div className="grid grid-cols-12 py-3 items-center bg-white">
              <div className="col-span-8 px-3">
                <p className="text-sm font-medium">
                  {serviceDetails.serviceName || "Service Charge"}
                </p>
              </div>
              <div className="col-span-4 px-3 text-right">
                <p className="text-sm">
                  ₹{Number((serviceDetails?.serviceCharge || 0)).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Display all work detail items */}
            {workDetails.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 py-3 items-center bg-white"
              >
                <div className="col-span-8 px-3">
                  <p className="text-sm">{item.description}</p>
                </div>
                <div className="col-span-4 px-3 text-right">
                  <p className="text-sm">₹{(item.amount || item.cost || 0).toFixed(2)}</p>
                </div>
              </div>
            ))}

            {/* Display message if no items */}
            {workDetails.length === 0 && (
              <div className="py-3 px-3 text-gray-500 italic text-center">
                No additional service details available.
              </div>
            )}

            
          </div>

          {/* Total row */}
          <div className="bg-gray-100 border-t border-gray-300 grid grid-cols-12 py-3 font-medium">
            <div className="col-span-8 px-3 text-right">TOTAL</div>
            <div className="col-span-4 px-3 text-right">
              ₹{calculateTotal().toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkDetailsBill;