import type {
  Challenge,
  ChallengeFilter,
} from "@/features/challenges/types/challenge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import ChallengeRow from "./ChallengeRow";
import { useState, useRef, useEffect, useId } from "react";
import { Spinner } from "@/components/ui/Spinner";

const challengeFilters: ChallengeFilter[] = [
  "All",
  "Algorithms",
  "Data Structures",
  "Math",
  "Dynamic Programming",
  "Graph Theory",
  "Sorting",
  "Searching",
  "Greedy",
  "Backtracking",
  "Recursion",
];

const BATCH_SIZE = 5;

type ChallengeTableProps = { challenges: readonly Challenge[] };

export default function ChallengeTable({ challenges }: ChallengeTableProps) {
  const titleId = useId();
  const resultsId = useId();
  const [selectedTag, setSelectedTag] = useState<ChallengeFilter>("All");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const filteredChallenges =
    selectedTag === "All"
      ? challenges
      : challenges.filter((challenge) => challenge.tags === selectedTag);
  const visibleChallenges = filteredChallenges.slice(0, visibleCount);
  const hasMore = visibleCount < filteredChallenges.length;
  useEffect(() => {
    const marker = loadMoreRef.current;

    if (!marker || !hasMore) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (cancelled || !entry?.isIntersecting) return;

        observer.disconnect();
        setIsLoadingMore(true);

        timeoutId = setTimeout(() => {
          if (cancelled) return;

          setVisibleCount((current) =>
            Math.min(current + BATCH_SIZE, filteredChallenges.length),
          );

          setIsLoadingMore(false);
        }, 700);
      },
      { rootMargin: "10px" },
    );

    observer.observe(marker);

    return () => {
      cancelled = true;
      observer.disconnect();

      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [hasMore, visibleCount, filteredChallenges.length, selectedTag]);
  return (
    <Card
      as="section"
      aria-labelledby={titleId}
      variant="flat"
      padding="none"
    >
      <h2
        id={titleId}
        className="mb-4 text-lg font-semibold uppercase tracking-ui text-foreground"
      >
        Challenge library
      </h2>
      <CardHeader className="flex flex-row flex-wrap items-center justify-start gap-inline space-y-0 border-b border-border pb-4">
        {challengeFilters.map((tag) => (
          <Button
            key={tag}
            size="sm"
            variant={selectedTag === tag ? "outline" : "ghost"}
            aria-pressed={selectedTag === tag}
            aria-controls={resultsId}
            onClick={() => {
              if (selectedTag === tag) return;

              setSelectedTag(tag);
              setVisibleCount(BATCH_SIZE);
              setIsLoadingMore(false);
            }}
          >
            {tag}
          </Button>
        ))}
      </CardHeader>
      <CardContent id={resultsId} className="flex flex-col gap-stack">
        <p
          role="status"
          aria-live="polite"
          className="text-xs text-muted-foreground tabular-nums"
        >
          Showing {visibleChallenges.length} of {filteredChallenges.length}{" "}
          challenges
          {selectedTag !== "All" && ` in ${selectedTag}`}
        </p>
        {filteredChallenges.length > 0 ? (
          <>
            <div
              aria-hidden="true"
              className="hidden grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_6rem] gap-x-4 px-4 text-xs uppercase tracking-ui text-muted-foreground sm:grid"
            >
              <span>Challenge</span>
              <span className="px-2">Difficulty</span>
              <span className="px-2">Solve rate</span>
              <span>Status</span>
            </div>
            <ul
              aria-label="Challenges"
              aria-busy={isLoadingMore}
              className="flex flex-col gap-stack"
            >
              {visibleChallenges.map((challenge) => (
                <ChallengeRow key={challenge.id} challenge={challenge} />
              ))}
            </ul>
          </>
        ) : (
          <div className="flex flex-col items-center gap-stack rounded-ui border border-border bg-card/20 px-gutter py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No challenges found for {selectedTag}.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedTag("All");
                setVisibleCount(BATCH_SIZE);
                setIsLoadingMore(false);
              }}
            >
              Show all challenges
            </Button>
          </div>
        )}
        {isLoadingMore && (
          <div className="flex items-center justify-center gap-inline py-6 text-accent">
            <Spinner size="sm" label="Loading more challenges" />
            <span aria-hidden="true" className="text-xs uppercase tracking-ui">
              Loading more challenges…
            </span>
          </div>
        )}
        {hasMore && (
          <div ref={loadMoreRef} aria-hidden="true" className="h-px" />
        )}
      </CardContent>
    </Card>
  );
}
