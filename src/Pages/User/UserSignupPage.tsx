import { useState } from "react";
import { useFormik } from "formik";
import { SignupValidation } from "../../components/Common/Validations";
import { signup } from "../../Api/user";

export interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
}
interface initialVal {
  name: string;
  email: string;
  phone: string;
  password: string;
  cpassword: string;
}

const initialValues: initialVal = {
  name: "",
  email: "",
  phone: "",
  password: "",
  cpassword: "",
};

const UserSignupPage: React.FC = () => {
  const { values, handleBlur, handleChange, handleSubmit, errors } = useFormik({
    initialValues: initialValues,
    validationSchema: SignupValidation,
    onSubmit: (values) => {
      const formData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        confirmPassword: values.cpassword,
      };
      const hanSub = async () => {
        try {
          const result = await signup(formData);
          // if (result) {
          //   navigate("/user/otp-page");
          // }
          console.log("result fron the signup form is ",result)
        } catch (error) {
          console.log(error);
        }
      };
      hanSub();
    },
  });

  return (
    <div className="bg-[url('/src/Images/loginPageBackground.jpg')] bg-cover bg-center h-screen w-screen flex items-center">
      <div className="w-full lg:w-1/3 pt-8">
        <div className="pl-14 ">
          <h1 className="w-full text-5xl  text-black font-exo  p-10">
            FREEZE <span className="text-white font-exo">LAND</span>{" "}
          </h1>
        </div>
        <div className="pl-6">
          <div className="font-[sans-serif] bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <h3 className="text-gray-800 text-3xl font-extrabold">
                  Sign up
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Already have an account?{" "}
                  <a
                    href="javascript:void(0);"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Sign in here
                  </a>
                </p>
              </div>

              
              <div>
                <label className="text-gray-800 text-sm block mb-1">
                  Name
                </label>
                <div className="relative">
                  <input
                    name="name"
                    type="text"
                    required
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className="bg-gray-50 w-full text-sm text-gray-800 border border-gray-300 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter email"
                  />
                  {errors.name && <small className='text-red-500'>{errors.name}</small>}

                </div>
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
                  {errors.email && <small className='text-red-500'>{errors.email}</small>}

                </div>
              </div>

              <div>
                <label className="text-gray-800 text-sm block mb-1">
                  Phone
                </label>
                <div className="relative">
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={values.phone}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className="bg-gray-50 w-full text-sm text-gray-800 border border-gray-300 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <small className='text-red-500'>{errors.phone}</small>}

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
                  {errors.password && <small className='text-red-500'>{errors.password}</small>}

                </div>
              </div>

              <div>
                <label className="text-gray-800 text-sm block mb-1">
                  Conform Password
                </label>
                <div className="relative">
                  <input
                    name="cpassword"
                    type="password"
                    required
                    value={values.cpassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className="bg-gray-50 w-full text-sm text-gray-800 border border-gray-300 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Conform you password"
                  />
                  {errors.cpassword && <small className='text-red-500'>{errors.cpassword}</small>}

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
                  Sign up
                </button>
              </div>

              <div className="my-4 flex items-center">
                <hr className="w-full border-gray-300" />
                <p className="text-sm text-gray-600 text-center mx-4">or</p>
                <hr className="w-full border-gray-300" />
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  viewBox="0 0 512 512"
                >
                  {/* Google Icon */}
                  <path
                    fill="#fbbd00"
                    d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                  />
                  <path
                    fill="#0f9d58"
                    d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                  />
                </svg>
                Continue with Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignupPage;
