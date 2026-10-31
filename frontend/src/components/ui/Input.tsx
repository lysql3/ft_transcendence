import { forwardRef, useId, useState } from "react";
import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    type = "text",
    id,
    disabled,
    className = "",
    wrapperClassName = "",
    ...props
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const frame = error
    ? "border-destructive focus-within:shadow-[0_0_14px_-4px_var(--danger)]"
    : "border-border hover:border-accent/60 focus-within:border-accent focus-within:shadow-glow";

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-ui"
        >
          {label}
        </label>
      )}

      <div
        className={`flex items-center border bg-card/90 rounded-ui transition-[border-color,box-shadow] duration-(--duration) ease-ui ${frame} ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        <input
          ref={ref}
          id={inputId}
          type={isPassword && showPassword ? "text" : type}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`w-full min-w-0 bg-transparent px-3 py-2 text-sm text-foreground caret-accent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed autofill:shadow-[inset_0_0_0_1000px_var(--color-card)] autofill:[-webkit-text-fill-color:var(--color-foreground)] ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            disabled={disabled}
            className="shrink-0 cursor-pointer px-3 text-xs font-semibold uppercase tracking-ui text-muted-foreground transition-colors hover:text-accent disabled:cursor-not-allowed"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
