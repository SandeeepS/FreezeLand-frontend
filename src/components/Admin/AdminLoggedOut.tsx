import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../App/store";


const AdminLoggedOut = () => {

    const { adminData } = useAppSelector((state) => state.auth);
    if (adminData) {
        return <Navigate to='/admin/dashboard' />
    } else {
        return <Outlet />
    }
}

export default AdminLoggedOut;