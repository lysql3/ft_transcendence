import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Pen, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { authClient } from "@/features/auth/lib/authClient";

const avatarUrl =
  "https://api.dicebear.com/10.x/identicon/svg?backgroundColor=101216&rowColor=ff2e88,00e5ff,ffe600,7cff00,ff6a00,b400ff&seed=";

export default function Account() {
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>();
  const photoInput = useRef<HTMLInputElement>(null);
  const { data: session } = authClient.useSession();

  const name = session?.user?.name || "User";
  const photo = session?.user?.image || avatarUrl + encodeURIComponent(name);

  function previewPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file?.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") setPhotoPreview(reader.result);
    });
    reader.readAsDataURL(file);
  }

  const fields = [
    {
      label: "Name",
      type: "text",
      value: session?.user?.name ?? "",
      isEditing: editingName,
      toggleEditing: () => setEditingName((editing) => !editing),
    },
    {
      label: "Email",
      type: "email",
      value: session?.user?.email ?? "",
      isEditing: editingEmail,
      toggleEditing: () => setEditingEmail((editing) => !editing),
    },
  ] as const;

  return (
    <Card
      as="section"
      variant="solid"
      padding="none"
      className="account-card"
      aria-labelledby="account-heading"
    >
      <header className="account-card-header">
        <button
          type="button"
          className="account-photo-button"
          aria-label="Change profile photo"
          onClick={() => photoInput.current?.click()}
        >
          <Avatar
            src={photoPreview ?? photo}
            name={name}
            className="account-avatar"
          />
          <span className="account-photo-edit" aria-hidden="true">
            <Pen size={16} />
          </span>
        </button>
        <input
          ref={photoInput}
          type="file"
          accept="image/*"
          hidden
          onChange={previewPhoto}
        />
        <div>
          <h2 id="account-heading" className="account-card-heading">
            Account
          </h2>
          <CardDescription>Your display name and email address.</CardDescription>
        </div>
      </header>

      <div className="account-fields">
        {fields.map(({ label, type, value, isEditing, toggleEditing }) => (
          <div key={type} className="account-field">
            <div className="account-field-content">
              {isEditing ? (
                <Input type={type} label={label} defaultValue={value} />
              ) : (
                <>
                  <p className="account-field-label">{label}</p>
                  <p className="account-field-value">{value || "Unavailable"}</p>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="account-edit-button"
              aria-label={
                isEditing
                  ? `Cancel editing ${label.toLowerCase()}`
                  : `Edit ${label.toLowerCase()}`
              }
              onClick={toggleEditing}
            >
              {isEditing ? (
                <X size={16} aria-hidden="true" />
              ) : (
                <Pen size={16} aria-hidden="true" />
              )}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
