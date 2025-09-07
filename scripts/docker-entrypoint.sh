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

# Run database migrations
echo "🔧 Running database migrations..."
if node scripts/migrate.js; then
  echo "✅ Database migrations completed successfully!"
else
  echo "⚠️  Database migrations failed, trying basic initialization..."
  node scripts/init-db.js || echo "⚠️  Database initialization failed, continuing anyway..."
fi

# Seed database with initial data
echo "🌱 Seeding database..."
if node scripts/seed.js; then
  echo "✅ Database seeding completed successfully!"
else
  echo "⚠️  Database seeding failed, continuing anyway..."
fi

# Start the application
echo "🎉 Starting the application..."
exec "$@"
