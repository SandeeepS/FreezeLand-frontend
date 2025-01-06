import Header from "../../components/User/Header";
import AccountSidebar from "../../components/User/AccountSidebar";
import AccountHeader from "../../components/User/AccountHeader";
import Footer from "../../components/User/Footer";
import { Outlet } from "react-router-dom";

const Account: React.FC = () => {
  return (
    <>
      <div className="flex flex-col">
        {/* Fixed header at the top */}
        <div className="fixed top-0 left-0 w-full z-10 ">
          <Header />
        </div>

        {/* Account header */}
        <div className=" pt-32 h-4  w-full fixed  z-10 ">
          <AccountHeader />
        </div>

        {/* Main content area */}
        <div className="flex flex-col flex-grow pt-[12rem] ">
          {/* Content section with sidebar and main area */}
          
          <div className="flex flex-row flex-grow bg-slate-200">

            {/* Sidebar */}
            <div className="bg-white ml-4 mt-4 mb-4 rounded-lg basis-1/4 shadow-md">
              <AccountSidebar />
            </div>

            {/* Main content */}
            <div className="mx-4 mt-4 mb-4 basis-3/4 p-4 bg-white rounded-lg shadow-md">
              <Outlet />
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Account;
