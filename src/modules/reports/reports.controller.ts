import { Controller, Get, Query, Res, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ReportsService, ExportOptions } from './reports.service';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('employees/export/csv')
  @ApiOperation({ summary: 'Export employees to CSV' })
  @ApiResponse({ status: 200, description: 'CSV file exported successfully' })
  @ApiQuery({ name: 'department_id', required: false, type: Number })
  @ApiQuery({ name: 'includeTimestamps', required: false, type: Boolean })
  @ApiQuery({
    name: 'sort_by',
    required: false,
    enum: ['name', 'email', 'salary', 'created_at'],
  })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  async exportCSV(
    @Res() res: Response,
    @Query('department_id', new ParseIntPipe({ optional: true }))
    department_id?: number,
    @Query('includeTimestamps') includeTimestamps?: boolean,
    @Query('sort_by') sort_by?: string,
    @Query('order') order?: 'ASC' | 'DESC',
  ) {
    const options: ExportOptions = {
      format: 'csv',
      department_id,
      includeTimestamps: includeTimestamps === true,
      sort_by,
      order,
    };

    await this.reportsService.exportEmployees(options, res);
  }

  @Get('employees/export/pdf')
  @ApiOperation({ summary: 'Export employees to PDF' })
  @ApiResponse({ status: 200, description: 'PDF file exported successfully' })
  @ApiQuery({ name: 'department_id', required: false, type: Number })
  @ApiQuery({ name: 'includeTimestamps', required: false, type: Boolean })
  @ApiQuery({
    name: 'sort_by',
    required: false,
    enum: ['name', 'email', 'salary', 'created_at'],
  })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  async exportPDF(
    @Res() res: Response,
    @Query('department_id', new ParseIntPipe({ optional: true }))
    department_id?: number,
    @Query('includeTimestamps') includeTimestamps?: boolean,
    @Query('sort_by') sort_by?: string,
    @Query('order') order?: 'ASC' | 'DESC',
  ) {
    const options: ExportOptions = {
      format: 'pdf',
      department_id,
      includeTimestamps: includeTimestamps === true,
      sort_by,
      order,
    };

    await this.reportsService.exportEmployees(options, res);
  }
}
