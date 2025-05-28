import React from "react";
import { X, MapPin, Plus } from "lucide-react";

interface AddressWarningModalProps {
  show: boolean;
  onClose: () => void;
  onAddAddress: () => void;
  userName?: string;
}

const AddressWarningModal: React.FC<AddressWarningModalProps> = ({
  show,
  onClose,
  onAddAddress,
  userName = "User"
}) => {
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
     

          {/* Body */}
          <div className="p-6">
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                No Address Found
              </h4>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Hi {userName}! We need a delivery address to process your service request. 
                Please add an address to continue with your booking.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>Why do we need your address?</strong>
                  <br />
                  Your address helps us assign the right service provider and ensure timely delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onAddAddress}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Address</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressWarningModal;