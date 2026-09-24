# Multi-stage build: the build stage needs devDependencies (vite, esbuild,
# typescript) to produce dist/, the runtime stage only needs the result of
# that build plus production dependencies -- keeps the shipped image lean
# and out of ever needing a compiler toolchain at runtime.
FROM node:22-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# script/build.ts (npm run build) bundles most server-side deps directly
# into dist/index.cjs via esbuild -- this node_modules only covers the
# few packages esbuild deliberately leaves external (e.g. optional native
# addons like bufferutil), plus anything else "npm start" needs at runtime.
COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["npm", "start"]
