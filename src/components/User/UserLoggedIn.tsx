import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../App/store";
import { useEffect, useState } from "react";
import { getProfile } from "../../Api/user";
import { useDispatch } from "react-redux";
import { userLogout } from "../../App/slices/AuthSlice";
import toast from "react-hot-toast";


const UserLoggedIn = () => {
    const [data, setData] = useState(false)
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getProfile();
                if (result?.data.isBlocked) setData(true);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])
    const { userData } = useAppSelector((state) => state.auth);
    if (!loading && data) {
        dispatch(userLogout());
        toast.error('User Blocked by the admin!');
        return <Navigate to='/' />
    }
    return userData ? <Outlet /> : <Navigate to='/' />;
}

export default UserLoggedIn;