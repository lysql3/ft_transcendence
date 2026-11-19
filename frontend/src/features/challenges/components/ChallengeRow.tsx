import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/cn";
import { Link } from "react-router-dom";
import { type Challenge } from "@/features/challenges/types/challenge";
import { Card } from "@/components/ui/Card";

const difficultyStyles: Record<Challenge["difficulty"], string> = {
  Easy: "text-success",
  Medium: "text-warning",
  Hard: "text-destructive",
};

export default function ChallengeRow({ challenge }: { challenge: Challenge }) {
  const StatusIcon = challenge.solved ? Check : Circle;
  const rate = challenge.solvingPercentage;
  const percentage =
    typeof rate === "number" && Number.isFinite(rate) && rate >= 0 && rate <= 1
      ? `${Math.round(rate * 100)}% solved`
      : "No data";

  return (
    <Card as="li" interactive variant="gradient" padding="none">
      <Link
        to={`/challenges/${challenge.id}`}
        className="grid grid-cols-[minmax(0,1fr)_6rem] items-center gap-x-4 gap-y-3 rounded-ui p-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_6rem]"
      >
        <h3 className="min-w-0 break-words text-sm font-semibold text-foreground">
          {challenge.title}
        </h3>

        <div className="justify-self-start">
          <span
            className={cn(
              "inline-flex rounded-ui px-2 py-1 text-xs font-medium",
              difficultyStyles[challenge.difficulty],
            )}
          >
            <span className="sr-only">Difficulty: </span>
            {challenge.difficulty}
          </span>
        </div>

        <div className="min-w-0">
          <span className="inline-flex max-w-full rounded-ui bg-secondary/40 px-2 py-1 text-xs text-muted-foreground">
            <span className="sr-only">Solving percentage: </span>
            {percentage}
          </span>
        </div>

        <span
          className={cn(
            "inline-flex items-center justify-self-start gap-2 whitespace-nowrap text-xs",
            challenge.solved ? "text-success" : "text-muted-foreground",
          )}
        >
          <StatusIcon aria-hidden="true" className="size-4 shrink-0" />
          {challenge.solved ? "Solved" : "To solve"}
        </span>
      </Link>
    </Card>
  );
}
