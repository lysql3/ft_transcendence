import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { NavBar } from "@/components/layout/NavBar";
import NotFoundPage from "@/pages/NotFoundPage";
import { sampleChallenges } from "../data/sampleChallenges";
import ChallengeWorkspace from "../components/ChallengeWorkspace";

export default function ChallengePage() {
  const { problemId } = useParams();
  const challenge = sampleChallenges.find((item) => String(item.id) === problemId);

  if (!challenge) return <NotFoundPage />;

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
        <ChallengeWorkspace challenge={challenge} />
      </main>
    </>
  );
}
