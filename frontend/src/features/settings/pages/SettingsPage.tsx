import { useState } from "react";
import { Card } from "@/components/ui/Card";
import MenuContent from "../components/MenuContent";
import { SettingMenu } from "../components/SettingMenu";

export default function SettingsPage() {
  const [selectedSection, setSelectedSection] = useState("Account");

  return (
    <>
      <main
        aria-labelledby="settings-heading"
        className="mx-auto w-full max-w-page px-gutter py-gutter"
      >
        <h1
          id="settings-heading"
          className="mb-stack text-2xl font-bold uppercase tracking-ui text-foreground md:text-3xl"
        >
          Settings
        </h1>

        <Card variant="gradient" padding="none" className="settings-layout">
          <SettingMenu
            selectedSection={selectedSection}
            onSelect={setSelectedSection}
          />
          <MenuContent selectedSection={selectedSection} />
        </Card>
      </main>
    </>
  );
}
