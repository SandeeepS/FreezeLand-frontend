import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../App/store";

const MechLoggedIn = () => {
  const { mechData } = useAppSelector((state) => state.auth);
  if (mechData) {
    console.log("mech data is present in the mechloggedIn", mechData);
    return <Outlet />;
  } else {
    console.log("mech data is not present ", mechData);
    return <Navigate to="/mech/login" />;
  }
};

export default MechLoggedIn;
