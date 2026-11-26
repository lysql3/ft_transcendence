import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authClient } from "../../auth/lib/authClient";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { NavBar } from "@/components/layout/NavBar";

export function ProtectedRoute() {
  const { data: session, isPending, error, refetch } = authClient.useSession();
  const { pathname } = useLocation();

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

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <NavBar type="UserNavBar" />
      <div key={pathname} className="page-enter">
        <Outlet />
      </div>
    </>
  );
}
