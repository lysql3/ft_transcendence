import { SignUpForm } from "@/features/auth/components/SignUpForm";
import { MatrixRain } from "@/components/ui/MatrixRain";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";

const features = [
  "Build your player profile",
  "Enter your first match",
  "Climb the leaderboard",
];

function JoinCard() {
  return (
    <Card variant="solid" corners className="order-2 flex flex-col lg:order-1">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs tracking-widest text-muted-foreground">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)] animate-pulse"
            />
            <span>NEW PLAYER REGISTRATION</span>
          </div>
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="hidden h-px w-10 bg-border sm:block"
            />
            <span>v1.0.0</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <h1 className="text-4xl font-extrabold uppercase leading-none tracking-tight text-foreground sm:text-7xl">
          JOIN THE
          <span className="mt-2 block text-accent">ARENA.</span>
        </h1>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Create your player profile, enter your first match, and start climbing
          the leaderboard.
        </p>
      </CardContent>

      <CardFooter>
        <ul className="flex flex-col gap-4 text-xs text-muted-foreground sm:text-sm">
          {features.map((text) => (
            <li key={text} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-5 shrink-0 items-center justify-center rounded-ui border border-accent/40 bg-accent/10 text-accent shadow-glow"
              >
                ✓
              </span>
              <span className="leading-tight">{text}</span>
            </li>
          ))}
        </ul>
      </CardFooter>
    </Card>
  );
}

export default function SignUpPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-gutter py-8">
      <MatrixRain />
      <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-gutter lg:max-w-4xl lg:grid-cols-2">
        <JoinCard />
        <SignUpForm className="order-1 lg:order-2" />
      </div>
    </main>
  );
}
