import { useSelector } from "react-redux";
import { RootState } from "../../App/store";
import { useNavigate } from "react-router-dom";

const AssignedWorks: React.FC = () => {
  const mechanic = useSelector((state: RootState) => state.auth.mechData);
  const navigate = useNavigate();
  
  // Check if mechanic exists and is verified
  const isVerified =  mechanic?.isVerified ?? false;
  const handleVerification = () =>{
     navigate('/mech/verifyMechanic');
  }

  return (
    <>
      {/* Render verification message if not verified */}
      {!isVerified && (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <img
            src="/src/Images/verificationNotCompleted.png"
            alt="Verification Required"
            className="w-32 h-32 mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">
            Complete Verification First
          </h2>
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
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
          </button>
        </div>
      )}

      {/* Render services grid if verified */}
      {isVerified && (
        <div className="w-full bg-freeze-color h-[600px]">
          <h1 className="text-5xl text-center m-12">Assigned Works</h1>
          <div className="flex m-12 space-x-10 justify-center">
            {/* Your existing service cards remain unchanged */}
            <div className="h-64 flex flex-col justify-between rounded overflow-hidden shadow-lg bg-[#fefefe]">
              <div className="w-full flex-grow flex justify-center items-center p-2">
                <img
                  className="w-24 h-24 object-contain"
                  src="/src/Images/air-conditioning.png"
                  alt="A/C Service"
                />
              </div>
              <div className="flex justify-center p-4">
                <h3 className="text-xl mb-2 text-center">A/C Service</h3>
              </div>
            </div>
            {/* ... rest of your service cards ... */}
          </div>
        </div>
      )}
    </>
  );
};

export default AssignedWorks;
