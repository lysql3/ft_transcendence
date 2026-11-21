import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ActionGuardProps {
  redirectTo: string;
}

export function ActionGuard({ redirectTo }: ActionGuardProps) {
  const location = useLocation();
  const isAllowed = location.state?.allowed;

  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
