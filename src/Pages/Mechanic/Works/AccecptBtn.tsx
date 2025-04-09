import { useState } from "react";
import SwipeRightIcon from "@mui/icons-material/SwipeRight";
import ConfirmationModal from "./ConformationModal";
import { RootState, useAppSelector } from "../../../App/store";
import { updateWorkAssigned } from "../../../Api/mech";
import { useNavigate } from "react-router-dom";

interface AcceptBtnProps {
  complaintId: string;
}

const AcceptBtn: React.FC<AcceptBtnProps> = ({ complaintId }) => {
  const navigate = useNavigate();
    const mechanic = useAppSelector((state: RootState) => state.auth.mechData);
  const mechanicId = mechanic?.data._id;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    // Here you would implement the API call to accept the complaint
    console.log(`Accepting complaint with ID: ${complaintId}`);
    const updateAccecptStatus = async () => {
        try{
            const status = "accepted";
            const result = await updateWorkAssigned(complaintId,mechanicId,status);
            console.log("Result is from the backend is ",result);
            if(result?.data.success == true){
              navigate("/mech/queue");
            }
        }catch(error){
            console.log(error as Error);
        }
    } 
    updateAccecptStatus();
    closeModal();
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
      >
        <SwipeRightIcon className="mr-1" />
        Accept
      </button>
      
      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default AcceptBtn;