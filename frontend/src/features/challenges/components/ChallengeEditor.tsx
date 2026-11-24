import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { applyEditorTheme } from "../lib/monaco";
import ChallengeOutput from "./ChallengeOutput";
import { Button } from "@/components/ui/Button";
import { Play, Send } from "lucide-react";
import { ResizeHandle } from "@/components/ui/ResizeHandle";
import type { Challenge, EditorLanguage } from "../types/challenge";

const editorLanguages = {
  javascript: { label: "JavaScript", filename: "solution.js" },
  typescript: { label: "TypeScript", filename: "solution.ts" },
};

type ChallengeEditorProps = { challenge: Challenge };

export default function ChallengeEditor({ challenge }: ChallengeEditorProps) {
  const [language, setLanguage] = useState<EditorLanguage>("javascript");
  const [outputHeight, setOutputHeight] = useState(160);
  const editorAreaRef = useRef<HTMLDivElement>(null);

  const [maxOutputHeight, setMaxOutputHeight] = useState(160);

  const [drafts, setDrafts] = useState<Record<EditorLanguage, string>>(() => ({
    javascript:
      challenge.starterCode?.javascript ?? "// Write your solution here.\n",
    typescript: challenge.starterCode?.typescript ?? "// Write your solution here.\n",
  }));

  const code = drafts[language];

  function updateCurrentDraft(value: string) {
    setDrafts((current) => ({
      ...current,
      [language]: value,
    }));
  }

  useEffect(() => {
    const root = document.documentElement;

    const observer = new MutationObserver(() => {
      applyEditorTheme();
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });

    return () => observer.disconnect();
  }, []);

  // Keep at least 160px for Monaco, including after viewport changes.
  useEffect(() => {
    const area = editorAreaRef.current;
    if (!area) return;
    const observer = new ResizeObserver(() => {
      const limit = Math.max(96, outputHeight + area.clientHeight - 160);
      setMaxOutputHeight(limit);
      setOutputHeight((height) => Math.min(limit, Math.max(96, height)));
    });
    observer.observe(area);
    return () => observer.disconnect();
  }, [outputHeight]);

  return (
    <Card
      variant="solid"
      padding="none"
      className="flex h-[85dvh] min-h-[32rem] min-w-0 flex-col overflow-hidden"
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
        <span className="text-sm text-foreground">
          {editorLanguages[language].filename}
        </span>

        <select
          aria-label="Editor language"
          value={language}
          onChange={(event) => {
            const value = event.target.value;

            if (value === "javascript" || value === "typescript") {
              setLanguage(value);
            }
          }}
          className="w-auto cursor-pointer rounded-ui border border-border bg-card px-3 py-1.5 text-xs text-foreground"
        >
          {Object.entries(editorLanguages).map(([value, config]) => (
            <option key={value} value={value}>
              {config.label}
            </option>
          ))}
        </select>
      </header>

      <div ref={editorAreaRef} className="min-h-0 flex-1">
        <Editor
          height="100%"
          path={`challenge-${challenge.id}/${editorLanguages[language].filename}`}
          language={language}
          theme="codearena"
          beforeMount={applyEditorTheme}
          value={code}
          onChange={(value) => updateCurrentDraft(value ?? "")}
          loading={<Spinner label="Loading code editor" />}
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            accessibilitySupport: "auto",
            ariaLabel: `${challenge.title} solution editor`,
            tabSize: 2,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
      <div
        role="group"
        aria-label="Code actions"
        className="flex shrink-0 flex-wrap items-center justify-end gap-inline border-t border-border bg-card px-4 py-3"
      >
        <Button variant="outline" size="sm">
          <Play aria-hidden="true" className="size-4" />
          Run code
        </Button>

        <Button variant="solid" size="sm">
          <Send aria-hidden="true" className="size-4" />
          Submit
        </Button>
      </div>
      <ResizeHandle
        orientation="horizontal"
        aria-label="Resize output panel"
        aria-valuetext={`${Math.round(outputHeight)} pixels output height`}
        value={outputHeight}
        min={96}
        max={maxOutputHeight}
        step={16}
        reverse
        onValueChange={setOutputHeight}
      />
      <ChallengeOutput height={outputHeight} />
    </Card>
  );
}
