import { useFormik } from "formik";
import React from "react";
import { LoginValidation } from "../../components/Common/Validations";
import { login } from "../../Api/user";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserCredental } from "../../App/slices/AuthSlice";
import OAuth from "../../components/Common/OAuth";
import toast from "react-hot-toast";
import { initialVal2 } from "../../interfaces/IPages/User/IUserInterfaces";

const initialValues: initialVal2 = {
  email: "",
  password: "",
};

const UserLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { values, handleBlur, handleChange, handleSubmit, errors } = useFormik({
    initialValues: initialValues,
    validationSchema: LoginValidation,
    onSubmit: (values) => {
      const hanSub = async () => {
        try {
          const result = await login(values.email, values.password);
          console.log("result is ", result);
          if (result?.status === 200 && result.data.data.success) {
            console.log("result fron the front end ", result);
            dispatch(setUserCredental(result?.data.data.data));
            navigate("/user/homepage");
          } else if (
            result?.status === 200 &&
            result.data.data.success == false
          ) {
            console.log("loging failed due to Incorrect password or email");
            toast.error(result?.data?.data.message || "Login failed");
          }
        } catch (error) {
          console.log(error);
        }
      };
      hanSub();
    },
  });

  return (
    <div className="bg-center h-screen w-screen flex items-center justify-center">
      <div className="w-full lg:w-1/3 pt-8">
        <div className="pl-14 ">
          <h1 className="w-full text-5xl  text-black font-exo  p-10">
            FREEZE <span className="text-freeze-color font-exo">LAND</span>{" "}
          </h1>
        </div>
        <div className="pl-6">
          <div className="font-[sans-serif] bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
            <form className="space-y-5 flex-col  " onSubmit={handleSubmit}>
              <div className="flex flex-col items-center text-center">
                <h3 className="text-gray-800 text-3xl font-extrabold">
                  Sign in
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    className="text-freeze-color font-semibold hover:underline"
                  >
                    Sign up here
                  </a>
                </p>
              </div>

              <div>
                <label className="text-gray-800 text-sm block mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    name="email"
                    type="text"
                    required
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className="bg-gray-50 w-full text-sm text-gray-800 border border-gray-300 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter email"
                  />
                  {errors.email && (
                    <small className="text-red-500">{errors.email}</small>
                  )}
                </div>
              </div>

              <div>
                <label className="text-gray-800 text-sm block mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type="password"
                    required
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className="bg-gray-50 w-full text-sm text-gray-800 border border-gray-300 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter password"
                  />
                  {errors.password && (
                    <small className="text-red-500">{errors.password}</small>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex items-center"></div>
                <a
                  href="/user/forget-password"
                  className="text-freeze-color text-sm font-semibold hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-freeze-color text-white text-sm font-semibold rounded-md hover:bg-blue-500 focus:outline-none"
                >
                  Sign in
                </button>
              </div>

              <div className="my-4 flex items-center">
                <hr className="w-full border-gray-300" />
                <p className="text-sm text-gray-600 text-center mx-4">or</p>
                <hr className="w-full border-gray-300" />
              </div>

              <OAuth />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
