// CustomerDetailsComponent.tsx
import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

interface CustomerDetailsProps {
  complaint: {
    userDetails?:{
        name: string;
        password: string;
        email: string;
        phone: number;
        profile_picture: string;
        defaultAddress: string;
        role: string;
    }
    createdAt: string;
    defaultAddress: string;
  };
  formatDate: (dateString: string) => string;
}

const CustomerDetailsComponent: React.FC<CustomerDetailsProps> = ({
  complaint,
  formatDate,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="font-semibold text-lg mb-4">Customer Information</h3>

      <div className="flex items-center mb-4">
        <PersonIcon className="text-gray-500 mr-3" />
        <div>
          <p className="font-medium">
            {complaint.userDetails?.name || "Unknown Customer"}
          </p>
          <p className="text-sm text-gray-500">
            {complaint.userDetails?.email || "No email provided"}
          </p>
        </div>
      </div>

      <div className="flex items-center mb-4">
        <CalendarTodayIcon className="text-gray-500 mr-3" />
        <div>
          <p className="font-medium">Request Date</p>
          <p className="text-sm text-gray-500">
            {formatDate(complaint.createdAt)}
          </p>
        </div>
      </div>


      {complaint.userDetails?.phone && (
        <div className="border-t border-gray-200 mt-4 pt-4">
          <p className="font-medium">Contact Information</p>
          <p className="text-gray-600">{complaint.userDetails.phone}</p>
        </div>
      )}
    </div>
  );
};

export default CustomerDetailsComponent;
