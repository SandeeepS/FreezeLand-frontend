import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../App/store";


const AdminLoggedIn = () => {

    const { adminData } = useAppSelector((state) => state.auth);
    if (adminData) {
        return <Outlet />
    } else {
        return <Navigate to='/admin/login' />
    }
}

export default AdminLoggedIn;