import AdminHeader from "../../components/Admin/AdminHeader";
import AdminListing from "../../components/Admin/AdminListing";
import MechDataListing from "../../components/Admin/MechDataListing";
const AdminMechListing: React.FC = () => {
  return (
    <div className="h-screen flex">
      {/* side bar */}
      <AdminListing />
      {/* Contents */}
      <div className="w-3/4 bg-[#DFECF8]">
        <div>
          <AdminHeader heading="Mechanics" />
          <div className="flex justify-center items-center">
            <MechDataListing/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMechListing;
