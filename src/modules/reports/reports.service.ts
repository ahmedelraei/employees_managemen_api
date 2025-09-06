import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as csvWriter from 'csv-writer';
import * as PDFDocument from 'pdfkit';
import { EmployeesService } from '../employees/employees.service';
import { Employee } from '../employees/entities/employee.entity';
import * as fs from 'fs';
import * as path from 'path';

export interface ExportOptions {
  department_id?: number;
  format: 'csv' | 'pdf';
  includeTimestamps?: boolean;
  sort_by?: string;
  order?: 'ASC' | 'DESC';
}

@Injectable()
export class ReportsService {
  constructor(private readonly employeesService: EmployeesService) {}

  async exportEmployees(options: ExportOptions, res: Response): Promise<void> {
    // Get all employees with filters
    const employees = await this.getAllEmployeesForExport(options);

    if (options.format === 'csv') {
      await this.exportToCSV(employees, options, res);
    } else if (options.format === 'pdf') {
      await this.exportToPDF(employees, options, res);
    }
  }

  private async getAllEmployeesForExport(
    options: ExportOptions,
  ): Promise<Employee[]> {
    const queryDto = {
      page: 1,
      limit: 10000, // Get all employees
      department_id: options.department_id,
      sort_by: options.sort_by || 'name',
      order: options.order || ('ASC' as 'ASC' | 'DESC'),
    };

    const result = await this.employeesService.findAll(queryDto);
    return result.data;
  }

  private async exportToCSV(
    employees: Employee[],
    options: ExportOptions,
    res: Response,
  ): Promise<void> {
    const headers = [
      { id: 'id', title: 'ID' },
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
      { id: 'department', title: 'Department' },
      { id: 'salary', title: 'Salary' },
    ];

    if (options.includeTimestamps) {
      headers.push({ id: 'created_at', title: 'Created At' });
      headers.push({ id: 'updated_at', title: 'Updated At' });
    }

    // Create temporary file
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const filename = `employees_export_${Date.now()}.csv`;
    const filepath = path.join(tempDir, filename);

    const writer = csvWriter.createObjectCsvWriter({
      path: filepath,
      header: headers,
    });

    const records = employees.map((employee) => {
      const record: any = {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        department: employee.department?.name || 'N/A',
        salary: employee.salary,
      };

      if (options.includeTimestamps) {
        record.created_at = employee.created_at.toISOString();
        record.updated_at = employee.updated_at.toISOString();
      }

      return record;
    });

    await writer.writeRecords(records);

    // Set response headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream the file
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    // Clean up temp file after streaming
    fileStream.on('end', () => {
      fs.unlinkSync(filepath);
    });
  }

  private async exportToPDF(
    employees: Employee[],
    options: ExportOptions,
    res: Response,
  ): Promise<void> {
    const doc = new PDFDocument({ margin: 50 });
    const filename = `employees_export_${Date.now()}.pdf`;

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add company header
    doc.fontSize(20).text('Employee Management System', { align: 'center' });
    doc.fontSize(16).text('Employee Report', { align: 'center' });
    doc.moveDown();

    // Add generation info
    doc
      .fontSize(10)
      .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
    doc.text(`Total Employees: ${employees.length}`, { align: 'right' });

    if (options.department_id) {
      const departmentName = employees[0]?.department?.name || 'Unknown';
      doc.text(`Department: ${departmentName}`, { align: 'right' });
    }

    doc.moveDown(2);

    // Table headers
    const startX = 50;
    let currentY = doc.y;
    const rowHeight = 25;
    const colWidths = [50, 120, 150, 100, 80];

    // Header row
    doc.fontSize(10).fillColor('black');
    doc
      .rect(
        startX,
        currentY,
        colWidths.reduce((a, b) => a + b, 0),
        rowHeight,
      )
      .fill('#f0f0f0');

    let currentX = startX;
    const headers = ['ID', 'Name', 'Email', 'Department', 'Salary'];

    headers.forEach((header, index) => {
      doc.fillColor('black').text(header, currentX + 5, currentY + 8, {
        width: colWidths[index] - 10,
        align: 'left',
      });
      currentX += colWidths[index];
    });

    currentY += rowHeight;

    // Data rows
    employees.forEach((employee, index) => {
      const fillColor = index % 2 === 0 ? '#ffffff' : '#f9f9f9';
      doc
        .rect(
          startX,
          currentY,
          colWidths.reduce((a, b) => a + b, 0),
          rowHeight,
        )
        .fill(fillColor);

      currentX = startX;
      const data = [
        employee.id.toString(),
        employee.name,
        employee.email,
        employee.department?.name || 'N/A',
        `$${employee.salary.toFixed(2)}`,
      ];

      data.forEach((text, colIndex) => {
        doc.fillColor('black').text(text, currentX + 5, currentY + 8, {
          width: colWidths[colIndex] - 10,
          align: colIndex === 4 ? 'right' : 'left', // Right align salary
        });
        currentX += colWidths[colIndex];
      });

      currentY += rowHeight;

      // Add new page if needed
      if (currentY > 700) {
        doc.addPage();
        currentY = 50;
      }
    });

    // Add summary statistics
    if (employees.length > 0) {
      doc.addPage();
      doc.fontSize(14).text('Summary Statistics', 50, 50);
      doc.moveDown();

      const totalSalary = employees.reduce(
        (sum, emp) => sum + Number(emp.salary),
        0,
      );
      const avgSalary = totalSalary / employees.length;
      const minSalary = Math.min(...employees.map((emp) => Number(emp.salary)));
      const maxSalary = Math.max(...employees.map((emp) => Number(emp.salary)));

      doc.fontSize(10);
      doc.text(`Total Employees: ${employees.length}`);
      doc.text(`Total Salary Cost: $${totalSalary.toFixed(2)}`);
      doc.text(`Average Salary: $${avgSalary.toFixed(2)}`);
      doc.text(`Minimum Salary: $${minSalary.toFixed(2)}`);
      doc.text(`Maximum Salary: $${maxSalary.toFixed(2)}`);

      // Department breakdown
      const departmentStats = employees.reduce(
        (acc, emp) => {
          const deptName = emp.department?.name || 'Unknown';
          if (!acc[deptName]) {
            acc[deptName] = { count: 0, totalSalary: 0 };
          }
          acc[deptName].count++;
          acc[deptName].totalSalary += Number(emp.salary);
          return acc;
        },
        {} as Record<string, { count: number; totalSalary: number }>,
      );

      doc.moveDown();
      doc.text('Department Breakdown:');
      Object.entries(departmentStats).forEach(([dept, stats]) => {
        const avgDeptSalary = stats.totalSalary / stats.count;
        doc.text(
          `${dept}: ${stats.count} employees, Avg Salary: $${avgDeptSalary.toFixed(2)}`,
        );
      });
    }

    // Add page numbers
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(8)
        .text(`Page ${i + 1} of ${pageCount}`, 50, 750, { align: 'center' });
    }

    doc.end();
  }
}
