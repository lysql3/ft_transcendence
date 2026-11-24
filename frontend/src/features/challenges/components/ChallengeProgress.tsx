import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Bar } from "@/components/ui/Bar";
import { cn } from "@/lib/cn";
import type { Challenge } from "../types/challenge";
import { challengeDifficulties, difficultyPresentation } from "../lib/difficulty";

type DifficultyProgressCardProps = {
  difficulty: Challenge["difficulty"];
  challenges: readonly Challenge[];
};

function DifficultyProgressCard({
  difficulty,
  challenges,
}: DifficultyProgressCardProps) {
  const { icon: Icon, textClassName, cardClassName, progressVariant } =
    difficultyPresentation[difficulty];
  const matchingChallenges = challenges.filter(
    (challenge) => challenge.difficulty === difficulty,
  );
  const total = matchingChallenges.length;
  const solved = matchingChallenges.filter((challenge) => challenge.solved).length;
  const percent = total > 0 ? Math.floor((solved / total) * 100) : 0;

  return (
    <Card variant="gradient" className={cn("min-w-0", cardClassName)}>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
        <div className="flex items-center gap-2">
          <Icon aria-hidden="true" className={`size-5 shrink-0 ${textClassName}`} />
          <h3
            className={`text-sm font-semibold uppercase tracking-ui ${textClassName}`}
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
          variant={progressVariant}
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

type ChallengeProgressProps = { challenges: readonly Challenge[] };

export default function ChallengeProgress({ challenges }: ChallengeProgressProps) {
  return (
    <section
      aria-label="Challenge progress by difficulty"
      className="grid grid-cols-1 gap-stack sm:grid-cols-3"
    >
      {challengeDifficulties.map((difficulty) => (
        <DifficultyProgressCard
          key={difficulty}
          difficulty={difficulty}
          challenges={challenges}
        />
      ))}
    </section>
  );
}
