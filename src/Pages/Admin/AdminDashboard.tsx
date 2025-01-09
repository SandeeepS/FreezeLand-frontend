import AdminHeader from "../../components/Admin/AdminHeader";
import Grid from "../../components/Admin/Dashboard/Grid";

const AdminDashboard: React.FC = () => {
  const heading = "Dashboard";
  return (
    <div>
      <AdminHeader heading={heading}/>
      <div className="w-full  h-screen bg-[#DFECF8]">
         <Grid/>
      </div>
   
    </div>
  );
};

export default AdminDashboard;
