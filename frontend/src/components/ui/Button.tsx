import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline";
  content?: ReactNode;
};

const base =
  "inline-flex items-center justify-center border border-accent px-4 py-2 " +
  "text-sm font-semibold uppercase tracking-ui rounded-ui cursor-pointer " +
  "transition-all duration-200 ease-ui " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  solid: "bg-accent text-accent-foreground hover:bg-background hover:text-accent",
  outline: "bg-background text-accent hover:bg-accent hover:text-accent-foreground",
};

export function Button({
  variant = "solid",
  content,
  children,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children ?? content}
    </button>
  );
}