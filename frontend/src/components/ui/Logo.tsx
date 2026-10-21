import type { HTMLAttributes } from "react";

type LogoSize = "sm" | "md" | "lg";

type LogoProps = HTMLAttributes<HTMLSpanElement> & {
  name?: string;
  size?: LogoSize;
};

const sizes: Record<LogoSize, string> = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl md:text-5xl",
};

export const Logo = ({
  name = "CodeArena",
  size = "md",
  className = "",
  ...rest
}: LogoProps) => {
  return (
    <span
      role="img"
      aria-label={name}
      className={`inline-flex select-none items-center whitespace-nowrap font-bold tracking-wider ${sizes[size]} ${className}`}
      {...rest}
    >
      <span aria-hidden="true" className="text-logo">
        &lt;{name}
      </span>
      <span
        aria-hidden="true"
        className="text-accent [text-shadow:0_0_8px_var(--accent),0_0_20px_var(--accent)] "
      >
        /
      </span>
      <span aria-hidden="true" className="text-logo">
        &gt;
      </span>
    </span>
  );
};
