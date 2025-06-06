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
  console.log("mechainc frm the store is ",mechanicId);
  console.log("mechanic id ", mechanicId);
  const navigate = useNavigate();
  const [mechanicDetails, setMechanicDetails] = useState<MechanicData | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!mechanicId) {
        console.warn("Mechanic ID is undefined or null");
        return;
      }
      try {
        console.log("Fetching mechanic details for ID:", mechanicId);
        const response = await getMechanicDetails(mechanicId.id);
        console.log("Mechanic details from backend:", response?.data.result);
        setMechanicDetails(response?.data.result); // Set the fetched mechanic details
      } catch (error) {
        console.error("Error fetching mechanic details:", error);
      }
    };
    fetchData();
  }, [mechanicId]); // Add dependency array to avoid unnecessary re-renders

  // Determine verification and Adhar status
  const isVerified = mechanicDetails?.isVerified; // Default to false if undefined
  const hasAdharDetails = !!mechanicDetails?.adharProof; // Ensure this is a boolean

  return (
    <>
      {/* Conditional Rendering */}
      {!isVerified && !hasAdharDetails && <NotVerifiedPage />}
      {!isVerified && hasAdharDetails && <ProccessingVerificationComponent />}
      {isVerified && (
        <div className="w-full bg-freeze-color h-[400px] ">
          <div className="p-8">
            <h1 className="text-4xl font-semibold text-center text-white ">
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
