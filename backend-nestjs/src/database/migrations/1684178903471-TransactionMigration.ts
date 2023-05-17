import {MigrationInterface, QueryRunner} from 'typeorm'

export class TransactionMigration1684178903471 implements MigrationInterface {
  name = 'TransactionMigration1684178903471'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bank_transaction"
       (
           "uuid"                       varchar PRIMARY KEY NOT NULL,
           "date"                       date                NOT NULL,
           "time"                       varchar,
           "amount"                     integer             NOT NULL,
           "bank_account_uuid"          varchar             NOT NULL,
           "transfer_bank_account_uuid" varchar,
           "beneficiary_account_number" varchar,
           "payee_uuid"                 varchar,
           "category_uuid"              varchar,
           "hash"                       varchar,
           "import_details"             text,
           "created_at"                 datetime            NOT NULL DEFAULT (datetime('now')),
           "updated_at"                 datetime            NOT NULL DEFAULT (datetime('now')),
           CONSTRAINT "CHK_a9e694978d881b4a497668656b" CHECK (time IS strftime('%H:%M:%S', time)),
           CONSTRAINT "CHK_445d387b8c8efc2f1506193f37" CHECK (date IS strftime('%Y-%m-%d', date)),
           CONSTRAINT "FK_eeaadf90e91735f8d3d024db2bb" FOREIGN KEY ("bank_account_uuid") REFERENCES "bank_account" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION,
           CONSTRAINT "FK_e7ce7d0a97014124c74d16e994a" FOREIGN KEY ("transfer_bank_account_uuid") REFERENCES "bank_account" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION,
           CONSTRAINT "FK_1c92609b3b609634fdda8fbf236" FOREIGN KEY ("payee_uuid") REFERENCES "payee" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION,
           CONSTRAINT "FK_140da4d4796ade9d9d575518656" FOREIGN KEY ("category_uuid") REFERENCES "category" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
       )`
    )
    await queryRunner.query(
      `CREATE TABLE "bank_sub_transaction"
       (
           "uuid"             varchar PRIMARY KEY NOT NULL,
           "amount"           integer             NOT NULL,
           "category_uuid"    varchar             NOT NULL,
           "transaction_uuid" varchar             NOT NULL,
           "created_at"       datetime            NOT NULL DEFAULT (datetime('now')),
           "updated_at"       datetime            NOT NULL DEFAULT (datetime('now')),
           CONSTRAINT "FK_a1d17f63ba13c983ca4421c871b" FOREIGN KEY ("category_uuid") REFERENCES "category" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION,
           CONSTRAINT "FK_0c7480b6a7be7f7aee3e9603b0c" FOREIGN KEY ("transaction_uuid") REFERENCES "category" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
       )`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bank_sub_transaction"`)
    await queryRunner.query(`DROP TABLE "bank_transaction"`)
  }
}
