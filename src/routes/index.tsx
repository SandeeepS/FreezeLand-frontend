import { userRoutes } from "./userRoutes";
import { adminRoutes } from "./adminRoutes";
import { mechRoutes } from "./mechRoutes";
import NotFound from "../components/Common/NotFound";

export const appRoutes = [
  ...userRoutes,
  ...adminRoutes,
  ...mechRoutes,
  { path: "*", element: <NotFound />, },
];
