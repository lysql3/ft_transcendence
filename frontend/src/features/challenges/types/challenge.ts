export type Challenge = {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  tags: "Algorithms" | "Data Structures" | "Math";
  /** Fraction from 0 to 1 representing the overall solve rate, not personal status. */
  solvingPercentage?: number;
  solved: boolean;
};
