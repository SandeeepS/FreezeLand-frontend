import "./App.css";
import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import InstallPWA from "./components/PWA/InstallPWA";
import FallBackLoader from "./components/Common/FallBackLoader";
import { appRoutes } from "./routes";

function App() {
  const element = useRoutes(appRoutes);
  
  return (
    <>
      <header>
        <InstallPWA />
      </header>

      <Toaster position="top-right" reverseOrder={false} />
      <Suspense fallback={<FallBackLoader />}>{element}</Suspense>
    </>
  );
}

export default App;
