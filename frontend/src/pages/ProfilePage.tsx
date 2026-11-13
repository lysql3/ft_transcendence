import {
  Award,
  Braces,
  Code,
  Flame,
  Shield,
  Sparkles,
  SquareCheck,
  SquareX,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NavBar } from "@/components/layout/NavBar";
import { Card, CardHeader } from "@/components/ui/Card";
import { Bar } from "@/components/ui/Bar";
import avatarImage from "@/assets/images/omben-ch.jpg";

/* ---------- Types ---------- */

type Player = {
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  level: number;
  /** XP earned in the current level */
  xp: number;
  /** XP needed to reach the next level */
  xpToNextLevel: number;
  rank: number;
  season: number;
  isOnline: boolean;
  challengesSolved: number;
  totalXp: number;
  currentStreak: number;
  wins: number;
};

type Difficulty = "Easy" | "Medium" | "Hard" | "Very Hard";
type MatchResult = "Win" | "Loss";

type Match = {
  id: number;
  puzzle: string;
  /** ISO date, e.g. 2023-01-31 */
  date: string;
  difficulty: Difficulty;
  result: MatchResult;
  xpGained: number;
};

type StatItem = {
  icon: LucideIcon;
  title: string;
  value: number;
  unit: string;
};

/* ---------- Placeholder data. Replace with data from your API. ---------- */

const player: Player = {
  name: "GALACTUS",
  email: "Omben-ch@example.com",
  avatarUrl: avatarImage,
  bio: "Competitive coder. Problem solver. Always ready for the next challenge.",
  level: 190,
  xp: 700,
  xpToNextLevel: 2000,
  rank: 25,
  season: 1,
  isOnline: true,
  challengesSolved: 18,
  totalXp: 120000,
  currentStreak: 5,
  wins: 18,
};

const matchHistory: Match[] = [
  { id: 1, puzzle: "Two Sum, One Arena", date: "2023-01-01", difficulty: "Easy", result: "Win", xpGained: 50 },
  { id: 2, puzzle: "The Vanishing Path", date: "2023-01-02", difficulty: "Medium", result: "Loss", xpGained: 20 },
  { id: 3, puzzle: "The Maze of Mirrors", date: "2023-01-03", difficulty: "Hard", result: "Win", xpGained: 100 },
  { id: 4, puzzle: "Binary Tree Patrol", date: "2023-01-04", difficulty: "Very Hard", result: "Win", xpGained: 200 },
];

/* ---------- Helpers ---------- */

const numberFormat = new Intl.NumberFormat("en-US");
const dateFormat = new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" });

const cornerBase = "pointer-events-none absolute size-5 border-accent";

const difficultyColor: Record<Difficulty, string> = {
  Easy: "text-success",
  Medium: "text-warning",
  Hard: "text-destructive",
  "Very Hard": "text-destructive",
};

// Built from the player, so the stats follow the data when it comes from your API.
const getStats = (p: Player): StatItem[] => [
  { icon: Code, title: "CHALLENGES SOLVED", value: p.challengesSolved, unit: "Challenges" },
  { icon: Braces, title: "TOTAL XP", value: p.totalXp, unit: "XP" },
  { icon: Flame, title: "CURRENT STREAK", value: p.currentStreak, unit: "Days" },
  { icon: Trophy, title: "MATCH WINS", value: p.wins, unit: "Wins" },
];

/* ---------- Avatar ---------- */

type AvatarCardProps = {
  name: string;
  avatarUrl: string;
  level: number;
  className?: string;
};

