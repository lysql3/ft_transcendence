import { cloneElement, useEffect, useId, useRef, useState } from "react";
import type {
  ButtonHTMLAttributes,
  KeyboardEvent,
  ReactElement,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type TriggerElement = ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>;

export type DropdownItem = {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  destructive?: boolean;
  disabled?: boolean;
  chevron?: boolean;
};

type DropdownProps = {
  /** A native button, or a render function returning a native button. */
  trigger: TriggerElement | ((open: boolean) => TriggerElement);
  items: DropdownItem[];
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
  className,
  menuClassName = "w-64",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [initialFocus, setInitialFocus] = useState<"first" | "last">("first");
  const id = useId();
  const triggerElement =
    typeof trigger === "function" ? trigger(open) : trigger;
  const triggerId = triggerElement.props.id ?? `${id}-trigger`;
  const menuId = `${id}-menu`;

  function focusTrigger() {
    ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }

  useEffect(() => {
    if (!open) return;
    const buttons = menuRef.current?.querySelectorAll<HTMLButtonElement>(
      "[role='menuitem']:not(:disabled)",
    );
    const index = initialFocus === "last" ? (buttons?.length ?? 0) - 1 : 0;
    if (buttons?.length) buttons[index]?.focus();
    else menuRef.current?.focus();

    const onDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, initialFocus]);

  function handleMenuKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" || event.key === "Tab") {
      if (event.key === "Escape") event.preventDefault();
      setOpen(false);
      focusTrigger();
      return;
    }
    const buttons = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(
        "[role='menuitem']:not(:disabled)",
      ) ?? [],
    );
    if (!buttons.length) return;
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    let next: number;
    switch (event.key) {
      case "ArrowDown":
        next = (index + 1) % buttons.length;
        break;
      case "ArrowUp":
        next = (index - 1 + buttons.length) % buttons.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = buttons.length - 1;
        break;
      default: {
        if (
          event.key.length !== 1 ||
          event.ctrlKey ||
          event.metaKey ||
          event.altKey
        )
          return;
        next = buttons.findIndex((_, offset) => {
          const candidate = buttons[(index + 1 + offset) % buttons.length];
          return candidate.textContent
            ?.trim()
            .toLowerCase()
            .startsWith(event.key.toLowerCase());
        });
        if (next < 0) return;
        next = (index + 1 + next) % buttons.length;
      }
    }
    event.preventDefault();
    buttons[next]?.focus();
  }

  return (
    <div
      ref={ref}
      className={cn("relative inline-block text-left", className)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setOpen(false);
      }}
    >
      {cloneElement(triggerElement, {
        id: triggerId,
        type: triggerElement.props.type ?? "button",
        "aria-expanded": open,
        "aria-haspopup": "menu",
        "aria-controls": open ? menuId : undefined,
        onClick: (event) => {
          triggerElement.props.onClick?.(event);
          if (event.defaultPrevented) return;
          setInitialFocus("first");
          setOpen((value) => !value);
        },
        onKeyDown: (event) => {
          triggerElement.props.onKeyDown?.(event);
          if (
            event.defaultPrevented ||
            !["ArrowDown", "ArrowUp"].includes(event.key)
          )
            return;
          event.preventDefault();
          setInitialFocus(event.key === "ArrowUp" ? "last" : "first");
          setOpen(true);
        },
      })}

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 max-w-[calc(100vw-2rem)] rounded-ui border border-border bg-popover p-1 text-popover-foreground shadow-lg shadow-black/25 backdrop-blur-glass",
            align === "right" ? "right-0" : "left-0",
            menuClassName,
          )}
        >
          {header && (
            <div className="mb-1 border-b border-border px-3 py-3">
              {header}
            </div>
          )}
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            tabIndex={-1}
            onKeyDown={handleMenuKey}
          >
            {items.map((item, index) => (
              <button
                key={`${item.label}-${index}`}
                role="menuitem"
                type="button"
                tabIndex={-1}
                disabled={item.disabled}
                onClick={() => {
                  setOpen(false);
                  focusTrigger();
                  item.onClick();
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-ui px-3 py-2.5 text-left text-sm transition-colors duration-(--duration) ease-ui disabled:cursor-not-allowed disabled:opacity-50",
                  item.destructive
                    ? "text-destructive hover:bg-destructive/10 focus-visible:bg-destructive/10"
                    : "text-foreground hover:bg-accent/10 hover:text-accent focus-visible:bg-accent/10 focus-visible:text-accent",
                )}
              >
                {item.icon && (
                  <span
                    aria-hidden="true"
                    className="flex size-4 items-center justify-center text-current"
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
        </div>
      )}
    </div>
  );
}
