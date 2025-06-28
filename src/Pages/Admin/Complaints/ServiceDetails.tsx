import { useEffect, useState } from "react";
import { getImageUrl } from "../../../Api/admin";

interface ServiceDetailsProps {
  serviceDetails: {
    name: string;
    serviceCharge: number;
    discription: string[];
    imageKey?: string;
    _id: string;
  } | null;
}

const ServiceDetails = ({ serviceDetails }: ServiceDetailsProps) => {

    const [image,setImage] = useState();
    useEffect(() => {
         const fetchData = async () => {
        try {
          if (serviceDetails?.imageKey) {
            const result = await getImageUrl(
              serviceDetails?.imageKey,
              "service"
            );
            if (result) {
              setImage(result.data.url);
            }
          }
        } catch (error) {
          console.log(error as Error);
        }
      };
      fetchData();
    },[serviceDetails])
    if (!serviceDetails) return null;

  if (!serviceDetails) return null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-3 mb-4">
          Service Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">Service Name</p>
              <p className="font-medium text-gray-800">{serviceDetails.name}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500">Service Charge</p>
              <p className="font-medium text-gray-800">₹{serviceDetails.serviceCharge}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Service ID</p>
              <p className="font-medium text-gray-800 text-sm">{serviceDetails._id}</p>
            </div>
          </div>
          
          {serviceDetails.imageKey && (
            <div className="md:flex md:justify-end">
              <img 
                src={image} 
                alt={serviceDetails.name} 
                className="w-full md:w-40 h-40 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
        
        {serviceDetails.discription && serviceDetails.discription.length > 0 && (
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Service Description</p>
            <ul className="list-disc pl-5 space-y-1">
              {serviceDetails.discription.map((item, index) => (
                <li key={index} className="text-gray-800">{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetails;