import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Zap, Code, Brackets, type LucideIcon } from "lucide-react";
import { Bar } from "@/components/ui/Bar";
import { cn } from "@/lib/cn";
import type { Challenge } from "../types/challenge";

type StateCardProps = {
  difficulty: Challenge["difficulty"];
  totalChallenges?: number;
  solvedChallenges?: number;
  icon: LucideIcon;
  color: "text-success" | "text-warning" | "text-destructive";
  variant: "success" | "warning" | "danger";
};

const data: Record<string, StateCardProps> = {
  easy: {
    difficulty: "Easy",
    totalChallenges: 10,
    solvedChallenges: 5,
    icon: Brackets,
    color: "text-success",
    variant: "success",
  },
  medium: {
    difficulty: "Medium",
    totalChallenges: 10,
    solvedChallenges: 3,
    icon: Code,
    color: "text-warning",
    variant: "warning",
  },
  hard: {
    difficulty: "Hard",
    totalChallenges: 10,
    solvedChallenges: 1,
    icon: Zap,
    color: "text-destructive",
    variant: "danger",
  },
};

const difficultyStyles: Record<Challenge["difficulty"], string> = {
  Easy: "border-success/40 from-success/10",
  Medium: "border-warning/40 from-warning/10",
  Hard: "border-destructive/40 from-destructive/10",
};

function StateCard({
  difficulty,
  totalChallenges = 0,
  solvedChallenges = 0,
  icon: Icon,
  color,
  variant,
}: StateCardProps) {
  const total = Number.isFinite(totalChallenges)
    ? Math.max(0, Math.floor(totalChallenges))
    : 0;
  const solved = Number.isFinite(solvedChallenges)
    ? Math.min(total, Math.max(0, Math.floor(solvedChallenges)))
    : 0;
  const percent = total > 0 ? Math.floor((solved / total) * 100) : 0;

  return (
    <Card
      variant="gradient"
      className={cn("min-w-0", difficultyStyles[difficulty])}
    >
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
        <div className="flex items-center gap-2">
          <Icon aria-hidden="true" className={`size-5 shrink-0 ${color}`} />
          <h3
            className={`text-sm font-semibold uppercase tracking-ui ${color}`}
          >
            {difficulty}
          </h3>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">
          {total} {total === 1 ? "challenge" : "challenges"}
        </span>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tabular-nums">{solved}</span>
          <span className="text-xs text-muted-foreground">solved</span>
        </p>
        <Bar
          value={solved}
          max={total || 1}
          size="sm"
          variant={variant}
          glow={false}
          label="Progress"
          aria-label={`${difficulty} challenges solved`}
          valueText={`${solved} / ${total}`}
        />
        <p className="text-xs text-muted-foreground tabular-nums">
          {total === 0 ? "No challenges available yet" : `${percent}% complete`}
        </p>
      </CardContent>
    </Card>
  );
}

export default function ChallengesState() {
  return (
    <section
      aria-label="Challenge progress by difficulty"
      className="grid grid-cols-1 gap-stack sm:grid-cols-3"
    >
      {Object.values(data).map((props) => (
        <StateCard key={props.difficulty} {...props} />
      ))}
    </section>
  );
}
