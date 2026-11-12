import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export type DropdownItem = {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  destructive?: boolean;
  /** show a ">" on the right (like "Profile" in the design) */
  chevron?: boolean;
};

type DropdownProps = {
  /** a node, or a function that receives `open` so you can rotate a chevron */
  trigger: ReactNode | ((open: boolean) => ReactNode);
  items: DropdownItem[];
  /** optional block above the items (user info). A divider is added below it */
  header?: ReactNode;
  align?: "left" | "right";
  className?: string;
  menuClassName?: string;
};

export function Dropdown({
  trigger,
  items,
  header,
  align = "right",
  className = "",
  menuClassName = "w-64",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative inline-block text-left ${className}`}>
      <div
        onClick={() => setOpen((v) => !v)}
        role="button"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {typeof trigger === "function" ? trigger(open) : trigger}
      </div>

      {open && (
        <div
          role="menu"
          className={`absolute z-50 mt-2 rounded-ui border border-border bg-card p-1 shadow-lg shadow-black/25 backdrop-blur-glass ${menuClassName} ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {header && (
            <div className="mb-1 border-b border-border px-3 py-3">
              {header}
            </div>
          )}

          {items.map((item, index) => (
            <button
              key={index}
              role="menuitem"
              type="button"
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-ui px-3 py-2.5 text-left text-sm transition-colors duration-(--duration) ease-ui ${
                item.destructive
                  ? "text-destructive hover:bg-destructive/10"
                  : "text-foreground hover:bg-accent/10 hover:text-accent"
              }`}
            >
              {item.icon && (
                <span
                  aria-hidden="true"
                  className="flex size-4 items-center justify-center text-muted-foreground"
                >
                  {item.icon}
                </span>
              )}
              <span className="flex-1 truncate">{item.label}</span>
              {item.chevron && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m9 6 6 6-6 6" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}