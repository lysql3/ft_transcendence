import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import { authClient } from "../../auth/lib/authClient";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";

export function GuestRoute() {
  const { data: session, isPending, error, refetch } = authClient.useSession();
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  if (!hasCheckedSession && !isPending && !error) {
    setHasCheckedSession(true);
  }

  if (isPending && !hasCheckedSession) {
    return <Spinner label="Checking your session..." />;
  }

  if (error && !hasCheckedSession) {
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

  return (
    <>
      {error && (
        <div role="alert" className="flex flex-wrap items-center justify-center gap-inline p-gutter text-sm text-destructive">
          <p>Unable to refresh your session. Your form has been kept.</p>
          <Button onClick={() => void refetch()}>Try again</Button>
        </div>
      )}
      <Outlet />
    </>
  );
}