function AvatarCard({ name, avatarUrl, level, className = "" }: AvatarCardProps) {
  return (
    <div className={`relative w-full max-w-xs p-2 ${className}`}>
      <span aria-hidden="true" className={`${cornerBase} left-0 top-0 border-l-2 border-t-2`} />
      <span aria-hidden="true" className={`${cornerBase} bottom-0 right-0 border-b-2 border-r-2`} />

      <div className="relative border border-border bg-card/60 p-2 backdrop-blur-glass">
        <img src={avatarUrl} alt={`${name}'s avatar`} className="block aspect-square w-full object-cover" />

        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 border border-accent bg-background/90 px-3 py-1.5 text-xs tracking-ui text-accent backdrop-blur-glass">
          <Shield aria-hidden="true" className="size-4" />
          <span>LVL {level}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Name, status and bio ---------- */

type PlayerIdentityCardProps = {
  name: string;
  email: string;
  isOnline: boolean;
  bio: string;
};

function PlayerIdentityCard({ name, email, isOnline, bio }: PlayerIdentityCardProps) {
  return (
    <Card variant="flat" padding="none" className="flex min-w-0 flex-col justify-center gap-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span
          aria-hidden="true"
          className={`size-2 rounded-full ${
            isOnline ? "animate-pulse bg-success shadow-[0_0_10px_var(--success)]" : "bg-muted-foreground"
          }`}
        />
        <span>{isOnline ? "Online" : "Offline"}</span>
      </div>
      <h1 className="break-words text-3xl font-extrabold uppercase leading-none tracking-ui text-foreground sm:text-5xl xl:text-6xl">
        {name}
      </h1>
      <p className="break-all text-sm text-muted-foreground lg:text-base">{email}</p>
      <p className="text-sm text-muted-foreground lg:text-base">{bio}</p>
    </Card>
  );
}

/* ---------- Global rank ---------- */

function RankCard({ rank }: { rank: number }) {
  const currentRank = Math.max(1, Math.floor(rank));

  return (
    <Card variant="flat" className="flex min-h-32 min-w-0 flex-col items-center justify-center gap-2 text-center">
      <h2 className="text-lg font-medium uppercase tracking-ui text-muted-foreground">Global rank</h2>
      <div className="flex items-center gap-2">
        <p className="text-3xl font-medium leading-none tracking-ui text-accent tabular-nums sm:text-4xl">
          #{numberFormat.format(currentRank)}
        </p>
        <Award aria-hidden="true" className="size-8 text-accent" />
      </div>
    </Card>
  );
}

/* ---------- Profile header section ---------- */

function PlayerProfileCard({ player }: { player: Player }) {
  return (
    <Card variant="flat">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs tracking-widest text-muted-foreground">
          <span>PLAYER PROFILE</span>
          <div className="flex items-center gap-inline">
            <span aria-hidden="true" className="hidden h-px w-10 bg-border sm:block" />
            <span>SEASON {player.season}</span>
          </div>
        </div>
      </CardHeader>

      {/* Phones/tablets: stacked.  Desktop (lg+): avatar | identity | rank, side by side. */}
      <div className="flex flex-col gap-stack lg:grid lg:grid-cols-3 lg:gap-gutter">
        <AvatarCard name={player.name} avatarUrl={player.avatarUrl} level={player.level} />
        <PlayerIdentityCard name={player.name} email={player.email} isOnline={player.isOnline} bio={player.bio} />
        <RankCard rank={player.rank} />
      </div>
    </Card>
  );
}

/* ---------- Level and XP ---------- */

type LevelProgressCardProps = {
  level: number;
  /** XP earned in this level */
  value: number;
  /** XP needed to reach the next level */
  max: number;
  className?: string;
};

function LevelProgressCard({ level, value, max, className = "" }: LevelProgressCardProps) {
  const current = Math.min(Math.max(value, 0), max);
  const remaining = max - current;
  // floor, not round: 99.7% must not read as "100%" while XP is still missing
  const percent = max > 0 ? Math.floor((current / max) * 100) : 0;

  return (
    <Card
      variant="gradient"
      padding="lg"
      className={`flex min-w-0 flex-col justify-center gap-4 sm:flex-row sm:items-center sm:gap-8 ${className}`}
    >
      <div className="flex shrink-0 flex-col gap-1">
        <div className="flex items-center gap-2">
          <Sparkles aria-hidden="true" className="size-4 text-accent" />
          <h2 className="text-xs font-semibold uppercase tracking-ui text-muted-foreground">Player progression</h2>
        </div>
        <p className="text-2xl font-bold tracking-ui text-foreground">
          LEVEL <span className="text-accent">{level}</span>
        </p>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Bar
          glow={false}
          size="lg"
          value={current}
          max={max}
          label="XP"
          valueText={`${numberFormat.format(current)} / ${numberFormat.format(max)}`}
        />

        <div className="flex items-center justify-between text-xs tracking-ui text-muted-foreground">
          <span>{percent}%</span>
          <span>
            {numberFormat.format(remaining)} XP to LEVEL {level + 1}
          </span>
        </div>
      </div>
    </Card>
  );
}

/* ---------- Stats ---------- */

function StatCard({ icon: Icon, title, value, unit }: StatItem) {
  return (
    <Card variant="gradient" padding="sm">
      {/* A plain div, not CardHeader: its space-y margin would push the title below the icon */}
      <div className="mb-3 flex items-center gap-2">
        <Icon aria-hidden="true" className="size-4 shrink-0 text-accent" />
        <h3 className="text-sm font-semibold uppercase tracking-ui text-muted-foreground">{title}</h3>
      </div>
      <p className="flex items-baseline gap-2">
        <span className="text-lg font-medium tracking-ui text-foreground">{numberFormat.format(value)}</span>
        <span className="text-sm tracking-ui text-muted-foreground">{unit}</span>
      </p>
    </Card>
  );
}

function StatsGrid({ stats }: { stats: StatItem[] }) {
  return (
    <section aria-labelledby="player-stats-title">
      <h2 id="player-stats-title" className="sr-only">
        Player stats
      </h2>
      <div className="grid grid-cols-2 gap-stack lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </section>
  );
}

/* ---------- Match history ---------- */

function MatchRow({ match }: { match: Match }) {
  const didWin = match.result === "Win";
  const ResultIcon = didWin ? SquareCheck : SquareX;
  const resultColor = didWin ? "text-success" : "text-destructive";

  return (
    <Card
      as="li"
      variant="gradient"
      padding="sm"
      className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3"
    >
      <ResultIcon aria-hidden="true" className={`size-5 ${resultColor}`} />

      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-foreground">{match.puzzle}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{dateFormat.format(new Date(`${match.date}T00:00:00`))}</p>
      </div>

      <span className={`px-2 py-1 text-xs font-semibold ${difficultyColor[match.difficulty]}`}>{match.difficulty}</span>

      <div className="min-w-16 text-right">
        <p className={`text-xs font-semibold uppercase tracking-ui ${resultColor}`}>{match.result}</p>
        <p className="mt-1 text-xs text-muted-foreground">+{numberFormat.format(match.xpGained)} XP</p>
      </div>
    </Card>
  );
}

function MatchHistoryCard({ matches }: { matches: Match[] }) {
  // Newest first, last four. ISO dates sort correctly as plain strings.
  const recentMatches = [...matches].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  return (
    <Card variant="flat" padding="lg">
      <CardHeader>
        <h2 className="font-semibold uppercase tracking-ui">
          MATCH <span className="text-accent">HISTORY</span>
        </h2>
      </CardHeader>

      {recentMatches.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {recentMatches.map((match) => (
            <MatchRow key={match.id} match={match} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No match history available.</p>
      )}
    </Card>
  );
}

/* ---------- Page ---------- */

export default function ProfilePage() {
  return (
    <>
      <NavBar type="UserNavBar" />
      <main className="mx-auto flex w-full max-w-page flex-col gap-stack p-gutter">
        <PlayerProfileCard player={player} />
        <hr className="border-border" />
        <LevelProgressCard level={player.level} value={player.xp} max={player.xpToNextLevel} />
        <StatsGrid stats={getStats(player)} />
        <MatchHistoryCard matches={matchHistory} />
      </main>
    </>
  );
}
