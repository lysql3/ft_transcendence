import { Brackets, Code, Zap, type LucideIcon } from "lucide-react";
import type { ChallengeDifficulty } from "../types/challenge";

export const challengeDifficulties = ["Easy", "Medium", "Hard"] as const;

export const difficultyPresentation: Record<
  ChallengeDifficulty,
  {
    icon: LucideIcon;
    textClassName: string;
    cardClassName: string;
    progressVariant: "success" | "warning" | "danger";
  }
> = {
  Easy: {
    icon: Brackets,
    textClassName: "text-success",
    cardClassName: "border-success/40 from-success/10",
    progressVariant: "success",
  },
  Medium: {
    icon: Code,
    textClassName: "text-warning",
    cardClassName: "border-warning/40 from-warning/10",
    progressVariant: "warning",
  },
  Hard: {
    icon: Zap,
    textClassName: "text-destructive",
    cardClassName: "border-destructive/40 from-destructive/10",
    progressVariant: "danger",
  },
};
