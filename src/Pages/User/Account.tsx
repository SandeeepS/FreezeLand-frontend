import React from "react";
import Header from "../../components/User/Header";
import AccountSidebar from "../../components/User/AccountSidebar";
import AccountHeader from "../../components/User/AccountHeader";
import Footer from "../../components/User/Footer";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const Account: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>("");
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <AccountHeader />
        <div className="w-full bg-slate-200">
          <div className="grid grid-flow-row-dense grid-cols-3 grid-rows-3 ...">
            <div className="bg-white mx-5 mt-5 rounded-lg">
              <AccountSidebar />
            </div>
            <div className=" col-span-2 bg-white mr-5 mt-5 rounded-lg flex justify-center items-center ">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Account;
