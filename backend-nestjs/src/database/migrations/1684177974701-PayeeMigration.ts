import {MigrationInterface, QueryRunner} from 'typeorm'

export class PayeeMigration1684177974701 implements MigrationInterface {
  name = 'PayeeMigration1684177974701'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payee"
       (
           "uuid"       varchar PRIMARY KEY NOT NULL,
           "name"       varchar             NOT NULL,
           "created_at" datetime            NOT NULL DEFAULT (datetime('now')),
           "updated_at" datetime            NOT NULL DEFAULT (datetime('now'))
       )`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payee"`)
  }
}
