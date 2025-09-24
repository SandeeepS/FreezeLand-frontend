import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { useAppSelector } from "../../../App/store";
import { getAllAddressOfUser } from "../../../Api/user";
import { getMechanicAddress } from "../../../Api/mech";

interface Address {
  _id: string;
  fullAddress: string;
  landmark: string;
  houseNumber: string;
  isDeleted: boolean;
}

interface AddressListProps {
  role: "user" | "mechanic" | "admin" | string;
  onAddAddress?: () => void; // callback to open modal / navigate to add address page
}

const AddressList: React.FC<AddressListProps> = ({ role, onAddAddress }) => {
  //need to create a api call for getting the address of user/ mechanic based on the role
  let data;
  let getAddressFunction: (id: string) => Promise<any>;
  const [address, setAddress] = useState<Address[]>();

  if (role == "user") {
    data = useAppSelector((state) => state.auth.userData);
    getAddressFunction = getAllAddressOfUser;
  } else {
    data = useAppSelector((state) => state.auth.mechData);
    getAddressFunction = getMechanicAddress;
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await getAddressFunction(data?.id as string);
        setAddress(response.data.result);
      } catch (error) {
        console.log("error while fetching the data", error);
      }
    };
    fetch();
  }, [data?.id, getAddressFunction]);

  useEffect(() => {
    console.log("Result from the backend is ...", address);
  });

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
        <div className=" space-y-4">
          <div className="md:flex ">
            {address &&
              address.map((addr) => (
                <div
                  key={addr._id}
                  className={`p-4 m-1 rounded-xl border ${
                    addr.isDeleted
                      ? "bg-gray-100 border-gray-300"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <p className="font-medium">{addr.fullAddress}</p>
                  <p className="text-sm text-gray-600">
                    {addr.landmark}, {addr.houseNumber},
                  </p>

                  <div className="mt-3 flex gap-3">
                    <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-xl hover:bg-blue-600">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600">
                      Remove
                    </button>
                    <button className="px-3 py-1 text-sm bg-green-500 text-white rounded-xl hover:bg-green-600">
                      Set Default
                    </button>
                  </div>
                </div>
              ))}
          </div>
          {/* Add Address option even when addresses exist */}
          <div className="flex justify-center">
            <button
              onClick={onAddAddress}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition flex items-center"
            >
              <MdAdd className="mr-1" />
              Add New Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressList;
