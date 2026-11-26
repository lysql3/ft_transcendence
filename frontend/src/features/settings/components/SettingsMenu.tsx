import { Palette, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const menuItems = [
  { id: "account", title: "Account", icon: UserRound },
  { id: "appearance", title: "Style", icon: Palette },
] as const;

export type SettingsSection = (typeof menuItems)[number]["id"];

type SettingsMenuProps = {
  selectedSection: SettingsSection;
  onSelect: (section: SettingsSection) => void;
};

export function SettingsMenu({ selectedSection, onSelect }: SettingsMenuProps) {
  return (
    <Card variant="solid" padding="sm" as="aside" aria-label="Settings sections">
      <div className="settings-menu">
        {menuItems.map(({ id, title, icon: Icon }) => {
          const isSelected = selectedSection === id;

          return (
            <Button
              key={id}
              variant={isSelected ? "outline" : "ghost"}
              className="settings-menu-button"
              aria-pressed={isSelected}
              onClick={() => onSelect(id)}
            >
              <Icon size={16} aria-hidden="true" />
              {title}
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
