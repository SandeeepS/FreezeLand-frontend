import React from "react";

const ServiceDetails:React.FC = ({serviceImage,discription}) => {
  return (
    <div className="md:w-[40%]">
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
