import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = false; // Replace with your authentication logic

export function GuestRoute() {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
