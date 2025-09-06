import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateActivityLogsTable1703000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'activity_logs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'action',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'entity',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'entity_id',
            type: 'int',
          },
          {
            name: 'old_values',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'new_values',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'ip_address',
            type: 'varchar',
            length: '45',
          },
          {
            name: 'user_agent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        indices: [
          {
            name: 'IDX_ACTIVITY_ENTITY',
            columnNames: ['entity', 'entity_id'],
          },
          {
            name: 'IDX_ACTIVITY_CREATED_AT',
            columnNames: ['created_at'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('activity_logs');
  }
}
