import {MigrationInterface, QueryRunner} from 'typeorm'

export class TransactionItemMigration1684496078491
  implements MigrationInterface
{
  name = 'TransactionItemMigration1684496078491'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "bank_transaction_item"
                             (
                                 "uuid"             varchar PRIMARY KEY NOT NULL,
                                 "amount"           integer             NOT NULL,
                                 "transaction_uuid" varchar             NOT NULL,
                                 "category_uuid"    varchar             NOT NULL,
                                 "is_credit"        boolean             NOT NULL,
                                 "created_at"       datetime            NOT NULL DEFAULT (datetime('now')),
                                 "updated_at"       datetime            NOT NULL DEFAULT (datetime('now')),
                                 "reimburse_uuid"   varchar,
                                 CONSTRAINT "REL_d85d2056aebc7ca81e919b85dc" UNIQUE ("reimburse_uuid"),
                                 CONSTRAINT "FK_8d2b56cd2dc49b1c5d346809219" FOREIGN KEY ("transaction_uuid") REFERENCES "bank_transaction" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION,
                                 CONSTRAINT "FK_72917b684db378ebdf75d3ab8c4" FOREIGN KEY ("category_uuid") REFERENCES "category" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION,
                                 CONSTRAINT "FK_d85d2056aebc7ca81e919b85dc4" FOREIGN KEY ("reimburse_uuid") REFERENCES "bank_transaction_item" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
                             )`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bank_transaction_item"`)
  }
}
