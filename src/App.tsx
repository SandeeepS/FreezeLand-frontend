import "./App.css";
import React, { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import AdminLoggedIn from "./components/Admin/AdminLoggedIn";
import AdminLoggedOut from "./components/Admin/AdminLoggedOut";
import MechLoggedIn from "./components/Mech/MechLoggedIn";
import MechLoggedOut from "./components/Mech/MechLoggedOut";

const UserHomePage = lazy(() => import("./Pages/User/UserHomePage"));
const UserLoggedOut = lazy(() => import("./components/User/UserLoggedOut"));
const UserLoggedIn = lazy(() => import("./components/User/UserLoggedIn"));
const UserSignupPage = lazy(() => import("./Pages/User/UserSignupPage"));
const UserLoginPage = lazy(() => import("./Pages/User/UserLoginPage"));
const AdminLoginPage = lazy(() => import("./Pages/Admin/AdminLoginPage"));
const AdminDashboard = lazy(() => import("./Pages/Admin/AdminDashboard"));
const AdminUserListing = lazy(() => import("./Pages/Admin/AdminUserListing"));
const AdminMechListing = lazy(() => import("./Pages/Admin/AdminMechListing"));
const MechanicLoginPage = lazy(
  () => import("./Pages/Mechanic/MechanicLoginPage")
);
const MechanicHomePage = lazy(
  () => import("./Pages/Mechanic/MechanicHomePage")
);

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Suspense fallback={<div>...Loading</div>}>
        <Routes>
          {/* userRoutes */}
          <Route path="" element={<UserLoggedOut />}>
            <Route path="/signup" element={<UserSignupPage />} />
            <Route path="/login" element={<UserLoginPage />} />
          </Route>
          <Route path="" element={<UserLoggedIn />}>
            <Route path="/user/homepage" element={<UserHomePage />} />
          </Route>

          {/*Admin Routes*/}
          <Route path="" element={<AdminLoggedOut />}>
            <Route path="/admin/login" element={<AdminLoginPage />} />
          </Route>

          <Route path="" element={<AdminLoggedIn />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUserListing />} />
            <Route path="/admin/mech" element={<AdminMechListing />} />
          </Route>

          {/*Mechanic Routes*/}
          <Route path="" element={<MechLoggedOut />}>
            <Route path="/mech/login" element={<MechanicLoginPage />} />
          </Route>

          <Route path="" element={<MechLoggedIn />}>
            <Route path="/mech/homepage" element={<MechanicHomePage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
