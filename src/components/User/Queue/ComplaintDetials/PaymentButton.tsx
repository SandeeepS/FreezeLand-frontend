import React from "react";


interface PaymentButtonProps {
  complaintId: string;
  status: string;

}

const PaymentButton: React.FC<PaymentButtonProps> = ({ complaintId, status }) => {
  const handlePaymentClick = () => {
    console.log(`Initiating payment for complaint ${complaintId}`);
  };

  if (status !== "completed") {
    return null;
  }

  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={handlePaymentClick}
        className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow transition duration-150 ease-in-out"
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentButton;