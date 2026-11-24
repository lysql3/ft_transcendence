import { lazy, Suspense, useState, type CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { ResizeHandle } from "@/components/ui/ResizeHandle";
import type { Challenge } from "../types/challenge";
import ChallengeProblemPanel from "./ChallengeProblemPanel";

const ChallengeEditor = lazy(() => import("./ChallengeEditor"));

// Shared coding surface. Solo and PvP pages own their routing and mode-specific UI.
type ChallengeWorkspaceProps = { challenge: Challenge };

export default function ChallengeWorkspace({ challenge }: ChallengeWorkspaceProps) {
  const [descriptionWidth, setDescriptionWidth] = useState(50);

  function getDescriptionPixelsPerUnit(handle: HTMLButtonElement) {
    const container = handle.parentElement;
    if (!container) return 0;
    const styles = getComputedStyle(container);
    return (
      (container.clientWidth -
        parseFloat(styles.paddingLeft) -
        parseFloat(styles.paddingRight) -
        handle.offsetWidth) /
      100
    );
  }

  return (
    <Card
      variant="gradient"
      padding="none"
      className="grid w-full grid-cols-1 gap-gutter p-gutter lg:grid-cols-[var(--split-columns)] lg:gap-0"
      style={
        {
          "--split-columns": `${descriptionWidth}fr 1rem ${100 - descriptionWidth}fr`,
        } as CSSProperties
      }
    >
      <ChallengeProblemPanel challenge={challenge} />
      <ResizeHandle
        orientation="vertical"
        aria-label="Resize description and IDE panels"
        aria-valuetext={`${Math.round(descriptionWidth)}% description width`}
        value={descriptionWidth}
        min={30}
        max={70}
        step={2}
        onValueChange={setDescriptionWidth}
        getPixelsPerUnit={getDescriptionPixelsPerUnit}
        className="hidden lg:flex"
      />
      <Suspense
        fallback={
          <Card
            variant="solid"
            className="flex h-[85dvh] min-h-[32rem] items-center justify-center"
          >
            <Spinner label="Loading coding workspace" />
          </Card>
        }
      >
        <ChallengeEditor key={challenge.id} challenge={challenge} />
      </Suspense>
    </Card>
  );
}
