import { useNavigate } from "react-router-dom";
import BuildIcon from "@mui/icons-material/Build";
import React from "react";

interface UpdateStatusBtnProps {
    complaintId: string; 
  }
  

const UpdateStatusBtn:React.FC<UpdateStatusBtnProps> = ({ complaintId }) => {
  const navigate = useNavigate();

  const handleUpdate = () => {
    if (complaintId) {
      navigate(`/mechanic/update-complaint/${complaintId}`);
    }
  };

  return (
    <div>
      <button
        onClick={handleUpdate}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
      >
        <BuildIcon className="mr-1" />
        Update Status
      </button>
    </div>
  );
};

export default UpdateStatusBtn;
