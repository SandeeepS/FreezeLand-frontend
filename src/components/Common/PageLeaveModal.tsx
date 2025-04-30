import React from "react";
import { ConfirmationModalProps } from "../../interfaces/IComponents/Common/ICommonInterfaces";

const PageLeaveModal: React.FC<ConfirmationModalProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-lg">{message}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 mr-2 bg-gray-500 text-white rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageLeaveModal;
