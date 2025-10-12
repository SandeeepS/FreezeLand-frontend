import { RouteObject } from "react-router-dom";
import UserLoggedIn from "../components/User/UserLoggedIn";
import UserLoggedOut from "../components/User/UserLoggedOut";
import UserLayout from "../Pages/User/UserLayout";
import History from "../components/User/History";
import Payments from "../components/User/Payments";
import Queue from "../components/User/Queue/Queue";
import ComplaintDetail from "../components/User/Queue/ComplaintDetials/ComplaintDetail";
import UserServiceHistory from "../components/User/ServiceHistory/UserServiceHistory";
import ServiceOverview from "../Pages/User/Service/ServiceOverview";
import React from "react";
import MainProfile from "../components/Common/Profile/MainProfile";
import { getImageUrl } from "../Api/user";
import ErrorFallBack from "../components/Common/ErrorFallBack";

const UserHomePage = React.lazy(() => import("../Pages/User/UserHomePage"));
const UserSignupPage = React.lazy(() => import("../Pages/User/UserSignupPage"));
const UserLoginPage = React.lazy(() => import("../Pages/User/UserLoginPage"));
const UserOtpPage = React.lazy(() => import("../Pages/User/UserOtpPage"));
const ForgetPassword = React.lazy(() => import("../Pages/User/ForgetPassword"));
const PaymentSuccessPage = React.lazy(
  () => import("../Pages/User/Payment/PaymentSuccessPage")
);
const Service = React.lazy(() => import("../Pages/User/Service"));

export const userRoutes: RouteObject[] = [
  { index: true, path: "/", element: <UserHomePage /> },
  { path: "/user/serviceDetails/:id", element: <ServiceOverview /> },

  {
    path: "/auth",
    element: <UserLoggedOut />,
    children: [
      { path: "signup", element: <UserSignupPage /> },
      { path: "login", element: <UserLoginPage /> },
      { path: "otp-page/:id", element: <UserOtpPage /> },
      { path: "user/forget-password", element: <ForgetPassword /> },
    ],
  },
  {
    path: "/user",
    element: <UserLoggedIn />,
    children: [
      {
        path: "",
        element: <UserLayout />,
        errorElement: (
          <ErrorFallBack
            error={new Error("An unknown error occurred.")}
            resetErrorBoundary={() => window.location.reload()}
          />
        ),
        children: [
          {
            path: "profile",
            element: <MainProfile role="user" getImage={getImageUrl} />,
          },
          { path: "history", element: <History /> },
          { path: "payment", element: <Payments /> },
          { path: "queue", element: <Queue /> },
          { path: "serviceHistory", element: <UserServiceHistory /> },
          { path: "service/:id", element: <Service /> },
          {
            path: "registeredComplaintByUser/:id",
            element: <ComplaintDetail />,
          },
          { path: "payment/success", element: <PaymentSuccessPage /> },
        ],
      },
    ],
  },
];
