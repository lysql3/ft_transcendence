import { useState } from "react";
import { Button } from "../ui/Button";

export type NavLink = { label: string; href: string };

type NavBarProps = {
  links: NavLink[];
  homeHref: string;
  activePath?: string;
};

export const NavBar = ({
  links,
  homeHref = "/",
  activePath = "/",
}: NavBarProps) => {
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/"
      ? activePath === "/"
      : activePath === href || activePath.startsWith(href + "/");

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors hover:text-accent-text ${
      isActive(href) ? "text-accent-text" : "text-fg"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/10 backdrop-blur-[3px]">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3"
      >
        <a
          href={homeHref}
          aria-label={`CodeArena home`}
          className="flex items-center text-xl font-bold tracking-wider
          transition-opacity hover:opacity-90"
        >
          <span className="text-logo">&lt;CodeArena</span>
          <span className="text-accent [text-shadow:0_0_8px_var(--accent)]">
            /
          </span>
          <span className="text-logo">&gt;</span>
        </a>
        <ul className="hidden items-center gap-6 md:flex">
          {links.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className={linkClass(href)}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="outline">SIGN UP</Button>
          <Button>LOGIN</Button>
        </div>

        <button
          type="button"
          className="cursor-pointer border border-line px-3 py-1.5 text-sm text-fg md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-line px-4 pb-4 md:hidden"
        >
          <ul className="flex flex-col gap-4 py-4">
            {links.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className={linkClass(href)}
                  aria-current={isActive(href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <Button variant="outline">Log in</Button>
            <Button>Sign up</Button>
          </div>
        </div>
      )}
    </header>
  );
};
