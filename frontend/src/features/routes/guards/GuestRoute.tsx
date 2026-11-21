import { Navigate, Outlet } from "react-router-dom";
import { authClient } from "../../auth/lib/authClient";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";

export function GuestRoute() {
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

  if (session) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
