import { useState } from "react";
import type { SubmitEvent } from "react";
import { Pen, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authClient } from "@/features/auth/lib/authClient";

type UsernameFieldProps = {
  username: string;
  refreshSession: ReturnType<typeof authClient.useSession>["refetch"];
};

export function UsernameField({ username, refreshSession }: UsernameFieldProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft === null || saving) return;

    const nextUsername = draft.trim();
    setError("");

    if (nextUsername.length < 3 || nextUsername.length > 20) {
      setError("Username must be 3–20 characters.");
      return;
    }

    setSaving(true);
    try {
      const { error: updateError } = await authClient.updateUser({
        username: nextUsername,
      });

      if (updateError) {
        setError(updateError.message || "Could not save your username.");
        return;
      }

      const options = { query: { disableCookieCache: true } };
      const { data: savedSession } = await authClient.getSession(options);

      if (!savedSession) {
        setError("Could not verify the saved username. Refresh to check it.");
        return;
      }

      if (savedSession.user.username !== nextUsername.toLowerCase()) {
        setError("The server did not return the updated username.");
        return;
      }

      await refreshSession(options);
      setDraft(null);
    } catch {
      setError("Could not save your username. Try again.");
    } finally {
      setSaving(false);
    }
  }

  if (draft === null) {
    return (
      <div className="account-field">
        <div>
          <p className="account-field-label">Username</p>
          <p className="account-field-value">{username || "Unavailable"}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="account-edit-button"
          aria-label="Edit username"
          onClick={() => {
            setError("");
            setDraft(username);
          }}
        >
          <Pen size={16} aria-hidden="true" />
        </Button>
      </div>
    );
  }

  return (
    <form className="account-field account-field-form" onSubmit={save}>
      <Input
        label="Username"
        wrapperClassName="account-field-input"
        value={draft}
        maxLength={20}
        error={error}
        disabled={saving}
        onChange={(event) => setDraft(event.currentTarget.value)}
      />
      <Button
        variant="ghost"
        size="sm"
        className="account-edit-button"
        aria-label="Cancel editing username"
        disabled={saving}
        onClick={() => setDraft(null)}
      >
        <X size={16} aria-hidden="true" />
      </Button>
      <Button type="submit" size="sm" loading={saving}>
        Save
      </Button>
    </form>
  );
}
