import { useEffect, useState } from "react";

type Health = { status: string; db?: string };
type State =
  | { kind: "loading" }
  | { kind: "ok"; data: Health }
  | { kind: "error"; message: string };

export default function App() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    const ctrl = new AbortController();

    fetch("/api/health", { signal: ctrl.signal })
      .then(async (res) => {
        // the backend returns JSON even on 503 (db down), so read the body either way
        const data: Health = await res.json();
        setState(
          res.ok
            ? { kind: "ok", data }
            : {
                kind: "error",
                message: `HTTP ${res.status}: ${JSON.stringify(data)}`,
              },
        );
      })
      .catch((err) => {
        if (err.name !== "AbortError")
          setState({ kind: "error", message: String(err) });
      });

    return () => ctrl.abort();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="rounded-xl bg-slate-800 p-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-emerald-400">
          ft_transcendence
        </h1>

        {state.kind === "loading" && (
          <p className="mt-4 text-slate-400">Checking backend...</p>
        )}

        {state.kind === "ok" && (
          <pre className="mt-4 rounded bg-slate-900 p-4 text-left text-emerald-300">
            {JSON.stringify(state.data, null, 2)}
          </pre>
        )}

        {state.kind === "error" && (
          <p className="mt-4 max-w-md break-words text-red-400">
            Backend unreachable: {state.message}
          </p>
        )}
      </div>
    </div>
  );
}
