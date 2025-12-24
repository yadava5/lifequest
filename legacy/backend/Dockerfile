FROM node:20-bullseye-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm install

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
COPY backend-entrypoint.sh ./backend-entrypoint.sh
RUN chmod +x backend-entrypoint.sh

RUN npm run prisma:generate
RUN npm run build

EXPOSE 4000
CMD ["./backend-entrypoint.sh"]
