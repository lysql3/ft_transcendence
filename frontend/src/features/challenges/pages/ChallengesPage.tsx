import ChallengeTable from "../components/ChallengeTable";

export default function ChallengesPage() {
  return (
    <>
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

        <ChallengeTable />
      </main>
    </>
  );
}
