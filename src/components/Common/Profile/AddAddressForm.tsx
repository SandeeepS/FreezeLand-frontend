import React, { useState } from "react";
import OlaMapPicker from "../maps/OlaMapPicker";
import { MdWork } from "react-icons/md";
import { IoHomeSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import { useAppSelector } from "../../../App/store";
import {
  IAddress,
  IAddressResponse,
} from "../../../interfaces/IComponents/Common/ICommonInterfaces";

interface AddAddressFormProps {
  role: string;
  mode: "add" | "edit";
  initialData?: IAddress;
  onClose: () => void;
  onSave: (address: IAddress) => Promise<IAddressResponse>;
}

const AddAddressForm: React.FC<AddAddressFormProps> = ({
  role,
  mode,
  initialData,
  onClose,
  onSave,
}) => {
  let data;
  if (role == "user") {
    data = useAppSelector((state) => state.auth.userData);
  } else {
    data = useAppSelector((state) => state.auth.mechData);
  }

  const [isSaving, setIsSaving] = useState(false);
  const [addressType, setAddressType] = useState<"Home" | "Work">(
    initialData?.addressType || "Home"
  );
  const [showMap, setShowMap] = useState(false);
  const [landmark, setLandmark] = useState(initialData? initialData.landmark : "");
  const [houseNumber, setHouseNumber] = useState(initialData? initialData.houseNumber : "");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    initialData
      ? { lat: initialData.latitude, lng: initialData.longitude }
      : null
  );
  const [fullAddress, setFullAddress] = useState(
    initialData?.fullAddress || ""
  );
  const handleSave = async () => {
    try {
      if (!data) {
        toast.error("User not found. Please login again.");
        return;
      }

      if (!coords) {
        toast.error("Please pick a location on the map.");
        return;
      }
      setIsSaving(true);
      const newAddress: IAddress = {
        ...(initialData?.userId && { _id: initialData._id }),
        userId: data.id,
        addressType: addressType,
        fullAddress: fullAddress,
        houseNumber: houseNumber,
        longitude: coords.lng,
        latitude: coords.lat,
        landmark: landmark,
      };
      console.log("new Address is ----------------",newAddress);
      const response = await onSave(newAddress);
      console.log(
        "response from the backend after updating the address is ",
        response
      );
      if(response){
        toast.success("Address updated successfully");
      }else{
        toast.error("Address updation failed!!");
      }
      onClose();
    } catch (error) {
      console.log(
        "Error occured while updating the address to the databse from the AddAddressForm"
      );
      toast.error(
        mode === "edit" ? "Update failed!" : "Address adding failed!"
      );
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          {mode === "edit" ? "Edit Address" : "Add Address"}
        </h2>

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
                  ? "border-freeze-color bg-indigo-50 text-freeze-color"
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
                  ? "border-freeze-color bg-indigo-50 text-freeze-color"
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
          <div className="flex items-center gap-2 flex-col">
            <div>
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="rounded-xl bg-freeze-color px-3 py-2 text-sm text-white hover:bg-blue-700"
              >
                Use Current Location
              </button>
            </div>
            <div>
              {coords ? (
                <span className="text-xs text-gray-600">
                  {/**cords will be used for future pupose */}
                  {/* Chosen: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)} */}
                </span>
              ) : (
                <span className="text-xs text-gray-500">
                  No location chosen yet
                </span>
              )}
            </div>
          </div>
          {fullAddress && (
            <p className="mt-2 rounded-lg bg-gray-50 p-2 text-sm text-black border-freeze-color border-2">
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
            value= {landmark}
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

        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-300 px-4 py-2 hover:bg-red-600 hover:text-white w-36"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`rounded-lg bg-freeze-color px-4 py-2 text-white w-36 hover:bg-blue-700 flex items-center justify-center ${
              isSaving ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={isSaving}
          >
            {isSaving
              ? "Saving..."
              : mode === "edit"
              ? "Update Address"
              : "Save Address"}
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
            if (loc.formatted_address) setFullAddress(loc.formatted_address);
            setShowMap(false);
          }}
        />
      )}
    </div>
  );
};

export default AddAddressForm;
