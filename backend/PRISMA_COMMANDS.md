# Prisma Commands

Prisma ORM 8 CLI. Run from the project root. Commands are listed in the order you will meet them: one-time first, daily after.

> Only `db ...` commands change the database. `contract ...` and `migration ...` commands only touch files in the repo.

---

## Part 1: One-time setup (project creator only)

| # | Command | What it does |
|---|---------|--------------|
| 1 | `npx prisma orm init --target postgres --authoring psl` | Creates `prisma.config.ts`, `contract.prisma`, `db.ts`, `.env.example` and installs dependencies |
| 2 | `npx prisma contract emit` | Generates `contract.json` and `contract.d.ts` from `contract.prisma` |
| 3 | `npx prisma db init` | Creates the tables in an empty database and signs it |
| 4 | `npx prisma migration plan --name init` | Writes the first migration (baseline) |

---

## Part 2: Joining the project (each teammate, once per machine)

| # | Command | What it does |
|---|---------|--------------|
| 1 | `npm install` | Installs dependencies |
| 2 | `cp .env.example .env` | Creates your local env file (then fill in `DATABASE_URL`) |
| 3 | `npx prisma contract emit` | Regenerates `contract.json` and `contract.d.ts` |
| 4 | `npx prisma db migrate` | Applies all committed migrations to your empty local database |

---

## Part 3: Daily commands (repeating)

### Changing the data model

After editing `contract.prisma`, run these in order:

| # | Command | What it does |
|---|---------|--------------|
| 1 | `npx prisma contract emit` | Regenerates `contract.json` and `contract.d.ts` |
| 2 | `npx prisma migration plan --name <change_name>` | Writes a new migration directory for the change |
| 3 | `npx prisma db migrate --advance-ref db` | Applies pending migrations and updates the `db` ref |

Example: `npx prisma migration plan --name add_match_status`

### After pulling teammates' changes

| Command | What it does |
|---------|--------------|
| `npx prisma contract emit` | Regenerates the contract files |
| `npx prisma db migrate --advance-ref db` | Applies new migrations from the repo to your database |

### Checking state

| Command | What it does |
|---------|--------------|
| `npx prisma migration status` | Shows which migrations are pending |
| `npx prisma migration log` | Shows which migrations have been applied |
| `npx prisma db verify` | Reports whether the database matches the contract (changes nothing) |

### Quick experiments (local dev database only)

| Command | What it does |
|---------|--------------|
| `npx prisma db update --dry-run` | Shows what would change in the database without applying it |
| `npx prisma db update` | Applies the contract directly to the database with no migration file |

---

## Part 4: Rare / recovery

| Command | What it does |
|---------|--------------|
| `npx prisma db sign` | Records the current contract hash in a database that already matches it |
| `npx prisma migration ref set db <migration-dir-or-hash>` | Points the `db` ref at a given contract by hand |
| `npx prisma db verify --db "$DATABASE_URL"` | Checks a specific database (e.g. in CI) against the contract |
| `npx prisma db migrate --db "$DATABASE_URL"` | Applies migrations to a specific database (e.g. in CI or deploy) |

---

## CI check

```bash
npx prisma contract emit
git diff --exit-code <path-to-contract-folder>
npx prisma db migrate --db "$DATABASE_URL"
npx prisma db verify --db "$DATABASE_URL"
```

---

## Full change workflow (summary)

```
edit contract.prisma
  → npx prisma contract emit
  → npx prisma migration plan --name <name>
  → review the new migrations/app/<name>/ directory
  → npx prisma db migrate --advance-ref db
  → commit: contract.prisma, contract.json, contract.d.ts, migrations/
```

## Notes

- The first line of `contract.prisma` must be `// use prisma-8`.
- Never edit `contract.json` or `contract.d.ts` by hand.
- Always run `contract emit` before any other command after changing the contract.
- Prisma ORM 8 may still be in release-candidate status. Check `npx prisma --help` and the official docs if a command behaves differently.
