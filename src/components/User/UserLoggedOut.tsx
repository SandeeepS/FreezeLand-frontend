import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../App/store";


const UserLoggedOut = () => {

    const { userData } = useAppSelector((state) => state.auth);
    if (userData) {
        return <Navigate to='/user/home' />
    } else {
        return <Outlet />
    }

}

export default UserLoggedOut;