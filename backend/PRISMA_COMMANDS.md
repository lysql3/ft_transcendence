# Prisma 7 Commands

Run from the project root. Commands are listed in the order you will meet them: one-time first, daily after.

> `generate`, `validate`, `format`, `studio`, `migrate status` do not change the database schema. `migrate dev`, `migrate deploy`, `migrate reset`, `migrate resolve`, `db push` do.

---

## Part 1: One-time setup (project creator only)

| # | Command | What it does |
|---|---------|--------------|
| 1 | `npm install prisma --save-dev` | Installs the Prisma CLI |
| 2 | `npm install @prisma/client @prisma/adapter-pg dotenv` | Installs the client, the PostgreSQL driver adapter, and dotenv |
| 3 | `npx prisma init --datasource-provider postgresql` | Creates `prisma/schema.prisma`, `prisma.config.ts`, and `.env` |
| 4 | `npx prisma validate` | Checks `schema.prisma` for errors |
| 5 | `npx prisma migrate dev --name init` | Creates the first migration and applies it to the dev database |
| 6 | `npx prisma generate` | Generates the Prisma Client |

---

## Part 2: Joining the project (each teammate, once per machine)

| # | Command | What it does |
|---|---------|--------------|
| 1 | `npm install` | Installs dependencies |
| 2 | `cp .env.example .env` | Creates your local env file (then fill in `DATABASE_URL`) |
| 3 | `npx prisma migrate deploy` | Applies all committed migrations to your empty local database |
| 4 | `npx prisma generate` | Generates the Prisma Client |
| 5 | `npx prisma db seed` | Runs the seed script (if the project has one) |

---

## Part 3: Daily commands (repeating)

### Changing the data model

After editing `schema.prisma`:

| # | Command | What it does |
|---|---------|--------------|
| 1 | `npx prisma format` | Formats `schema.prisma` |
| 2 | `npx prisma validate` | Checks `schema.prisma` for errors |
| 3 | `npx prisma migrate dev --name <change_name>` | Creates a new migration and applies it to the dev database |
| 4 | `npx prisma generate` | Regenerates the Prisma Client |

Example: `npx prisma migrate dev --name add_match_status`

### After pulling teammates' changes

| Command | What it does |
|---------|--------------|
| `npx prisma migrate dev` | Applies new migrations from the repo to your dev database |
| `npx prisma generate` | Regenerates the Prisma Client |

### Checking state

| Command | What it does |
|---------|--------------|
| `npx prisma migrate status` | Shows which migrations are applied and which are pending |
| `npx prisma studio` | Opens a browser UI to view and edit data (dev only) |

### Dev database only

| Command | What it does |
|---------|--------------|
| `npx prisma db seed` | Runs the seed script |
| `npx prisma migrate reset` | Drops the dev database, reapplies all migrations, and seeds |
| `npx prisma db push` | Applies `schema.prisma` directly to the database with no migration file |

---

## Part 4: Production (CI / deploy)

| Command | What it does |
|---------|--------------|
| `npx prisma generate` | Generates the Prisma Client during the Docker build |
| `npx prisma migrate deploy` | Applies pending committed migrations to the production database |
| `npx prisma migrate status` | Checks the production database against the migration history |

---

## Part 5: Rare / recovery

| Command | What it does |
|---------|--------------|
| `npx prisma migrate resolve --applied <migration_name>` | Marks a migration as applied in the history table |
| `npx prisma migrate resolve --rolled-back <migration_name>` | Marks a failed migration as rolled back |
| `npx prisma migrate dev --create-only --name <name>` | Creates a migration file without applying it (to edit the SQL first) |
| `npx prisma db pull` | Writes the existing database structure into `schema.prisma` |

---

## Full change workflow (summary)

```
edit schema.prisma
  → npx prisma migrate dev --name <name>
  → npx prisma generate
  → review prisma/migrations/<timestamp>_<name>/migration.sql
  → commit: schema.prisma, prisma/migrations/
```

## Notes

- Never edit a migration that has already been applied. Create a new one.
- Never run `migrate dev`, `migrate reset`, or `db push` against production.
- Do not commit `.env`. Commit `.env.example`.
- The generated client output is gitignored. Run `npx prisma generate` after cloning, after pulling schema changes, and in the Docker build.
- In Prisma 7, `migrate dev` does not run `generate` or `db seed` automatically.
- Prisma 7 reads the database URL from `prisma.config.ts`, not from `schema.prisma`.
- If a flag or command behaves differently, check `npx prisma --help` and the Prisma 7 docs.
