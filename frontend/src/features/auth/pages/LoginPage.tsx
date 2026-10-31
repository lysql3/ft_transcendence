import { LoginForm } from "@/features/auth/components/LoginForm";
import { MatrixRain } from "@/components/ui/MatrixRain";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";

function WelcomeBackCard() {
  return (
    <Card variant="solid" corners className="order-2 flex flex-col lg:order-1">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs tracking-widest text-muted-foreground">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)] animate-pulse"
            />
            <span>PLAYER AUTHENTICATION</span>
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
        <h1 className="text-4xl font-extrabold uppercase leading-none tracking-tight text-foreground sm:text-7xl">
          WELCOME
          <span className="mt-2 block text-accent">BACK.</span>
        </h1>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Log in to your account to continue climbing the leaderboard and
          dominating the arena.
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-3 text-xs tracking-widest">
          <div className="flex items-end gap-1 h-4" aria-hidden="true">
            <span className="w-1 bg-accent/40 h-1.5 rounded-ui" />
            <span className="w-1 bg-accent/60 h-2.5 rounded-ui" />
            <span className="w-1 bg-accent/80 h-3.5 rounded-ui" />
            <span className="w-1 bg-accent h-4 rounded-ui shadow-[0_0_8px_var(--accent)]" />
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

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-gutter py-8">
      <MatrixRain />
      <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-gutter lg:max-w-4xl lg:grid-cols-2">
        <WelcomeBackCard />
        <LoginForm className="order-1 lg:order-2" />
      </div>
    </main>
  );
}
