import "./App.css";
import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import InstallPWA from "./components/PWA/InstallPWA";
import FallBackLoader from "./components/Common/FallBackLoader";
import { appRoutes } from "./routes";

function App() {
  const router = createBrowserRouter(appRoutes);

  return (
    <>
      <header>
        <InstallPWA />
      </header>

      <Toaster position="top-right" reverseOrder={false} />
      <Suspense fallback={<FallBackLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}

export default App;
