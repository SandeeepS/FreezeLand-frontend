import React from "react";
import { useNavigate } from "react-router-dom";
import { updateApprove } from "../../../../Api/admin";
import { ApproveModalProps } from "../../../../interfaces/IComponents/Admin/IAdminInterfaces";

const ApproveModal: React.FC<ApproveModalProps> = ({
  isOpen,
  onClose,
  id,
  verifyStatus,
}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;
  const handleApprove = async () => {
    try {
      console.log("Entered in the handleApprove function");
      const result = await updateApprove(id, verifyStatus);
      console.log("Approval result:", result);
      onClose();
      navigate("/admin/verifyMechanic");
    } catch (error) {
      console.error("Error approving mechanic:", error);
      throw new Error("Error occured while approving the mechanic ");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold text-center mb-4">
          Are you sure you want to approve this mechanic?
        </h3>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={handleApprove}
          >
            Yes, Approve
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveModal;
