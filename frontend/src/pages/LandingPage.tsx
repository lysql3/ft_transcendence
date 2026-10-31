import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Code,
  Flame,
  Terminal,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NavBar } from "@/components/layout/NavBar";
import { MatrixRain } from "@/components/ui/MatrixRain";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

/* ---------- Data (replace with API data later) ---------- */

const stats = { playersOnline: 1200, activeMatches: 20 };

const currentYear = new Date().getFullYear();

const features: {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    number: "01",
    icon: Users,
    title: "REAL-TIME MULTIPLAYER",
    description: "Compete against other developers in live coding battles.",
  },
  {
    number: "02",
    icon: Code,
    title: "CODING CHALLENGES",
    description: "Solve programming challenges under pressure.",
  },
  {
    number: "03",
    icon: Trophy,
    title: "LEADERBOARDS",
    description: "Climb the rankings and prove your skills.",
  },
  {
    number: "04",
    icon: Zap,
    title: "PLAYER PROGRESSION",
    description: "Track your performance and improve over time.",
  },
];

const steps = [
  { number: "01", step: "Create Account" },
  { number: "02", step: "Join a Match" },
  { number: "03", step: "Code & Compete" },
  { number: "04", step: "Climb Leaderboard" },
];

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-2 text-xs tracking-widest text-muted-foreground">
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="hidden h-px w-20 bg-border sm:block"
      />
    </div>
  );
}

function SectionHeading({
  title,
  accent,
  description,
}: {
  title: string;
  accent: string;
  description: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-gutter lg:flex-row lg:items-end">
      <h2 className="text-4xl font-extrabold uppercase leading-none tracking-ui text-foreground sm:text-6xl xl:text-7xl">
        {title}
        <span className="mt-2 block text-accent">{accent}</span>
      </h2>
      <CardDescription className="max-w-md leading-relaxed sm:text-base">
        {description}
      </CardDescription>
    </div>
  );
}

