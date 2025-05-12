import React, { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import { Props } from "../../../../interfaces/IComponents/User/IUserInterfaces";
import { getImageUrl} from "../../../../Api/user";

const ComplaintHeader: React.FC<Props> = ({
  image,
  name,
  requestId,
  status,
}) => {
  console.log(requestId);
  //useEffect for getting the service details from the backend
  const [serviceImage,setServiceImage] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const imageurl = await getImageUrl(image,"user");
        if (imageurl?.data?.url) {
          setServiceImage(imageurl.data.url);
        } else {
          console.error("Image URL not found in API response:", imageurl);
        }
      } catch (error) {
        console.log(error as Error);
        throw error as Error;
      }
    };
    fetchData();
  }, [image]);


  return (
    <div className="p-6 border-b bg-gray-200 rounded-lg  ">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={serviceImage}
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
