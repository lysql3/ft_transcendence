import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { NavBar } from "@/components/layout/NavBar";
import NotFoundPage from "@/pages/NotFoundPage";
import ChallengeWorkspace from "../components/ChallengeWorkspace";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { getProblem, ProblemApiError } from "../lib/problemApi";
import type { Challenge } from "../types/challenge";

export default function ChallengePage() {
  const { slug } = useParams();

  return slug ? <ChallengeDetail key={slug} slug={slug} /> : <NotFoundPage />;
}

function ChallengeDetail({ slug }: { slug: string }) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [error, setError] = useState<"missing" | "failed" | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    void getProblem(slug, controller.signal)
      .then((problem) => {
        if (!controller.signal.aborted) setChallenge(problem);
      })
      .catch((failure: unknown) => {
        if (controller.signal.aborted) return;

        setError(
          failure instanceof ProblemApiError && failure.status === 404
            ? "missing"
            : "failed",
        );
      });

    return () => controller.abort();
  }, [slug]);

  if (error === "missing") return <NotFoundPage />;

  return (
    <>
      <NavBar type="UserNavBar" />
      <main>
        <nav aria-label="Challenge navigation" className="px-gutter py-3">
          <Link
            to="/challenges"
            className="inline-flex items-center gap-2 rounded-ui border border-border px-control-x py-control-y text-xs font-semibold uppercase tracking-ui text-accent transition-colors duration-(--duration) ease-ui hover:border-accent hover:bg-accent/10"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to challenges
          </Link>
        </nav>
        {error === "failed" ? (
          <p role="alert" className="p-gutter">
            Unable to load this challenge. Refresh to try again.
          </p>
        ) : challenge === null ? (
          <Spinner label="Loading challenge" />
        ) : (
          <ChallengeWorkspace challenge={challenge} />
        )}
      </main>
    </>
  );
}
