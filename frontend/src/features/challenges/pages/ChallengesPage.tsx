import ChallengeProgress from "../components/ChallengeProgress";
import { sampleChallenges } from "../data/sampleChallenges";
import { NavBar } from "@/components/layout/NavBar";
import ChallengeTable from "../components/ChallengeTable";

export default function ChallengesPage() {
  return (
    <>
      <NavBar type="UserNavBar" />
      <main className="mx-auto flex w-full max-w-page flex-col gap-8 px-gutter py-8 sm:py-12">
        <header className="space-y-4 border-b border-border pb-8">
          <h1 className="text-3xl font-extrabold uppercase leading-tight tracking-ui text-foreground sm:text-5xl">
            Choose your next{" "}
            <span className="block text-accent">challenge.</span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Pick a problem, test your approach, and keep building your skills.
          </p>
        </header>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold uppercase tracking-ui text-foreground">
            Your progress
          </h2>
          <ChallengeProgress challenges={sampleChallenges} />
        </div>

        <ChallengeTable challenges={sampleChallenges} />
      </main>
    </>
  );
}
