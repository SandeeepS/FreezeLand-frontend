import React from "react";
import Header from "../../components/User/Header";
import AccountSidebar from "../../components/User/AccountSidebar";
import AccountHeader from "../../components/User/AccountHeader";

const Account: React.FC = () => {
  return (
    <>
      <Header />
      <div className="bg-slate-300 w-full h-screen">
        <AccountHeader />
        <AccountSidebar />
      </div>
    </>
  );
};

export default Account;
