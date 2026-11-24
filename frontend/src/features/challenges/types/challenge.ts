export type ChallengeDifficulty = "Easy" | "Medium" | "Hard";
export type EditorLanguage = "javascript" | "typescript";

export type ChallengeSummary = {
  id: number;
  slug: string;
  title: string;
  difficulty: ChallengeDifficulty;
  tags: string[];
  solved?: boolean | null;
  solvingPercentage?: number | null;
};

export type Challenge = ChallengeSummary & {
  description: string;
  visibleTestCases: {
    id: number;
    input: string;
    expectedOutput: string;
  }[];
  hiddenTestCount: number;
  starterCode?: Partial<Record<EditorLanguage, string>>;
};

export type ChallengeFilter = string;
