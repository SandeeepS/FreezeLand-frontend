import React from "react";
import { ConformationModalProps } from "../../interfaces/IComponents/Common/ICommonInterfaces";

const ConformationModal: React.FC<ConformationModalProps> = ({
  onClose,
  show,
}) => {
  if (!show) return null;

  return (
    <div
      id="popup-modal"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-60 backdrop-blur-sm"
    >
      <div className="relative p-4 w-full max-w-md max-h-full animate-fadeIn">
        <div className="relative bg-white rounded-xl shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Modal Content */}
          <div className="p-6 md:p-8 text-center">
            <div className="mx-auto mb-6 bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center dark:bg-green-900">
              <svg
                className="w-10 h-10 text-green-600 dark:text-green-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
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
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Success</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Your complaint has been successfully registered. We will process it promptly.
            </p>
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-colors duration-200 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConformationModal;