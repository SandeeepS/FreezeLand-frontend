import React from "react";

interface Address {
  _id: string;
  name: string;
  phone: number;
  email: string;
  district: string;
  state: string;
  landMark: string;
  pin: number;
  isDeleted: boolean;
}

interface AddressListProps {
  addresses: Address[];
  role: "user" | "mechanic" | "admin"  | string;
}

const AddressList: React.FC<AddressListProps> = ({ addresses, role }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {role === "admin"
          ? "Admin Address"
          : role === "mechanic"
          ? "Workshop Address"
          : "User Addresses"}
      </h3>

      {addresses.length === 0 ? (
        <p className="text-gray-500">No address added yet.</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`p-4 rounded-xl border ${
                addr.isDeleted
                  ? "bg-gray-100 border-gray-300"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <p className="font-medium">{addr.name}</p>
              <p className="text-sm text-gray-600">
                {addr.landMark}, {addr.district}, {addr.state} - {addr.pin}
              </p>
              <p className="text-sm text-gray-600">
                📞 {addr.phone} | ✉️ {addr.email}
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
      )}
    </div>
  );
};

export default AddressList;
