//signup component for user
import { useState } from "react";


const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Event handler for input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Event handler for form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <div className="font-[sans-serif] bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <h3 className="text-gray-800 text-3xl font-extrabold">Sign up</h3>
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
          <label className="text-gray-800 text-sm block mb-1">Email</label>
          <div className="relative">
            <input
              name="email"
              type="text"
              required
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-50 w-full text-sm text-gray-800 border border-gray-300 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter email"
            />
          </div>
        </div>

        <div>
          <label className="text-gray-800 text-sm block mb-1">Phone</label>
          <div className="relative">
            <input
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              className="bg-gray-50 w-full text-sm text-gray-800 border border-gray-300 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div>
          <label className="text-gray-800 text-sm block mb-1">Password</label>
          <div className="relative">
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-50 w-full text-sm text-gray-800 border border-gray-300 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter password"
            />
          </div>
        </div>

        <div>
          <label className="text-gray-800 text-sm block mb-1">
            Conform Password
          </label>
          <div className="relative">
            <input
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-gray-50 w-full text-sm text-gray-800 border border-gray-300 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Conform you password"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
    
          </div>
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
  );
};

export default SignUpForm;
