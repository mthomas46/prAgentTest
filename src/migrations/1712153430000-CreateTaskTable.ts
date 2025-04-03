import { MigrationInterface, QueryRunner } from 'typeorm';
import { TaskStatus } from '../../shared/enums/task-status.enum';

export class CreateTaskTable1712153430000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum type
    await queryRunner.query(`
      CREATE TYPE task_status_enum AS ENUM ('${Object.values(TaskStatus).join("', '")}')
    `);

    // Create table
    await queryRunner.query(`
      CREATE TABLE "task" (
        "id" SERIAL NOT NULL,
        "title" character varying NOT NULL,
        "description" text,
        "status" task_status_enum NOT NULL DEFAULT 'PENDING',
        "assignedTo" character varying,
        "dueDate" timestamp,
        "metadata" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        CONSTRAINT "PK_task" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TYPE task_status_enum`);
  }
} 