import AdminHeader from "../../components/Admin/AdminHeader";

const AdminDashboard: React.FC = () => {
  const heading = "Dashboard";
  return (
    <div>
      <AdminHeader heading={heading} />
      <div className="w-full  h-screen bg-[#DFECF8]">
        <h1>Admin dashboard</h1>
      </div>
    </div>
  );
};

export default AdminDashboard;
