import { useId } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BarVariant = "accent" | "success" | "warning" | "danger" | "info";
type BarSize = "sm" | "md" | "lg";

type BarProps = {
  /** current value */
  value: number;
  /** maximum value (default 100) */
  max?: number;
  /** text on the left above the bar, e.g. "XP" */
  label?: ReactNode;
  /** show the right-hand text above the bar (default: "value / max") */
  showValue?: boolean;
  /** override the right-hand text, e.g. "2,450 / 3,000 XP" */
  valueText?: ReactNode;
  variant?: BarVariant;
  size?: BarSize;
  /** split the bar into N blocks instead of one continuous fill */
  segments?: number;
  /** neon glow on the fill */
  glow?: boolean;
  className?: string;
  /** Accessible name when the visual label is absent or non-text. */
  "aria-label"?: string;
};

const fillColor: Record<BarVariant, string> = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-info",
};

const glowColor: Record<BarVariant, string> = {
  accent: "shadow-[0_0_10px_var(--accent)]",
  success: "shadow-[0_0_10px_var(--success)]",
  warning: "shadow-[0_0_10px_var(--warning)]",
  danger: "shadow-[0_0_10px_var(--danger)]",
  info: "shadow-[0_0_10px_var(--info)]",
};

const heights: Record<BarSize, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function Bar({
  value,
  max = 100,
  label,
  showValue = false,
  valueText,
  variant = "accent",
  size = "md",
  segments,
  glow = true,
  className = "",
  "aria-label": ariaLabel,
}: BarProps) {
  const labelId = useId();
  const hasLabel =
    label !== undefined &&
    label !== null &&
    typeof label !== "boolean" &&
    label !== "";
  const segmentCount =
    segments !== undefined && Number.isFinite(segments)
      ? Math.min(1000, Math.max(1, Math.floor(segments)))
      : 1;
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const clamped = Math.min(
    Math.max(Number.isFinite(value) ? value : 0, 0),
    safeMax,
  );
  const percent = (clamped / safeMax) * 100;

  const fill = `${fillColor[variant]} ${glow ? glowColor[variant] : ""}`;

  return (
    <div className={cn("w-full", className)}>
      {(hasLabel || showValue || valueText != null) && (
        <div className="mb-1.5 flex items-center justify-between font-mono text-xs tracking-ui">
          <span id={labelId} className="text-muted-foreground">
            {label}
          </span>
          {(showValue || valueText != null) && (
            <span className="text-muted-foreground">
              {valueText ?? `${clamped} / ${safeMax}`}
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={clamped}
        aria-label={ariaLabel ?? (hasLabel ? undefined : "Progress")}
        aria-labelledby={!ariaLabel && hasLabel ? labelId : undefined}
        aria-valuetext={typeof valueText === "string" ? valueText : undefined}
        className={`w-full ${heights[size]}`}
      >
        {segmentCount > 1 ? (
          <div className="flex size-full gap-1">
            {Array.from({ length: segmentCount }, (_, i) => {
              // how much of this block is filled (0 to 1)
              const blockFill = Math.min(
                Math.max((percent / 100) * segmentCount - i, 0),
                1,
              );
              return (
                <div
                  key={i}
                  className="relative flex-1 overflow-hidden border border-border bg-muted"
                >
                  <div
                    className={`h-full transition-[width] duration-500 ease-ui motion-reduce:transition-none ${fill}`}
                    style={{ width: `${blockFill * 100}%` }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="size-full overflow-hidden rounded-ui border border-border bg-muted">
            <div
              className={`h-full transition-[width] duration-500 ease-ui motion-reduce:transition-none ${fill}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
