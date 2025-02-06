import Header from "../../components/User/Header";
import Footer from "../../components/User/Footer";
import { Outlet } from "react-router-dom";

const Account: React.FC = () => {
  return (
    <>
      <div className=" mainContainer flex flex-col">
        <div className="header fixed top-0 left-0 w-full z-10">
          <Header />
        </div>

        {/* Main content area */}
        <div className="main_content_area flex flex-col flex-grow pt-[6rem] ">
          {/* Content section with sidebar and main area */}

          <div className="maincontent flex flex-row flex-grow bg-slate-200">
            {/*Main content*/}
            <div className="main_content mx-4 mt-4 mb-4 basis-3/4 p-4 bg-white rounded-lg shadow-md">
              <Outlet />
            </div>
            {/* Main content */}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Account;
