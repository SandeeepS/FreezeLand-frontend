import React from "react";

interface ServiceDetailsProps {
  serviceImage: string;
  discription: string;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ serviceImage, discription }) => {
  return (
    <div className="serviceImage md:w-[45%]">
      <div className="md:mb-12 flex justify-center">
        <img src={serviceImage} alt="" />
      </div>
      <div className="mb-12 flex justify-center my-5">
        <h1 className="font-Metal text-xl">{discription}</h1>
      </div>
    </div>
  );
};

export default ServiceDetails;
