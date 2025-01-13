import React from "react";
import AdminListing from "./AdminListing";
import { Outlet } from "react-router-dom";
import AdminMainHeader from "./AdminMainHeader";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col">
      <div className="fixed z-10 w-full">
        <AdminMainHeader />
      </div>
      <div className="flex ">
        <div className="hidden md:block">
          <AdminListing />
        </div>
        <div className="w-full  md:ml-56 mt-28 bg-[#DFECF8]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
