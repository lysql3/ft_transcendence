import { Routes, Route } from "react-router-dom";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignInPage from "@/features/auth/pages/SignUpPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import ResetLinkSentPage from "@/features/auth/pages/ResetLinkSentPage";
import VerifyEmailNoticePage from "@/features/auth/pages/VerifyEmailNoticePage";
import VerifySuccessPage from "@/features/auth/pages/VerifySuccessPage";
import PasswordResetSuccessPage from "@/features/auth/pages/PasswordResetSuccessPage";
import Dashboard from "@/pages/Dashboard";

import { ProtectedRoute } from "./guards/ProtectedRoute";
import { GuestRoute } from "./guards/GuestRoute";
import { TokenGuard } from "./guards/TokenGuard";
import { ActionGuard } from "./guards/ActionGuard";

const isAuthenticated = false; // Replace with your authentication logic

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Dashboard /> : <LandingPage />}
      />

      <Route element={<GuestRoute />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route element={<TokenGuard />}>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ActionGuard redirectTo="/forgot-password" />}>
        <Route path="/reset-link-sent" element={<ResetLinkSentPage />} />
      </Route>

      <Route element={<ActionGuard redirectTo="/signup" />}>
        <Route
          path="/verify-email-notice"
          element={<VerifyEmailNoticePage />}
        />
      </Route>

      <Route element={<ActionGuard redirectTo="/login" />}>
        <Route path="/verify-success" element={<VerifySuccessPage />} />
        <Route
          path="/password-reset-success"
          element={<PasswordResetSuccessPage />}
        />
      </Route>
    </Routes>
  );
}
