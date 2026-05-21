#!/bin/sh
set -e

# Run the official entrypoint in the background
docker-entrypoint.sh postgres &
PID="$!"

# Wait for postgres to start
until pg_isready -h localhost -p 5432 -U postgres; do
  echo "Waiting for PostgreSQL to start..."
  sleep 1
done

echo "PostgreSQL started. Synchronizing database credentials from environment variables..."

# 1. If the user is not postgres, create the user if it doesn't exist and update its password
if [ "$POSTGRES_USER" != "postgres" ]; then
  psql -U postgres -c "CREATE USER \"$POSTGRES_USER\" WITH PASSWORD '$POSTGRES_PASSWORD';" 2>/dev/null || \
  psql -U postgres -c "ALTER USER \"$POSTGRES_USER\" WITH PASSWORD '$POSTGRES_PASSWORD';"
  psql -U postgres -c "ALTER USER \"$POSTGRES_USER\" WITH SUPERUSER;"
else
  # If the user is postgres, just update the password
  psql -U postgres -c "ALTER USER postgres WITH PASSWORD '$POSTGRES_PASSWORD';"
fi

# 2. Create the database if it doesn't exist
if ! psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$POSTGRES_DB'" | grep -q 1; then
  psql -U postgres -c "CREATE DATABASE \"$POSTGRES_DB\" OWNER \"$POSTGRES_USER\";"
fi

# 3. Grant privileges
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE \"$POSTGRES_DB\" TO \"$POSTGRES_USER\";"

echo "Database credentials synchronized successfully!"

# Wait for the postgres process to finish
wait "$PID"
