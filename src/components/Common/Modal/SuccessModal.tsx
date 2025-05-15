import React from "react";

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  isSuccess: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ 
  isOpen, 
  message, 
  onClose,
  isSuccess 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md text-center">
        <div className="mb-4">
          {isSuccess ? (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg 
                className="h-6 w-6 text-green-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg 
                className="h-6 w-6 text-red-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </div>
          )}
        </div>
        <p className={`mb-6 text-lg font-medium ${isSuccess ? 'text-gray-800' : 'text-red-600'}`}>
          {message}
        </p>
        <button
          onClick={onClose}
          className={`px-6 py-2 ${isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white rounded`}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;