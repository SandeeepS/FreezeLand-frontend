import React from "react";
import Header from "../../components/User/Header";
import { Outlet } from "react-router-dom";

const UserLayout: React.FC = () => {
  return (
    <div >
      <div className="header fixed top-0 left-0 w-full z-10">
        <Header />
      </div>
      <div>
          <Outlet/>
      </div>
    </div>
  );
};

export default UserLayout;
