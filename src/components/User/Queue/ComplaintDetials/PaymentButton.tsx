import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { handlePayment } from "../../../../Api/user";
import toast from "react-hot-toast";
import { useAppSelector } from "../../../../App/store";
import { useNavigate } from "react-router-dom";


export interface paymentData  {
  complaintId: string;
  status: string;
  mechanicId: string;
  amount: number;
  serviceId: string;
}

const PaymentButton: React.FC<paymentData> = ({
  complaintId,
  status,
  mechanicId,
  amount,
  serviceId,
}) => {
  const userId = useAppSelector((state) => state.auth.userData);
  console.log("complaintId", complaintId);
  console.log("status", status);
  console.log("mechanicId", mechanicId);
  console.log("amount", amount);
  console.log("serviceId", serviceId);

  const [isLoading, setIsLoading] = useState(false);

  const handlePayement = async () => {
    console.log("triggered enrol button");

    try {
      setIsLoading(true);
    
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

      if (!stripe) {
        setIsLoading(false);
        toast.error("Stripe could not be loaded.");
        return;
      }

      const data = {
        complaintId: complaintId,
        serviceId: serviceId,
        userId: userId?.id,
        mechanicId: mechanicId,
        amount: amount,
        status: status,
        paymentType: "stripe",
      };

      // payement API be completed
      console.log("calling");
      const response = await handlePayment(data);
      console.log("hayyyy stripe", response?.data);
      if (response?.data?.message === "user blocked") {
        // window.location.href = `${ROUTES.user.signin}?message:blocked`;
        console.log("user blocked");
      }

      const sessionId = response?.data?.session.sessionId;
      console.log("sessionId", sessionId);
      if (stripe && sessionId) {
        const result = await stripe.redirectToCheckout({ sessionId });
        console.log("payment result from the stripe is",result);

        setIsLoading(false);
        if (result.error) {
          toast.error(result.error.message || "An unexpected error occurred.");
        }
      } else {
        setIsLoading(false);
        toast.error("Stripe could not be loaded or session ID is missing.");
      }
    } catch (error) {
      console.error("Error during payment:", error);
      setIsLoading(false);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status !== "completed") {
    return null;
  }

  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={handlePayement}
        className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow transition duration-150 ease-in-out"
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentButton;
