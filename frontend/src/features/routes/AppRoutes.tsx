import { Routes, Route } from "react-router-dom";

import LoginPage from "@/features/auth/pages/LoginPage";
import SignInPage from "@/features/auth/pages/SignUpPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import ResetLinkSentPage from "@/features/auth/pages/ResetLinkSentPage";
import PasswordResetSuccessPage from "@/features/auth/pages/PasswordResetSuccessPage";

import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import ProfilePage from "@/pages/ProfilePage";

import { ProtectedRoute } from "./guards/ProtectedRoute";
import { GuestRoute } from "./guards/GuestRoute";
import { TokenGuard } from "./guards/TokenGuard";
import { ActionGuard } from "./guards/ActionGuard";
import { authClient } from "../auth/lib/authClient";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

function HomeRoute() {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  if (isPending) {
    return <Spinner label="Checking your session..." />;
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-stack p-gutter"
      >
        <p>Unable to check your session.</p>
        <Button onClick={() => void refetch()}>Try again</Button>
      </div>
    );
  }

  return session ? <Dashboard /> : <LandingPage />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />

      <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignInPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route element={<TokenGuard />}>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ActionGuard redirectTo="/forgot-password" />}>
        <Route path="/reset-link-sent" element={<ResetLinkSentPage />} />
      </Route>

      <Route element={<ActionGuard redirectTo="/login" />}>
        <Route
          path="/password-reset-success"
          element={<PasswordResetSuccessPage />}
        />
      </Route>
    </Routes>
  );
}
