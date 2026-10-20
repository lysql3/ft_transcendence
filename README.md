# ft_transcendence
work in progress
A modern full-stack application built with **NestJS**, **React + Tailwind CSS (Vite)**, and **PostgreSQL**, managed by multi-stage Docker containerization and orchestrated via Docker Compose.

---

## 🏗️ Architecture & Services Overview

The application is structured into modular microservices communicating across an isolated Docker network (`ft_tra_networks`):

```
                     ┌────────────────────────────────────────┐
                     │          ft_tra_networks               │
                     │                                        │
┌────────────────┐   │   ┌────────────────────────────────┐   │
│  User Browser  │───┼──>│ frontend (Vite dev / Nginx)    │   │
└────────────────┘   │   │  Dev: :5173  | Prod: :443      │   │
                     │   └──────────────┬─────────────────┘   │
                     │                  │ /api proxy          │
                     │                  ▼                     │
                     │   ┌────────────────────────────────┐   │   ┌───────────────┐
                     │   │ backend (NestJS)               │───┼──>│ postgres (16) │
                     │   │  Port 3000 (Global prefix /api)│   │   │  Port 5432    │
                     │   └────────────────────────────────┘   │   └───────────────┘
                     └────────────────────────────────────────┘
```

### 1. `postgres` (Database Service)

- **Role:** Relational database storing persistent application data.
- **Image:** `postgres:16-alpine`.
- **Healthcheck:** Evaluates `pg_isready -U $POSTGRES_USER -d $POSTGRES_DB` to guarantee readiness before dependent services launch.
- **Storage:** Persisted on named Docker volume `pgdata`.
- **Stages:**
  - `dev`: Configured with verbose query logging (`log_statement=all`) and host port mapping (`5432:5432`).
  - `prod`: Hardened configuration, internal to Docker network (not exposed to host).

### 2. `backend` (NestJS API Service)

- **Role:** REST API, business logic, health checks, authentication, and database access.
- **Runtime:** Node.js 24 Alpine, NestJS 12.
- **Routing:** All routes are registered under global prefix `/api` (e.g., `/api`, `/api/health`).
- **Features:** Global validation pipe with DTO whitelisting, CORS enabled.
- **Stages:**
  - `dev`: Watch mode (`npm run start:dev`), bind-mounted `./backend:/app` for instantaneous TypeScript reloads.
  - `build`: Compiles TypeScript with `npm run build` producing `/app/dist`.
  - `prod`: Hardened runtime containing only production dependencies (`npm ci --omit=dev`), runs compiled `node dist/main.js` under the non-root `node` user.

### 3. `frontend` (React + Tailwind v4 + Vite)

- **Role:** Client user interface dashboard.
- **Stack:** React 19, Tailwind CSS v4, Vite 8, TypeScript.
- **Features:** Responsive dark theme, queries backend `/api/health` status with interactive feedback.
- **Stages:**
  - `dev`: Vite HMR dev server on port `5173`, bind-mounted `./frontend:/app` for instant hot module reloading. Proxies `/api` requests to `http://backend:3000`.
  - `build`: Generates optimized static bundle (`npm run build` -> `/app/dist`).
  - `prod`: `nginx:alpine` serving static assets over HTTPS with a self-signed certificate generated during image build, handles client-side SPA routing (`try_files $uri /index.html`), and reverse-proxies `/api/` to `http://backend:3000`.

---

## ⚙️ Environment Configuration

The project supports three environment files:

