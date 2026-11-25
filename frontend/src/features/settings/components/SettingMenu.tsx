import { Palette, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const menuItems = [
  { title: "Account", icon: UserRound },
  { title: "Style", icon: Palette },
];

type SettingMenuProps = {
  selectedSection: string;
  onSelect: (title: string) => void;
};

export function SettingMenu({ selectedSection, onSelect }: SettingMenuProps) {
  return (
    <Card variant="solid" padding="sm" as="aside" aria-label="Settings sections">
      <div className="settings-menu">
        {menuItems.map(({ title, icon: Icon }) => {
          const isSelected = selectedSection === title;

          return (
            <Button
              key={title}
              variant={isSelected ? "outline" : "ghost"}
              className="settings-menu-button"
              aria-pressed={isSelected}
              onClick={() => onSelect(title)}
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
