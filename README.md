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
│  User Browser  │───┼──>│ frontend-nginx (infra/nginx)  │   │
└────────────────┘   │   │ Dev -> Vite | Prod -> static  │   │
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

### 3. Frontend and Nginx Gateway

- **Frontend:** React 19, Tailwind CSS v4, and Vite 8. In development, the Vite service runs on internal port `5173` with `./frontend:/app` mounted for hot reload; Vite proxies `/api` to the backend.
- **Gateway:** The single `frontend-nginx` service uses configs and its production Dockerfile from `infra/nginx`. In development it proxies browser requests to Vite. In production its image builds the frontend assets, serves them over HTTPS, supports SPA routing, and proxies `/api/` and `/socket.io/` to the backend.

---

## ⚙️ Environment Configuration

The project uses one environment template and one local environment file:

| File                                   | Purpose                                                                |
| -------------------------------------- | ---------------------------------------------------------------------- |
| [`.env.example`](file:///.env.example) | Committed template listing all configurable variables.                 |
| `.env`                                 | Local copy used by Docker Compose and local commands; never commit it. |

### Key Environment Variables

```ini
NODE_ENV=development                       # 'development' or 'production'
POSTGRES_USER=transcendence                # Database superuser
POSTGRES_PASSWORD=devpassword              # Database password
POSTGRES_DB=transcendence_dev              # Database name
POSTGRES_PORT=5432                         # Host port for database (dev only)
PORT=3000                                  # Backend port
DATABASE_URL=postgresql://...              # Full connection string
BETTER_AUTH_SECRET=...                     # Long random secret; never commit
BETTER_AUTH_URL=http://localhost:3000     # Backend auth URL
FRONTEND_URL=http://localhost:5173        # Trusted frontend origin
FRONTEND_DEV_PORT=5173                     # Development Nginx gateway port
FRONTEND_PROD_PORT=443                     # Production Nginx HTTPS port
FRONTEND_HTTP_PORT=80                      # Production HTTP port
BACKEND_URL=http://backend:3000            # Backend target for Vite's development proxy
```

Create the local environment file and generate the Better Auth secret before
starting the backend:

```bash
cp .env.example .env
sed -i "s|^BETTER_AUTH_SECRET=.*|BETTER_AUTH_SECRET=$(openssl rand -base64 32)|" .env
```

Keep `.env` local. The secret signs sessions and changing it invalidates
existing sessions.

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
docker compose --env-file .env -f docker-compose.base.yml -f docker-compose.dev.yml ps

# View service logs
make logs-dev

# Stop dev containers
make down-dev
```

- **Frontend:** Visit `http://localhost:5173` (Nginx gateway to Vite)
- **Backend API:** Visit `http://localhost:3000/api/health`
- **Database:** Connect via `localhost:5432` (`user: transcendence`, `db: transcendence_dev`)
- **Adminer:** Visit `http://localhost:8080` and use `postgres` as the server with the development database credentials

---

### Option B: Containerized Production (Docker Compose)

Tests optimized production builds (compiled NestJS, static frontend served by the infra Nginx gateway, closed DB ports).

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

- **Application (Nginx):** Visit `https://localhost:443` (or configured `FRONTEND_PROD_PORT`); accept the self-signed certificate warning
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

Frontend will start on `http://localhost:5173`. In containerized development,
Nginx forwards browser traffic to Vite, which proxies `/api` requests to the
backend. In bare-metal development, Vite is accessed directly and proxies `/api`
requests to `http://localhost:3000`.

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

---

## Single-Command Production Stack

On a clean clone, use the Makefile entry point:

```bash
make prod-d
```

This initializes `.env`, builds the production images, checks the Judge0 cgroup requirement, starts Judge0 dependencies and workers, and starts the production backend and Nginx gateway. For attached logs, use `make prod`.

The development defaults are not production secrets. Before deploying, replace database passwords, `BETTER_AUTH_SECRET`, GitHub credentials, Judge0 authentication, Redis, and Judge0 PostgreSQL values with deployment secrets.

### Judge0 Cgroup Requirement

Judge0 execution containers require cgroup v1. If Docker reports cgroup v2, Judge0 will fail even if the application stack starts:

```text
Judge0 setup failed: Docker is using cgroup v2, but this Judge0 image requires cgroup v1.
```

Switch the Linux host to cgroup v1, reboot, and verify:

```bash
sudo sh -c 'printf "\nGRUB_CMDLINE_LINUX=\"$GRUB_CMDLINE_LINUX systemd.unified_cgroup_hierarchy=0\"\n" >> /etc/default/grub'
sudo update-grub
sudo reboot

docker info --format '{{.CgroupVersion}}'
```

The Makefile targets run `scripts/check-cgroup-v1.sh` before starting Judge0:

```bash
make prod-d
make dev
make judge-up
```
