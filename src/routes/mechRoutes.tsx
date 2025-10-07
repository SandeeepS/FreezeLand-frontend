import { RouteObject } from "react-router-dom";
import MechLoggedIn from "../components/Mech/MechLoggedIn";
import MechLoggedOut from "../components/Mech/MechLoggedOut";
import MechLayOut from "../Pages/Mechanic/MechLayOut";
import VerifyMechanic from "../Pages/Mechanic/VerifyMechanic";
import AllWorksPage from "../Pages/Mechanic/Works/AllWorksPage";
import ComplaintDetailsPage from "../Pages/Mechanic/Works/ComplaintDetailsPage";
import MechQueue from "../Pages/Mechanic/Queue/MechQueue";
import ServiceHistory from "../Pages/Mechanic/ServiceHistory/ServiceHistory";
import ServiceDetails from "../Pages/Mechanic/ServiceHistory/ServiceDetails";
import React from "react";
import MainProfile from "../components/Common/Profile/MainProfile";
import { getImageUrl } from "../Api/mech";
import ErrorFallBack from "../components/Common/ErrorFallBack";

const MechanicLoginPage = React.lazy(
  () => import("../Pages/Mechanic/MechanicLoginPage")
);
const MechanicHomePage = React.lazy(
  () => import("../Pages/Mechanic/MechanicHomePage")
);
const MechanicSignupPage = React.lazy(
  () => import("../Pages/Mechanic/MechanicSignupPage")
);
const MechOtpPage = React.lazy(() => import("../Pages/Mechanic/MechOtpPage"));
const ForgetPasswordForMech = React.lazy(
  () => import("../Pages/Mechanic/ForgetPasswordForMech")
);

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
        errorElement: (
          <ErrorFallBack
            error={new Error("An unknown error occurred.")}
            resetErrorBoundary={() => window.location.reload()}
          />
        ),
        children: [
          {
            path: "profile",
            element: <MainProfile role="mech" getImage={getImageUrl} />,
          },
          { path: "verifyMechanic", element: <VerifyMechanic /> },
          { path: "allWorks", element: <AllWorksPage /> },
          { path: "complaintDetails/:id", element: <ComplaintDetailsPage /> },
          { path: "queue", element: <MechQueue /> },
          { path: "serviceHistory", element: <ServiceHistory /> },
          { path: "serviceDetails/:id", element: <ServiceDetails /> },
        ],
      },
    ],
  },
];
