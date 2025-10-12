import React from "react";
import MechHeader from "../../components/Mech/MechHeader";
import { Outlet } from "react-router-dom";
const MechLayOut: React.FC = () => {
  return (
    <div>
      <div className="header fixed top-0 left-0 w-full z-10 ">
        <MechHeader />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MechLayOut;
