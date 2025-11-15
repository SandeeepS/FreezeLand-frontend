import React from "react";
import { MdCheckCircle } from "react-icons/md";

interface Address {
  _id: string;
  userId: string;
  fullAddress: string;
  addressType: "Home" | "Work";
  longitude: number;
  latitude: number;
  landmark: string;
  houseNumber: string;
  isDeleted: boolean;
  isDefaultAddress: boolean;
}

interface AddressSelectionProps {
  addresses: Address[];
  selectedAddress: string;
  onAddressSelect: (addressId: string) => void;
}

const AddressSelection: React.FC<AddressSelectionProps> = ({
  addresses,
  selectedAddress,
  onAddressSelect,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Select Service Location
        </h3>
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-16 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No address added yet.</p>
            <p className="text-gray-400 text-sm">
              Please add an address to continue
            </p>
          </div>
        ) : (
          <div className="grid gap-4 max-h-[500px] overflow-y-auto pr-2">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                onClick={() => onAddressSelect(addr._id)}
                className={`relative cursor-pointer p-6 rounded-xl border-2 transition-all ${
                  selectedAddress === addr._id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
                }`}
              >
                {selectedAddress === addr._id && (
                  <div className="absolute top-4 right-4">
                    <MdCheckCircle className="text-blue-500 text-3xl" />
                  </div>
                )}

                {addr.isDefaultAddress && (
                  <span className="absolute top-0 left-0 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-tl-xl rounded-br-xl">
                    Default
                  </span>
                )}

                <div className="mt-2">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-2 text-lg">
                        {addr.addressType}
                      </p>
                      <p className="text-gray-600 text-sm mb-2">
                        {addr.fullAddress}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {addr.landmark}, {addr.houseNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressSelection;