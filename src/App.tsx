import "./App.css";
import { Route, Routes } from "react-router-dom";
import UserHomePage from "./Pages/User/UserHomePage";
import UserSignupPage from "./Pages/User/UserSignupPage";
import UserLoginPage from "./Pages/User/UserLoginPage";
import AdminLoginPage from "./Pages/Admin/AdminLoginPage";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminUserListing from "./Pages/Admin/AdminUserListing";
import AdminMechListing from "./Pages/Admin/AdminMechListing";

function App() {
  return (
    <>
      <Routes>
        {/* userRoutes */}
        <Route path="user/homepage" element={<UserHomePage />} />
        <Route path="/signup" element={<UserSignupPage />} />
        <Route path="/login" element={<UserLoginPage/>}/>


        {/*Admin Routes*/}
        <Route path="/admin/login" element={<AdminLoginPage/>}/>
        <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
        <Route path="/admin/users" element={<AdminUserListing/>}/>
        <Route path="/admin/mech" element={<AdminMechListing/>}/>
      </Routes>
    </>
  );
}

export default App;
