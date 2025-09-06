import { DataSource } from 'typeorm';
import { Employee } from '../../modules/employees/entities/employee.entity';
import { Department } from '../../modules/departments/entities/department.entity';

export async function seedEmployees(dataSource: DataSource): Promise<void> {
  const employeeRepository = dataSource.getRepository(Employee);
  const departmentRepository = dataSource.getRepository(Department);

  // Get all departments
  const departments = await departmentRepository.find();

  if (departments.length === 0) {
    console.log('No departments found. Please seed departments first.');
    return;
  }

  const sampleEmployees = [
    {
      name: 'John Doe',
      email: 'john.doe@company.com',
      salary: 75000,
      departmentName: 'Information Technology',
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      salary: 68000,
      departmentName: 'Human Resources',
    },
    {
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      salary: 82000,
      departmentName: 'Sales',
    },
    {
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      salary: 71000,
      departmentName: 'Marketing',
    },
    {
      name: 'David Brown',
      email: 'david.brown@company.com',
      salary: 79000,
      departmentName: 'Finance',
    },
    {
      name: 'Lisa Davis',
      email: 'lisa.davis@company.com',
      salary: 73000,
      departmentName: 'Operations',
    },
    {
      name: 'Robert Miller',
      email: 'robert.miller@company.com',
      salary: 85000,
      departmentName: 'Information Technology',
    },
    {
      name: 'Emily Garcia',
      email: 'emily.garcia@company.com',
      salary: 66000,
      departmentName: 'Human Resources',
    },
    {
      name: 'James Rodriguez',
      email: 'james.rodriguez@company.com',
      salary: 88000,
      departmentName: 'Sales',
    },
    {
      name: 'Amanda Martinez',
      email: 'amanda.martinez@company.com',
      salary: 72000,
      departmentName: 'Marketing',
    },
    {
      name: 'Christopher Lee',
      email: 'christopher.lee@company.com',
      salary: 81000,
      departmentName: 'Finance',
    },
    {
      name: 'Jessica Taylor',
      email: 'jessica.taylor@company.com',
      salary: 74000,
      departmentName: 'Operations',
    },
    {
      name: 'Daniel Anderson',
      email: 'daniel.anderson@company.com',
      salary: 92000,
      departmentName: 'Information Technology',
    },
    {
      name: 'Ashley Thomas',
      email: 'ashley.thomas@company.com',
      salary: 69000,
      departmentName: 'Human Resources',
    },
    {
      name: 'Matthew Jackson',
      email: 'matthew.jackson@company.com',
      salary: 86000,
      departmentName: 'Sales',
    },
    {
      name: 'Stephanie White',
      email: 'stephanie.white@company.com',
      salary: 76000,
      departmentName: 'Marketing',
    },
    {
      name: 'Andrew Harris',
      email: 'andrew.harris@company.com',
      salary: 83000,
      departmentName: 'Finance',
    },
    {
      name: 'Megan Clark',
      email: 'megan.clark@company.com',
      salary: 77000,
      departmentName: 'Operations',
    },
    {
      name: 'Joshua Lewis',
      email: 'joshua.lewis@company.com',
      salary: 89000,
      departmentName: 'Information Technology',
    },
    {
      name: 'Nicole Robinson',
      email: 'nicole.robinson@company.com',
      salary: 70000,
      departmentName: 'Human Resources',
    },
    {
      name: 'Ryan Walker',
      email: 'ryan.walker@company.com',
      salary: 84000,
      departmentName: 'Sales',
    },
    {
      name: 'Samantha Hall',
      email: 'samantha.hall@company.com',
      salary: 78000,
      departmentName: 'Marketing',
    },
    {
      name: 'Kevin Allen',
      email: 'kevin.allen@company.com',
      salary: 80000,
      departmentName: 'Finance',
    },
    {
      name: 'Rachel Young',
      email: 'rachel.young@company.com',
      salary: 75000,
      departmentName: 'Operations',
    },
    {
      name: 'Brandon King',
      email: 'brandon.king@company.com',
      salary: 91000,
      departmentName: 'Information Technology',
    },
    {
      name: 'Lauren Wright',
      email: 'lauren.wright@company.com',
      salary: 67000,
      departmentName: 'Human Resources',
    },
    {
      name: 'Tyler Lopez',
      email: 'tyler.lopez@company.com',
      salary: 87000,
      departmentName: 'Sales',
    },
    {
      name: 'Kimberly Hill',
      email: 'kimberly.hill@company.com',
      salary: 73000,
      departmentName: 'Marketing',
    },
    {
      name: 'Justin Scott',
      email: 'justin.scott@company.com',
      salary: 82000,
      departmentName: 'Finance',
    },
    {
      name: 'Brittany Green',
      email: 'brittany.green@company.com',
      salary: 76000,
      departmentName: 'Operations',
    },
    {
      name: 'Nathan Adams',
      email: 'nathan.adams@company.com',
      salary: 90000,
      departmentName: 'Information Technology',
    },
    {
      name: 'Danielle Baker',
      email: 'danielle.baker@company.com',
      salary: 68000,
      departmentName: 'Human Resources',
    },
    {
      name: 'Jonathan Gonzalez',
      email: 'jonathan.gonzalez@company.com',
      salary: 85000,
      departmentName: 'Sales',
    },
    {
      name: 'Heather Nelson',
      email: 'heather.nelson@company.com',
      salary: 74000,
      departmentName: 'Marketing',
    },
    {
      name: 'Aaron Carter',
      email: 'aaron.carter@company.com',
      salary: 81000,
      departmentName: 'Finance',
    },
    {
      name: 'Melissa Mitchell',
      email: 'melissa.mitchell@company.com',
      salary: 77000,
      departmentName: 'Operations',
    },
    {
      name: 'Sean Perez',
      email: 'sean.perez@company.com',
      salary: 88000,
      departmentName: 'Information Technology',
    },
    {
      name: 'Crystal Roberts',
      email: 'crystal.roberts@company.com',
      salary: 69000,
      departmentName: 'Human Resources',
    },
    {
      name: 'Jeremy Turner',
      email: 'jeremy.turner@company.com',
      salary: 86000,
      departmentName: 'Sales',
    },
    {
      name: 'Vanessa Phillips',
      email: 'vanessa.phillips@company.com',
      salary: 75000,
      departmentName: 'Marketing',
    },
    {
      name: 'Gregory Campbell',
      email: 'gregory.campbell@company.com',
      salary: 83000,
      departmentName: 'Finance',
    },
    {
      name: 'Tiffany Parker',
      email: 'tiffany.parker@company.com',
      salary: 78000,
      departmentName: 'Operations',
    },
    {
      name: 'Adam Evans',
      email: 'adam.evans@company.com',
      salary: 93000,
      departmentName: 'Information Technology',
    },
    {
      name: 'Monica Edwards',
      email: 'monica.edwards@company.com',
      salary: 71000,
      departmentName: 'Human Resources',
    },
    {
      name: 'Jacob Collins',
      email: 'jacob.collins@company.com',
      salary: 87000,
      departmentName: 'Sales',
    },
    {
      name: 'Alicia Stewart',
      email: 'alicia.stewart@company.com',
      salary: 76000,
      departmentName: 'Marketing',
    },
    {
      name: 'Eric Sanchez',
      email: 'eric.sanchez@company.com',
      salary: 84000,
      departmentName: 'Finance',
    },
    {
      name: 'Courtney Morris',
      email: 'courtney.morris@company.com',
      salary: 79000,
      departmentName: 'Operations',
    },
    {
      name: 'Steven Rogers',
      email: 'steven.rogers@company.com',
      salary: 95000,
      departmentName: 'Information Technology',
    },
    {
      name: 'Angela Reed',
      email: 'angela.reed@company.com',
      salary: 72000,
      departmentName: 'Human Resources',
    },
  ];

  for (const employeeData of sampleEmployees) {
    const existingEmployee = await employeeRepository.findOne({
      where: { email: employeeData.email },
    });

    if (!existingEmployee) {
      const department = departments.find(
        (d) => d.name === employeeData.departmentName,
      );
      if (department) {
        const employee = employeeRepository.create({
          name: employeeData.name,
          email: employeeData.email,
          salary: employeeData.salary,
          department_id: department.id,
        });
        await employeeRepository.save(employee);
        console.log(`Created employee: ${employeeData.name}`);
      } else {
        console.log(`Department not found for employee: ${employeeData.name}`);
      }
    } else {
      console.log(`Employee already exists: ${employeeData.name}`);
    }
  }
}
