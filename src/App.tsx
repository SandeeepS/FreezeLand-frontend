import "./App.css";
import { Route, Routes } from "react-router-dom";
import UserHomePage from "./Pages/User/UserHomePage";
import UserSignupPage from "./Pages/User/UserSignupPage";

function App() {
  return (
    <>
      <Routes>
        {/* userRoutes */}
        <Route path="homepage" element={<UserHomePage />} />
        <Route path="SignUp" element={<UserSignupPage />} />
      </Routes>
    </>
  );
}

export default App;
