import AdminHeader from "../../components/Admin/AdminHeader";
import AdminListing from "../../components/Admin/AdminListing";
const AdminDashboard: React.FC = () => {
  return (
    <>
      <div className="h-screen flex">
        {/* side bar */}
        <AdminListing />
        {/* Contents */}
        <div className="w-3/4 bg-[#DFECF8]">
          <div>
            <AdminHeader heading="Dashboard"/>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
