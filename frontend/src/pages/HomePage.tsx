import { NavBar } from "../components/layout/NavBar";
import { MatrixRain } from "../components/ui/MatrixRain";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../components/ui/Card";
import { Logo } from "../components/ui/Logo";
import {
  Users,
  Code,
  Trophy,
  Zap,
  ArrowRight,
  Flame,
  Terminal,
  Shield,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";

// Replace with real data from API later.
const stats = { playersOnline: 1200, activeMatches: 20 };

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
      {/* Terminal title bar */}
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
  // Array of features to keep your code clean and dry (DRY principle)
  const features = [
    {
      number: "01",
      icon: <Users className="text-accent size-4" />,
      title: "REAL-TIME MULTIPLAYER",
      description: "Compete against other developers in live coding battles.",
    },
    {
      number: "02",
      icon: <Code className="text-accent size-4" />,
      title: "CODING CHALLENGES",
      description: "Solve programming challenges under pressure.",
    },
    {
      number: "03",
      icon: <Trophy className="text-accent size-4" />,
      title: "LEADERBOARDS",
      description: "Climb the rankings and prove your skills.",
    },
    {
      number: "04",
      icon: <Zap className="text-accent size-4" />,
      title: "PLAYER PROGRESSION",
      description: "Track your performance and improve over time.",
    },
  ];

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      <Card variant="flat" className="flex flex-col">
        <CardHeader>
          {/* Fixed typo: item-center -> items-center */}
          <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-2 text-xs tracking-widest text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>01 WHY CODEARENNA?</span>
            </div>
            <span
              aria-hidden="true"
              className="hidden h-px w-20 bg-border sm:block"
            />
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          {/* Fixed responsiveness: stacked on mobile/tablet, side-by-side on lg screens */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h1 className="text-4xl font-extrabold uppercase leading-none tracking-ui text-foreground sm:text-6xl xl:text-7xl">
              BUILT FOR
              <span className="mt-2 block text-accent">COMPETITION.</span>
            </h1>
            <CardDescription className="max-w-md leading-relaxed sm:text-base text-muted-foreground">
              Everything you need to sharpen your skills, challenge your peers,
              and become the developer you were meant to be.
            </CardDescription>
          </div>

          {/* Feature Cards Grid with added gap-gutter (or gap-4) */}
          <div className="grid grid-cols-1 pt-8 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => (
              <Card
                key={feature.number}
                variant="solid"
                className="flex flex-col justify-between transition-all duration-300 hover:border-accent/60"
              >
                <CardHeader className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <span className="text-accent font-mono font-bold">
                    {feature.number}
                  </span>
                  {feature.icon}
                </CardHeader>
                <CardContent className="pt-4 flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="text-base font-bold tracking-ui text-foreground">
                      {feature.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className="flex justify-end items-end pt-4">
                    <ArrowRight className="text-muted-foreground size-4 transition-transform duration-300 hover:translate-x-1 hover:text-accent" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProtocolCard({ className = "" }: { className?: string }) {
  const steps = [
    {
      number: "01",
      step: "Create Account",
      description: "Initialize your profile and set up your developer persona.",
    },
    {
      number: "02",
      step: "Join a Match",
      description: "Select a queue, entry tier, or custom lobby.",
    },
    {
      number: "03",
      step: "Code & Compete",
      description: "Solve real-time problems against live opponents.",
    },
    {
      number: "04",
      step: "Climb Leaderboard",
      description: "Earn points, level up, and showcase your rank.",
    },
  ];

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      <Card variant="flat" className="flex flex-col">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-2 text-xs tracking-widest text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>02 THE PROTOCOL</span>
            </div>
            <span
              aria-hidden="true"
              className="hidden h-px w-20 bg-border sm:block"
            />
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h1 className="text-4xl font-extrabold uppercase leading-none tracking-ui text-foreground sm:text-6xl xl:text-7xl">
              ENTER THE
              <span className="mt-2 block text-accent">ARENA.</span>
            </h1>
            <CardDescription className="max-w-md leading-relaxed sm:text-base text-muted-foreground">
              Four steps between you and the top of the leaderboard.
            </CardDescription>
          </div>

          <div className="grid grid-cols-1 pt-8 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((item, index) => {
              const isLastStep = index === steps.length - 1;

              return (
                <Card
                  key={item.number}
                  variant="solid"
                  className="group flex flex-row items-center justify-between p-4 transition-all duration-300 hover:border-accent/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-accent text-xl font-bold font-mono tracking-ui">
                      {item.number}
                    </span>
                    <div className="flex flex-col justify-center">
                      <span className="text-muted-foreground text-[10px] tracking-widest uppercase font-mono">
                        STEP {item.number}
                      </span>
                      <span className="text-foreground text-sm font-bold tracking-ui mt-0.5">
                        {item.step}
                      </span>
                    </div>
                  </div>

                  {!isLastStep && (
                    <div className="pl-2">
                      <ArrowRight className="text-muted-foreground size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent" />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function CtaCard({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full max-w-7xl mx-auto ${className}`}>
      <Card
        variant="flat"
        className="relative flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 text-center"
      >
        <CardHeader className="pb-4">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-mono tracking-widest text-muted-foreground ">
            <Flame className="size-3.5  text-muted-foreground" />
            <span>YOUR NEXT CHALLENGE AWAITS</span>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center max-w-2xl gap-6">
          <h1 className="text-4xl font-extrabold uppercase leading-tight tracking-ui text-foreground sm:text-6xl xl:text-7xl">
            READY TO ENTER
            <span className="mt-1 block text-accent">THE ARENA?</span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
            Create your account, initialize your developer persona, and take
            your spot on the live global leaderboard.
          </p>

          <div className="pt-4 w-full sm:w-auto">
            <Link to="/signup" className="w-full sm:w-auto inline-block">
              <Button
                size="lg"
                variant="solid"
                className="w-full sm:w-auto px-8 py-6 text-base tracking-ui font-bold"
              >
                <Terminal className="size-4 mr-2" />
                INITIALIZE REGISTRATION
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Footer({ className = "" }: { className?: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`w-full max-w-7xl mx-auto pt-12 pb-8 ${className}`}>
      <Card variant="flat" className="border-t border-border/80 bg-card/40 py-6">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
          {/* Brand Logo & Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <Logo />
            <span className="hidden sm:inline text-border">|</span>
            <span>&copy; {currentYear} CodeArena. All rights reserved.</span>
          </div>

          {/* Essential Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-accent transition-colors">
              Terms of Service
            </Link>
          </div>
        </CardContent>
      </Card>
    </footer>
  );
}

function HomePage() {
  return (
    <>
      <MatrixRain />
      <NavBar links={[]} homeHref="/" activePath="/" />

      <main className="mx-auto w-full max-w-page px-gutter py-12 lg:py-32 flex flex-col gap-12 lg:gap-48">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-stretch">
          <HeroCard />
          <TerminalCard />
        </div>

        <div>
          <FeatureShowcaseCard />
        </div>
        <div>
          <ProtocolCard />
        </div>
        <div>
          <CtaCard />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
