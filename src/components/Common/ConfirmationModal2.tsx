import React, { useState, useEffect } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  reasons: string[];
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

const ConfirmationModal2: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title = "Confirm Action",
  message,
  reasons,
  onConfirm,
  onCancel,
}) => {
  const [selectedReason, setSelectedReason] = useState("");

  useEffect(() => {
    if (!isOpen) setSelectedReason(""); // Reset on close
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-md flex flex-col">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Select a reason:</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
          >
            <option value="">-- Choose a reason --</option>
            {reasons.map((reason, idx) => (
              <option key={idx} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selectedReason)}
            disabled={!selectedReason}
            className={`px-4 py-2 text-white rounded ${
              selectedReason
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-300 cursor-not-allowed"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal2;
