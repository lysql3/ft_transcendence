import LandingPage from "./pages/LandingPage";
import SignInPage from "@/features/auth/pages/SignUpPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResetPassword } from "@/features/auth/pages/ResetPasswordPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignInPage />} />
        <Route path="/password-reset" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
