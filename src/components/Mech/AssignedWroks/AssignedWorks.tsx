import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import NotVerifiedPage from "./NotVerifiedPage";
import ProccessingVerificationComponent from "./ProccessingVerificationComponent";

const AssignedWorks: React.FC = () => {
  const mechanic = useSelector((state: RootState) => state.auth.mechData);
  console.log("mechanic details ", mechanic);
  // Check if mechanic exists and is verified
  let isVerified = false;
  if (mechanic?.isVerified == true) {
    isVerified = true;
  }
  const hasAdharDetails = mechanic?.adharProof !== null;
  return (
    <>
      {/* Render verification message if not verified */}
      {isVerified === false && !hasAdharDetails && <NotVerifiedPage />}
      {isVerified === false && hasAdharDetails && (
        <ProccessingVerificationComponent />
      )}
      {/* Render services grid if verified */}
      {isVerified === true && hasAdharDetails && (
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
