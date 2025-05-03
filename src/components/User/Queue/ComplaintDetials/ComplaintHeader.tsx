import React, { useEffect } from "react";
import StatusBadge from "./StatusBadge";
import { Props } from "../../../../interfaces/IComponents/User/IUserInterfaces";
import { getService } from "../../../../Api/user";

const ComplaintHeader: React.FC<Props> = ({
  image,
  name,
  requestId,
  status,
}) => {
  console.log(requestId);
  //useEffect for getting the service details from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getService(requestId);
        console.log(
          "service deatils from the backend from  the backend is ",
          result
        );
      } catch (error) {
        console.log(error as Error);
        throw error as Error;
      }
    };
    fetchData();
  }, [requestId]);
  return (
    <div className="p-6 border-b ">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={image}
            alt={name}
            className="w-16 h-16 rounded-full mr-4 border"
          />
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-gray-600">Request ID: {requestId}</p>
          </div>
        </div>
        <div>
          <StatusBadge status={status} />
        </div>
      </div>
    </div>
  );
};

export default ComplaintHeader;
