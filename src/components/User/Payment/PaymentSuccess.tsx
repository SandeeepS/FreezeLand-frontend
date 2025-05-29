import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SiTicktick } from "react-icons/si";
import { RxCrossCircled } from "react-icons/rx";
// Ensure this is the correct path
import Loader from "../../Common/Icon/Loader";
import { successPayment } from "../../../Api/user";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState();
  const [orderStatus, setOrderStatus] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState(20);

  const continueToHomePage = () => {
    navigate("/user/homepage");
  };

  useEffect(() => {
    // Only fetch details if they aren't already saved in state
    if (!orderDetails) {
      const fetchOrderDetails = async () => {
        const params = new URLSearchParams(location.search);
        const sessionId = params.get("session_id");
        console.log("entered in the payment success");
        console.log(sessionId, "sessionId");

        if (sessionId) { 
          try {
            const response = await successPayment(sessionId);
            console.log(response, "response.data");
            const exactData = response?.data.result;
            console.log("exact data is ",exactData);
            const { message, status, data } = exactData;
            if (status == "SUCCESS"){
              console.log(message);
              setOrderStatus(true);
              console.log("PAYMENT SUCCESS");
              setOrderDetails(data);
            } else {
              setOrderStatus(false);
              setOrderDetails(data);
            }
          } catch (error) {
            console.error("Error fetching order details:", error);
            setOrderStatus(false);
          }
        }
      };
      fetchOrderDetails();
    }
  }, [location.search, orderDetails]);

  useEffect(() => {
    // Start countdown if payment fails and orderStatus is false
    if (orderStatus === false) {
      const intervalId = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(intervalId);
            console.log("payment failed provide navigation here ");
          }
          return prevCount - 1;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [orderStatus, countdown, navigate, orderDetails]);

  console.log(orderDetails, "this is order details");

  if (!orderDetails) return <Loader />;

  return orderStatus ? (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-t">
      <div className="flex flex-col text-center items-center gap-4 border-rounded rounded-lg bg-white p-10 shadow-2xl">
        <h1 className="text-green-500 text-7xl">
          <SiTicktick />
        </h1>
        <h1 className="text-2xl font-bold">Payment Successful!</h1>
        {/* <p>{`Order ID :  ${orderDetails?.id}`}</p> */}
        {/* <p>{`Amount Paid :  ${orderDetails?.amount}`}</p> */}
        <p>Provdie name and amount paid here </p>
        {/* <img
          src={orderDetails?.thumbnail}
          alt="Course Thumbnail"
          className="h-20 w-25 rounded-lg"
        /> */}
        <p>Provide image here if image is there ?</p>

        <button
          className="bg-freeze-color border-rounded rounded-lg p-2 shadow-lg text-white font-semibold hover:bg-blue-700 transition-all"
            onClick={continueToHomePage}
        >
          Continue to home page
        </button>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-t">
      <div className="flex flex-col text-center items-center gap-4 border-rounded rounded-lg bg-[#DDB3FF] p-10 shadow-lg">
        <h1 className="text-red-500 text-7xl">
          <RxCrossCircled />
        </h1>
        <h1 className="text-2xl font-bold">Payment failed!</h1>
        {/* <p>{`Order ID :  ${orderDetails?.tutorId}`}</p>
        <p>{`Amount of ${orderDetails?.price} will be credited back to your account if debited, within 7 business days.`}</p> */}
        <p>{`Redirecting to course page in ${countdown} seconds.`}</p>

        <button
          className="bg-[#7C24F0] border-rounded rounded-lg p-2 shadow-lg text-white font-semibold hover:bg-[#6211cd] transition-all"
          onClick={continueToHomePage}
        >
          Back to service details page
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
