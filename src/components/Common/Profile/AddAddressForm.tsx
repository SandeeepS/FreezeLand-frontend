// AddAddressForm.tsx
import React, { useState } from "react";
import OlaMapPicker from "../maps/OlaMapPicker";
import { MdWork } from "react-icons/md";
import { IoHomeSharp } from "react-icons/io5";

interface AddAddressFormProps {
  onClose: () => void;
  onSave?: (address: any) => void;
}

const AddAddressForm: React.FC<AddAddressFormProps> = ({ onClose, onSave }) => {
  const [addressType, setAddressType] = useState<"Home" | "Work">("Home");
  const [showMap, setShowMap] = useState(false);
  const [landmark, setLandmark] = useState("");
  const [houseNumber, setHouseNumber] = useState("");

  // New: coordinates + formatted address
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [fullAddress, setFullAddress] = useState("");

  const handleSave = () => {
    const newAddress = {
      addressType,
      landmark,
      houseNumber,
      latitude: coords?.lat ?? null,
      longitude: coords?.lng ?? null,
      formattedAddress: fullAddress || undefined,
    };
    onSave?.(newAddress);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          ➕ Add Address
        </h2>

        {/* Address Type with icons */}
        <div className="mb-4">
          <label className="mb-1 block font-medium text-gray-600">
            Address Type
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setAddressType("Home")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border p-3 ${
                addressType === "Home"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span>
                <IoHomeSharp />
              </span>
              <span className="font-medium">Home</span>
            </button>
            <button
              type="button"
              onClick={() => setAddressType("Work")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border p-3 ${
                addressType === "Work"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span>
                <MdWork />
              </span>
              <span className="font-medium">Work</span>
            </button>
          </div>
        </div>

        {/* Use Current Location button (opens map) */}
        <div className="mb-4">
          <label className="mb-1 block font-medium text-gray-600">
            Location
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMap(true)}
              className="rounded-xl bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700"
            >
              Use Current Location
            </button>
            {coords ? (
              <span className="text-xs text-gray-600">
                Chosen: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </span>
            ) : (
              <span className="text-xs text-gray-500">
                No location chosen yet
              </span>
            )}
          </div>
          {fullAddress && (
            <p className="mt-2 rounded-lg bg-gray-50 p-2 text-sm text-gray-700">
              {fullAddress}
            </p>
          )}
        </div>

        {/* Landmark */}
        <div className="mb-4">
          <label className="mb-1 block font-medium text-gray-600">
            Landmark
          </label>
          <input
            type="text"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className="w-full rounded-lg border p-2"
            placeholder="Near Govt School, Temple etc."
          />
        </div>

        {/* House / Flat Number */}
        <div className="mb-6">
          <label className="mb-1 block font-medium text-gray-600">
            House / Flat Number
          </label>
          <input
            type="text"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
            className="w-full rounded-lg border p-2"
            placeholder="12/A, Flat No. 3"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-300 px-4 py-2 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Save Address
          </button>
        </div>
      </div>

      {/* Map modal */}
      {showMap && (
        <OlaMapPicker
          apiKey={import.meta.env.VITE_OLA_MAPS_API_KEY as string}
          onCancel={() => setShowMap(false)}
          onConfirm={(loc) => {
            setCoords({ lat: loc.lat, lng: loc.lng });
            if (loc.formattedAddress) setFullAddress(loc.formattedAddress);
            setShowMap(false);
          }}
        />
      )}
    </div>
  );
};

export default AddAddressForm;
