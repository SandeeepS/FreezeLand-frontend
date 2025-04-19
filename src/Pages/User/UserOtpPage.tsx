import React, { useEffect, useState } from "react";
import { getTempUserData, resendOtp, verifyOtp } from "../../Api/user";
import { useNavigate, useParams } from "react-router-dom";
import { setUserCredental, saveUser } from "../../App/slices/AuthSlice.ts";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../App/store";
import errorHandler from "../../Api/errorHandler.ts";
import toast from "react-hot-toast";

const UserOtpPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [otp, setOTP] = useState<string>("");
  const [seconds, setSeconds] = useState(60);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData } = useAppSelector((state) => state.auth);
  // useEffect(() => {
  //   const fetch = async () => {
  //     try {
  //       const tempUserDetails = await getTempUserData(id);
  //       console.log(
  //         "tempUserData in the otp entering page is",
  //         tempUserDetails
  //       );
  //     } catch (error) {
  //       console.log(error as Error);
  //       throw error;
  //     }
  //   };
  //   fetch();
  // }, []);

  useEffect(() => {
    if (userData) navigate("/user/home");
  }, [userData]);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => setSeconds(seconds - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [seconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setOTP(e.target.value);
  };

  const handleVerify = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }
    
    try {
      console.log("Verifying OTP:", otp);
      
      const result = await verifyOtp(id as string, otp);
      console.log("result of verify otp in the userOtpPage", result);
      
      if (result.data.success) {
        console.log("userData from the backend to dispatch", result.data.data);
        dispatch(setUserCredental(result.data.data));
        toast.success("OTP verified successfully!");
        navigate("/login");
      }
    } catch (error) {
      // Use the error handler to display appropriate toast messages
      await errorHandler(error as Error);
    } 
  };
  const resendOTP = async () => {
    try {
      await resendOtp();
    } catch (error) {
      console.log(error as Error);
    }
  };
  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center h-screen w-full">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-lg shadow-md  ">
        <h1 className="text-2xl font-semibold text-center mb-6">Enter OTP</h1>
        <p className="text-white-600 text-center mb-4">
          Code sent to your Email
        </p>
        <div className="flex justify-center my-2 h-10">
          <input
            type="text"
            value={otp}
            onChange={handleOTPChange}
            maxLength={6}
            className="rounded-lg bg-freeze-color cursor-text   flex items-center justify-center text-white text-center outline-none"
          />
        </div>
        <div className="flex items-center flex-col justify-between mb-6">
          <div className="ps-1">
            {seconds <= 0 ? (
              <div>
                Otp Expired{" "}
                <span
                  onClick={resendOTP}
                  className="text-blue-500 cursor-pointer"
                >
                  Request another ?
                </span>
              </div>
            ) : (
              <div>
                Otp expires in {minutes} min {remainingSeconds} sec
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleVerify}
          className="w-full px-4 py-2 text-lg font-medium text-white bg-freeze-color rounded-md hover:bg-blue-700"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default UserOtpPage;
