import { ArrowDown, ArrowDownUp, ArrowUp } from "lucide-react";
import type { ChallengeFilter } from "../types/challenge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import ChallengeRow from "./ChallengeRow";
import { useState, useRef, useEffect, useId } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { listProblems, type ProblemPage, type ProblemSort } from "../lib/problemApi";

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

const LOADING_DELAY_MS = 0;
const SEARCH_DEBOUNCE_MS = 500;

export default function ChallengeTable() {
  const titleId = useId();
  const resultsId = useId();
  const [filter, setFilter] = useState<ChallengeFilter | null>(null);
  const [searchInput, setSearchInput] = useState<string | null>(null);
  const [sort, setSort] = useState<ProblemSort | null>(null);
  const selectedTag = filter ?? "All";
  const search = searchInput?.trim() ?? "";
  const firstPageDelay = searchInput !== null
    ? SEARCH_DEBOUNCE_MS
    : filter !== null ? LOADING_DELAY_MS : 0;

  function toggleSort(by: ProblemSort["by"]) {
    setSort((current) => ({
      by,
      order: current?.by === by
        ? current.order === "asc" ? "desc" : "asc"
        : by === "solveRate" || by === "status" ? "desc" : "asc",
    }));
  }

  return (
    <Card as="section" aria-labelledby={titleId} variant="flat" padding="none">
      <h2
        id={titleId}
        className="mb-4 text-lg font-semibold uppercase tracking-ui text-foreground"
      >
        Challenge library
      </h2>
      <Input
        type="search"
        label="Search challenges"
        placeholder="Search by title"
        value={searchInput ?? ""}
        onChange={(event) => setSearchInput(event.target.value)}
        aria-controls={resultsId}
        wrapperClassName="mb-4 max-w-md"
      />
      <CardHeader className="flex flex-row flex-wrap items-center justify-start gap-inline space-y-0 border-b border-border pb-4">
        {challengeFilters.map((tag) => (
          <Button
            key={tag}
            size="sm"
            variant={selectedTag === tag ? "outline" : "ghost"}
            aria-pressed={selectedTag === tag}
            aria-controls={resultsId}
            onClick={() => {
              if (tag !== selectedTag) setFilter(tag);
            }}
          >
            {tag}
          </Button>
        ))}
      </CardHeader>
      <CardContent id={resultsId} className="flex flex-col gap-stack">
        <div className="grid grid-cols-[minmax(0,1fr)_6rem] items-center gap-x-4 px-4 text-xs uppercase tracking-ui text-muted-foreground sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_6rem]">
          <SortButton
            label="Title"
            order={sort?.by === "title" ? sort.order : undefined}
            onClick={() => toggleSort("title")}
          />
          <SortButton
            label="Difficulty"
            order={sort?.by === "difficulty" ? sort.order : undefined}
            onClick={() => toggleSort("difficulty")}
          />
          <SortButton
            label="Solve rate"
            order={sort?.by === "solveRate" ? sort.order : undefined}
            onClick={() => toggleSort("solveRate")}
          />
          <SortButton
            label="Status"
            order={sort?.by === "status" ? sort.order : undefined}
            onClick={() => toggleSort("status")}
          />
        </div>
        <ChallengeResults
          key={JSON.stringify([selectedTag, search, firstPageDelay, sort])}
          selectedTag={selectedTag}
          search={search}
          sort={sort}
          firstPageDelay={firstPageDelay}
          onClearFilter={() => setFilter("All")}
        />
      </CardContent>
    </Card>
  );
}

function SortButton({
  label,
  order,
  onClick,
}: {
  label: string;
  order?: ProblemSort["order"];
  onClick: () => void;
}) {
  const Icon = order === "asc" ? ArrowUp : order === "desc" ? ArrowDown : ArrowDownUp;

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 justify-self-start rounded-ui uppercase hover:text-accent aria-pressed:text-accent"
      aria-pressed={order !== undefined}
    >
      {label}
      <Icon aria-hidden="true" className="size-3 shrink-0" />
      {order && <span className="sr-only">{order === "asc" ? "Ascending" : "Descending"}</span>}
    </button>
  );
}

