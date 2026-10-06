COMPOSE		= docker compose
COMPOSE_FILE	= docker-compose.yml

RESET	= \033[0m
BOLD	= \033[1m
GREEN	= \033[32m
YELLOW	= \033[33m
CYAN	= \033[36m


.PHONY: all up down build rebuild restart logs clean fclean test lint help

all: build up

help:
	@echo ""
	@echo "$(BOLD)$(CYAN)ft_transcendence$(RESET) – available targets:"
	@echo ""
	@echo "  $(BOLD)all$(RESET)      Build images and start all services"
	@echo "  $(BOLD)up$(RESET)       Start services (attach logs)"
	@echo "  $(BOLD)down$(RESET)     Stop and remove containers"
	@echo "  $(BOLD)build$(RESET)    Build (or rebuild) Docker images"
	@echo "  $(BOLD)rebuild$(RESET)  Force rebuild without cache"
	@echo "  $(BOLD)restart$(RESET)  Down then up"
	@echo "  $(BOLD)logs$(RESET)     Follow logs of all services"
	@echo "  $(BOLD)clean$(RESET)    Stop containers and remove volumes"
	@echo "  $(BOLD)fclean$(RESET)   clean + remove all project images"
	@echo "  $(BOLD)test$(RESET)     Run backend unit tests"
	@echo "  $(BOLD)lint$(RESET)     Run backend linter"
	@echo ""

up:
	@echo "$(GREEN)Starting services…$(RESET)"
	$(COMPOSE) -f $(COMPOSE_FILE) up

up-d:
	@echo "$(GREEN)Starting services (detached)…$(RESET)"
	$(COMPOSE) -f $(COMPOSE_FILE) up -d

down:
	@echo "$(YELLOW)Stopping services…$(RESET)"
	$(COMPOSE) -f $(COMPOSE_FILE) down

build:
	@echo "$(CYAN)Building images…$(RESET)"
	$(COMPOSE) -f $(COMPOSE_FILE) build

rebuild:
	@echo "$(CYAN)Rebuilding images (no cache)…$(RESET)"
	$(COMPOSE) -f $(COMPOSE_FILE) build --no-cache

restart: down up

logs:
	$(COMPOSE) -f $(COMPOSE_FILE) logs -f

clean:
	@echo "$(YELLOW)Removing containers and volumes…$(RESET)"
	$(COMPOSE) -f $(COMPOSE_FILE) down -v

fclean: clean
	@echo "$(YELLOW)Removing project images…$(RESET)"
	$(COMPOSE) -f $(COMPOSE_FILE) down --rmi local

test:
	@echo "$(CYAN)Running backend tests…$(RESET)"
	cd backend && npm test

test-e2e:
	@echo "$(CYAN)Running backend e2e tests…$(RESET)"
	cd backend && npm run test:e2e

lint:
	@echo "$(CYAN)Running linter…$(RESET)"
	cd backend && npm run lint
