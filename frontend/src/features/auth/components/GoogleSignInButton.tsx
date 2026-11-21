import { useRef, useState } from "react";
import { createAuthClient } from "better-auth/client";
import { Button } from "@/components/ui/Button";
import GoogleIcon from "@/assets/icons/google-icon.svg";

const authClient = createAuthClient();

type GoogleSignInButtonProps = {
  label: string;
  disabled?: boolean;
  onStart: () => void;
  onError: (message: string) => void;
  onLoadingChange: (loading: boolean) => void;
};

export function GoogleSignInButton({
  label,
  disabled = false,
  onStart,
  onError,
  onLoadingChange,
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);
  const pending = useRef(false);

  async function signIn() {
    if (pending.current || disabled) return;
    pending.current = true;
    setLoading(true);
    onLoadingChange(true);
    onStart();
    try {
      const { error } = await authClient.signIn.social({ provider: "google" });
      if (error) onError(error.message || "Unable to sign in with Google. Please try again.");
    } catch {
      onError("Unable to connect to Google sign-in. Please try again.");
    } finally {
      pending.current = false;
      setLoading(false);
      onLoadingChange(false);
    }
  }

  return (
    <Button type="button" variant="solid" size="lg" className="mt-2 w-full"
      onClick={signIn} loading={loading} disabled={disabled}>
      <img src={GoogleIcon} alt="" className="size-4" />
      {label}
    </Button>
  );
}
