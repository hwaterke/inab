import {MigrationInterface, QueryRunner} from 'typeorm'

export class AccountMigration1684178437639 implements MigrationInterface {
  name = 'AccountMigration1684178437639'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bank_account"
       (
           "uuid"       varchar PRIMARY KEY NOT NULL,
           "name"       varchar             NOT NULL,
           "iban"       varchar             NOT NULL,
           "created_at" datetime            NOT NULL DEFAULT (datetime('now')),
           "updated_at" datetime            NOT NULL DEFAULT (datetime('now')),
           CONSTRAINT "UQ_0737486aaa76bd3903f77fa757e" UNIQUE ("name"),
           CONSTRAINT "UQ_07b9b9b18c16a5bf66642dee363" UNIQUE ("iban")
       )`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bank_account"`)
  }
}
