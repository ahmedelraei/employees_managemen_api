import { DataSource } from 'typeorm';
import { seedDepartments } from './department.seeder';
import { seedEmployees } from './employee.seeder';

export async function runSeeders(dataSource: DataSource): Promise<void> {
  console.log('Starting database seeding...');

  try {
    console.log('Seeding departments...');
    await seedDepartments(dataSource);

    console.log('Seeding employees...');
    await seedEmployees(dataSource);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}
