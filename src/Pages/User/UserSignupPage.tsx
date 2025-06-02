import { useFormik } from "formik";
import { SignupValidation } from "../../components/Common/Validations";
import { signup } from "../../Api/user";
import { useNavigate } from "react-router-dom";
import OAuth from "../../components/Common/OAuth";
import {
  FormData,
  initialVal3,
} from "../../interfaces/IPages/User/IUserInterfaces";
import errorHandler from "../../Api/errorHandler";

const initialValues: initialVal3 = {
  name: "",
  email: "",
  phone: "",
  password: "",
  cpassword: "",
};

const UserSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { values, handleBlur, handleChange, handleSubmit, errors } = useFormik({
    initialValues: initialValues,
    validationSchema: SignupValidation,
    onSubmit: (values) => {
      const formData: FormData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        cpassword: values.cpassword,
      };
      console.log(
        "checking the conformpasswod from the form data ",
        formData.cpassword,
        formData.password
      );
      const hanSub = async () => {
        try {
          const result = await signup(formData);
          if(result.error){
            errorHandler(result.error);
            return;
          }
          console.log("resutl is", result);
          if (result) {
            const TempUserId = result.data.result._id;
            navigate(`/otp-page/${TempUserId}`);
          }
          console.log("result from the signup form is", result);
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
                    href="/login"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Sign in here
                  </a>
                </p>
              </div>

              <div>
                <label className="text-gray-800 text-sm block mb-1">Name</label>
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
                  {errors.name && (
                    <small className="text-red-500">{errors.name}</small>
                  )}
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
                  {errors.email && (
                    <small className="text-red-500">{errors.email}</small>
                  )}
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
                  {errors.phone && (
                    <small className="text-red-500">{errors.phone}</small>
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
                  {errors.cpassword && (
                    <small className="text-red-500">{errors.cpassword}</small>
                  )}
                </div>
              </div>

              {/* <div className="flex items-center justify-between">
                <div className="flex items-center"></div>
                <a
                  href="javascript:void(0);"
                  className="text-blue-600 text-sm font-semibold hover:underline"
                >
                  Forgot Password?
                </a>
              </div> */}

              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  Sign up
                </button>
              </div>

              {/* <div className="my-4 flex items-center">
                <hr className="w-full border-gray-300" />
                <p className="text-sm text-gray-600 text-center mx-4">or</p>
                <hr className="w-full border-gray-300" />
              </div>

              <OAuth /> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignupPage;
