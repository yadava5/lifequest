#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  export DATABASE_URL="file:./dev.db"
fi

if echo "$DATABASE_URL" | grep -q "file:\./"; then
  DB_PATH=${DATABASE_URL#file:./}
  DB_DIR=$(dirname "$DB_PATH")
  mkdir -p "$DB_DIR"
fi

npx prisma db push
npx prisma db seed
node dist/server.js
