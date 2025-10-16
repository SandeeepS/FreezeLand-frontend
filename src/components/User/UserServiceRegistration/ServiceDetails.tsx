// ServiceDetails.tsx
import React from "react";

interface ServiceDetailsProps {
  serviceImage: string;
  discription?: string | string[];
  serviceAmount?: number;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  serviceImage,
  serviceAmount,
  discription,
}) => {
  return ( 
    <div className=" flex  justify-around rounded-lg  overflow-hidden md:flex md:px-6">
      {/* Image Section */}
      <div className="relative aspect-video">
        {serviceImage ? (
          <img
            src={serviceImage}
            alt="Service"
            className="h-52 object-cover "
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/placeholder-service-image.jpg";
              (e.target as HTMLImageElement).className = "object-contain p-8";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Description */}
        {discription && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900">Description</h3>
            {Array.isArray(discription) ? (
              <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                {discription.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 leading-relaxed">{discription}</p>
            )}
          </div>
        )}

        {/* Price */}
        {serviceAmount !== undefined && (
          <div className="mb-4 mt-4">
            <span className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-md text-lg font-medium">
              Service Charge ₹{serviceAmount.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetails;
