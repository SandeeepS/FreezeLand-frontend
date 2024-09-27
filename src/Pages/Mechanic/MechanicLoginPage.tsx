import { useFormik } from "formik";
import React, { useEffect } from "react";
import { LoginValidation } from "../../components/Common/Validations";
import { useNavigate } from "react-router-dom";
import { mechLogin } from "../../Api/mech";
import toast from "react-hot-toast";
import { useAppSelector } from "../../App/store";
import { setMechCredential } from "../../App/slices/AuthSlice";
import { useDispatch } from "react-redux";

interface initialVal {
  email: string;
  password: string;
}

const initialValues: initialVal = {
  email: "",
  password: "",
};

const MechanicLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { mechData } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (mechData) {
      navigate("/mech/homepage");
    }
  }, [mechData]);

  const { values, handleBlur, handleChange, handleSubmit, errors } = useFormik({
    initialValues: initialValues,
    validationSchema: LoginValidation,
    onSubmit: (values) => {
      const hanSub = async () => {
        try {
          const result = await mechLogin(values.email, values.password);
          if (result) {
            console.log("result reched in the login page  ", result);
            dispatch(setMechCredential(result.data.data));
            navigate("/mech/homepage");
          }
          console.log("result fron the login form is ", result);
        } catch (error) {
          toast.error("Invalild email or password");
          console.log(error);
        }
      };
      hanSub();
    },
  });

  return (
    <div className="bg-[url('/src/Images/penguineBlack.jpg')] bg-cover bg-center h-screen w-screen flex items-center">
      <div className="w-full lg:w-1/3 pt-8">
        <div className="pl-14 ">
          <h1 className="w-full text-5xl  text-black font-exo  p-10">
            FREEZE <span className="text-freeze-color font-exo">LAND</span>{" "}
          </h1>
        </div>
        <div className="pl-6">
          <div className="font-[sans-serif] bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <h3 className="text-gray-800 text-3xl font-extrabold">
                  Mechanic Sign in
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Don't have an account?{" "}
                  <a
                    href="/mech/signuppage"
                    className="text-blue-600 font-semibold hover:underline"
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

              <div className="flex items-center justify-between">
                <div className="flex items-center"></div>
                <a
                  href="javascript:void(0);"
                  className="text-blue-600 text-sm font-semibold hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicLoginPage;
