import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge resolves class conflicts ("px-3" should beat "px-control-x").
// It only knows Tailwind's default names, so we teach it your custom theme tokens.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ["ui"],
      tracking: ["ui"],
      ease: ["ui"],
      shadow: ["glow"],
      blur: ["glass"],
      spacing: ["control-x", "control-y", "card", "gutter", "section", "stack", "inline"],
    },
  },
});

/** Joins class names, skips falsy values, and lets later classes win conflicts. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));