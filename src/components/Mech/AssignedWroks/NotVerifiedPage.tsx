import { useNavigate } from "react-router-dom";

const NotVerifiedPage = () => {
  const navigate = useNavigate();
  const handleVerification = () => {
    navigate("/mech/verifyMechanic");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <img
        src="/src/Images/verificationNotCompleted.png"
        alt="Verification Required"
        className="w-32 h-32 mb-4"
      />
      <h2 className="text-2xl font-bold mb-2">Complete Verification First</h2>
      <p className="text-gray-500 text-center">
        Please verify your account to view and accept assigned works.
      </p>
      <button
        type="button"
        className="text-white pt-3 mt-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={handleVerification}
      >
        Lets Verify
        <svg
          className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round" // Updated to camelCase
            strokeLinejoin="round" // Updated to camelCase
            strokeWidth="2" // Updated to camelCase
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </button>
    </div>
  );
};

export default NotVerifiedPage;