function ChallengeResults({
  selectedTag,
  search,
  sort,
  firstPageDelay,
  onClearFilter,
}: {
  selectedTag: ChallengeFilter;
  search: string;
  sort: ProblemSort | null;
  firstPageDelay: number;
  onClearFilter: () => void;
}) {
  const [results, setResults] = useState<ProblemPage | null>(null);
  const [request, setRequest] = useState<{ page: number; limit?: number }>({
    page: 1,
    limit: 5,
  });
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const hasMore =
    results !== null && results.page * results.limit < results.total;
  const loadingLabel = results ? "Loading more challenges" : "Loading challenges";

  useEffect(() => {
    const controller = new AbortController();
    const tag = selectedTag === "All" ? undefined : selectedTag;

    function loadPage() {
      void listProblems({ ...request, tag, search, sort }, controller.signal)
        .then((response) => {
          if (controller.signal.aborted) return;

          setResults((current) => ({
            ...response,
            items: [...(current?.items ?? []), ...response.items],
          }));
          setStatus("ready");
        })
        .catch(() => {
          if (!controller.signal.aborted) setStatus("error");
        });
    }

    let timer: number | undefined;
    const delay = request.page > 1 ? LOADING_DELAY_MS : firstPageDelay;
    if (delay > 0) {
      timer = window.setTimeout(loadPage, delay);
    } else {
      loadPage();
    }

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [request, selectedTag, search, sort, firstPageDelay]);

  useEffect(() => {
    const marker = loadMoreRef.current;
    if (!marker || !results || !hasMore || status !== "ready") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        observer.disconnect();
        setStatus("loading");
        setRequest({ page: results.page + 1, limit: results.limit });
      },
      { rootMargin: "10px" },
    );

    observer.observe(marker);
    return () => observer.disconnect();
  }, [results, hasMore, status]);

  return (
    <>
      {results && (
        <p
          role="status"
          aria-live="polite"
          className="text-xs text-muted-foreground tabular-nums"
        >
          Showing {results.items.length} of {results.total} challenges
          {selectedTag !== "All" && ` in ${selectedTag}`}
        </p>
      )}
      {results &&
        (results.items.length > 0 ? (
          <ul
            aria-label="Challenges"
            aria-busy={status === "loading"}
            className="flex flex-col gap-stack"
          >
            {results.items.map((challenge) => (
              <ChallengeRow key={challenge.id} challenge={challenge} />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-stack rounded-ui border border-border bg-card/20 px-gutter py-8 text-center">
            <p className="text-sm text-muted-foreground">
              {search
                ? "No challenges match your search."
                : selectedTag === "All"
                ? "No challenges found."
                : `No challenges found for ${selectedTag}.`}
            </p>
            {selectedTag !== "All" && (
              <Button variant="outline" onClick={onClearFilter}>
                Show all challenges
              </Button>
            )}
          </div>
        ))}
      {status === "loading" && (
        <div className="flex items-center justify-center gap-inline py-6 text-accent">
          <Spinner size="sm" label={loadingLabel} />
          <span aria-hidden="true" className="text-xs uppercase tracking-ui">
            {loadingLabel}…
          </span>
        </div>
      )}
      {status === "error" && (
        <div role="alert" className="flex flex-col items-start gap-stack">
          <p>Unable to load challenges.</p>
          <Button
            variant="outline"
            onClick={() => {
              setStatus("loading");
              setRequest({ ...request });
            }}
          >
            Try again
          </Button>
        </div>
      )}
      {hasMore && <div ref={loadMoreRef} aria-hidden="true" className="h-px" />}
    </>
  );
}
