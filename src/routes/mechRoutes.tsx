import { RouteObject } from "react-router-dom";
import MechLoggedIn from "../components/Mech/MechLoggedIn";
import MechLoggedOut from "../components/Mech/MechLoggedOut";
import MechLayOut from "../Pages/Mechanic/MechLayOut";

import VerifyMechanic from "../Pages/Mechanic/VerifyMechanic";
import AllWorksPage from "../Pages/Mechanic/Works/AllWorksPage";
import ComplaintDetailsPage from "../Pages/Mechanic/Works/ComplaintDetailsPage";
import MechQueue from "../Pages/Mechanic/Queue/MechQueue";
import MechanicProfile from "../components/Mech/Profile/MechanicProfile";
import MechanicEditProfile from "../components/Mech/Profile/MechanicEditProfile";
import MechAddress from "../components/Mech/Profile/MechAddress";
import MechAddAddress from "../components/Mech/Profile/MechAddAddress";
import MechAllAddress from "../components/Mech/Profile/MechAllAddress";
import MechEditAddress from "../components/Mech/Profile/MechEditAddress";
import ServiceHistory from "../Pages/Mechanic/ServiceHistory/ServiceHistory";
import ServiceDetails from "../Pages/Mechanic/ServiceHistory/ServiceDetails";
import React from "react";

const MechanicLoginPage = React.lazy(() => import("../Pages/Mechanic/MechanicLoginPage"));
const MechanicHomePage = React.lazy(() => import("../Pages/Mechanic/MechanicHomePage"));
const MechanicSignupPage = React.lazy(() => import("../Pages/Mechanic/MechanicSignupPage"));
const MechOtpPage = React.lazy(() => import("../Pages/Mechanic/MechOtpPage"));
const ForgetPasswordForMech = React.lazy(() => import("../Pages/Mechanic/ForgetPasswordForMech"));

export const mechRoutes: RouteObject[] = [
  {
    path: "/",
    element: <MechLoggedOut />,
    children: [
      { path: "mech/login", element: <MechanicLoginPage /> },
      { path: "mech/signuppage", element: <MechanicSignupPage /> },
      { path: "mech/veryfy-otp/:id", element: <MechOtpPage /> },
      { path: "mech/forgot-password", element: <ForgetPasswordForMech /> },
    ],
  },
  {
    path: "/mech",
    element: <MechLoggedIn />,
    children: [
      { path: "homepage", element: <MechanicHomePage /> },
      {
        path: "",
        element: <MechLayOut />,
        children: [
          { path: "verifyMechanic", element: <VerifyMechanic /> },
          { path: "allWorks", element: <AllWorksPage /> },
          { path: "complaintDetails/:id", element: <ComplaintDetailsPage /> },
          { path: "queue", element: <MechQueue /> },
          { path: "profile", element: <MechanicProfile /> },
          { path: "editProfile", element: <MechanicEditProfile /> },
          { path: "serviceHistory", element: <ServiceHistory /> },
          { path: "serviceDetails/:id", element: <ServiceDetails /> },
          { path: "mechAddress", element: <MechAddress /> },
          { path: "AddAddress", element: <MechAddAddress /> },
          { path: "showAllAddress", element: <MechAllAddress /> },
          { path: "editAddress/:id", element: <MechEditAddress /> },
        ],
      },
    ],
  },
];
