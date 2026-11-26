import { Avatar } from "@/components/ui/Avatar";
import { Card, CardDescription } from "@/components/ui/Card";
import { authClient } from "@/features/auth/lib/authClient";
import { UsernameField } from "./UsernameField";

const avatarUrl =
  "https://api.dicebear.com/10.x/identicon/svg?backgroundColor=101216&rowColor=ff2e88,00e5ff,ffe600,7cff00,ff6a00,b400ff&seed=";

export default function AccountSettings() {
  const { data: session, refetch } = authClient.useSession();
  const user = session?.user;
  const name = user?.username || user?.name || "User";
  const photo = user?.image || avatarUrl + encodeURIComponent(name);

  return (
    <Card
      as="section"
      variant="solid"
      padding="none"
      className="settings-panel"
      aria-labelledby="account-heading"
    >
      <header className="account-card-header">
        <Avatar src={photo} name={name} className="account-avatar" />
        <div>
          <h2 id="account-heading" className="settings-panel-heading">
            Account
          </h2>
          <CardDescription>Profile photo editing is coming later.</CardDescription>
        </div>
      </header>

      <div className="account-fields">
        <UsernameField username={user?.username ?? ""} refreshSession={refetch} />
        <div className="account-field">
          <div>
            <p className="account-field-label">Email</p>
            <p className="account-field-value">{user?.email || "Unavailable"}</p>
          </div>
        </div>
        <div className="account-field">
          <div>
            <p className="account-field-label">Bio</p>
            <CardDescription>Bio editing is coming later.</CardDescription>
          </div>
        </div>
      </div>
    </Card>
  );
}
