import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { useAppSelector } from "../../../App/store";
import { getAllAddressOfUser, removeUserAddress } from "../../../Api/user";
import { getMechanicAddress, removeMechAddress } from "../../../Api/mech";
import ConfirmModal from "../Modal/ConfirmModal";
import toast from "react-hot-toast";

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

interface AddressListProps {
  role: "user" | "mechanic" | "admin" | string;
  onAddAddress?: () => void;
  onEditAddress?: (addr: Address) => void;
  onSetDefaultAddress: (userId: string, addressId: string) => Promise<any>;
}

const AddressList: React.FC<AddressListProps> = ({
  role,
  onAddAddress,
  onEditAddress,
  onSetDefaultAddress,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [address, setAddress] = useState<Address[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<
    "edit" | "remove" | "setDefault" | null
  >(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [fullAddressView, setFullAddressView] = useState<string>("");

  console.log(deletingId);
  let data;
  let getAddressFunction: (id: string) => Promise<any>;
  let addressRemoveFunction: (
    userId: string,
    addressId: string
  ) => Promise<any>;

  if (role == "user") {
    data = useAppSelector((state) => state.auth.userData);
    getAddressFunction = getAllAddressOfUser;
    addressRemoveFunction = removeUserAddress;
  } else {
    data = useAppSelector((state) => state.auth.mechData);
    getAddressFunction = getMechanicAddress;
    addressRemoveFunction = removeMechAddress;
  }

  const fetchAddresses = async () => {
    try {
      const response = await getAddressFunction(data?.id as string);
      console.log(
        "Response after fetching the address of user / mechanic ",
        response
      );

      const sortedAddresses = response.data.result.sort(
        (a: Address, b: Address) =>
          (b.isDefaultAddress ? 1 : 0) - (a.isDefaultAddress ? 1 : 0)
      );

      setAddress(sortedAddresses);
    } catch (error) {
      console.log("Error while fetching the data", error);
    }
  };

  useEffect(() => {
    console.log("fetched address are ",address);
  })

  useEffect(() => {
    if (data?.id) {
      fetchAddresses();
    }
  }, [data?.id, getAddressFunction]);

  useEffect(() => {
    console.log("Result from the backend is ...", address);
  });

  const handleOpenModal = (
    action: "edit" | "remove" | "setDefault",
    addr: Address
  ) => {
    setSelectedAction(action);
    setSelectedAddress(addr);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedAddress || !selectedAction) return;
    try {
      if (selectedAction === "edit") {
        if (selectedAction === "edit") {
          if (selectedAddress) {
            onEditAddress?.(selectedAddress);
          }
        }
        console.log("Editing address:", selectedAddress);
      } else if (selectedAction === "remove") {
        const prev = address ?? [];
        const updated = prev.filter((a) => a._id !== selectedAddress._id);

        setAddress(updated);
        setIsModalOpen(false);
        setDeletingId(selectedAddress._id);

        try {
          console.log(data);
          let userId: string = "";
          if (role == "mech") {
            userId = data?.id ?? "";
          } else {
            userId = selectedAddress._id;
          }
          const result = await addressRemoveFunction(
            userId,
            selectedAddress._id
          );
          console.log("result after removing the address is ", result);
          if (result.data.success) {
            toast.success("Address removed successfully");
          }
        } catch (error) {
          // rollback on failure
          console.error("Failed to delete address:", error);
          setAddress(prev);
          toast.error("Failed to Delete Address");
        } finally {
          setDeletingId(null);
          setSelectedAction(null);
          setSelectedAddress(null);
        }
        return;
      } else if (selectedAction === "setDefault") {
        try {
          console.log(data);
          let userId: string = "";
          if (role == "mech") {
            userId = data?.id ?? "";
          } else {
            userId = selectedAddress.userId;
          }
          console.log("the rolr of the user is ", role);
          const result = await onSetDefaultAddress(userId, selectedAddress._id);
          console.log("result after setting defult address is ", result);
          if (result.data.success) {
            toast.success("Default address updated successfully");
            await fetchAddresses();
          }
        } catch (error) {
          console.log("error occured while setDefaultAdress ", error);
        }
      }
    } catch (error) {
      console.error("Error performing action:", error);
    } finally {
      setIsModalOpen(false);
      setSelectedAction(null);
      setSelectedAddress(null);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {role === "admin"
            ? "Admin Address"
            : role === "mechanic"
            ? "Workshop Address"
            : "User Addresses"}
        </h3>
      </div>

      <div className="flex justify-center  mb-2">
        <button
          onClick={onAddAddress}
          className="px-4 py-2 bg-freeze-color text-white rounded-xl shadow hover:bg-blue-500 transition flex items-center"
        >
          <MdAdd className="mr-1" />
          Add New Address
        </button>
      </div>

      {address && address.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <p className="text-gray-500">No address added yet.</p>
          <button
            onClick={onAddAddress}
            className="px-4 py-2 bg-freeze-color text-white rounded-xl shadow hover:bg-blue-700 transition flex items-center "
          >
            <MdAdd className="mr-1" />
            Add Address
          </button>
        </div>
      ) : (
        <div className=" space-y-4 overflow-y-scroll md:overflow-x-scroll md:overflow-y-hidden ">
          <div className="md:flex">
            {address &&
              address.map((addr) => (
                <div
                  key={addr._id}
                  className={`relative flex flex-col justify-between p-4 m-1 rounded-xl border min-h-[180px]
                      ${
                        addr.isDeleted
                          ? "bg-gray-100 border-gray-300"
                          : "bg-gray-50 border-gray-200"
                      }`}
                >
                  <div className="mb-4">
                    {addr.isDefaultAddress && (
                      <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-tr-lg rounded-bl-lg">
                        Default Address
                      </div>
                    )}
                  </div>

                  <div
                    className="cursor-pointer "
                    onClick={() => {
                      setFullAddressView(addr.fullAddress);
                      setIsAddressModalOpen(true);
                    }}
                  >
                    <p className="font-medium line-clamp-4 overflow-hidden">
                      {addr.fullAddress}
                    </p>
                    <p className="text-sm text-gray-600">
                      {addr.landmark}, {addr.houseNumber},
                    </p>
                  </div>

                  <div className="mt-3 flex gap-2 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => handleOpenModal("edit", addr)}
                      className="h-10 px-3 py-1 text-sm bg-blue-500 text-white rounded-sm hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleOpenModal("remove", addr)}
                      className="h-10 px-3 py-1 text-sm bg-red-500 text-white rounded-sm hover:bg-red-600"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => {
                        if (!addr.isDefaultAddress)
                          handleOpenModal("setDefault", addr);
                      }}
                      disabled={addr.isDefaultAddress}
                      className={`h-10 px-3 py-1 text-sm text-white rounded-sm transition
                          ${
                            addr.isDefaultAddress
                              ? "bg-green-300 cursor-not-allowed"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                    >
                      {addr.isDefaultAddress ? "Default" : "Set Default"}
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Add Address option even when addresses exist */}
        </div>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        title={
          selectedAction === "edit"
            ? "Edit Address"
            : selectedAction === "remove"
            ? "Remove Address"
            : "Set Default Address"
        }
        message={
          selectedAction === "edit"
            ? "Do you want to edit this address?"
            : selectedAction === "remove"
            ? "Are you sure you want to delete this address?"
            : "Do you want to set this as your default address?"
        }
        onConfirm={handleConfirm}
        onCancel={() => setIsModalOpen(false)}
      />

      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 md:w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Full Address</h2>
            <p className="text-gray-700 mb-4">{fullAddressView}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressList;
