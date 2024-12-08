FROM node:20.9.0-alpine AS deps
WORKDIR /app
RUN apk add --no-cache \
  libc6-compat \
  python3 \
  make \
  g++

COPY package.json yarn.lock ./
RUN yarn install

FROM node:20.9.0-alpine AS builder
ARG SERVICE
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build ${SERVICE}

FROM node:20.9.0-alpine AS runner
ARG SERVICE
WORKDIR /app
RUN apk add --no-cache openssl


COPY --from=builder /app/dist/apps/${SERVICE} ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

CMD ["node", "dist/main.js"]