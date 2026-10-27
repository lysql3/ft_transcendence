COMPOSE			= docker compose
ENV_DEV			= .env.dev
ENV_PROD		= .env.prod

COMPOSE_BASE	= docker-compose.base.yml
COMPOSE_DEV		= docker-compose.dev.yml
COMPOSE_PROD	= docker-compose.prod.yml

CMD_DEV			= $(COMPOSE) --env-file $(ENV_DEV) -f $(COMPOSE_BASE) -f $(COMPOSE_DEV)
CMD_PROD		= $(COMPOSE) --env-file $(ENV_PROD) -f $(COMPOSE_BASE) -f $(COMPOSE_PROD)

RESET	= \033[0m
BOLD	= \033[1m
GREEN	= \033[32m
YELLOW	= \033[33m
CYAN	= \033[36m
MAGENTA	= \033[35m

.PHONY: help dev dev-d build-dev down-dev restart-dev logs-dev \
	backend backend-d build-backend \
        prod prod-d build-prod down-prod restart-prod logs-prod \
	down clean fclean docker-clean test test-e2e lint build-local

# dev
dev: build-dev
	@echo "$(GREEN)Starting development environment (hot-reload enabled)…$(RESET)"
	$(CMD_DEV) up -d postgres adminer
	$(CMD_DEV) run --rm backend-migrate
	$(CMD_DEV) up --no-deps backend frontend

dev-d: build-dev
	@echo "$(GREEN)Starting development environment in detached mode…$(RESET)"
	$(CMD_DEV) up -d postgres adminer
	$(CMD_DEV) run --rm backend-migrate
	$(CMD_DEV) up -d --no-deps backend frontend

build-dev:
	@echo "$(CYAN)Building dev images (target: dev)…$(RESET)"
	$(CMD_DEV) build

down-dev:
	@echo "$(YELLOW)Stopping development environment…$(RESET)"
	$(CMD_DEV) down

restart-dev: down-dev dev

logs-dev:
	$(CMD_DEV) logs -f

# postres and backend and dependencies
backend: build-backend
	@echo "$(GREEN)Starting backend and dependency services…$(RESET)"
	$(CMD_DEV) up -d postgres
	$(CMD_DEV) run --rm backend-migrate
	$(CMD_DEV) up --no-deps backend

backend-d: build-backend
	@echo "$(GREEN)Starting backend and dependency services in detached mode…$(RESET)"
	$(CMD_DEV) up -d postgres
	$(CMD_DEV) run --rm backend-migrate
	$(CMD_DEV) up -d --no-deps backend

build-backend:
	@echo "$(CYAN)Building backend and dependency images…$(RESET)"
	$(CMD_DEV) build postgres backend-migrate backend

postgres: build-postgres
	@echo "$(GREEN)Starting postgres and dependency services…$(RESET)"
	$(CMD_DEV) up postgres

postgres-d: build-postgres
	@echo "$(GREEN)Starting postgres and dependency services in detached mode…$(RESET)"
	$(CMD_DEV) up -d postgres

build-postgres:
	@echo "$(CYAN)Building postgres and dependency images…$(RESET)"
	$(CMD_DEV) build postgres backend-migrate

# prod
prod: build-prod
	@echo "$(MAGENTA)Starting production environment…$(RESET)"
	$(CMD_PROD) up -d postgres
	$(CMD_PROD) run --rm backend-migrate
	$(CMD_PROD) up --no-deps backend frontend

prod-d: build-prod
	@echo "$(MAGENTA)Starting production environment in detached mode…$(RESET)"
	$(CMD_PROD) up -d postgres
	$(CMD_PROD) run --rm backend-migrate
	$(CMD_PROD) up -d --no-deps backend frontend

build-prod:
	@echo "$(CYAN)Building production images (target: prod)…$(RESET)"
	$(CMD_PROD) build

down-prod:
	@echo "$(YELLOW)Stopping production environment…$(RESET)"
	$(CMD_PROD) down

restart-prod: down-prod prod

logs-prod:
	$(CMD_PROD) logs -f

# cleanup
down:
	@echo "$(YELLOW)Stopping all project containers…$(RESET)"
	$(CMD_DEV) down 2>/dev/null || true
	$(CMD_PROD) down 2>/dev/null || true

clean:
	@echo "$(YELLOW)Stopping containers and removing volumes…$(RESET)"
	$(CMD_DEV) down -v 2>/dev/null || true
	$(CMD_PROD) down -v 2>/dev/null || true

fclean: clean
	@echo "$(YELLOW)Removing all project images…$(RESET)"
	$(CMD_DEV) down -v --rmi local 2>/dev/null || true
	$(CMD_PROD) down -v --rmi local 2>/dev/null || true

docker-clean:
	@echo "$(YELLOW)Removing all Compose containers, images, networks, and volumes (sudo)…$(RESET)"
	sudo $(CMD_DEV) down --volumes --rmi all --remove-orphans 2>/dev/null || true
	sudo $(CMD_PROD) down --volumes --rmi all --remove-orphans 2>/dev/null || true

# tests
test:
	@echo "$(CYAN)Running backend unit tests…$(RESET)"
	cd backend && npm test

test-e2e:
	cp .env.dev backend/.env
	@echo "Running backend e2e tests..."
	cd backend && DATABASE_URL=postgresql://user:devpassword@localhost:5432/transcendence_dev npm run test:e2e

lint:
	@echo "$(CYAN)Linting backend…$(RESET)"
	cd backend && npm run lint
	@echo "$(CYAN)Linting frontend…$(RESET)"
	cd frontend && npm run lint

build-local:
	@echo "$(CYAN)Building backend locally…$(RESET)"
	cd backend && npm run build
	@echo "$(CYAN)Building frontend locally…$(RESET)"
	cd frontend && npm run build

help:
	@echo ""
	@echo "$(BOLD)$(CYAN)ft_transcendence$(RESET) – Management Commands:"
	@echo ""
	@echo "  $(BOLD)$(GREEN)[Development Environment]$(RESET)"
	@echo "    $(BOLD)make dev$(RESET)          Start dev containers with live reload (attached logs)"
	@echo "    $(BOLD)make dev-d$(RESET)        Start dev containers in detached background mode"
	@echo "    $(BOLD)make build-dev$(RESET)    Build development images (target: dev)"
	@echo "    $(BOLD)make down-dev$(RESET)     Stop dev containers"
	@echo "    $(BOLD)make restart-dev$(RESET)  Restart dev containers"
	@echo "    $(BOLD)make logs-dev$(RESET)     Follow dev container logs"
	@echo "    $(BOLD)make backend$(RESET)       Build and run backend with dependencies"
	@echo "    $(BOLD)make backend-d$(RESET)     Run backend with dependencies in background"
	@echo "    $(BOLD)make build-backend$(RESET) Build backend and dependency images"
	@echo ""
	@echo "  $(BOLD)$(MAGENTA)[Production Environment]$(RESET)"
	@echo "    $(BOLD)make prod$(RESET)         Start production containers (attached logs)"
	@echo "    $(BOLD)make prod-d$(RESET)       Start production containers in detached mode"
	@echo "    $(BOLD)make build-prod$(RESET)   Build production multi-stage images (target: prod)"
	@echo "    $(BOLD)make down-prod$(RESET)    Stop prod containers"
	@echo "    $(BOLD)make restart-prod$(RESET) Restart prod containers"
	@echo "    $(BOLD)make logs-prod$(RESET)    Follow prod container logs"
	@echo ""
	@echo "  $(BOLD)$(YELLOW)[Cleanup]$(RESET)"
	@echo "    $(BOLD)make down$(RESET)         Stop all running project containers"
	@echo "    $(BOLD)make clean$(RESET)        Stop containers and remove volumes (pgdata)"
	@echo "    $(BOLD)make fclean$(RESET)       clean + remove project images and orphans"
	@echo "    $(BOLD)make docker-clean$(RESET) Remove all Compose resources (asks for sudo)"
	@echo ""
	@echo "  $(BOLD)$(CYAN)[Local Quality & Tests]$(RESET)"
	@echo "    $(BOLD)make test$(RESET)         Run backend unit tests locally"
	@echo "    $(BOLD)make test-e2e$(RESET)     Run backend end-to-end tests locally"
	@echo "    $(BOLD)make lint$(RESET)         Lint both frontend and backend"
	@echo "    $(BOLD)make build-local$(RESET)  Build both frontend and backend locally"
	@echo ""
