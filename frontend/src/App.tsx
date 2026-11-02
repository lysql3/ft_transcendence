import LandingPage from "./pages/LandingPage";
import SignInPage from "@/features/auth/pages/SignUpPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";
import { PasswordResetSuccessPage } from "@/features/auth/pages/PasswordResetSuccessPage";
import { VerifyEmailNoticePage } from "@/features/auth/pages/VerifyEmailNoticePage";
import { ResetLinkSentPage } from "@/features/auth/pages/ResetLinkSentPage";
import { VerifySuccessPage } from "@/features/auth/pages/VerifySuccessPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/reset-password-success"
          element={<PasswordResetSuccessPage />}
        />
        <Route path="/verify-email" element={<VerifyEmailNoticePage />} />
        <Route path="/reset-link-sent" element={<ResetLinkSentPage />} />
        <Route path="/verify-success" element={<VerifySuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
