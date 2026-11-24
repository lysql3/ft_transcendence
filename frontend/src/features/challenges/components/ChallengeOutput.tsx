import { useId } from "react";
import { Terminal } from "lucide-react";

type ChallengeOutputProps = {
  height: number;
};

export default function ChallengeOutput({ height }: ChallengeOutputProps) {
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      style={{ height }}
      className="flex shrink-0 flex-col border-t border-border bg-background"
    >
      <header className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-2">
        <Terminal aria-hidden="true" className="size-4 text-accent" />

        <h2
          id={titleId}
          className="text-xs font-semibold uppercase tracking-ui text-foreground"
        >
          Output
        </h2>
      </header>

      <div
        tabIndex={0}
        role="region"
        aria-label="Output contents"
        className="min-h-0 flex-1 overflow-auto overscroll-contain p-4 font-mono text-xs leading-6"
      >
        <p className="text-muted-foreground">
          <span aria-hidden="true" className="mr-2 text-accent">
            &gt;
          </span>
          Execution output will appear here.
        </p>
      </div>
    </section>
  );
}
