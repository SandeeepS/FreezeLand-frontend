import React from "react";
import { CalendarToday, Handyman, LocationOn, Warning } from "@mui/icons-material";
import { Props2 } from "../../../../interfaces/IComponents/User/IUserInterfaces";


const ComplaintInfo: React.FC<Props2> = ({ serviceDetails, complaint, deviceImages }) => (
  <div className="md:col-span-2">
    <h2 className="text-xl font-semibold mb-4">Service Details</h2>
    <div className="bg-gray-50 p-5 rounded-lg mb-6">
      <div className="flex items-start mb-4">
        <Handyman className="w-5 h-5 mr-3 mt-1 text-gray-500" />
        <div>
          <h3 className="font-medium">Service Type</h3>
          <p>{serviceDetails.name || "Unknown"}</p>
        </div>
      </div>
      <div className="flex items-start mb-4">
        <CalendarToday className="w-5 h-5 mr-3 mt-1 text-gray-500" />
        <div>
          <h3 className="font-medium">Request Date</h3>
          <p>{new Date(complaint.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex items-start mb-4">
        <LocationOn className="w-5 h-5 mr-3 mt-1 text-gray-500" />
        <div>
          <h3 className="font-medium">Service Location</h3>
          <p>{complaint.locationName?.address || "Not specified"}</p>
        </div>
      </div>
      <div className="flex items-start">
        <Warning className="w-5 h-5 mr-3 mt-1 text-gray-500" />
        <div>
          <h3 className="font-medium">Description</h3>
          <p>{complaint.description || "No description provided"}</p>
        </div>
      </div>
    </div>

    {deviceImages.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Device Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {deviceImages.map((img, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img src={img} alt={`Device ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    )}


  </div>
);

export default ComplaintInfo;
