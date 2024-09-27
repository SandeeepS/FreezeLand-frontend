import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../App/store";

const MechLoggedIn = () => {
  const { mechData } = useAppSelector((state) => state.auth);
  if (mechData) {
    console.log("admin data is present in the adminloggedIn",mechData);
    return <Outlet />;
  } else {
    console.log("Admin data is not present ",mechData);
    return <Navigate to="/mech/login" />;
  }
};

export default MechLoggedIn;
