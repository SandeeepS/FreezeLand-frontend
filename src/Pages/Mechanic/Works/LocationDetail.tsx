import React from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface LocationDetalProps {
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
}

const LocationDetail: React.FC<LocationDetalProps> = ({ location }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="font-semibold text-lg mb-4">Location</h3>

      <div className="flex items-start">
        <LocationOnIcon className="text-gray-500 mr-3 mt-1" />
        <div>
          <p className="font-medium">Service Location</p>
          <p className="text-sm text-gray-500">
            {location.address || "No address provided"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;
