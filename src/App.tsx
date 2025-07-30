import "./App.css";
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import InstallPWA from "./components/PWA/InstallPWA";
import FallBackLoader from "./components/Common/FallBackLoader";
import NotFound from "./components/Common/NotFound";

import AdminLoggedIn from "./components/Admin/AdminLoggedIn";
import AdminLoggedOut from "./components/Admin/AdminLoggedOut";
import MechLoggedIn from "./components/Mech/MechLoggedIn";
import MechLoggedOut from "./components/Mech/MechLoggedOut";
import UserLoggedIn from "./components/User/UserLoggedIn";
import UserLoggedOut from "./components/User/UserLoggedOut";

// User
import UserOtpPage from "./Pages/User/UserOtpPage";
import ForgetPassword from "./Pages/User/ForgetPassword";
import Profile from "./components/User/Profile";
import Address from "./components/User/Address";
import History from "./components/User/History";
import Payments from "./components/User/Payments";
import AddAddress from "./components/User/AddAddress";
import AllAddress from "./components/User/AllAddress";
import { EditAddress } from "./components/User/EditAddress";
import UserLayout from "./Pages/User/UserLayout";
import Queue from "./components/User/Queue/Queue";
import ProfileEdit from "./components/User/ProfileEdit";
import ComplaintDetail from "./components/User/Queue/ComplaintDetials/ComplaintDetail";
import UserServiceHistory from "./components/User/ServiceHistory/UserServiceHistory";

//Mechanic
import MechOtpPage from "./Pages/Mechanic/MechOtpPage";
import ForgetPasswordForMech from "./Pages/Mechanic/ForgetPasswordForMech";
import MechLayOut from "./Pages/Mechanic/MechLayOut";
import VerifyMechanic from "./Pages/Mechanic/VerifyMechanic";
import AllWorksPage from "./Pages/Mechanic/Works/AllWorksPage";
import ComplaintDetailsPage from "./Pages/Mechanic/Works/ComplaintDetailsPage";
import MechQueue from "./Pages/Mechanic/Queue/MechQueue";
import MechanicProfile from "./components/Mech/Profile/MechanicProfile";
import MechanicEditProfile from "./components/Mech/Profile/MechanicEditProfile";
import MechAddress from "./components/Mech/Profile/MechAddress";
import MechAddAddress from "./components/Mech/Profile/MechAddAddress";
import MechAllAddress from "./components/Mech/Profile/MechAllAddress";
import MechEditAddress from "./components/Mech/Profile/MechEditAddress";
import ServiceHistory from "./Pages/Mechanic/ServiceHistory/ServiceHistory";
import ServiceDetails from "./Pages/Mechanic/ServiceHistory/ServiceDetails";

//Admin
import Layout from "./components/Admin/Layout";
import MechanicVerify from "./components/Admin/Mechanic/VerifyMechanic/MechanicVerify";
import AdminComplaintListing from "./Pages/Admin/Complaints/AdminComplaintListing";
import AdminCompliantDetailsPage from "./Pages/Admin/Complaints/AdminCompliantDetailsPage";
import MechanicForVerificationList from "./Pages/Admin/Mechanic/MechanicForVerificationList";
import SelectReportComponent from "./components/Admin/Reports/SelectReportComponent";
import AllReportComponent from "./components/Admin/Reports/AllReportComponent";

const UserHomePage = lazy(() => import("./Pages/User/UserHomePage"));
const UserSignupPage = lazy(() => import("./Pages/User/UserSignupPage"));
const UserLoginPage = lazy(() => import("./Pages/User/UserLoginPage"));
const PaymentSuccessPage = lazy(() => import("./Pages/User/Payment/PaymentSuccessPage"));
const Service = lazy(() => import("./Pages/User/Service"));

const AdminLoginPage = lazy(() => import("./Pages/Admin/AdminLoginPage"));
const AdminDashboard = lazy(() => import("./Pages/Admin/AdminDashboard"));
const AdminUserListing = lazy(() => import("./Pages/Admin/AdminUserListing"));
const AdminMechListing = lazy(() => import("./Pages/Admin/AdminMechListing"));
const AdminDeviceListing = lazy(() => import("./Pages/Admin/AdminDeviceListing"));
const AdminServices = lazy(() => import("./Pages/Admin/AdminServices"));
const NewService = lazy(() => import("./Pages/Admin/NewService"));
const EditServices = lazy(() => import("./Pages/Admin/EditService"));
const AddNewDevice = lazy(() => import("./components/Admin/AddNewDevice"));

