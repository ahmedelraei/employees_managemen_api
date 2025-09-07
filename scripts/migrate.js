const { DataSource } = require('typeorm');
const path = require('path');

async function runMigrations() {
  console.log('🔧 Setting up DataSource for migrations...');

  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'employees_db',
    entities: [path.join(__dirname, '../dist/src/**/*.entity.js')],
    migrations: [path.join(__dirname, '../dist/src/database/migrations/*.js')],
    synchronize: false,
    logging: true,
    migrationsRun: false,
    migrationsTableName: 'migrations',
  });

  try {
    console.log('🔧 Initializing database connection...');
    await dataSource.initialize();
    console.log('✅ Database connection established');

    console.log('🔧 Checking pending migrations...');
    const pendingMigrations = await dataSource.showMigrations();
    console.log(`📋 Found ${pendingMigrations.length} pending migrations`);

    if (pendingMigrations.length > 0) {
      console.log('🔧 Running migrations...');
      const migrations = await dataSource.runMigrations();
      console.log(`✅ Successfully executed ${migrations.length} migrations`);
      migrations.forEach((migration) => {
        console.log(`  ✓ ${migration.name}`);
      });
    } else {
      console.log('ℹ️  No pending migrations to run');
    }

    await dataSource.destroy();
    console.log('🔧 Database connection closed');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    throw error; // Re-throw to let the entrypoint script handle it
  }
}

// Run if called directly
if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
