import { useId } from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Challenge } from "../types/challenge";
import { difficultyPresentation } from "../lib/difficulty";
import ChallengeDescription from "./ChallengeDescription";

type ChallengeProblemPanelProps = { challenge: Challenge };

export default function ChallengeProblemPanel({ challenge }: ChallengeProblemPanelProps) {
  const descriptionTitleId = useId();
  return (
    <Card
      variant="solid"
      className="flex min-h-0 min-w-0 flex-col lg:max-h-[85dvh]"
    >
      <header className="mb-6 shrink-0 space-y-3 border-b border-border pb-5">
        <div className="flex flex-wrap items-center gap-inline text-xs tracking-ui">
          <span
            className={`font-semibold uppercase ${difficultyPresentation[challenge.difficulty].textClassName}`}
          >
            <span className="sr-only">Difficulty: </span>
            {challenge.difficulty}
          </span>
          <span aria-hidden="true" className="text-muted-foreground">
            /
          </span>
          <span className="text-muted-foreground">{challenge.tags}</span>
          {challenge.solved && (
            <span className="inline-flex items-center gap-1.5 text-success">
              <Check aria-hidden="true" className="size-4" />
              Solved
            </span>
          )}
        </div>
        <h1 className="break-words text-2xl font-bold tracking-ui text-foreground">
          {challenge.title}
        </h1>
      </header>
      <div
        role="region"
        aria-labelledby={descriptionTitleId}
        tabIndex={0}
        className="min-h-0 flex-1 rounded-ui lg:overflow-y-auto lg:overscroll-contain lg:pr-3"
      >
        <h2 id={descriptionTitleId} className="sr-only">
          Problem statement
        </h2>
        <ChallengeDescription description={challenge.description} />
      </div>
    </Card>
  );
}
