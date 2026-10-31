import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "@/components/ui/Spinner";

type ButtonVariant = "solid" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and blocks clicks. */
  loading?: boolean;
  /** Kept so existing <Button content="..." /> calls keep working. Prefer children. */
  content?: ReactNode;
};

const base =
  "inline-flex items-center justify-center gap-2 border font-semibold uppercase tracking-ui rounded-ui cursor-pointer " +
  "transition-all duration-(--duration) ease-ui " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  solid:
    "border-accent bg-accent text-accent-foreground hover:bg-background hover:text-accent",
  outline:
    "border-accent bg-background text-accent hover:bg-accent hover:text-accent-foreground",
  ghost:
    "border-transparent bg-transparent text-foreground hover:border-border hover:text-accent",
  danger:
    "border-destructive bg-destructive text-destructive-foreground hover:bg-background hover:text-destructive",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1 text-xs",
  md: "px-control-x py-control-y text-sm", // uses your spacing tokens
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "solid",
  size = "md",
  loading = false,
  content,
  children,
  className,
  type = "button",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      {children ?? content}
    </button>
  );
}
