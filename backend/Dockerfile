# Base Stage: Shared dependencies & runtime
FROM node:24-alpine AS base

RUN apk add --no-cache openssl

WORKDIR /app

ENV DATABASE_URL=postgresql://user:password@localhost:5432/database

COPY package*.json ./

# Development Stage: Watch mode & dev tools
FROM base AS dev

ENV NODE_ENV=development

RUN npm ci

COPY . .

RUN npm run prisma:generate

EXPOSE 3000

# CMD ["npm", "run", "start:dev"]

# Build Stage: Compile TypeScript to JS
FROM base AS build

RUN npm ci

COPY . .

RUN npm run prisma:generate
RUN npm run build

# Production Stage: Minimal hardened runtime
FROM base AS prod

ENV NODE_ENV=production

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]
