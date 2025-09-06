#!/bin/sh
set -e

echo "🚀 Starting Employee Management System..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
while ! nc -z ${DB_HOST:-mysql} ${DB_PORT:-3306}; do
  echo "Waiting for database to be ready..."
  sleep 2
done

echo "✅ Database is ready!"

# Initialize database
echo "🔧 Initializing database..."
node scripts/init-db.js || echo "⚠️  Database initialization failed, continuing anyway..."

# Start the application
echo "🎉 Starting the application..."
exec "$@"
