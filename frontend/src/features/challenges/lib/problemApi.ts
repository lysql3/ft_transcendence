import type { Challenge, ChallengeSummary } from "../types/challenge";

const difficultyLabels = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
} as const;

type ApiSummary = Omit<ChallengeSummary, "difficulty"> & {
  difficulty: keyof typeof difficultyLabels;
};

type ApiDetail = Omit<Challenge, "difficulty"> & {
  difficulty: keyof typeof difficultyLabels;
};

export type ProblemPage = {
  items: ChallengeSummary[];
  total: number;
  page: number;
  limit: number;
};

export type ProblemSort = {
  by: "title" | "difficulty" | "solveRate" | "status";
  order: "asc" | "desc";
};

type ApiProblemPage = Omit<ProblemPage, "items"> & { items: ApiSummary[] };

export class ProblemApiError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`Problem request failed (${status})`);
    this.status = status;
  }
}

async function get<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { credentials: "include", signal });

  if (!response.ok) {
    throw new ProblemApiError(response.status);
  }

  return response.json();
}

export async function listProblems(
  { page, tag, limit, search, sort }: {
    page: number;
    tag?: string;
    limit?: number;
    search?: string;
    sort?: ProblemSort | null;
  },
  signal: AbortSignal,
): Promise<ProblemPage> {
  const params = new URLSearchParams({ page: String(page) });
  if (tag) params.set("tag", tag);
  if (search) params.set("search", search);
  if (limit !== undefined) params.set("limit", String(limit));
  if (sort) {
    params.set("sortBy", sort.by);
    params.set("sortOrder", sort.order);
  }

  const result = await get<ApiProblemPage>(`/api/problem?${params}`, signal);

  return {
    ...result,
    items: result.items.map((item) => ({
      ...item,
      difficulty: difficultyLabels[item.difficulty],
    })),
  };
}

export async function getProblem(slug: string, signal: AbortSignal): Promise<Challenge> {
  const problem = await get<ApiDetail>(
    `/api/problem/${encodeURIComponent(slug)}`,
    signal,
  );

  return { ...problem, difficulty: difficultyLabels[problem.difficulty] };
}
