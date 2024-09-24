import "./App.css";
import React, { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";

const UserHomePage = lazy(() => import("./Pages/User/UserHomePage"));
const UserLoggedOut = lazy(() => import("./components/User/UserLoggedOut"));
const UserSignupPage = lazy(() => import("./Pages/User/UserSignupPage"));
const UserLoginPage = lazy(() => import("./Pages/User/UserLoginPage"));
const AdminLoginPage = lazy(() => import("./Pages/Admin/AdminLoginPage"));
const AdminDashboard = lazy(() => import("./Pages/Admin/AdminDashboard"));
const AdminUserListing = lazy(() => import("./Pages/Admin/AdminUserListing"));
const AdminMechListing = lazy(() => import("./Pages/Admin/AdminMechListing"));
const UserLoggedIn = lazy(() => import("./components/User/UserLoggedIn"));

function App() {
  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
      <Suspense fallback={<div>...Loading</div>}>
        <Routes>
          {/* userRoutes */}
            <Route path="/signup" element={<UserSignupPage />} />
            <Route path="/login" element={<UserLoginPage />} />
            <Route path="" element={<UserLoggedOut />}>
              <Route path="/user/homepage" element={<UserHomePage />} />
            </Route>
       

          {/*Admin Routes*/}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUserListing />} />
          <Route path="/admin/mech" element={<AdminMechListing />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
