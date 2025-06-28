import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import NotVerifiedPage from "./NotVerifiedPage";
import ProccessingVerificationComponent from "./ProccessingVerificationComponent";
import { useEffect, useState } from "react";
import { getMechanicDetails } from "../../../Api/mech";
import { MechanicData } from "../../../interfaces/IComponents/Mechanic/IMechanicInterface";
import AnimatedButton from "./AnimatedButton";
import { useNavigate } from "react-router-dom";

const AssignedWorks: React.FC = () => {
  const mechanicId = useSelector((state: RootState) => state.auth.mechData);
  console.log("mechanic from the store is ", mechanicId);
  console.log("mechanic id ", mechanicId);
  const navigate = useNavigate();
  
  const [mechanicDetails, setMechanicDetails] = useState<MechanicData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!mechanicId) {
        console.warn("Mechanic ID is undefined or null");
        setIsLoading(false);
        setError("Mechanic ID not found");
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        console.log("Fetching mechanic details for ID:", mechanicId);
        const response = await getMechanicDetails(mechanicId.id);
        console.log("Mechanic details from backend:", response?.data.result);
        setMechanicDetails(response?.data.result); 
      } catch (error) {
        console.error("Error fetching mechanic details:", error);
        setError("Failed to fetch mechanic details");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [mechanicId]); 

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading verification status...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="w-full bg-red-50 h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Determine verification and Adhar status
  const isVerified = mechanicDetails?.isVerified;
  const hasAdharDetails = !!mechanicDetails?.adharProof;

  return (
    <>
      {/* Conditional Rendering */}
      {!isVerified && !hasAdharDetails && <NotVerifiedPage />}
      {!isVerified && hasAdharDetails && <ProccessingVerificationComponent />}
      {isVerified && (
        <div className="w-full bg-freeze-color h-[400px]">
          <div className="p-8">
            <h1 className="text-4xl font-semibold text-center text-white">
              Available Works
            </h1>
            <div className="flex m-4 space-x-10 justify-center" onClick={() => navigate("/mech/allWorks")}>
              <AnimatedButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignedWorks;