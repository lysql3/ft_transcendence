import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { MatrixRain } from "@/components/ui/MatrixRain";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

function RecoveryCard() {
  return (
    <Card variant="solid" corners className="order-2 flex flex-col lg:order-1">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs tracking-widest text-muted-foreground">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)] animate-pulse"
            />
            <span>ACCOUNT RECOVERY</span>
          </div>
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="hidden h-px w-10 bg-border sm:block"
            />
            <span>SECURE</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <h1 className="text-4xl uppercase font-extrabold leading-none tracking-tight text-foreground sm:text-7xl">
          RESET
          <span className="mt-2 block text-accent">ACCESS.</span>
        </h1>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Locked out of the arena? Enter your registered email and we'll send a
          secure link to restore your account.
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-3 text-xs tracking-widest">
          <div className="flex h-4 items-end gap-1" aria-hidden="true">
            <span className="h-1.5 w-1 rounded-ui bg-accent/40" />
            <span className="h-2.5 w-1 rounded-ui bg-accent/60" />
            <span className="h-3.5 w-1 rounded-ui bg-accent/80" />
            <span className="h-4 w-1 rounded-ui bg-accent shadow-[0_0_8px_var(--accent)]" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">ARENA ACCESS</span>
            <span className="font-bold text-accent text-shadow-glow">
              READY
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export function ForgotPasswordPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-gutter py-8">
      <MatrixRain />
      <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-gutter lg:max-w-4xl lg:grid-cols-2">
        <RecoveryCard />
        <ForgotPasswordForm className="order-1 lg:order-2" />
      </div>
    </main>
  );
}
