import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../App/store";

const UserLoggedIn = () => {
  const { userData } = useAppSelector((state) => state.auth);
  if (userData) {
    console.log("user data from the UserLoggedIn is ", userData);
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default UserLoggedIn;
