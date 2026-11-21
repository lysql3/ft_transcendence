# NestJS CLI: Generate Commands

Run from the backend project root. `g` is short for `generate`. `<name>` is lowercase, e.g. `users`, `matches`.

---

## Part 1: Project setup (once)

| Command | What it does |
|---------|--------------|
| `npm install -g @nestjs/cli` | Installs the `nest` command globally |
| `nest new <project-name>` | Creates a new NestJS project |
| `npx nest ...` | Runs the project's local Nest CLI if it is not installed globally |

---

## Part 2: Generate one piece

| Command | Short | What it does |
|---------|-------|--------------|
| `nest g module <name>` | `nest g mo <name>` | Creates `<name>.module.ts` and registers it in `app.module.ts` |
| `nest g controller <name>` | `nest g co <name>` | Creates `<name>.controller.ts` and its spec file, and registers it in the module |
| `nest g service <name>` | `nest g s <name>` | Creates `<name>.service.ts` and its spec file, and registers it in the module |

The three files land in `src/<name>/`. Generate the module first, so the controller and service register in it.

```bash
nest g module users
nest g controller users
nest g service users
```

---

## Part 3: Generate everything at once

| Command | Short | What it does |
|---------|-------|--------------|
| `nest g resource <name>` | `nest g res <name>` | Creates module, controller, service, DTOs, and entity together |

`nest g resource` asks two questions:

| Prompt | Choices |
|--------|---------|
| Transport layer | REST API, GraphQL (code first), GraphQL (schema first), Microservice (non-HTTP), WebSockets |
| Generate CRUD entry points? | Yes / No |

For a REST backend choose **REST API**. For Socket.IO choose **WebSockets**.

---

## Part 4: Other generators you will likely use

| Command | Short | What it does |
|---------|-------|--------------|
| `nest g gateway <name>` | `nest g ga <name>` | Creates a WebSocket gateway (Socket.IO) |
| `nest g guard <name>` | `nest g gu <name>` | Creates a guard (auth/permission checks) |
| `nest g pipe <name>` | `nest g pi <name>` | Creates a pipe (validation/transform) |
| `nest g filter <name>` | `nest g f <name>` | Creates an exception filter |
| `nest g interceptor <name>` | `nest g itc <name>` | Creates an interceptor |
| `nest g middleware <name>` | `nest g mi <name>` | Creates a middleware |
| `nest g decorator <name>` | `nest g d <name>` | Creates a custom decorator |
| `nest g class <name>` | `nest g cl <name>` | Creates a plain class (e.g. a DTO) |
| `nest g interface <name>` | `nest g itf <name>` | Creates an interface |
| `nest g provider <name>` | `nest g pr <name>` | Creates a provider class |

---

## Part 5: Flags (work on every generate command)

| Flag | What it does |
|------|--------------|
| `--dry-run` or `-d` | Shows what would be created, writes nothing |
| `--no-spec` | Skips the `.spec.ts` test file |
| `--flat` | Creates the file in `src/` without a subfolder |
| `--skip-import` | Skips registering the file in a module |

Examples:

```bash
nest g resource matches --dry-run
nest g service auth --no-spec
nest g guard jwt-auth --flat
```

---

## Part 6: Nested paths

| Command | What it does |
|---------|--------------|
| `nest g module auth/jwt` | Creates the module in `src/auth/jwt/` |
| `nest g controller auth/jwt` | Creates the controller in `src/auth/jwt/` |

---

## Part 7: Run and build

| Command | What it does |
|---------|--------------|
| `npm run start` | Starts the app |
| `npm run start:dev` | Starts the app and restarts on file changes |
| `npm run build` | Compiles TypeScript into `dist/` |
| `npm run start:prod` | Runs the compiled `dist/main.js` |

---

## Typical workflow (summary)

```
nest g resource matches        # new feature with module, controller, service, DTOs
  → pick REST API, say Yes to CRUD
  → add the DB calls in matches.service.ts
  → nest g guard jwt-auth      # protect routes, if needed
  → nest g gateway game        # real-time events, if needed
```

## Notes

- Always run `--dry-run` first on a big generate (like `resource`) to see which files it will touch.
- Generators register the new class in the nearest module automatically. If it ends up in `app.module.ts` instead, move it by hand.
- Check `nest g --help` and `nest g <schematic> --help` if a flag is missing in your CLI version.
