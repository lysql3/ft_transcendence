export type ChallengeDifficulty = "Easy" | "Medium" | "Hard";
export type EditorLanguage = "javascript" | "typescript";

export type Challenge = {
  id: number;
  title: string;
  difficulty: ChallengeDifficulty;
  description: string;
  /** The category or type of the challenge. */
  tags:
    | "Algorithms"
    | "Data Structures"
    | "Math"
    | "Dynamic Programming"
    | "Graph Theory"
    | "Sorting"
    | "Searching"
    | "Greedy"
    | "Backtracking"
    | "Recursion";
  /** Fraction from 0 to 1 representing the overall solve rate, not personal status. */
  solvingPercentage?: number;
  solved: boolean;
  /** Optional problem-specific templates; otherwise the editor starts with a comment. */
  starterCode?: Partial<Record<EditorLanguage, string>>;
};

export type ChallengeTag = Challenge["tags"];
export type ChallengeFilter = "All" | ChallengeTag;
