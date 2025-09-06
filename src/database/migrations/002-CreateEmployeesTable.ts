import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateEmployeesTable1703000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'employees',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'salary',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'department_id',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['department_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'departments',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
        ],
        indices: [
          {
            name: 'IDX_EMPLOYEE_EMAIL',
            columnNames: ['email'],
          },
          {
            name: 'IDX_EMPLOYEE_DEPARTMENT',
            columnNames: ['department_id'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('employees');
  }
}
