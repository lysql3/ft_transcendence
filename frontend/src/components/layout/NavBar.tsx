import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown } from "@/components/ui/DropDown";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import {
  Settings,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  User as UserIcon,
  X,
} from "lucide-react";
import { authClient } from "@/features/auth/lib/authClient";

export type NavLink = {
  label: string;
  href: string;
  /** Other routes that represent the same navigation section. */
  activePaths?: string[];
};

type NavUser = {
  name: string;
  email: string;
  avatarUrl?: string | null;
};

const guestLinks: NavLink[] = [];

const userLinks: NavLink[] = [
  { label: "Home", href: "/", activePaths: ["/dashboard"] },
  { label: "Challenges", href: "/challenges" },
  { label: "Leaderboard", href: "/leaderboard" },
];

type LinkItemProps = {
  links: NavLink[];
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block border-b pb-1 text-sm font-medium transition-colors duration-(--duration) ease-ui hover:text-accent ${
    isActive
      ? "border-accent text-accent"
      : "border-transparent text-muted-foreground"
  }`;

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block py-3 text-sm font-medium transition-colors duration-(--duration) ease-ui hover:text-accent ${
    isActive ? "text-accent" : "text-muted-foreground"
  }`;

export function LinkItem({
  links,
  variant = "desktop",
  onNavigate,
}: LinkItemProps) {
  const { pathname } = useLocation();
  if (links.length === 0) return null;
  const isDesktop = variant === "desktop";

  return (
    <ul
      className={
        isDesktop ? "hidden items-center gap-8 md:flex" : "flex flex-col py-2"
      }
    >
      {links.map(({ label, href, activePaths = [] }) => {
        const isActive = [href, ...activePaths].some((path) =>
          matchPath({ path, end: href === "/" }, pathname),
        );
        return (
          <li
            key={href}
            className={
              isDesktop ? "" : "border-b border-border last:border-b-0"
            }
          >
            <Link
              to={href}
              aria-current={isActive ? "page" : undefined}
              className={(isDesktop ? desktopLinkClass : mobileLinkClass)({
                isActive,
              })}
              onClick={onNavigate}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------------------------------- Guest --------------------------------- */

function GuestNavBar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/20 backdrop-blur-glass transition-colors duration-(--duration) ease-ui">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-page items-center justify-between gap-gutter px-gutter py-4"
      >
        <Link to="/" aria-label="CodeArena home">
          <Logo />
        </Link>

        <LinkItem links={guestLinks} />

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/signup">
            <Button variant="outline">SIGN UP</Button>
          </Link>
          <Link to="/login">
            <Button>LOGIN</Button>
          </Link>
        </div>

        <button
          type="button"
          className="cursor-pointer rounded-ui border border-border p-1.5 text-foreground transition-colors duration-(--duration) ease-ui hover:border-accent md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-background/95 px-gutter pb-4 backdrop-blur-glass md:hidden"
        >
          <LinkItem links={guestLinks} variant="mobile" onNavigate={close} />

          <div className="flex items-center gap-3 pt-2">
            <Link to="/signup" onClick={close} className="flex-1">
              <Button variant="outline" className="w-full">
                SIGN UP
              </Button>
            </Link>
            <Link to="/login" onClick={close} className="flex-1">
              <Button className="w-full">LOGIN</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------------------------------- User ---------------------------------- */

function NotificationButton({ hasUnread = true }: { hasUnread?: boolean }) {
  return (
    <button
      type="button"
      aria-label={hasUnread ? "Notifications (unread)" : "Notifications"}
      className="relative cursor-pointer rounded-ui p-2 text-muted-foreground transition-colors duration-(--duration) ease-ui hover:text-accent"
    >
      <Bell className="size-5" />
      {hasUnread && (
        <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-accent shadow-glow" />
      )}
    </button>
  );
}

function UserNavBar({ user: suppliedUser }: { user?: NavUser }) {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const user: NavUser = suppliedUser ?? {
    name: session?.user.username || session?.user.name || "Player",
    email: session?.user.email || "example@example.com",
    avatarUrl: "https://api.dicebear.com/10.x/identicon/svg?backgroundColor=101216&rowColor=ff2e88,00e5ff,ffe600,7cff00,ff6a00,b400ff&seed=" + (session?.user?.name || "Player"),
  };

  const close = () => setOpen(false);

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        setLogoutError("Unable to log out. Please try again.");
        return;
      }

      navigate("/", { replace: true });
    } catch {
      setLogoutError("Unable to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  const menuItems = [
    {
      label: "Profile",
      icon: <UserIcon className="size-4" />,
      chevron: true,
      onClick: () => navigate("/profile"),
    },
    {
      label: "Settings",
      icon: <Settings className="size-4" />,
      chevron: true,
      onClick: () => navigate("/settings"),
    },
    {
      label: isLoggingOut ? "Logging out…" : "Log out",
      icon: <LogOut className="size-4" />,
      destructive: true,
      disabled: isLoggingOut,
      onClick: () => {
        void handleLogout();
      },
    },
  ];

  const menuHeader = (
    <div className="flex items-center gap-3">
      <Avatar src={user.avatarUrl} name={user.name} className="size-10" />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          {user.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/20 backdrop-blur-glass transition-colors duration-(--duration) ease-ui">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-page items-center gap-gutter px-gutter py-4"
      >
        <Link to="/" aria-label="CodeArena home" className="shrink-0">
          <Logo />
        </Link>

        {/* centered links on desktop */}
        <div className="flex flex-1 justify-center">
          <LinkItem links={userLinks} />
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <NotificationButton />

          <Dropdown
            align="right"
            items={menuItems}
            header={menuHeader}
            trigger={(isOpen) => (
              <button
                type="button"
                aria-label="Account menu"
                className="flex cursor-pointer items-center gap-2 rounded-ui px-1.5 py-1 text-sm text-foreground transition-colors duration-(--duration) ease-ui hover:text-accent"
              >
                <Avatar
                  src={user.avatarUrl}
                  name={user.name}
                  className="size-8"
                />
                <span className="hidden max-w-32 truncate md:inline">
                  {user.name}
                </span>
                <ChevronDown
                  className={`size-4 text-muted-foreground transition-transform duration-(--duration) ease-ui ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          />

          <button
            type="button"
            className="cursor-pointer rounded-ui p-1.5 text-accent transition-colors duration-(--duration) ease-ui md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {logoutError && (
        <p
          role="alert"
          className="mx-auto max-w-page px-gutter py-2 text-sm text-destructive"
        >
          {logoutError}
        </p>
      )}

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-background/95 px-gutter backdrop-blur-glass md:hidden"
        >
          <LinkItem links={userLinks} variant="mobile" onNavigate={close} />
        </div>
      )}
    </header>
  );
}

/* --------------------------------- Switch --------------------------------- */

export function NavBar({
  type = "GuestNavBar",
  user,
}: {
  type?: "GuestNavBar" | "UserNavBar";
  user?: NavUser;
}) {
  return type === "GuestNavBar" ? <GuestNavBar /> : <UserNavBar user={user} />;
}
