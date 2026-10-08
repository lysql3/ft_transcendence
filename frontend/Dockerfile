# Base Stage
FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

# Development Stage: Vite HMR dev server
FROM base AS dev

ENV NODE_ENV=development

RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Build Stage: Compile Vite static assets
FROM base AS build

RUN npm ci

COPY . .

RUN npm run build

# Production Stage
FROM nginx:alpine AS prod

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
