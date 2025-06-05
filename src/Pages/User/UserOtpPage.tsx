import React, { useEffect, useState } from "react";
import { resendOtp, verifyOtp } from "../../Api/user";
import { useNavigate, useParams } from "react-router-dom";
import { setUserCredental } from "../../App/slices/AuthSlice.ts";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../App/store";
import toast from "react-hot-toast";

const UserOtpPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  //here id is the tempUserId 

  const [otp, setOTP] = useState<string>("");
  const [seconds, setSeconds] = useState(60);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData } = useAppSelector((state) => state.auth);

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
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOTP(value);
  };

  //function to handle otp verification 
  const handleVerify = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }
    
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP!");
      return;
    }

    setOtpLoading(true);
    try {
      console.log("Verifying OTP:", otp);
      
      const result = await verifyOtp(id as string, otp);
      console.log("result of verify otp in the userOtpPage", result);

      if ("data" in result && result.data.success) {
        console.log("userData from the backend to dispatch", result.data.data);
        dispatch(setUserCredental(result.data.data));
        toast.success("OTP verified successfully!");
        navigate("/login");
      } else if ("data" in result) {
        console.log("login failed due to problem in otp verification");
        toast.error(result?.data?.message || "Signup Failed");
      } else {
        toast.error("An unexpected error occurred during verification.");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred during verification.");
    } finally {
      setOtpLoading(false);
    }
  };
  
  const resendOTP = async () => {
    setResendLoading(true);
    try {
      const response = await resendOtp(id as string);
      console.log("Response from the backend after resending the otp", response);
      
      // Reset timer to 60 seconds after successful resend
      setSeconds(60);
      setOTP(""); // Clear current OTP
      toast.success("OTP resent successfully!");
    } catch (error) {
      console.log(error as Error);
      toast.error("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter Verification Code</h1>
            <p className="text-gray-600">
              Code sent to your Email
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={handleOTPChange}
                maxLength={6}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="text-center space-y-2">
              {seconds > 0 ? (
                <p className="text-sm text-gray-600">
                  OTP expires in {minutes} min {remainingSeconds} sec
                </p>
              ) : (
                <p className="text-sm text-red-600 font-medium">
                  OTP Expired{" "}
                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={resendLoading}
                    className="text-blue-500 cursor-pointer hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {resendLoading ? "Sending..." : "Request another?"}
                  </button>
                </p>
              )}
              
              {seconds > 0 && (
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={resendLoading}
                    className="text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {resendLoading ? "Sending..." : "Resend Code"}
                  </button>
                </p>
              )}
            </div>

            <button
              onClick={handleVerify}
              disabled={!otp || otp.length !== 6 || otpLoading}
              className="w-full bg-freeze-color text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {otpLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                "Verify"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOtpPage;