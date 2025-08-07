import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../App/store";

const UserLoggedOut = () => {
  const  userData  = useAppSelector((state) => state.auth.userData);
  console.log("userDAta from the UserloggedOut is ",userData)
  if (userData) {
    return <Navigate to="/" />;
  } else {
    return <Outlet />;
  }
};

export default UserLoggedOut;
