import { MigrationInterface, QueryRunner } from 'typeorm';

export abstract class BaseMigration implements MigrationInterface {
  abstract up(queryRunner: QueryRunner): Promise<void>;
  abstract down(queryRunner: QueryRunner): Promise<void>;

  protected async createTable(
    queryRunner: QueryRunner,
    tableName: string,
    columns: string[],
  ): Promise<void> {
    await queryRunner.createTable(
      {
        name: tableName,
        columns: columns.map(column => ({
          name: column,
          type: 'varchar',
          isNullable: false,
        })),
      },
      true,
    );
  }

  protected async dropTable(
    queryRunner: QueryRunner,
    tableName: string,
  ): Promise<void> {
    await queryRunner.dropTable(tableName);
  }
} 