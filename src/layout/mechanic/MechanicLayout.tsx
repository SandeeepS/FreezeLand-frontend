import React from "react";
import MechHeader from "../../components/Mech/Header";
import { Outlet } from "react-router-dom";
import SideBar from "../../components/Mech/Sidebar";
const MechanicLayout: React.FC = () => {
  return (
    <div className="flex flex-col bg-[#DFECF8]">
      <div className="header fixed top-0 left-0 w-full z-10 ">
        <MechHeader />
      </div>
      <div className="flex">
        <div className="hidden md:block">
          <SideBar />
        </div>
        <div className="w-full h-screen md:ml-56 mt-10 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MechanicLayout;
