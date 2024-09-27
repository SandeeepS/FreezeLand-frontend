import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../App/store";

const MechLoggedOut = () => {
  const { mechData } = useAppSelector((state) => state.auth);
  if (mechData) {
    return <Navigate to="/mech/dashboard" />;
  } else {
    return <Outlet />;
  }
};

export default MechLoggedOut;
