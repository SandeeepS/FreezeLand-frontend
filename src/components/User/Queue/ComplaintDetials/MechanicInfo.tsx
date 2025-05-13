import React, { useEffect, useState } from "react";
import { Phone, Email, Person, VerifiedUser } from "@mui/icons-material";
import { getImageUrl } from "../../../../Api/user";

interface MechanicDetails {
  photo?: string;
  name: string;
  isVerified: boolean;
  _id: string;
  phone: string;
  email: string;
  acceptedAt?: string;
  date?: string;
}

const MechanicInfo: React.FC<{ mechanicDetails?: MechanicDetails }> = ({
  mechanicDetails,
}) => {
  const [mechanicImage, setMechanicImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const image = await getImageUrl(
          mechanicDetails?.photo as string,
          "mechanic"
        );
        setMechanicImage(image?.data.url);
      } catch (error) {
        throw error as Error;
      }
    };
    fetchData();
  });
  if (!mechanicDetails) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Assigned Mechanic</h3>
        <p className="text-gray-500">No mechanic has been assigned yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-300  rounded-lg">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold my-2">Assigned Mechanic</h3>
      </div>
      <div className=" bg-gray-100 p-5">
        <div className="flex items-center mb-4">
          {mechanicDetails.photo ? (
            <img
              src={mechanicImage}
              alt={mechanicDetails.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
              <Person className="text-gray-500 text-xl" />
            </div>
          )}

          <div className="ml-4">
            <div className="flex items-center">
              <h4 className="text-md font-medium">{mechanicDetails.name}</h4>
              {mechanicDetails.isVerified && (
                <VerifiedUser className="text-green-500 ml-2 w-4 h-4" />
              )}
            </div>
            <p className="text-sm text-gray-500">
              Mechanic ID: {mechanicDetails._id.slice(-6)}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Phone className="text-gray-500 mr-2 w-4 h-4" />
            <span>{mechanicDetails.phone}</span>
          </div>
          <div className="flex items-center text-sm">
            <Email className="text-gray-500 mr-2 w-4 h-4" />
            <span>{mechanicDetails.email}</span>
          </div>
        </div>

        {mechanicDetails.acceptedAt && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Accepted request on:{" "}
              {new Date(mechanicDetails.acceptedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MechanicInfo;
