import React, { useState } from "react";
import { Home, Briefcase } from "lucide-react"; // 👈 using lucide-react icons

interface AddAddressFormProps {
  onClose: () => void;
  onSave?: (address: any) => void;
}

const AddAddressForm: React.FC<AddAddressFormProps> = ({ onClose, onSave }) => {
  const [addressType, setAddressType] = useState<"Home" | "Work">("Home");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [landmark, setLandmark] = useState("");
  const [houseNumber, setHouseNumber] = useState("");

  const handleSave = () => {
    const newAddress = {
      addressType,
      useCurrentLocation,
      landmark,
      houseNumber,
    };
    // onSave?.(newAddress);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 ">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full sm:max-w-md md:max-w-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          ➕ Add Address
        </h2>

        {/*  */}
        <div className="mb-6">
          <p className="font-medium text-gray-600 mb-2">Address Type</p>
          <div className="flex gap-4">
            <button
              onClick={() => setAddressType("Home")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition 
                ${
                  addressType === "Home"
                    ? "bg-freeze-color text-white border-blue-400"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                }`}
            >
              <Home size={18} />
              Home
            </button>

            <button
              onClick={() => setAddressType("Work")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition 
                ${
                  addressType === "Work"
                    ? "bg-freeze-color text-white border-blue-400"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                }`}
            >
              <Briefcase size={18} />
              Work
            </button>
          </div>
        </div>

        {/* Current Location */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={useCurrentLocation}
            onChange={(e) => setUseCurrentLocation(e.target.checked)}
          />
          <label className="text-gray-700">Use Current Location</label>
        </div>

        {/* Landmark */}
        <div className="mb-4">
          <label className="block font-medium text-gray-600 mb-1">
            Landmark
          </label>
          <input
            type="text"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="Near Govt School, Temple etc."
          />
        </div>

        {/* House Number */}
        <div className="mb-6">
          <label className="block font-medium text-gray-600 mb-1">
            House / Flat Number
          </label>
          <input
            type="text"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="12/A, Flat No. 3"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-red-700 w-32 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-freeze-color text-white rounded-lg hover:bg-blue-700 w-32"
          >
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAddressForm;
