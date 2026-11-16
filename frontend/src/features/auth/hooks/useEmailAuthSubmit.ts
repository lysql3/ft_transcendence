import { useNavigate } from "react-router-dom";
import type {
  FieldPath,
  FieldValues,
  UseFormClearErrors,
  UseFormSetError,
} from "react-hook-form";

type EmailAuthSubmitOptions<T extends FieldValues> = {
  endpoint: "/api/auth/sign-in/email" | "/api/auth/sign-up/email";
  failureMessage: string;
  getPayload: (data: T) => Record<string, string>;
  errorFields: Readonly<Record<string, FieldPath<T> | undefined>>;
  clearErrors: UseFormClearErrors<T>;
  setError: UseFormSetError<T>;
};

/** Return an async handler so React Hook Form tracks submission and loading. */
export function useEmailAuthSubmit<T extends FieldValues>({
  endpoint,
  failureMessage,
  getPayload,
  errorFields,
  clearErrors,
  setError,
}: EmailAuthSubmitOptions<T>) {
  const navigate = useNavigate();

  return async (data: T) => {
    clearErrors();
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(getPayload(data)),
      });
      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const payload = result && typeof result === "object" ? result : {};
        const message = "message" in payload && typeof payload.message === "string"
          ? payload.message
          : `${failureMessage} (HTTP ${response.status}). Please try again.`;
        const code = "code" in payload && typeof payload.code === "string"
          ? payload.code : "";
        const field = Object.hasOwn(errorFields, code) ? errorFields[code] : undefined;
        setError(field ?? "root", { type: "server", message }, { shouldFocus: !!field });
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch {
      setError("root", {
        type: "server",
        message: "Unable to connect to the server. Please try again later.",
      });
    }
  };
}
