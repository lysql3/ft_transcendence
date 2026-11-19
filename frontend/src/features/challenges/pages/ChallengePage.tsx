import { Link, useParams } from "react-router-dom";
import { NavBar } from "@/components/layout/NavBar";
import { Card } from "@/components/ui/Card";
import NotFoundPage from "@/pages/NotFoundPage";
import { sampleChallenges } from "../data/sampleChallenges";

export default function ChallengePage() {
  const { problemId } = useParams();
  const challenge = sampleChallenges.find(
    (item) => String(item.id) === problemId,
  );

  if (!challenge) return <NotFoundPage />;

  return (
    <>
      <NavBar type="UserNavBar" />
      <main className="mx-auto flex w-full max-w-page flex-col gap-stack px-gutter py-8">
        <Link
          to="/challenges"
          className="w-fit text-sm text-accent underline underline-offset-4"
        >
          Back to challenges
        </Link>
        <Card as="article" variant="gradient" className="space-y-4">
          <p className="text-xs uppercase tracking-ui text-muted-foreground">
            {challenge.difficulty} / {challenge.tags}
          </p>
          <h1 className="break-words text-2xl font-bold tracking-ui text-foreground sm:text-3xl">
            {challenge.title}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {challenge.description}
          </p>
          <p className="text-xs text-muted-foreground">
            {challenge.solved
              ? "You have solved this challenge."
              : "You haven’t solved this challenge yet."}
          </p>
        </Card>
      </main>
    </>
  );
}
