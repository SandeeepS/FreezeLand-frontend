import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { NewPasswordValidation } from "../Validations";

// Type definitions
interface ApiError {
  response?: {
    data?: {
      message?: string;
      success?: boolean;
    };
    status?: number;
  };
  message?: string;
}

interface UserData {
  _id: string;
  name?: string;
  email?: string;
  profile_picture?: string;
}

interface ForgetPasswordProps {
  userType: "user" | "mechanic";
  apiCalls: {
    forgotPassword: (email: string) => Promise<any>;
    verifyOtp: (otp: string) => Promise<any>;
    updatePassword: (password: string, userId: string) => Promise<any>;
  };
  loginRoute: string;
  iconType?: "lock" | "wrench";
}

const initialValues = {
  password: "",
  cpassword: "",
};

const CommonForgetPassword: React.FC<ForgetPasswordProps> = ({
  userType,
  apiCalls,
  loginRoute,
  iconType = "lock",
}) => {
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState<number>(60);
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Timer effect
  useEffect(() => {
    if (seconds > 0 && showOtp) {
      const timer = setInterval(() => setSeconds(seconds - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [seconds, showOtp]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Helper function to extract error message
  const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === "object") {
      const apiError = error as ApiError;
      return (
        apiError.response?.data?.message ||
        apiError.message ||
        "Something went wrong!"
      );
    }
    return "Something went wrong!";
  };

  // Email submission handler
  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await apiCalls.forgotPassword(email);
      if (res?.data?.success) {
        setUserData(res.data.data || null);
        toast.success(res.data.message || "OTP sent successfully!");
        setShowOtp(true);
        setSeconds(60);
      } else {
        toast.error(res?.data?.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Email submission error:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // OTP submission handler
  const handleOtpSubmit = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP!");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP!");
      return;
    }

    if (seconds <= 0) {
      toast.error("OTP has expired. Please request a new one.");
      return;
    }

    setOtpLoading(true);
    try {
      const res = await apiCalls.verifyOtp(otp);

      if (res?.data?.success) {
        setShowForm(true);
        toast.success("OTP verified successfully!");
      } else {
        toast.error(res?.data?.message || "Invalid OTP!");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setOtpLoading(false);
    }
  };

  // Password form handler
  const { values, handleBlur, handleChange, handleSubmit, errors, resetForm } =
    useFormik({
      initialValues: initialValues,
      validationSchema: NewPasswordValidation,
      onSubmit: async (formValues) => {
        if (!userData?._id) {
          toast.error(
            `${
              userType === "user" ? "User" : "Mechanic"
            } data not found. Please try again.`
          );
          return;
        }

        try {
          const res = await apiCalls.updatePassword(
            formValues.password,
            userData._id
          );

          if (res?.data?.success) {
            toast.success("Password updated successfully!");
            navigate(loginRoute);
          } else {
            toast.error(res?.data?.message || "Failed to update password");
          }
        } catch (error) {
          console.error("Password update error:", error);
          toast.error(getErrorMessage(error));
        }
      },
    });

  // Resend OTP handler
  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      const result = await apiCalls.forgotPassword(email);

      if (result?.data?.success) {
        if (result.data.data) {
          setUserData(result.data.data);
        }
        toast.success("New OTP sent successfully!");
        setSeconds(60);
        setOtp("");
      } else {
        toast.error(result?.data?.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setResendLoading(false);
    }
  };

  const handleClearPasswords = () => {
    resetForm();
  };

  const handleBackToEmail = () => {
    setShowOtp(false);
    setShowForm(false);
    setOtp("");
    setSeconds(60);
    setUserData(null);
  };

  // Handler for individual OTP box change
  const handleOtpBoxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) {
      const newOtp = otp.split("");
      newOtp[index] = "";
      setOtp(newOtp.join(""));
      return;
    }

    const newOtp = otp.split("");
    newOtp[index] = value.slice(-1); // Only take last digit
    setOtp(newOtp.join(""));

    // Move to next input automatically
    const nextInput = document.querySelector(
      `input:nth-of-type(${index + 2})`
    ) as HTMLInputElement | null;
    if (nextInput && value) nextInput.focus();
  };

  // Handler for backspace key
  const handleOtpBoxKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ): void => {
    if (e.key === "Backspace" && !otp[index]) {
      const prevInput = document.querySelector(
        `input:nth-of-type(${index})`
      ) as HTMLInputElement | null;
      if (prevInput) prevInput.focus();
    }
  };

  // Handler for paste
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (paste.length === 0) return;
    setOtp(paste);

    // Focus last filled box
    const lastIndex = paste.length - 1;
    const nextInput = document.querySelector(
      `input:nth-of-type(${lastIndex + 1})`
    ) as HTMLInputElement | null;
    if (nextInput) nextInput.focus();
  };

  // Icon rendering based on type
  const renderIcon = () => {
    if (iconType === "wrench") {
      return (
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      );
    }
    return (
      <svg
        className="w-8 h-8 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Email Step */}
        {!showOtp && !showForm && (
          <div className="bg-white rounded-xl border shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                {renderIcon()}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Forgot Password?
              </h1>
              <p className="text-gray-600">
                Enter your email address and we'll send you a verification code
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email address"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  "Send Verification Code"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  to={loginRoute}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* OTP Step */}
        {showOtp && !showForm && (
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
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Enter Verification Code
              </h1>
              <p className="text-gray-600">
                We've sent a 6-digit code to{" "}
                <span className="font-medium">{email}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Verification Code
                </label>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[index] || ""}
                      onChange={(e) => handleOtpBoxChange(e, index)}
                      onKeyDown={(e) => handleOtpBoxKeyDown(e, index)}
                      onPaste={handleOtpPaste}
                      disabled={seconds <= 0}
                      className={`w-10 h-10 sm:w-11 sm:h-11 text-center text-lg sm:text-xl font-mono border rounded-lg focus:outline-none transition-colors 
                        ${
                          seconds <= 0
                            ? "bg-gray-100 cursor-not-allowed"
                            : "bg-blue-50 border-blue-300 focus:ring-2 focus:ring-blue-500"
                        }
                      `}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center space-y-2">
                {seconds > 0 ? (
                  <p className="text-sm text-gray-600">
                    Code expires in {minutes}:
                    {remainingSeconds.toString().padStart(2, "0")}
                  </p>
                ) : (
                  <p className="text-sm text-red-600 font-medium">
                    OTP Expired{" "}
                    <button
                      type="button"
                      onClick={handleResendOTP}
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
                      onClick={handleResendOTP}
                      disabled={resendLoading}
                      className="text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      {resendLoading ? "Sending..." : "Resend Code"}
                    </button>
                  </p>
                )}
              </div>

              <button
                onClick={handleOtpSubmit}
                disabled={
                  !otp || otp.length !== 6 || seconds <= 0 || otpLoading
                }
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {otpLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify Code"
                )}
              </button>

              <button
                onClick={handleBackToEmail}
                className="w-full text-gray-600 py-2 px-4 rounded-lg font-medium hover:text-gray-800 transition-colors"
              >
                ← Back to Email
              </button>
            </div>
          </div>
        )}

        {/* Password Reset Step */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              {userData?.profile_picture && (
                <img
                  src={userData.profile_picture}
                  alt="Profile"
                  className="mx-auto w-16 h-16 rounded-full object-cover mb-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Reset Password
              </h1>
              <p className="text-gray-600">
                Create a new password for {userData?.name || userData?.email}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter new password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="cpassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  id="cpassword"
                  name="cpassword"
                  value={values.cpassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Confirm new password"
                />
                {errors.cpassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cpassword}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClearPasswords}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={
                    !values.password ||
                    !values.cpassword ||
                    Object.keys(errors).length > 0
                  }
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommonForgetPassword;
