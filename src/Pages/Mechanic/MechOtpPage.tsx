import React, { useEffect, useState } from "react";
import { resendMechOtp, verifyMechOtp } from "../../Api/mech.ts";
import { useNavigate, useParams } from "react-router-dom";
import { setMechCredential } from "../../App/slices/AuthSlice.ts";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../App/store";
import toast from "react-hot-toast";

const MechOtpPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log("id from the signupPage is", id);

  const [otp, setOTP] = useState<string>("");
  const [seconds, setSeconds] = useState(0); // Start with 0, will be set from sessionStorage or API
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [isTimerInitialized, setIsTimerInitialized] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mechData } = useAppSelector((state) => state.auth);

  // Key for storing timer in sessionStorage
  const timerKey = `mech_otp_timer_${id}`;

  useEffect(() => {
    if (mechData) navigate("/mech/homepage");
  }, [mechData, navigate]);

  useEffect(() => {
    const storedEndTime = sessionStorage.getItem(timerKey);
    if (storedEndTime) {
      const endTime = parseInt(storedEndTime);
      const currentTime = Date.now();
      const remainingTime = Math.max(
        0,
        Math.floor((endTime - currentTime) / 1000)
      );
      setSeconds(remainingTime);
    } else {
      const endTime = Date.now() + 60000; // 60 seconds from now
      sessionStorage.setItem(timerKey, endTime.toString());
      setSeconds(60);
    }
    setIsTimerInitialized(true);
  }, [id, timerKey]);

  // Timer countdown effect
  useEffect(() => {
    if (!isTimerInitialized) return;

    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds - 1;
          if (newSeconds <= 0) {
            sessionStorage.removeItem(timerKey);
            return 0;
          }
          return newSeconds;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      sessionStorage.removeItem(timerKey);
    }
  }, [seconds, isTimerInitialized, timerKey]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOTP(value);
  };

  const handleVerify = async () => {
    // Check if timer is expired
    if (seconds <= 0) {
      toast.error("OTP has expired. Please request a new one.");
      return;
    }

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
      console.log("OTP:", otp);
      const result = await verifyMechOtp(id as string, otp);
      console.log("result from the verifyMechOtp function ", result);

      if (result && "data" in result && result.data.success) {
        console.log(`everything is fine your mechId is  ${result.data.mechId}`);
        dispatch(setMechCredential(result.data.data));
        toast.success("OTP verified successfully!");
        sessionStorage.removeItem(timerKey);
        navigate("/mech/homepage");
      } else if (result && "data" in result) {
        console.log("Signup failed due to problem in otp verification");
        toast.error(result?.data?.message || "Signup Failed");
      } else {
        toast.error("An unexpected error occurred during verification.");
      }
    } catch (error) {
      console.log(
        "error occurred in the MechOtpPage while handling the otp verification",
        error
      );
      toast.error("An error occurred during verification.");
    } finally {
      setOtpLoading(false);
    }
  };

  const resendOTP = async () => {
    setResendLoading(true);
    try {
      const response = await resendMechOtp(id as string);
      console.log(
        "Response from the backend after resending the otp",
        response
      );

      const endTime = Date.now() + 60000; // 60 seconds from now
      sessionStorage.setItem(timerKey, endTime.toString());
      setSeconds(60);
      setOTP("");
      toast.success("OTP resent successfully!");
    } catch (error) {
      console.log(error as Error);
      toast.error("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  // Don't render anything until timer is initialized
  if (!isTimerInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Enter Verification Code
            </h1>
            <p className="text-gray-600">Code sent to your Email</p>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={handleOTPChange}
                maxLength={6}
                placeholder="Enter 6-digit code"
                disabled={seconds <= 0}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  seconds <= 0 ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
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
              disabled={!otp || otp.length !== 6 || otpLoading || seconds <= 0}
              className="w-full bg-freeze-color text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {otpLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : seconds <= 0 ? (
                "OTP Expired - Resend Required"
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

export default MechOtpPage;
