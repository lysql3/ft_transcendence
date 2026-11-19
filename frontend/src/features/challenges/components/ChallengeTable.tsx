import { type Challenge } from "@/features/challenges/types/challenge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import ChallengeRow from "./ChallengeRow";
import { sampleChallenges as challenges } from "../data/sampleChallenges";

const tags: Challenge["tags"][] = ["Algorithms", "Data Structures", "Math"];

export default function ChallengeTable() {
  return (
    <Card variant="flat" padding="none">
      <CardHeader className="flex flex-wrap items-center justify-between gap-2">
        <Button>All Challenges</Button>

        {tags.map((tag) => (
          <Button key={tag}>{tag}</Button>
        ))}
      </CardHeader>
      <CardContent>
        <ul aria-label="Challenges" className="space-y-3">
          {challenges.map((challenge) => (
            <ChallengeRow key={challenge.id} challenge={challenge} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