function HeroCard({ className = "" }: { className?: string }) {
  return (
    <Card variant="flat" className={`flex flex-col ${className}`}>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs tracking-widest text-muted-foreground">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)] animate-pulse"
            />
            <span>SYSTEM ONLINE</span>
          </div>
          <div className="flex items-center gap-inline">
            <span
              aria-hidden="true"
              className="hidden h-px w-10 bg-border sm:block"
            />
            <span>v1.0.0</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <h1 className="text-4xl font-extrabold uppercase leading-none tracking-ui text-foreground sm:text-6xl xl:text-7xl">
          CODE.
          <span className="mt-2 block text-accent">COMPETE.</span>
          <span className="mt-2 block text-foreground">CONQUER.</span>
        </h1>

        <CardDescription className="mt-6 max-w-lg leading-relaxed sm:text-base">
          A multiplayer coding arena where developers compete, solve challenges,
          and climb the leaderboard.
        </CardDescription>
      </CardContent>

      <CardFooter>
        <dl className="flex flex-wrap gap-x-8 gap-y-3 text-xs tracking-widest">
          <div>
            <dt className="text-muted-foreground">PLAYERS ONLINE</dt>
            <dd className="text-xl font-bold tabular-nums text-accent">
              {stats.playersOnline.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">ACTIVE MATCHES</dt>
            <dd className="text-xl font-bold tabular-nums text-accent">
              {stats.activeMatches.toLocaleString()}
            </dd>
          </div>
        </dl>
      </CardFooter>
    </Card>
  );
}

const TerminalCard = ({ className = "" }: { className?: string }) => {
  return (
    <Card variant="solid" corners className={`flex flex-col ${className}`}>
      <CardHeader className="mb-0 flex flex-row items-center justify-between border-b border-border/60 pb-3">
        <div aria-hidden="true" className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-destructive/80" />
          <span className="size-3 rounded-full bg-warning/80" />
          <span className="size-3 rounded-full bg-success/80" />
        </div>
        <span className="text-xs tracking-widest text-muted-foreground">
          codearena@terminal:~
        </span>
        <div aria-hidden="true" className="w-10" />
      </CardHeader>

      <CardContent className="flex-1 overflow-x-auto pt-4 text-xs leading-relaxed sm:text-sm">
        <div className="flex flex-col gap-1.5 text-foreground">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span aria-hidden="true">$</span>
            <span className="text-foreground">
              codearena init --mode=multiplayer
            </span>
          </div>

          <div className="pl-4 text-accent/80">
            [+] Initializing secure WebSocket tunnel...{" "}
            <span className="text-accent">[OK]</span>
          </div>
          <div className="pl-4 text-accent/80">
            [+] Loading container environment...{" "}
            <span className="text-accent">[READY]</span>
          </div>

          <div className="mt-2 text-muted-foreground">
            <span className="text-accent">const</span> arena ={" "}
            <span className="text-accent">new</span> CodeArena(&#123;
          </div>
          <div className="pl-6 text-muted-foreground">
            status: <span className="text-foreground">"live"</span>,
          </div>
          <div className="pl-6 text-muted-foreground">
            difficulty: <span className="text-foreground">"hardcore"</span>,
          </div>
          <div className="text-muted-foreground">&#125;);</div>

          <div className="mt-2 flex items-center gap-2 text-accent">
            <span aria-hidden="true">&gt;</span>
            <span className="animate-pulse">Awaiting player connection...</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function FeatureShowcaseCard({ className = "" }: { className?: string }) {
  return (
    <Card as="section" variant="flat" className={`flex flex-col ${className}`}>
      <CardHeader>
        <SectionLabel>01 WHY CODEARENA?</SectionLabel>
      </CardHeader>

      <CardContent className="flex-1">
        <SectionHeading
          title="BUILT FOR"
          accent="COMPETITION."
          description="Everything you need to sharpen your skills, challenge your peers, and become the developer you were meant to be."
        />

        <div className="grid grid-cols-1 gap-stack pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ number, icon: Icon, title, description }) => (
            <Card
              key={number}
              variant="solid"
              className="group flex flex-col justify-between hover:border-accent/60"
            >
              <CardHeader className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                <span className="font-bold text-accent">{number}</span>
                <Icon aria-hidden="true" className="size-4 text-accent" />
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between pt-4">
                <div>
                  <h3 className="text-base font-bold tracking-ui text-foreground">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
                <div className="flex items-end justify-end pt-4">
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 text-muted-foreground transition-[transform,color] duration-(--duration) ease-ui group-hover:translate-x-1 group-hover:text-accent"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ProtocolCard({ className = "" }: { className?: string }) {
  return (
    <Card as="section" variant="flat" className={`flex flex-col ${className}`}>
      <CardHeader>
        <SectionLabel>02 THE PROTOCOL</SectionLabel>
      </CardHeader>

      <CardContent className="flex-1">
        <SectionHeading
          title="ENTER THE"
          accent="ARENA."
          description="Four steps between you and the top of the leaderboard."
        />

        <div className="grid grid-cols-1 gap-stack pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <Card
              key={item.number}
              variant="solid"
              padding="sm"
              className="group flex flex-row items-center justify-between hover:border-accent/60"
            >
              <div className="flex items-center gap-inline">
                <span className="text-xl font-bold tracking-ui text-accent">
                  {item.number}
                </span>
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    STEP {item.number}
                  </span>
                  <span className="mt-0.5 text-sm font-bold tracking-ui text-foreground">
                    {item.step}
                  </span>
                </div>
              </div>

              {index < steps.length - 1 && (
                <ArrowRight
                  aria-hidden="true"
                  className="ml-2 size-4 text-muted-foreground transition-[transform,color] duration-(--duration) ease-ui group-hover:translate-x-1 group-hover:text-accent"
                />
              )}
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function CtaCard({ className = "" }: { className?: string }) {
  const navigate = useNavigate();

  return (
    <Card
      as="section"
      variant="flat"
      padding="none"
      className={`flex flex-col items-center justify-center p-8 text-center sm:p-12 md:p-16 ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs tracking-widest text-muted-foreground">
          <Flame aria-hidden="true" className="size-3.5" />
          <span>YOUR NEXT CHALLENGE AWAITS</span>
        </div>
      </CardHeader>

      <CardContent className="flex max-w-2xl flex-col items-center justify-center gap-6">
        <h2 className="text-4xl font-extrabold uppercase leading-tight tracking-ui text-foreground sm:text-6xl xl:text-7xl">
          READY TO ENTER
          <span className="mt-1 block text-accent">THE ARENA?</span>
        </h2>

        <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          Create your account, initialize your developer persona, and take your
          spot on the live global leaderboard.
        </p>

        <div className="w-full pt-4 sm:w-auto">
          <Button
            size="lg"
            className="w-full px-8 py-6 font-bold sm:w-auto"
            onClick={() => navigate("/signup")}
          >
            <Terminal aria-hidden="true" className="size-4" />
            INITIALIZE REGISTRATION
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Footer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`mx-auto w-full max-w-page px-gutter pb-8 pt-12 ${className}`}
    >
      <div className="flex flex-col items-center justify-between gap-gutter border-t border-border/80 bg-card/40 p-6 text-xs text-muted-foreground sm:flex-row">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
          <Logo />
          <span aria-hidden="true" className="hidden text-border sm:inline">
            |
          </span>
          <span>&copy; {currentYear} CodeArena. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/privacy"
            className="transition-colors duration-(--duration) hover:text-accent"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="transition-colors duration-(--duration) hover:text-accent"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}

function LandingPage() {
  return (
    <>
      <MatrixRain />
      <NavBar links={[]} homeHref="/" activePath="/" />

      <main className="mx-auto flex w-full max-w-page flex-col gap-section px-gutter py-section">
        <div className="grid grid-cols-1 items-stretch gap-gutter lg:grid-cols-2">
          <HeroCard />
          <TerminalCard />
        </div>

        <FeatureShowcaseCard />
        <ProtocolCard />
        <CtaCard />
      </main>

      <Footer />
    </>
  );
}

export default LandingPage;
