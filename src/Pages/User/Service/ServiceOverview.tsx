import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const ServiceOverview: React.FC = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const handleClick = (_id: string) => {
    console.log("clicked id is ", _id);
    navigate(`/user/service/${_id}`);
  };
  
  return (
    <div>
      <h1 className="pt-60">This is the page for service details </h1>
      <h2>{id}</h2>
      <button onClick={() => handleClick(id as string)}>Click here </button>
    </div>
  );
};

export default ServiceOverview;
