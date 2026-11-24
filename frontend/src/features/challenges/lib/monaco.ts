import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import EditorWorker from "monaco-editor/editor/editor.worker.js?worker";
import TypeScriptWorker from "monaco-editor/language/typescript/ts.worker.js?worker";

self.MonacoEnvironment = {
  getWorker(_moduleId, label) {
    if (label === "javascript" || label === "typescript") {
      return new TypeScriptWorker();
    }

    return new EditorWorker();
  },
};

loader.config({ monaco });

export function applyEditorTheme() {
  const styles = getComputedStyle(document.documentElement);

  const color = (name: string) => styles.getPropertyValue(name).trim();

  monaco.editor.defineTheme("codearena", {
    base: styles.colorScheme === "light" ? "vs" : "vs-dark",
    inherit: true,

    rules: [
      { token: "", foreground: color("--text-primary").slice(1) },
      { token: "keyword", foreground: color("--accent").slice(1) },
      { token: "string", foreground: color("--success").slice(1) },
      { token: "number", foreground: color("--info").slice(1) },
      { token: "comment", foreground: color("--text-muted").slice(1) },
    ],

    colors: {
      "editor.background": color("--bg-secondary"),
      "editor.foreground": color("--text-primary"),
      "editorCursor.foreground": color("--accent"),
      "editorLineNumber.foreground": color("--text-muted"),
      "editorLineNumber.activeForeground": color("--accent"),
      "editor.selectionBackground": color("--bg-tertiary"),
      "editor.lineHighlightBackground": color("--bg-tertiary"),
      "editorGutter.background": color("--bg-secondary"),
    },
  });

  monaco.editor.setTheme("codearena");
}
