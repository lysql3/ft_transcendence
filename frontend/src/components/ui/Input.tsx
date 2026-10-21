import { forwardRef, useId, useState } from "react";
import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, type = "text", id, disabled, className = "", wrapperClassName = "", ...props },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const frame = error
    ? "border-red-500 focus-within:shadow-[0_0_14px_-4px_#ef4444]"
    : "border-line hover:border-accent/60 focus-within:border-accent focus-within:shadow-[0_0_14px_-4px_var(--accent)]";

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-muted"
        >
          {label}
        </label>
      )}

      <div
        className={`flex items-center border bg-overlay/90 transition-[border-color,box-shadow] duration-200 ${frame} ${
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
          className={`w-full min-w-0 bg-transparent px-3 py-2 text-sm text-fg caret-accent outline-none placeholder:text-muted disabled:cursor-not-allowed autofill:shadow-[inset_0_0_0_1000px_var(--bg-secondary)] autofill:[-webkit-text-fill-color:var(--text-primary)] ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            disabled={disabled}
            className="shrink-0 cursor-pointer px-3 text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:text-accent-text disabled:cursor-not-allowed"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-xs text-red-500">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});