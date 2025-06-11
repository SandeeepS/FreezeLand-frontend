import {
  forgotPassword,
  forgotVerifyOtp,
  updateNewPassword,
} from "../../Api/user";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { initialVal } from "../../interfaces/IPages/User/IUserInterfaces";
import UserData from "../../interfaces/UserData";
import { NewPasswordValidation } from "../../components/Common/Validations";

// Type definitions for better error handling
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

interface ApiResponse {
  data: {
    success: boolean;
    message: string;
    data?: UserData;
  };
}

const initialValues: initialVal = {
  password: "",
  cpassword: "",
};

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState<number>(300);
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (seconds > 0 && showOtp) {
      timer = setInterval(() => setSeconds(seconds - 1), 1000);
    }
    return () => clearInterval(timer);
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

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = (await forgotPassword(email)) as ApiResponse;
      if (res?.data?.success) {
        setUser(res.data.data || null);
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
      const res = (await forgotVerifyOtp(otp)) as ApiResponse;

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
        if (!user?._id) {
          toast.error("User data not found. Please try again.");
          return;
        }

        try {
          const res = (await updateNewPassword(
            formValues.password,
            user._id
          )) as ApiResponse;

          if (res?.data?.success) {
            toast.success("Password updated successfully!");
            navigate("/login");
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
      const result = (await forgotPassword(email)) as ApiResponse;

      if (result?.data?.success) {
        if (result.data.data) {
          setUser(result.data.data);
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
    setSeconds(300);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Email Step */}
        {!showOtp && !showForm && (
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
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
                  to="/user/login"
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
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtp(value);
                  }}
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
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
              {user?.profile_picture && (
                <img
                  src={user.profile_picture}
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
                Create a new password for {user?.name || user?.email}
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

export default ForgetPassword;
