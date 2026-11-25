import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader } from "@/components/ui/Card";
import { useState } from "react";
import ThemePallete from "./ThemePallete";

const themes = [
  { id: "matrix-dark", name: "Matrix Dark" },
  { id: "matrix-light", name: "Matrix Light" },
  { id: "cyberpunk", name: "Cyberpunk" },
  { id: "tokyo-night", name: "Tokyo Night" },
  { id: "catppuccin", name: "Catppuccin" },
  { id: "amber-terminal", name: "Amber Terminal" },
  { id: "deep-ocean", name: "Deep Ocean" },
  { id: "rose-dusk", name: "Rose Dusk" },
  { id: "paper-ink", name: "Paper Ink" },
  { id: "glacier", name: "Glacier" },
  { id: "lavender-fog", name: "Lavender Fog" },
  { id: "copper-noir", name: "Copper Noir" },
  { id: "arctic-night", name: "Arctic Night" },
  { id: "solar-flare", name: "Solar Flare" },
  { id: "jade-forest", name: "Jade Forest" },
  { id: "midnight-indigo", name: "Midnight Indigo" },
  { id: "sandstone", name: "Sandstone" },
  { id: "slate-day", name: "Slate Day" },
];

function selectTheme(theme: string) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("codearena-theme", theme);
}

export default function Style() {
  const [selectedTheme, setSelectedTheme] = useState(
    () => document.documentElement.dataset.theme ?? "matrix-dark",
  );

  function handleThemeSelect(theme: string) {
    selectTheme(theme);
    setSelectedTheme(theme);
  }

  return (
    <Card
      as="section"
      variant="solid"
      padding="none"
      className="theme-card"
      aria-labelledby="theme-heading"
    >
      <CardHeader>
        <h2 id="theme-heading" className="theme-card-heading">
          Theme
        </h2>
        <CardDescription>Choose a color theme for CodeArena.</CardDescription>
      </CardHeader>

      <div className="theme-options" role="group" aria-labelledby="theme-heading">
        {themes.map(({ id, name }) => {
          const isSelected = selectedTheme === id;

          return (
            <Button
              key={id}
              variant="ghost"
              className="theme-option"
              aria-pressed={isSelected}
              onClick={() => handleThemeSelect(id)}
            >
              <ThemePallete theme={id} />
              <span className="theme-option-label">
                {name}
                {isSelected && <Check size={16} aria-hidden="true" />}
              </span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
