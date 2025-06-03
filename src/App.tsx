import "./App.css";
import { Suspense, lazy } from "react";
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
import Profile from "./components/User/Profile";
import Layout from "./components/Admin/Layout";
import Address from "./components/User/Address";
import History from "./components/User/History";
import Payments from "./components/User/Payments";
import AddAddress from "./components/User/AddAddress";
import AllAddress from "./components/User/AllAddress";
import { EditAddress } from "./components/User/EditAddress";
import UserLayout from "./Pages/User/UserLayout";
import Queue from "./components/User/Queue/Queue";
import NotFound from "./components/Common/NotFound";
import ProfileEdit from "./components/User/ProfileEdit";
import MechLayOut from "./Pages/Mechanic/MechLayOut";
import VerifyMechanic from "./Pages/Mechanic/VerifyMechanic";
import ComplaintDetail from "./components/User/Queue/ComplaintDetials/ComplaintDetail";
import AllWorksPage from "./Pages/Mechanic/Works/AllWorksPage";
import ComplaintDetailsPage from "./Pages/Mechanic/Works/ComplaintDetailsPage";
import MechQueue from "./Pages/Mechanic/Queue/MechQueue";
import MechanicProfile from "./components/Mech/Profile/MechanicProfile";
import MechanicEditProfile from "./components/Mech/Profile/MechanicEditProfile";
import VerifyMechanicByAdmin from "./components/Admin/Mechanic/VerifyMechanic/VerifyMechanicByAdmin";
import MechanicVerify from "./components/Admin/Mechanic/VerifyMechanic/MechanicVerify";
import PaymentSuccessPage from "./Pages/User/Payment/PaymentSuccessPage";
import AdminComplaintListing from "./Pages/Admin/Complaints/AdminComplaintListing";
import AdminCompliantDetailsPage from "./Pages/Admin/Complaints/AdminCompliantDetailsPage";
import ServiceHistory from "./Pages/Admin/ServiceHistory/ServiceHistory";
import InstallPWA from "./components/PWA/InstallPWA";
import MechAddress from "./components/Mech/Profile/MechAddress";
import MechAddAddress from "./components/Mech/Profile/MechAddAddress";
import MechAllAddress from "./components/Mech/Profile/MechAllAddress";
import MechEditAddress from "./components/Mech/Profile/MechEditAddress";
import MechanicForVerificationList from "./Pages/Admin/Mechanic/MechanicForVerificationList";
import SelectReportComponent from "./components/Admin/Reports/selectReportComponent";
import AllReportComponent from "./components/Admin/Reports/AllReportComponent";

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
      <header>
        <InstallPWA />
      </header>
      <Toaster position="top-right" reverseOrder={false} />
      <Suspense fallback={<div>...Loading</div>}>
        <Routes>
          {/* userRoutes */}
          <Route path="" element={<UserLoggedOut />}>
            <Route path="/signup" element={<UserSignupPage />} />
            <Route path="/login" element={<UserLoginPage />} />
            <Route path="otp-page/:id" element={<UserOtpPage />} />
            <Route path="/user/forget-password" element={<ForgetPassword />} />
          </Route>

          {/** new User layout */}
          <Route path="/user" element={<UserLoggedIn />}>
            <Route path="/user/homepage" element={<UserHomePage />} />

            <Route path="/user" element={<UserLayout />}>
              <Route path="/user/account" element={<Profile />} />
              <Route path="/user/address" element={<Address />} />
              <Route path="/user/history" element={<History />} />
              <Route path="/user/editProfile" element={<ProfileEdit />} />
              <Route path="/user/payment" element={<Payments />} />
              <Route path="/user/queue" element={<Queue />} />
              <Route path="/user/AddAddress" element={<AddAddress />} />
              <Route path="/user/showAllAddress" element={<AllAddress />} />
              <Route path="/user/editAddress/:id" element={<EditAddress />} />
              <Route path="/user/service/:id" element={<Service />} />
              <Route path="/user/registeredComplaintByUser/:id" element={<ComplaintDetail />}/>
              <Route path="/user/payment/success" element={<PaymentSuccessPage />}/>
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
              <Route path="/admin/verifyMechanic" element={<MechanicForVerificationList />}/>
              <Route path="/admin/mechanic/details/:id" element={<MechanicVerify />}/>
              <Route path="/admin/complaints" element={<AdminComplaintListing />} />
              <Route path="/admin/reports" element={<SelectReportComponent/>} />
              <Route path="/admin/showAllreports/:reportRole" element={<AllReportComponent/>}/>
              <Route path="/admin/viewMoreComplaintDetails/:id" element={<AdminCompliantDetailsPage />}/>
            </Route>
          </Route>

          {/*Mechanic Routes*/}
          <Route path="" element={<MechLoggedOut />}>
            <Route path="/mech/login" element={<MechanicLoginPage />} />
            <Route path="/mech/signuppage" element={<MechanicSignupPage />} />
            <Route path="/mech/veryfy-otp/:id" element={<MechOtpPage />} />
            <Route path="/mech/forgot-password" element={<ForgetPasswordForMech />}/>
          </Route>

          <Route path="" element={<MechLoggedIn />}>
            <Route path="/mech/homepage" element={<MechanicHomePage />} />
            <Route path="/mech" element={<MechLayOut />}>
              <Route path="/mech/verifyMechanic" element={<VerifyMechanic />} />
              <Route path="/mech/allWorks" element={<AllWorksPage />} />
              <Route path="/mech/complaintDetails/:id" element={<ComplaintDetailsPage />}/>
              <Route path="/mech/queue" element={<MechQueue />} />
              <Route path="/mech/profile" element={<MechanicProfile />} />
              <Route path="/mech/editProfile" element={<MechanicEditProfile />}/>
              <Route path="/mech/serviceHistory" element={<ServiceHistory />} />
              <Route path="/mech/mechAddress" element={<MechAddress />} />
              <Route path="/mech/AddAddress" element={<MechAddAddress />} />
              <Route path="/mech/showAllAddress" element={<MechAllAddress />} />
              <Route path="/mech/editAddress/:id" element={<MechEditAddress />}/>
            </Route>
          </Route>

          <Route path={"*"} element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
    // <>
    //    <LocationModal/>
    // </>
  );
}

export default App;
