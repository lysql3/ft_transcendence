import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type SpinnerSize = "sm" | "md" | "lg";

type SpinnerProps = HTMLAttributes<HTMLSpanElement> & {
  size?: SpinnerSize;
  label?: string;
};

const sizes: Record<SpinnerSize, string> = {
  sm: "size-4 border-2",
  md: "size-6 border-2",
  lg: "size-10 border-[3px]",
};

export function Spinner({
  size = "md",
  label = "Loading",
  className,
  ...rest
}: SpinnerProps) {
  return (
    <span role="status" className={cn("inline-flex", className)} {...rest}>
      <span
        aria-hidden="true"
        className={cn(
          "inline-block rounded-full border-current border-t-transparent animate-spin motion-reduce:animate-none",
          sizes[size],
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
