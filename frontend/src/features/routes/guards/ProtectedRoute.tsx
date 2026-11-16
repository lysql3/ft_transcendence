import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = false; // Replace with your authentication logic

export function ProtectedRoute() {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
