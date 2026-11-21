import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Bug, Home, RotateCcw, Terminal } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

const excuses = [
  "The page passed locally. Obviously.",
  "Someone named the route final_final_v2. We’re investigating.",
  "The semicolon escaped. The page went with it.",
  "We tried turning the URL off and on again. Still nothing.",
];

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [excuseIndex, setExcuseIndex] = useState(0);

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-size-[48px_48px] opacity-15"
      />

      <header className="relative mx-auto flex w-full max-w-page items-center justify-between gap-gutter px-gutter py-6">
        <Link to="/" aria-label="CodeArena home"><Logo /></Link>
        <span className="flex items-center gap-2 text-xs uppercase tracking-ui text-muted-foreground">
          <span aria-hidden="true" className="size-2 rounded-full bg-warning" />
          <span className="hidden sm:inline">Uncharted territory</span>
          <span className="sm:hidden">Lost?</span>
        </span>
      </header>

      <section aria-labelledby="not-found-title" className="relative mx-auto grid w-full max-w-page flex-1 content-center gap-10 px-gutter py-section lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="min-w-0">
          <p className="mb-5 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            Side quest unlocked: get lost
          </p>

          <div aria-hidden="true" className="flex items-center gap-2 text-[clamp(6rem,20vw,12rem)] font-extrabold leading-none tracking-tight text-accent sm:gap-4">
            <span>4</span>
            <span className="relative inline-flex items-center justify-center">
              <span className="opacity-20">0</span>
              <Bug className="absolute size-12 -rotate-12 sm:size-16" strokeWidth={1.5} />
            </span>
            <span>4</span>
          </div>

          <p className="mt-4 text-xs uppercase tracking-ui text-warning">Error 404 / page not found</p>
          <h1 id="not-found-title" className="mt-3 text-3xl font-extrabold uppercase leading-tight tracking-ui sm:text-5xl">
            You found a bug.
            <span className="block text-accent">Not a feature.</span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Nice exploration skills. Unfortunately, this route has fewer solutions
            than an infinite loop. Let’s get you back to an actual challenge.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => navigate("/", { replace: true })}>
              <Home aria-hidden="true" className="size-4" />
              Back to base
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Button>
            <Button size="lg" variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft aria-hidden="true" className="size-4" />
              Retrace my steps
            </Button>
          </div>
        </div>

        <Card variant="solid" corners padding="none" className="min-w-0 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Terminal aria-hidden="true" className="size-4 text-accent" />
              arena / incident.log
            </div>
            <span className="border border-warning/40 bg-warning/10 px-2 py-1 text-[10px] uppercase tracking-ui text-warning">Skill issue?</span>
          </div>

          <div className="space-y-6 p-5 text-xs leading-relaxed sm:p-8 sm:text-sm">
            <div className="space-y-2">
              <p><span aria-hidden="true" className="text-accent">$ </span>arena locate --page</p>
              <p className="text-muted-foreground">Searching the arena...</p>
              <p className="text-warning">[404] Page has left the match.</p>
            </div>

            <div className="border-l-2 border-border pl-4">
              <p className="text-muted-foreground">Official developer statement:</p>
              <p role="status" aria-live="polite" aria-atomic="true" className="mt-2 min-h-18 text-foreground sm:min-h-12">
                “{excuses[excuseIndex]}”
              </p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => setExcuseIndex((current) => (current + 1) % excuses.length)}>
                <RotateCcw aria-hidden="true" className="size-3.5" />
                Generate another excuse
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
              <span>Pages found: <span className="text-foreground">0</span></span>
              <span>XP lost: <span className="text-success">0</span></span>
              <span>Ego damage: <span className="text-warning">minimal</span></span>
            </div>
          </div>
        </Card>
      </section>

      <footer className="relative mx-auto w-full max-w-page px-gutter py-6 text-xs text-muted-foreground">
        <span className="text-accent">//</span> No rankings were harmed in the making of this detour.
      </footer>
    </main>
  );
}
