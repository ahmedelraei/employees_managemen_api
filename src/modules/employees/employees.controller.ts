import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { QueryEmployeeDto } from './dto/query-employee.dto';
import { Employee } from './entities/employee.entity';

@ApiTags('Employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({
    status: 201,
    description: 'Employee created successfully',
    type: Employee,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    const data = await this.employeesService.create(createEmployeeDto);
    return {
      success: true,
      data,
      message: 'Employee created successfully',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Employees retrieved successfully' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'department_id',
    required: false,
    type: Number,
    description: 'Filter by department',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search in name or email',
  })
  @ApiQuery({
    name: 'sort_by',
    required: false,
    enum: ['name', 'email', 'salary', 'created_at'],
  })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  async findAll(@Query() queryDto: QueryEmployeeDto) {
    const result = await this.employeesService.findAll(queryDto);
    return {
      success: true,
      ...result,
      message: 'Employees retrieved successfully',
    };
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get employee statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStatistics() {
    const data = await this.employeesService.getStatistics();
    return {
      success: true,
      data,
      message: 'Statistics retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an employee by ID' })
  @ApiResponse({
    status: 200,
    description: 'Employee retrieved successfully',
    type: Employee,
  })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.employeesService.findOne(id);
    return {
      success: true,
      data,
      message: 'Employee retrieved successfully',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an employee' })
  @ApiResponse({
    status: 200,
    description: 'Employee updated successfully',
    type: Employee,
  })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    const data = await this.employeesService.update(id, updateEmployeeDto);
    return {
      success: true,
      data,
      message: 'Employee updated successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an employee' })
  @ApiResponse({ status: 200, description: 'Employee deleted successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.employeesService.remove(id);
    return {
      success: true,
      message: 'Employee deleted successfully',
    };
  }
}
