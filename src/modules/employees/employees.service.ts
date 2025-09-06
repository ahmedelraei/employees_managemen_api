import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { QueryEmployeeDto } from './dto/query-employee.dto';
import { DepartmentsService } from '../departments/departments.service';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly departmentsService: DepartmentsService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    // Verify department exists
    await this.departmentsService.findOne(createEmployeeDto.department_id);

    const employee = this.employeeRepository.create(createEmployeeDto);
    return await this.employeeRepository.save(employee);
  }

  async findAll(
    queryDto: QueryEmployeeDto,
  ): Promise<PaginatedResult<Employee>> {
    const {
      page = 1,
      limit = 10,
      department_id,
      search,
      sort_by,
      order,
    } = queryDto;

    const queryBuilder = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department');

    // Apply filters
    if (department_id) {
      queryBuilder.andWhere('employee.department_id = :department_id', {
        department_id,
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(employee.name LIKE :search OR employee.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply sorting
    queryBuilder.orderBy(`employee.${sort_by}`, order);

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['department'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findOne(id);

    // Verify department exists if department_id is being updated
    if (updateEmployeeDto.department_id) {
      await this.departmentsService.findOne(updateEmployeeDto.department_id);
    }

    Object.assign(employee, updateEmployeeDto);
    return await this.employeeRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);
  }

  async findByDepartment(departmentId: number): Promise<Employee[]> {
    return await this.employeeRepository.find({
      where: { department_id: departmentId },
      relations: ['department'],
    });
  }

  async getStatistics() {
    const totalEmployees = await this.employeeRepository.count();

    const salaryStats = await this.employeeRepository
      .createQueryBuilder('employee')
      .select('AVG(employee.salary)', 'avgSalary')
      .addSelect('MIN(employee.salary)', 'minSalary')
      .addSelect('MAX(employee.salary)', 'maxSalary')
      .getRawOne();

    const departmentStats = await this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoin('employee.department', 'department')
      .select('department.name', 'departmentName')
      .addSelect('COUNT(employee.id)', 'employeeCount')
      .addSelect('AVG(employee.salary)', 'avgSalary')
      .groupBy('department.id')
      .getRawMany();

    return {
      totalEmployees,
      salaryStats: {
        average: parseFloat(salaryStats.avgSalary) || 0,
        minimum: parseFloat(salaryStats.minSalary) || 0,
        maximum: parseFloat(salaryStats.maxSalary) || 0,
      },
      departmentStats: departmentStats.map((stat) => ({
        departmentName: stat.departmentName,
        employeeCount: parseInt(stat.employeeCount),
        averageSalary: parseFloat(stat.avgSalary) || 0,
      })),
    };
  }
}
