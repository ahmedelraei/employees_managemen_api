import { DataSource } from 'typeorm';
import { Department } from '../../modules/departments/entities/department.entity';

export async function seedDepartments(dataSource: DataSource): Promise<void> {
  const departmentRepository = dataSource.getRepository(Department);

  const departments = [
    { name: 'Human Resources' },
    { name: 'Information Technology' },
    { name: 'Sales' },
    { name: 'Marketing' },
    { name: 'Finance' },
    { name: 'Operations' },
  ];

  for (const departmentData of departments) {
    const existingDepartment = await departmentRepository.findOne({
      where: { name: departmentData.name },
    });

    if (!existingDepartment) {
      const department = departmentRepository.create(departmentData);
      await departmentRepository.save(department);
      console.log(`Created department: ${departmentData.name}`);
    } else {
      console.log(`Department already exists: ${departmentData.name}`);
    }
  }
}
