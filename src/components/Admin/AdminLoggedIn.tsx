import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../App/store";

const AdminLoggedIn = () => {
  const { adminData } = useAppSelector((state) => state.auth);
  if (adminData) {
    console.log("admin data is present in the adminloggedIn",adminData);
    return <Outlet />;
  } else {
    console.log("Admin data is not present ",adminData);
    return <Navigate to="/admin/login" />;
  }
};

export default AdminLoggedIn;
