import {
  IsNotEmpty,
  IsString,
  Length,
  IsEmail,
  IsNumber,
  IsPositive,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'Employee full name',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({
    description: 'Employee email address',
    example: 'john.doe@company.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Employee salary',
    example: 75000.0,
    minimum: 0,
    maximum: 9999999.99,
  })
  @IsNumber()
  @IsPositive()
  @Min(0)
  @Max(9999999.99)
  salary: number;

  @ApiProperty({
    description: 'Department ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  department_id: number;
}
