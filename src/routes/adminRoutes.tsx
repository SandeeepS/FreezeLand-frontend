import { RouteObject } from "react-router-dom";
import AdminLoggedIn from "../components/Admin/AdminLoggedIn";
import AdminLoggedOut from "../components/Admin/AdminLoggedOut";
import Layout from "../components/Admin/Layout";

import MechanicVerify from "../components/Admin/Mechanic/VerifyMechanic/MechanicVerify";
import AdminComplaintListing from "../Pages/Admin/Complaints/AdminComplaintListing";
import AdminCompliantDetailsPage from "../Pages/Admin/Complaints/AdminCompliantDetailsPage";
import MechanicForVerificationList from "../Pages/Admin/Mechanic/MechanicForVerificationList";
import SelectReportComponent from "../components/Admin/Reports/SelectReportComponent";
import AllReportComponent from "../components/Admin/Reports/AllReportComponent";
import React from "react";

const AdminLoginPage = React.lazy(() => import("../Pages/Admin/AdminLoginPage"));
const AdminDashboard = React.lazy(() => import("../Pages/Admin/AdminDashboard"));
const AdminUserListing = React.lazy(() => import("../Pages/Admin/AdminUserListing"));
const AdminMechListing = React.lazy(() => import("../Pages/Admin/AdminMechListing"));
const AdminDeviceListing = React.lazy(() => import("../Pages/Admin/AdminDeviceListing"));
const AdminServices = React.lazy(() => import("../Pages/Admin/AdminServices"));
const NewService = React.lazy(() => import("../Pages/Admin/NewService"));
const EditServices = React.lazy(() => import("../Pages/Admin/EditService"));
const AddNewDevice = React.lazy(() => import("../components/Admin/AddNewDevice"));

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLoggedOut />,
    children: [{ path: "login", element: <AdminLoginPage /> }],
  },
  {
    path: "/admin",
    element: <AdminLoggedIn />,
    children: [
      {
        path: "",
        element: <Layout />,
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "users", element: <AdminUserListing /> },
          { path: "mech", element: <AdminMechListing /> },
          { path: "devices", element: <AdminDeviceListing /> },
          { path: "services", element: <AdminServices /> },
          { path: "addNewService", element: <NewService /> },
          { path: "editService/:id", element: <EditServices /> },
          { path: "addNewDevice", element: <AddNewDevice /> },
          { path: "verifyMechanic", element: <MechanicForVerificationList /> },
          { path: "mechanic/details/:id", element: <MechanicVerify /> },
          { path: "complaints", element: <AdminComplaintListing /> },
          { path: "viewMoreComplaintDetails/:id", element: <AdminCompliantDetailsPage /> },
          { path: "reports", element: <SelectReportComponent /> },
          { path: "showAllreports/:reportRole", element: <AllReportComponent /> },
        ],
      },
    ],
  },
];
