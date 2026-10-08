# Base Stage: Shared PostgreSQL runtime
FROM postgres:16-alpine AS base

# Development Stage: Verbose logging for dev
FROM base AS dev

CMD ["postgres", "-c", "log_statement=all"]

# Production Stage: Default PostgreSQL runtime
FROM base AS prod

CMD ["postgres"]