const MechanicLoginPage = lazy(() => import("./Pages/Mechanic/MechanicLoginPage"));
const MechanicHomePage = lazy(() => import("./Pages/Mechanic/MechanicHomePage"));
const MechanicSignupPage = lazy(() => import("./Pages/Mechanic/MechanicSignupPage"));

function App() {
  return (
    <>
      <header>
        <InstallPWA />
      </header>

      <Toaster position="top-right" reverseOrder={false} />

      <Suspense fallback={<FallBackLoader />}>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<UserLoggedOut />}>
            <Route path="signup" element={<UserSignupPage />} />
            <Route path="login" element={<UserLoginPage />} />
            <Route path="otp-page/:id" element={<UserOtpPage />} />
            <Route path="user/forget-password" element={<ForgetPassword />} />
          </Route>

          <Route path="/user" element={<UserLoggedIn />}>
            <Route index path="homepage" element={<UserHomePage />} />
            <Route path="" element={<UserLayout />}>
              <Route path="account" element={<Profile />} />
              <Route path="address" element={<Address />} />
              <Route path="history" element={<History />} />
              <Route path="editProfile" element={<ProfileEdit />} />
              <Route path="payment" element={<Payments />} />
              <Route path="queue" element={<Queue />} />
              <Route path="serviceHistory" element={<UserServiceHistory />} />
              <Route path="AddAddress" element={<AddAddress />} />
              <Route path="showAllAddress" element={<AllAddress />} />
              <Route path="editAddress/:id" element={<EditAddress />} />
              <Route path="service/:id" element={<Service />} />
              <Route path="registeredComplaintByUser/:id" element={<ComplaintDetail />} />
              <Route path="payment/success" element={<PaymentSuccessPage />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLoggedOut />}>
            <Route path="login" element={<AdminLoginPage />} />
          </Route>

          <Route path="/admin" element={<AdminLoggedIn />}>
            <Route path="" element={<Layout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUserListing />} />
              <Route path="mech" element={<AdminMechListing />} />
              <Route path="devices" element={<AdminDeviceListing />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="addNewService" element={<NewService />} />
              <Route path="editService/:id" element={<EditServices />} />
              <Route path="addNewDevice" element={<AddNewDevice />} />
              <Route path="verifyMechanic" element={<MechanicForVerificationList />} />
              <Route path="mechanic/details/:id" element={<MechanicVerify />} />
              <Route path="complaints" element={<AdminComplaintListing />} />
              <Route path="viewMoreComplaintDetails/:id" element={<AdminCompliantDetailsPage />} />
              <Route path="reports" element={<SelectReportComponent />} />
              <Route path="showAllreports/:reportRole" element={<AllReportComponent />} />
            </Route>
          </Route>

          {/* Mechanic Routes */}
          <Route path="/" element={<MechLoggedOut />}>
            <Route path="mech/login" element={<MechanicLoginPage />} />
            <Route path="mech/signuppage" element={<MechanicSignupPage />} />
            <Route path="mech/veryfy-otp/:id" element={<MechOtpPage />} />
            <Route path="mech/forgot-password" element={<ForgetPasswordForMech />} />
          </Route>

          <Route path="/mech" element={<MechLoggedIn />}>
            <Route path="homepage" element={<MechanicHomePage />} />
            <Route path="" element={<MechLayOut />}>
              <Route path="verifyMechanic" element={<VerifyMechanic />} />
              <Route path="allWorks" element={<AllWorksPage />} />
              <Route path="complaintDetails/:id" element={<ComplaintDetailsPage />} />
              <Route path="queue" element={<MechQueue />} />
              <Route path="profile" element={<MechanicProfile />} />
              <Route path="editProfile" element={<MechanicEditProfile />} />
              <Route path="serviceHistory" element={<ServiceHistory />} />
              <Route path="serviceDetails/:id" element={<ServiceDetails />} />
              <Route path="mechAddress" element={<MechAddress />} />
              <Route path="AddAddress" element={<MechAddAddress />} />
              <Route path="showAllAddress" element={<MechAllAddress />} />
              <Route path="editAddress/:id" element={<MechEditAddress />} />
            </Route>
          </Route>

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
