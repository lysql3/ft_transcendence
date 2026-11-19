import type { Challenge } from "../types/challenge";

// Preview fixtures until the challenge API is connected.
export const sampleChallenges: Challenge[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Description 1",
    tags: "Algorithms",
    solvingPercentage: 0.5,
    solved: true,
  },
  {
    id: 2,
    title: "Reverse Linked List",
    difficulty: "Medium",
    description: "Description 2",
    tags: "Data Structures",
    solvingPercentage: 0.3,
    solved: false,
  },
  {
    id: 3,
    title: "Dijkstra's Algorithm",
    difficulty: "Hard",
    description: "Description 3",
    tags: "Math",
    solvingPercentage: 0.8,
    solved: true,
  },
  {
    id: 4,
    title: "Binary Search",
    difficulty: "Easy",
    description: "Description 4",
    tags: "Algorithms",
    solvingPercentage: 0.6,
    solved: false,
  },
  {
    id: 5,
    title: "Merge Sort",
    difficulty: "Medium",
    description: "Description 5",
    tags: "Data Structures",
    solvingPercentage: 0.4,
    solved: true,
  },
  {
    id: 6,
    title: "Fibonacci Sequence",
    difficulty: "Hard",
    description: "Description 6",
    tags: "Math",
    solvingPercentage: 0.7,
    solved: false,
  },
];