| File                                   | Purpose                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------- |
| [`.env.example`](file:///.env.example) | Template listing all configurable variables with comments.                |
| [`.env.dev`](file:///.env.dev)         | Default configuration for local development and `docker-compose.dev.yml`. |
| [`.env.prod`](file:///.env.prod)       | Production configuration used by `docker-compose.prod.yml`.               |

### Key Environment Variables

```ini
NODE_ENV=development                       # 'development' or 'production'
POSTGRES_USER=transcendence                # Database superuser
POSTGRES_PASSWORD=devpassword              # Database password
POSTGRES_DB=transcendence_dev              # Database name
POSTGRES_PORT=5432                         # Host port for database (dev only)
PORT=3000                                  # Backend port
DATABASE_URL=postgresql://...              # Full connection string
FRONTEND_PORT=5173                         # Dev port (5173) or Prod port (443)
BACKEND_URL=http://backend:3000            # Backend target for frontend reverse proxy
```

---

## 🚀 Running the Project

### Option A: Containerized Development (Docker Compose)

Best for testing the entire integrated stack with hot-reloading and healthchecks.

```bash
# Build and start dev stack (live logs attached)
make dev

# Or run in background (detached mode)
make dev-d

# Check running containers
docker compose --env-file .env.dev -f docker-compose.base.yml -f docker-compose.dev.yml ps

# View service logs
make logs-dev

# Stop dev containers
make down-dev
```

- **Frontend:** Visit `http://localhost:5173`
- **Backend API:** Visit `http://localhost:3000/api/health`
- **Database:** Connect via `localhost:5432` (`user: transcendence`, `db: transcendence_dev`)
- **Adminer:** Visit `http://localhost:8080` and use `postgres` as the server with the development database credentials

---

### Option B: Containerized Production (Docker Compose)

Tests multi-stage optimized builds (compiled NestJS, non-root user, static Nginx frontend, closed DB ports).

```bash
# Build and start prod stack
make prod

# Or run detached
make prod-d

# View production logs
make logs-prod

# Stop prod containers
make down-prod
```

- **Application (Nginx):** Visit `https://localhost:443` (or configured `FRONTEND_PORT`); accept the self-signed certificate warning
- **API Endpoint:** Visit `https://localhost:443/api/health`
- **Proxy check:** Visit `https://localhost:443/api/whoami` to inspect the trusted client IP, protocol, and secure flag

---

### Option C: Local Development (Bare Metal / Host Machine)

Best for rapid code editing without Docker overhead.

#### 1. Start Database (Docker)

You can quickly run just PostgreSQL:

```bash
docker run --name ft_pg_local -e POSTGRES_USER=transcendence -e POSTGRES_PASSWORD=devpassword -e POSTGRES_DB=transcendence_dev -p 5432:5432 -d postgres:16-alpine
```

#### 2. Run Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend will start on `http://localhost:3000` with watch mode enabled.

#### 3. Run Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will start on `http://localhost:5173`. Vite proxies `/api` requests to `http://localhost:3000`.

---

## 🧪 Testing & Quality Assurance

### 1. Local Testing

```bash
# Backend unit tests (Vitest)
make test

# Backend e2e tests (Vitest + Supertest)
make test-e2e

# Linting (Oxlint on backend and frontend)
make lint

# Local compile verification (Nest build + Vite build)
make build-local
```

### 2. Testing Services in Containerized Dev Mode

Once `make dev-d` is running:

#### Backend Health & API:

```bash
# Direct backend check
curl -i http://localhost:3000/api
# Output: HTTP/1.1 200 OK -> Hello World!

curl -i http://localhost:3000/api/health
# Output: HTTP/1.1 200 OK -> {"status":"ok"}
```

#### Frontend & Proxy:

```bash
# Frontend HTML check
curl -i http://localhost:5173/

# Frontend proxy route to backend
curl -i http://localhost:5173/api/health
# Output: HTTP/1.1 200 OK -> {"status":"ok"}
```

#### Database Health:

```bash
docker exec -it $(docker ps -qf "name=postgres") pg_isready -U transcendence -d transcendence_dev
# Output: transcendence_dev:5432 - accepting connections
```

---

## 🧹 Cleanup Commands

```bash
# Stop all containers
make down

# Stop containers and destroy database volumes (clean slate)
make clean

# Full reset: stop containers, wipe volumes, remove built images
make fclean
```

---

## 🛠️ Makefile Command Cheatsheet

| Command              | Action                                                |
| -------------------- | ----------------------------------------------------- |
| `make` / `make help` | Show all available commands                           |
| `make dev`           | Build and start dev stack with live reload (attached) |
| `make dev-d`         | Start dev stack in background                         |
| `make build-dev`     | Build dev images (`target: dev`)                      |
| `make down-dev`      | Stop dev containers                                   |
| `make logs-dev`      | Stream dev logs                                       |
| `make prod`          | Build and start production stack (attached)           |
| `make prod-d`        | Start production stack in background                  |
| `make build-prod`    | Build multi-stage prod images (`target: prod`)        |
| `make down-prod`     | Stop production containers                            |
| `make logs-prod`     | Stream production logs                                |
| `make clean`         | Stop containers and remove volumes (`pgdata`)         |
| `make fclean`        | `clean` + delete project Docker images                |
| `make test`          | Run backend unit tests locally                        |
| `make test-e2e`      | Run backend e2e tests locally                         |
| `make lint`          | Run linter on both backend and frontend               |
| `make build-local`   | Build both backend and frontend locally               |
