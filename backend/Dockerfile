FROM node:24-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./

RUN echo "===== package.json =====" \
    && grep '"typescript"' package.json \
    && echo "===== package-lock.json =====" \
    && grep -n '"typescript"' package-lock.json
RUN node --version && npm --version


RUN npm ci

# COPY prisma ./prisma
# RUN npx prisma generate

COPY . .

EXPOSE 3000
CMD ["npm", "run", "start:dev"]
