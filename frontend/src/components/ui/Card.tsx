import type { ElementType, HTMLAttributes, ReactNode } from "react";


type CardVariant = "glass" | "solid" | "outline" | "flat";
type CardPadding = "none" | "sm" | "md" | "lg";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  /** Rendered element, e.g. "section" or "article". Defaults to "div". */
  as?: ElementType;
  /** glass = see-through + blur, solid = opaque surface, outline = border only. */
  variant?: CardVariant;
  padding?: CardPadding;
  /** Hover effect: accent border, soft glow and a small lift. */
  interactive?: boolean;
  /** Terminal-style accent brackets on two corners. */
  corners?: boolean;
};

const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(" ");

const variants: Record<CardVariant, string> = {
  glass: "bg-card/10 backdrop-blur-glass shadow-lg shadow-black/20",
  solid: "bg-card text-card-foreground",
  outline: "bg-transparent",
  flat: "border-0 bg-transparent"
};

const paddings: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const interactiveStyles =
  "hover:-translate-y-0.5 hover:border-accent hover:shadow-glow";

const cornerStyles =
  "before:pointer-events-none before:absolute before:-left-px before:-top-px before:h-3 before:w-3 before:border-l-2 before:border-t-2 before:border-accent " +
  "after:pointer-events-none after:absolute after:-bottom-px after:-right-px after:h-3 after:w-3 after:border-b-2 after:border-r-2 after:border-accent";

export function Card({
  children,
  as: Tag = "div",
  variant = "glass",
  padding = "md",
  interactive = false,
  corners = false,
  className,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cx(
        "relative border border-border rounded-ui transition-[transform,border-color,box-shadow] duration-(--duration) ease-ui",
        variants[variant],
        paddings[padding],
        interactive && interactiveStyles,
        corners && cornerStyles,
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Optional building blocks for consistent card content */

export function CardHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("mb-4 space-y-1", className)} {...rest} />;
}

export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cx("text-lg font-bold tracking-ui text-foreground", className)} {...rest} />;
}

export function CardDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx("text-sm text-muted-foreground", className)} {...rest} />;
}

export function CardContent({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("text-sm text-foreground", className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx("mt-6 flex items-center gap-3 border-t border-border pt-4", className)} {...rest} />
  );
}