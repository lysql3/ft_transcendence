import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { MatrixRain } from "@/components/ui/MatrixRain";
import { Button } from "@/components/ui/Button";

const RESEND_SECONDS = 30;

const linkClass =
  "text-accent underline underline-offset-4 transition-colors duration-(--duration) hover:text-accent/80";

export function ResetLinkSentPage() {
  // The forgot password form passes the email along: navigate("/forgot-password/sent", { state: { email } })
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;

  // The first email was just sent, so the resend button starts on cooldown.
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [sending, setSending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const handleResend = async () => {
    setSending(true);
    try {
      // TODO: call your "send reset link" API again here.
      setResent(true);
      setSecondsLeft(RESEND_SECONDS);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center px-gutter py-8">
      <MatrixRain />

      <Card
        variant="glass"
        padding="none"
        className="flex w-full max-w-2xl flex-col items-center p-8 text-center sm:p-12 md:p-16"
      >
        <CardHeader className="flex flex-col items-center gap-6">
          <span
            aria-hidden="true"
            className="flex size-16 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent shadow-glow"
          >
            <Mail className="size-10" />
          </span>

          <div className="flex items-center gap-2 text-xs tracking-widest text-muted-foreground">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)] animate-pulse"
            />
            <span>PASSWORD RESET REQUESTED</span>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6">
          <h1 className="text-4xl font-extrabold uppercase leading-none tracking-ui text-foreground sm:text-6xl xl:text-7xl">
            RESET LINK
            <span className="mt-2 block text-accent">SENT</span>
          </h1>

          {/* "If an account exists" on purpose: the page must not reveal which emails are registered. */}
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            If an account exists for{" "}
            {email ? (
              <span className="break-all font-bold text-foreground">
                {email}
              </span>
            ) : (
              "that email address"
            )}
            , we've sent a link to reset your password. Check your inbox and
            open it to choose a new one. The link expires after 30 minutes.
          </p>

          <div className="flex w-full flex-col items-center gap-4 pt-4">
            <Button
              size="lg"
              variant="outline"
              className="w-full px-8 font-bold sm:w-auto"
              loading={sending}
              disabled={secondsLeft > 0}
              onClick={handleResend}
            >
              {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend email"}
            </Button>

            {/* Announced to screen readers when the email is sent again */}
            <p role="status" className="min-h-4 text-xs text-accent">
              {resent ? "Reset link sent again." : ""}
            </p>
          </div>

          <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
            Didn't get it? Check your spam folder.{" "}
            <Link to="/forgot-password" className={linkClass}>
              Wrong email?
            </Link>{" "}
            <span aria-hidden="true">·</span>{" "}
            <Link to="/login" className={linkClass}>
              Back to login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
