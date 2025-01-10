import "./App.css";
import React, { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import AdminLoggedIn from "./components/Admin/AdminLoggedIn";
import AdminLoggedOut from "./components/Admin/AdminLoggedOut";
import MechLoggedIn from "./components/Mech/MechLoggedIn";
import MechLoggedOut from "./components/Mech/MechLoggedOut";
import UserLoggedOut from "./components/User/UserLoggedOut";
import UserLoggedIn from "./components/User/UserLoggedIn";
import UserOtpPage from "./Pages/User/UserOtpPage";
import MechOtpPage from "./Pages/Mechanic/MechOtpPage";
import ForgetPassword from "./Pages/User/ForgetPassword";
import ForgetPasswordForMech from "./Pages/Mechanic/ForgetPasswordForMech";
import Account from "./Pages/User/Account";
import Profile from "./components/Common/Profile";
import Layout from "./components/Admin/Layout";
import ProfileDetails from "./components/User/ProfileDetails";
import Address from "./components/User/Address";
import History from "./components/User/History";
import Payments from "./components/User/Payments";
import AddAddress from "./components/User/AddAddress";
import AllAddress from "./components/User/AllAddress";
import { EditAddress } from "./components/User/EditAddress";
import BasePage from "./Pages/User/UserLayout";
import UserLayout from "./Pages/User/UserLayout";
import Queue from "./components/User/Queue/Queue";

const UserHomePage = lazy(() => import("./Pages/User/UserHomePage"));
const UserSignupPage = lazy(() => import("./Pages/User/UserSignupPage"));
const UserLoginPage = lazy(() => import("./Pages/User/UserLoginPage"));
const AdminLoginPage = lazy(() => import("./Pages/Admin/AdminLoginPage"));
const AdminDashboard = lazy(() => import("./Pages/Admin/AdminDashboard"));
const AdminUserListing = lazy(() => import("./Pages/Admin/AdminUserListing"));
const AdminMechListing = lazy(() => import("./Pages/Admin/AdminMechListing"));
const AdminServices = lazy(() => import("./Pages/Admin/AdminServices"));
const NewService = lazy(() => import("./Pages/Admin/NewService"));

const AdminDeviceListing = lazy(
  () => import("./Pages/Admin/AdminDeviceListing")
);
const EditServices = lazy(() => import("./Pages/Admin/EditService"));
const Service = lazy(() => import("./Pages/User/Service"));
const AddNewDevice = lazy(() => import("./components/Admin/AddNewDevice"));

const MechanicLoginPage = lazy(
  () => import("./Pages/Mechanic/MechanicLoginPage")
);
const MechanicHomePage = lazy(
  () => import("./Pages/Mechanic/MechanicHomePage")
);
const MechanicSignupPage = lazy(
  () => import("./Pages/Mechanic/MechanicSignupPage")
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
            <Route path="otp-page" element={<UserOtpPage />} />
            <Route path="/user/forget-password" element={<ForgetPassword />} />
          </Route>

          <Route path="" element={<UserLoggedIn />}>
            <Route path="/user/homepage" element={<UserHomePage />} />
          </Route>

          {/** new User layout */}
          <Route path="/user" element={<UserLoggedIn />}>
            <Route path="/user" element={<UserLayout />}>
              <Route path="/user/account" element={<Profile />} />
              <Route path="/user/address" element={<Address />} />
              <Route path="/user/history" element={<History />} />
              <Route path="/user/payment" element={<Payments />} />
              <Route path="/user/queue" element={<Queue/>}/>
              <Route path="/user/AddAddress" element={<AddAddress />} />
              <Route path="/user/showAllAddress" element={<AllAddress />} />
              <Route path="/user/editAddress/:id" element={<EditAddress />} />
              <Route path="/user/service/:id" element={<Service />} />
            </Route>
          </Route>

          {/*Admin Routes*/}
          <Route path="/admin" element={<AdminLoggedOut />}>
            <Route path="/admin/login" element={<AdminLoginPage />} />
          </Route>

          <Route path="/admin" element={<AdminLoggedIn />}>
            <Route path="/admin" element={<Layout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUserListing />} />
              <Route path="/admin/mech" element={<AdminMechListing />} />
              <Route path="/admin/devices" element={<AdminDeviceListing />} />
              <Route path="/admin/services" element={<AdminServices />} />
              <Route path="/admin/addNewService" element={<NewService />} />
              <Route path="/admin/editService/:id" element={<EditServices />} />
              <Route path="/admin/addNewDevice" element={<AddNewDevice />} />
            </Route>
          </Route>

          {/*Mechanic Routes*/}
          <Route path="" element={<MechLoggedOut />}>
            <Route path="/mech/login" element={<MechanicLoginPage />} />
            <Route path="/mech/signuppage" element={<MechanicSignupPage />} />
            <Route path="/mech/veryfy-otp" element={<MechOtpPage />} />
            <Route
              path="/mech/forgot-password"
              element={<ForgetPasswordForMech />}
            />
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
