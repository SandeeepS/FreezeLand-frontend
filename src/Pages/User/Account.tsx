import Header from "../../components/User/Header";
import AccountSidebar from "../../components/User/AccountSidebar";
import AccountHeader from "../../components/User/AccountHeader";
import Footer from "../../components/User/Footer";

// import { useState } from "react";
import { Outlet } from "react-router-dom";

const Account: React.FC = () => {
  // const [selectedSection, setSelectedSection] = useState<string>("");
  return (
    <>
      <Header />
      <AccountHeader />

      <div className="flex pt-16 m-auto flex-row w-full bg-slate-200">
        <div className="bg-white ml-4 mt-4 mb-4  rounded-lg basis-1/4">
          <AccountSidebar />
        </div>
        <div className=" mx-4 mt-4 mb-4 basis-3/4 ">
          <Outlet/>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Account;
