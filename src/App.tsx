import "./App.css";
import { Route, Routes } from "react-router-dom";
import UserHomePage from "./Pages/User/UserHomePage";
import UserSignupPage from "./Pages/User/UserSignupPage";
import UserLoginPage from "./Pages/User/UserLoginPage";

function App() {
  return (
    <>
      <Routes>
        {/* userRoutes */}
        <Route path="user/homepage" element={<UserHomePage />} />
        <Route path="/signup" element={<UserSignupPage />} />
        <Route path="/login" element={<UserLoginPage/>}/>
      </Routes>
    </>
  );
}

export default App;
