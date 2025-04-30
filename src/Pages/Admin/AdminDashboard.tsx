import Grid from "../../components/Admin/Dashboard/Grid";
import TopBar from "../../components/Admin/Dashboard/TopBar";

const AdminDashboard: React.FC = () => {
  const heading = "Admin Dashboard"
  return (
    <div>
      <div className="w-full  h-screen bg-[#DFECF8]">
        <TopBar heading={heading}/>
         <Grid/>
      </div>
   
    </div>
  );
};

export default AdminDashboard;
