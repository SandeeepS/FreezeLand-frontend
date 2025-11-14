import React from "react";

interface ServiceDetailsProps {
  service: {
    name: string;
    discription: string;
    serviceCharge: number;
  };
  imageUrl: string;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  service,
  imageUrl,
}) => {
  return (
    <div className="">
      <div className="flex items-center md:flex-col">
        <div className="max-w-xl">
          <img
            src={imageUrl || "https://via.placeholder.com/500"}
            alt={service.name}
            className="w-full h-80 object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="flex flex-col justify-center items-center max-w-xl my-10">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            {service.name}
          </h3>
          <p className="text-gray-600 text-base mb-6 leading-relaxed">
            {service.discription}
          </p>
          <div className=" bg-green-50 border w-full h-24 border-green-200 rounded-lg p-5 inline-block">
            <p className="text-sm text-gray-600 mb-1">Service Charge</p>
            <p className="text-3xl font-bold text-green-600">
              ₹{service.serviceCharge}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;