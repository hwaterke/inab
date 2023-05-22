import {MigrationInterface, QueryRunner} from 'typeorm'

export class TransactionItemMigration1684785173605
  implements MigrationInterface
{
  name = 'TransactionItemMigration1684785173605'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bank_transaction_item"
       (
           "uuid"             varchar PRIMARY KEY NOT NULL,
           "amount"           integer             NOT NULL,
           "transaction_uuid" varchar             NOT NULL,
           "category_uuid"    varchar,
           "is_income"        boolean             NOT NULL,
           "is_credit"        boolean             NOT NULL,
           "reimburse_uuid"   varchar,
           "created_at"       datetime            NOT NULL DEFAULT (datetime('now')),
           "updated_at"       datetime            NOT NULL DEFAULT (datetime('now')),
           CONSTRAINT "CHK_2014030f1288f7c8781f9621e1" CHECK (amount <> 0),
           CONSTRAINT "CHK_987309ba04f9007da96292eaf9" CHECK (is_credit IS FALSE OR amount < 0),
           CONSTRAINT "CHK_60e2ab824c7a337367700d60ef" CHECK (reimburse_uuid IS NULL OR amount > 0),
           CONSTRAINT "CHK_3495e200b5254756a55e6308da" CHECK (is_income IS FALSE OR amount > 0),
           CONSTRAINT "CHK_1ba565fe74a448f1845a374fde" CHECK (reimburse_uuid IS NULL OR is_credit IS FALSE),
           CONSTRAINT "CHK_24353ca6f2db508e1647758770" CHECK ((is_income IS TRUE AND reimburse_uuid IS NULL AND category_uuid IS NULL) OR
                                                              (is_income IS FALSE AND reimburse_uuid IS NULL AND category_uuid IS NOT NULL) OR
                                                              (is_income IS FALSE AND reimburse_uuid IS NOT NULL AND category_uuid IS NULL)),
           CONSTRAINT "FK_8d2b56cd2dc49b1c5d346809219" FOREIGN KEY ("transaction_uuid") REFERENCES "bank_transaction" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION,
           CONSTRAINT "FK_72917b684db378ebdf75d3ab8c4" FOREIGN KEY ("category_uuid") REFERENCES "category" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION,
           CONSTRAINT "FK_d85d2056aebc7ca81e919b85dc4" FOREIGN KEY ("reimburse_uuid") REFERENCES "bank_transaction_item" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
       )`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bank_transaction_item"`)
  }
}
