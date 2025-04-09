import React from "react";
import { Person, Phone } from "@mui/icons-material";
import { Props3 } from "../../../../interfaces/IComponents/User/IUserInterfaces";



const CustomerInfo: React.FC<Props3> = ({ userDetails, fallbackName }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
    <div className="bg-gray-50 p-5 rounded-lg">
      <div className="flex items-center mb-4">
        <Person className="w-5 h-5 mr-3 text-gray-500" />
        <div>
          <h3 className="font-medium">Name</h3>
          <p>{userDetails.name || fallbackName || "Unknown"}</p>
        </div>
      </div>

      <div className="flex items-center">
        <Phone className="w-5 h-5 mr-3 text-gray-500" />
        <div>
          <h3 className="font-medium">Contact Number</h3>
          <p>{userDetails.phone || "Not available"}</p>
        </div>
      </div>
    </div>
  </div>
);

export default CustomerInfo;
