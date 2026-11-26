import { useState } from "react";
import { Card } from "@/components/ui/Card";
import AccountSettings from "../components/AccountSettings";
import AppearanceSettings from "../components/AppearanceSettings";
import { SettingsMenu } from "../components/SettingsMenu";
import type { SettingsSection } from "../components/SettingsMenu";

export default function SettingsPage() {
  const [selectedSection, setSelectedSection] = useState<SettingsSection>("account");

  return (
    <main aria-labelledby="settings-heading" className="settings-page">
      <h1 id="settings-heading" className="settings-heading">
        Settings
      </h1>

      <Card variant="gradient" padding="none" className="settings-layout">
        <SettingsMenu
          selectedSection={selectedSection}
          onSelect={setSelectedSection}
        />
        {selectedSection === "account" ? <AccountSettings /> : <AppearanceSettings />}
      </Card>
    </main>
  );
}
