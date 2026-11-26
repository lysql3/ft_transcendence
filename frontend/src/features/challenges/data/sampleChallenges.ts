import type { Challenge } from "../types/challenge";

type SampleChallenge = Omit<Challenge, "slug" | "tags" | "visibleTestCases" | "hiddenTestCount"> & {
  tags: string;
};

// Local preview fixtures.
// Solve rates and personal completion states are fictional demonstration data.
export const sampleChallenges: SampleChallenge[] = [
  {
    id: 1,
    title: "Two Sum",
    starterCode: {
      javascript: "function twoSum(nums, target) {\n  // Write your solution here.\n}\n",
      typescript: "function twoSum(nums: number[], target: number): number[] {\n  // Write your solution here.\n  return [];\n}\n",
    },
    difficulty: "Easy",
    description: `You are given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

### Example 1

\`\`\`text
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
\`\`\`

**Explanation:** The sum of \`nums[0]\` and \`nums[1]\` is \`2 + 7 = 9\`, which equals the target. Therefore, the indices \`[0, 1]\` are returned.

### Example 2

\`\`\`text
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

**Explanation:** The sum of \`nums[1]\` and \`nums[2]\` is \`2 + 4 = 6\`, which equals the target. Therefore, the indices \`[1, 2]\` are returned.

### Example 3

\`\`\`text
Input: nums = [3,3], target = 6
Output: [0,1]
\`\`\`

**Explanation:** The sum of \`nums[0]\` and \`nums[1]\` is \`3 + 3 = 6\`, which equals the target. Therefore, the indices \`[0, 1]\` are returned.

### Constraints

- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`-10^9 <= target <= 10^9\`
- Only one valid answer exists.

### Follow-up

Can you come up with an algorithm that is less than \`O(n^2)\` time complexity?`,
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
  {
    id: 7,
    title: "Knapsack Problem",
    difficulty: "Medium",
    description: "Description 7",
    tags: "Dynamic Programming",
    solvingPercentage: 0.2,
    solved: false,
  },
  {
    id: 8,
    title: "Graph Traversal",
    difficulty: "Easy",
    description: "Description 8",
    tags: "Graph Theory",
    solvingPercentage: 0.9,
    solved: true,
  },
  {
    id: 9,
    title: "Quick Sort",
    difficulty: "Medium",
    description: "Description 9",
    tags: "Sorting",
    solvingPercentage: 0.5,
    solved: false,
  },
  {
    id: 10,
    title: "Binary Search Tree",
    difficulty: "Hard",
    description: "Description 10",
    tags: "Searching",
    solvingPercentage: 0.3,
    solved: true,
  },
  {
    id: 11,
    title: "Greedy Algorithm",
    difficulty: "Medium",
    description: "Description 11",
    tags: "Greedy",
    solvingPercentage: 0.6,
    solved: false,
  },
  {
    id: 12,
    title: "Backtracking",
    difficulty: "Hard",
    description: "Description 12",
    tags: "Backtracking",
    solvingPercentage: 0.4,
    solved: true,
  },
  {
    id: 13,
    title: "Rotate an Array",
    difficulty: "Easy",
    description: "Rotate an array to the right by a given number of steps.",
    tags: "Algorithms",
    solvingPercentage: 0.34,
    solved: false,
  },
  {
    id: 14,
    title: "Maximum Subarray",
    difficulty: "Medium",
    description: "Find the contiguous subarray with the greatest sum.",
    tags: "Algorithms",
    solvingPercentage: 0.47,
    solved: false,
  },
  {
    id: 15,
    title: "Product Except Self",
    difficulty: "Medium",
    description: "Compute the product of all other elements without division.",
    tags: "Algorithms",
    solvingPercentage: 0.6,
    solved: false,
  },
  {
    id: 16,
    title: "Longest Consecutive Sequence",
    difficulty: "Hard",
    description:
      "Find the longest run of consecutive integers in an unsorted array.",
    tags: "Algorithms",
    solvingPercentage: 0.73,
    solved: true,
  },
  {
    id: 17,
    title: "Valid Parentheses",
    difficulty: "Easy",
    description:
      "Determine whether a string of brackets is correctly balanced.",
    tags: "Data Structures",
    solvingPercentage: 0.86,
    solved: false,
  },
  {
    id: 18,
    title: "Min Stack",
    difficulty: "Medium",
    description:
      "Design a stack that can retrieve its minimum element efficiently.",
    tags: "Data Structures",
    solvingPercentage: 0.24,
    solved: false,
  },
  {
    id: 19,
    title: "LRU Cache",
    difficulty: "Hard",
    description: "Implement a cache that evicts the least recently used item.",
    tags: "Data Structures",
    solvingPercentage: 0.37,
    solved: false,
  },
  {
    id: 20,
    title: "Queue Using Stacks",
    difficulty: "Easy",
    description: "Implement queue operations using two stacks.",
    tags: "Data Structures",
    solvingPercentage: 0.5,
    solved: true,
  },
  {
    id: 21,
    title: "Palindrome Number",
    difficulty: "Easy",
    description:
      "Determine whether an integer reads the same in both directions.",
    tags: "Math",
    solvingPercentage: 0.63,
    solved: false,
  },
  {
    id: 22,
    title: "Count Primes",
    difficulty: "Medium",
    description:
      "Count the prime numbers smaller than a given positive integer.",
    tags: "Math",
    solvingPercentage: 0.76,
    solved: false,
  },
  {
    id: 23,
    title: "Greatest Common Divisor",
    difficulty: "Easy",
    description: "Find the greatest common divisor of two positive integers.",
    tags: "Math",
    solvingPercentage: 0.89,
    solved: false,
  },
  {
    id: 24,
    title: "Integer to Roman",
    difficulty: "Medium",
    description: "Convert an integer into its Roman numeral representation.",
    tags: "Math",
    solvingPercentage: 0.27,
    solved: true,
  },
  {
    id: 25,
    title: "Climbing Stairs",
    difficulty: "Easy",
    description: "Count the ways to climb a staircase using one or two steps.",
    tags: "Dynamic Programming",
    solvingPercentage: 0.4,
    solved: false,
  },
  {
    id: 26,
    title: "House Robber",
    difficulty: "Medium",
    description:
      "Find the largest total available without choosing adjacent houses.",
    tags: "Dynamic Programming",
    solvingPercentage: 0.53,
    solved: false,
  },
  {
    id: 27,
    title: "Coin Change",
    difficulty: "Medium",
    description: "Find the fewest coins needed to make a target amount.",
    tags: "Dynamic Programming",
    solvingPercentage: 0.66,
    solved: false,
  },
  {
    id: 28,
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    description:
      "Find the length of the longest strictly increasing subsequence.",
    tags: "Dynamic Programming",
    solvingPercentage: 0.79,
    solved: true,
  },
  {
    id: 29,
    title: "Edit Distance",
    difficulty: "Hard",
    description:
      "Find the minimum edits required to transform one string into another.",
    tags: "Dynamic Programming",
    solvingPercentage: 0.17,
    solved: false,
  },
  {
    id: 30,
    title: "Number of Islands",
    difficulty: "Medium",
    description: "Count connected groups of land cells in a rectangular grid.",
    tags: "Graph Theory",
    solvingPercentage: 0.3,
    solved: false,
  },
  {
    id: 31,
    title: "Course Schedule",
    difficulty: "Medium",
    description:
      "Determine whether all courses can be completed given their prerequisites.",
    tags: "Graph Theory",
    solvingPercentage: 0.43,
    solved: false,
  },
  {
    id: 32,
    title: "Connected Components",
    difficulty: "Easy",
    description: "Count the connected components in an undirected graph.",
    tags: "Graph Theory",
    solvingPercentage: 0.56,
    solved: true,
  },
  {
    id: 33,
    title: "Network Delay Time",
    difficulty: "Medium",
    description:
      "Find how long a signal takes to reach every node in a network.",
    tags: "Graph Theory",
    solvingPercentage: 0.69,
    solved: false,
  },
  {
    id: 34,
    title: "Word Ladder",
    difficulty: "Hard",
    description: "Find the shortest sequence of valid word transformations.",
    tags: "Graph Theory",
    solvingPercentage: 0.82,
    solved: false,
  },
  {
    id: 35,
    title: "Sort Colors",
    difficulty: "Medium",
    description: "Reorder three categories of values in place.",
    tags: "Sorting",
    solvingPercentage: 0.2,
    solved: false,
  },
  {
    id: 36,
    title: "Merge Sorted Arrays",
    difficulty: "Easy",
    description: "Merge two sorted arrays into one sorted sequence.",
    tags: "Sorting",
    solvingPercentage: 0.33,
    solved: true,
  },
  {
    id: 37,
    title: "Kth Largest Element",
    difficulty: "Medium",
    description: "Find the kth largest value in an unsorted array.",
    tags: "Sorting",
    solvingPercentage: 0.46,
    solved: false,
  },
  {
    id: 38,
    title: "Sort Linked List",
    difficulty: "Medium",
    description: "Sort the nodes of a linked list in ascending order.",
    tags: "Sorting",
    solvingPercentage: 0.59,
    solved: false,
  },
  {
    id: 39,
    title: "Largest Number",
    difficulty: "Medium",
    description:
      "Arrange non-negative integers to form the largest concatenated number.",
    tags: "Sorting",
    solvingPercentage: 0.72,
    solved: false,
  },
  {
    id: 40,
    title: "Search Insert Position",
    difficulty: "Easy",
    description: "Find the index at which a target belongs in a sorted array.",
    tags: "Searching",
    solvingPercentage: 0.85,
    solved: true,
  },
  {
    id: 41,
    title: "First and Last Position",
    difficulty: "Medium",
    description: "Find the first and last occurrence of a target value.",
    tags: "Searching",
    solvingPercentage: 0.23,
    solved: false,
  },
  {
    id: 42,
    title: "Search Rotated Array",
    difficulty: "Medium",
    description:
      "Locate a target in an array that was sorted and then rotated.",
    tags: "Searching",
    solvingPercentage: 0.36,
    solved: false,
  },
  {
    id: 43,
    title: "Search a Matrix",
    difficulty: "Medium",
    description: "Find a target in a matrix with ordered rows and columns.",
    tags: "Searching",
    solvingPercentage: 0.49,
    solved: false,
  },
  {
    id: 44,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    description:
      "Find the median of two sorted arrays without fully merging them.",
    tags: "Searching",
    solvingPercentage: 0.62,
    solved: true,
  },
  {
    id: 45,
    title: "Assign Cookies",
    difficulty: "Easy",
    description: "Distribute cookies to satisfy as many children as possible.",
    tags: "Greedy",
    solvingPercentage: 0.75,
    solved: false,
  },
  {
    id: 46,
    title: "Jump Game",
    difficulty: "Medium",
    description: "Determine whether the last index of an array can be reached.",
    tags: "Greedy",
    solvingPercentage: 0.88,
    solved: false,
  },
  {
    id: 47,
    title: "Gas Station",
    difficulty: "Medium",
    description:
      "Find a starting station from which a complete circuit is possible.",
    tags: "Greedy",
    solvingPercentage: 0.26,
    solved: false,
  },
  {
    id: 48,
    title: "Non-overlapping Intervals",
    difficulty: "Medium",
    description: "Remove the fewest intervals to eliminate all overlaps.",
    tags: "Greedy",
    solvingPercentage: 0.39,
    solved: true,
  },
  {
    id: 49,
    title: "Candy Distribution",
    difficulty: "Hard",
    description:
      "Distribute the minimum candies while respecting adjacent ratings.",
    tags: "Greedy",
    solvingPercentage: 0.52,
    solved: false,
  },
  {
    id: 50,
    title: "Generate Parentheses",
    difficulty: "Medium",
    description:
      "Generate every valid arrangement of a given number of bracket pairs.",
    tags: "Backtracking",
    solvingPercentage: 0.65,
    solved: false,
  },
  {
    id: 51,
    title: "Combination Sum",
    difficulty: "Medium",
    description: "Find combinations of candidate values that sum to a target.",
    tags: "Backtracking",
    solvingPercentage: 0.78,
    solved: false,
  },
  {
    id: 52,
    title: "Permutations",
    difficulty: "Medium",
    description: "Generate all possible orderings of distinct values.",
    tags: "Backtracking",
    solvingPercentage: 0.16,
    solved: true,
  },
  {
    id: 53,
    title: "N-Queens",
    difficulty: "Hard",
    description: "Place queens on a chessboard so that none attack each other.",
    tags: "Backtracking",
    solvingPercentage: 0.29,
    solved: false,
  },
  {
    id: 54,
    title: "Sudoku Solver",
    difficulty: "Hard",
    description:
      "Fill a Sudoku board while satisfying all row, column, and box constraints.",
    tags: "Backtracking",
    solvingPercentage: 0.42,
    solved: false,
  },
  {
    id: 55,
    title: "Factorial",
    difficulty: "Easy",
    description: "Compute the factorial of a non-negative integer recursively.",
    tags: "Recursion",
    solvingPercentage: 0.55,
    solved: false,
  },
  {
    id: 56,
    title: "Sum of Digits",
    difficulty: "Easy",
    description: "Calculate the sum of an integer’s digits using recursion.",
    tags: "Recursion",
    solvingPercentage: 0.68,
    solved: true,
  },
  {
    id: 57,
    title: "Recursive Binary Search",
    difficulty: "Easy",
    description:
      "Search a sorted array by recursively narrowing the search range.",
    tags: "Recursion",
    solvingPercentage: 0.81,
    solved: false,
  },
  {
    id: 58,
    title: "Tower of Hanoi",
    difficulty: "Medium",
    description:
      "Generate valid moves to transfer a stack of disks between pegs.",
    tags: "Recursion",
    solvingPercentage: 0.19,
    solved: false,
  },
  {
    id: 59,
    title: "Decode a Nested String",
    difficulty: "Medium",
    description: "Expand a string containing nested repetition instructions.",
    tags: "Recursion",
    solvingPercentage: 0.32,
    solved: false,
  },
  {
    id: 60,
    title: "Recursive Tree Serialization",
    difficulty: "Hard",
    description:
      "Serialize a binary tree and reconstruct it using recursive traversal.",
    tags: "Recursion",
    solvingPercentage: 0.45,
    solved: true,
  },
];
