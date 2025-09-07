const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function runSeeding() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'employees_db',
  });

  try {
    console.log('🔧 Connected to database for seeding...');

    // Seed users
    console.log('👤 Seeding users...');

    // Check if admin user exists
    const [adminRows] = await connection.execute(
      'SELECT COUNT(*) as count FROM users WHERE email = ?',
      ['admin@example.com'],
    );

    if (adminRows[0].count === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.execute(
        'INSERT INTO users (name, email, password, role, isActive) VALUES (?, ?, ?, ?, ?)',
        [
          'System Administrator',
          'admin@example.com',
          hashedPassword,
          'admin',
          true,
        ],
      );
      console.log('✅ Admin user created (admin@example.com / admin123)');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Check if test user exists
    const [userRows] = await connection.execute(
      'SELECT COUNT(*) as count FROM users WHERE email = ?',
      ['user@example.com'],
    );

    if (userRows[0].count === 0) {
      const hashedPassword = await bcrypt.hash('user123', 10);
      await connection.execute(
        'INSERT INTO users (name, email, password, role, isActive) VALUES (?, ?, ?, ?, ?)',
        ['Test User', 'user@example.com', hashedPassword, 'user', true],
      );
      console.log('✅ Test user created (user@example.com / user123)');
    } else {
      console.log('ℹ️  Test user already exists');
    }

    // Seed departments
    console.log('🏢 Seeding departments...');
    const departments = [
      'Human Resources',
      'Information Technology',
      'Sales',
      'Marketing',
      'Finance',
      'Operations',
    ];

    for (const deptName of departments) {
      const [deptRows] = await connection.execute(
        'SELECT COUNT(*) as count FROM departments WHERE name = ?',
        [deptName],
      );

      if (deptRows[0].count === 0) {
        await connection.execute('INSERT INTO departments (name) VALUES (?)', [
          deptName,
        ]);
        console.log(`✅ Department created: ${deptName}`);
      }
    }

    // Seed sample employees
    console.log('👥 Seeding sample employees...');
    const [empRows] = await connection.execute(
      'SELECT COUNT(*) as count FROM employees',
    );

    if (empRows[0].count === 0) {
      const [itDeptRows] = await connection.execute(
        'SELECT id FROM departments WHERE name = ? LIMIT 1',
        ['Information Technology'],
      );

      if (itDeptRows.length > 0) {
        await connection.execute(
          'INSERT INTO employees (name, email, salary, department_id) VALUES (?, ?, ?, ?)',
          ['John Doe', 'john.doe@example.com', 75000, itDeptRows[0].id],
        );
        console.log('✅ Sample employee created: John Doe');
      }
    } else {
      console.log('ℹ️  Sample employees already exist');
    }

    await connection.end();
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    await connection.end();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runSeeding();
}

module.exports = runSeeding;
