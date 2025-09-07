import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    // Check if department with the same name already exists
    const existingDepartment = await this.departmentRepository.findOne({
      where: { name: createDepartmentDto.name },
    });

    if (existingDepartment) {
      throw new ConflictException(
        `Department with name '${createDepartmentDto.name}' already exists`,
      );
    }

    const department = this.departmentRepository.create(createDepartmentDto);

    try {
      return await this.departmentRepository.save(department);
    } catch (error) {
      // Handle database-level unique constraint violations
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          `Department with name '${createDepartmentDto.name}' already exists`,
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<Department[]> {
    return await this.departmentRepository.find({
      relations: ['employees'],
    });
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['employees'],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async update(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = await this.findOne(id);

    // If updating the name, check for duplicates (excluding current department)
    if (
      updateDepartmentDto.name &&
      updateDepartmentDto.name !== department.name
    ) {
      const existingDepartment = await this.departmentRepository.findOne({
        where: { name: updateDepartmentDto.name },
      });

      if (existingDepartment && existingDepartment.id !== id) {
        throw new ConflictException(
          `Department with name '${updateDepartmentDto.name}' already exists`,
        );
      }
    }

    Object.assign(department, updateDepartmentDto);

    try {
      return await this.departmentRepository.save(department);
    } catch (error) {
      // Handle database-level unique constraint violations
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          `Department with name '${updateDepartmentDto.name}' already exists`,
        );
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const department = await this.findOne(id);
    await this.departmentRepository.remove(department);
  }
}
