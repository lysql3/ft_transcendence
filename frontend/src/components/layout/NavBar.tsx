import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export type NavLink = { label: string; href: string };

type NavBarProps = {
  links: NavLink[];
  homeHref?: string;
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
    `text-sm font-medium transition-colors hover:text-accent ${
      isActive(href) ? "text-accent" : "text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/20 backdrop-blur-glass transition-colors duration-200">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-page items-center justify-between gap-gutter px-gutter py-4"
      >
        <a href={homeHref} aria-label="CodeArena home">
          <Logo />
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
          className="cursor-pointer border border-border px-3 py-1.5 text-sm text-foreground rounded-ui md:hidden transition-colors hover:border-accent"
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
          className="border-t border-border px-gutter pb-4 md:hidden bg-background/95 backdrop-blur-glass"
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
          <div className="flex items-center gap-3 pt-2">
            <Button variant="outline" className="w-full">Log in</Button>
            <Button className="w-full">Sign up</Button>
          </div>
        </div>
      )}
    </header>
  );
};