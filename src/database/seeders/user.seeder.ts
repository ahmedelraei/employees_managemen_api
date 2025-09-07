import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository('User');

  // Check if admin user already exists
  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@example.com' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await userRepository.save({
      name: 'System Administrator',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: admin123');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // Create a regular user for testing
  const existingUser = await userRepository.findOne({
    where: { email: 'user@example.com' },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('user123', 10);

    await userRepository.save({
      name: 'Test User',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user',
      isActive: true,
    });

    console.log('✅ Test user created successfully');
    console.log('📧 Email: user@example.com');
    console.log('🔑 Password: user123');
  } else {
    console.log('ℹ️  Test user already exists');
  }
}
