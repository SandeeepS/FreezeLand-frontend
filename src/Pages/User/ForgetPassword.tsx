import { Spinner } from "@chakra-ui/react";
import {
  forgotPassword,
  forgotVerifyOtp,
  resendOtp,
  updateNewPassword,
} from "../../Api/user";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { newPasswordValidation } from "../../components/Common/Validations";
import { initialVal } from "../../interfaces/IPages/User/IUserInterfaces";
import UserData from "../../interfaces/UserData";

const initialValues: initialVal = {
  password: "",
  cpassword: "",
};

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>();
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState<number>(300);
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | undefined>();

  const navigate = useNavigate();

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => setSeconds(seconds - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [seconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const handlSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(!loading);
    try {
      if (email) {
        const res = await forgotPassword(email);
        console.log(res);
        if (res?.data.success) {
          setLoading(false);
          setUser(res.data.data);
          toast.success(res.data.message);
          setShowOtp(!showOtp);
        } else toast.error(res?.data.message);
      }
    } catch (error) {
      console.log(error as Error);
      setLoading(false);
    }
  };
  const otpSubmitHandler = async () => {
    try {
      if (otp) {
        const res = await forgotVerifyOtp(otp);
        console.log(res);
        if (res?.data.success) {
          setShowForm(true);
        } else toast.error(res?.data.message);
      } else toast.error("please enter the otp!");
    } catch (error) {
      console.log(error);
      toast.error("something went wrong!");
    }
  };
  const { values, handleBlur, handleChange, handleSubmit, errors } = useFormik({
    initialValues: initialValues,
    validationSchema: newPasswordValidation,
    onSubmit: (values) => {
      const hanSub = async () => {
        if (user) {
          const res = await updateNewPassword(values.password, user?._id);
          if (res?.data.success) {
            toast.success("password updated successfully!");
            navigate("/login");
          } else toast.error(res?.data.message);
        }
      };
      hanSub();
    },
  });
  const resendOTP = async () => {
    try {
      await resendOtp();
    } catch (error) {
      console.log(error as Error);
    }
  };

  return (
    <>
      <main id="content" role="main" className="w-full max-w-md mx-auto p-6">
        {!showOtp && !showForm && (
          <div className="mt-28 bg-gray-100 p-3 rounded-xl shadow-3xl ">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h1 className="block text-2xl font-bold ">Forgot password?</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Remember your password?
                  <Link
                    to="/user/login"
                    className="text-blue-600 decoration-2 hover:underline font-medium"
                  >
                    Login here
                  </Link>
                </p>
              </div>

              <div className="mt-5">
                <form onSubmit={handlSubmit}>
                  <div className="grid gap-y-4">
                    <div className="text-center">
                      <label
                        htmlFor="email"
                        className="block text-sm font-bold ml-1 mb-2 "
                      >
                        Email address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                          required
                          aria-describedby="email-error"
                        />
                      </div>
                      <p
                        className="hidden text-xs text-red-600 mt-2"
                        id="email-error"
                      >
                        Please include a valid email address so we can get back
                        to you
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                    >
                      verify
                    </button>
                    {loading && (
                      <div className="flex justify-center">
                        <Spinner
                          thickness="4px"
                          speed="0.65s"
                          emptyColor="gray.200"
                          color="blue.500"
                          size="xl"
                        />
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {!showForm && showOtp && (
          <div className=" flex flex-col items-center justify-center h-screen w-full ">
            <div className="w-full max-w-md px-8 py-10 bg-white rounded-lg shadow-md ">
              <h1 className="text-2xl font-semibold text-center mb-6">
                Enter OTP
              </h1>
              <p className=" text-center mb-4">Code sent to your Email</p>
              <div className="flex justify-center my-2">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="rounded-lg border-2 border-gray-200  bg-gray-100 cursor-text   flex items-center justify-center  text-center outline-none"
                />
              </div>
              <div className="flex items-center flex-col justify-between mb-6">
                <p className="text-gray-600 text-sm">
                  Didn't receive code?{" "}
                  <span
                    onClick={resendOTP}
                    className="text-blue-300 cursor-pointer"
                  >
                    click here
                  </span>
                </p>
                <div className="ps-1">
                  {seconds <= 0 ? (
                    <div>Otp Expired</div>
                  ) : (
                    <div>
                      Otp expires in {minutes} min {remainingSeconds} sec
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={otpSubmitHandler}
                className="w-full px-4 py-2 text-lg font-medium  bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {showForm && (
          <div className="bg-gray-100 flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
              <div className="flex items-center space-x-2 mb-6">
                <img
                  src={user?.profile_picture}
                  alt="Lock Icon"
                  className="rounded-full w-36 h-36"
                />
                <div>
                  <h1 className="text-xl font-semibold">{user?.name}</h1>
                  <h1 className="text-md font-semibold">{user?.headLine}</h1>
                  <h1 className="text-sm font-semibold">{user?.email}</h1>
                  <h1 className="text-sm font-semibold">{user?.location}</h1>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Update password for enhanced account security.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="text-sm font-medium text-gray-700 block mb-2"
                  >
                    New Password *
                  </label>
                  <input
                    type="password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name="password"
                    className="password-input form-input block w-full border border-gray-300 rounded-md shadow-sm"
                  />
                  <p className="text-red-500">{errors.password}</p>
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700 block mb-2"
                  >
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    value={values.cpassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name="cpassword"
                    className="password-input form-input block border w-full border-gray-300 rounded-md shadow-sm"
                  />
                  <p className="text-red-500">{errors.cpassword}</p>
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:underline mt-1"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
                  >
                    Apply Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default ForgetPassword;
