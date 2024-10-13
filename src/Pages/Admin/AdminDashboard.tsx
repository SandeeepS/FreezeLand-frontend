import { Outlet } from "react-router-dom";
import AdminHeader from "../../components/Admin/AdminHeader";
import AdminListing from "../../components/Admin/AdminListing";
const AdminDashboard: React.FC = () => {
  return (
    <>
      <div className="flex">
        {/* side bar */}
        <AdminListing />
        {/* side bar */}

        {/* Contents */}
        <div className="w-full ml-16 md:ml-56 bg-[#DFECF8]">
          <AdminHeader heading="Dashboard" />
          <Outlet />
        </div>
        {/* Contents */}
      </div>
    </>
  );
};

export default AdminDashboard;
