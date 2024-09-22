import "./App.css";
import { Route, Routes } from "react-router-dom";
import UserHomePage from "./Pages/User/UserHomePage";
import UserSignupPage from "./Pages/User/UserSignupPage";
import UserLoginPage from "./Pages/User/UserLoginPage";
import AdminLoginPage from "./Pages/Admin/AdminLoginPage";
import AdminDashboard from "./Pages/Admin/AdminDashboard";

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
      </Routes>
    </>
  );
}

export default App;
