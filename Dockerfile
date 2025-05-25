# Dockerfile

# -- Base: build Next.js only
FROM node:18-bullseye as base

WORKDIR /app

# Copy frontend files
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.mjs ./
COPY .env.example ./
COPY app ./app
COPY components ./components
COPY lib ./lib

# Install Node deps and build
RUN npm install
RUN npm run build

# -- Runtime: Node + Python + pdfquery CLI
FROM node:18-bullseye as runner
WORKDIR /app

# Install Python & pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install --upgrade pip

# Copy backend and install CLI
COPY backend ./backend
RUN pip3 install -e ./backend/pdfquery

# Copy frontend runtime assets
COPY --from=base /app/.next ./.next
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/next.config.mjs ./next.config.mjs

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npx", "next", "start"]
