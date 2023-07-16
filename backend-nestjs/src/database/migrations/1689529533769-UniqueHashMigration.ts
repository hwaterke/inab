import {MigrationInterface, QueryRunner} from 'typeorm'

export class UniqueHashMigration1689529533769 implements MigrationInterface {
  name = 'UniqueHashMigration1689529533769'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_bank_transaction"
       (
           "uuid"                       varchar PRIMARY KEY NOT NULL,
           "date"                       date                NOT NULL,
           "time"                       varchar,
           "amount"                     integer             NOT NULL,
           "bank_account_uuid"          varchar             NOT NULL,
           "transfer_bank_account_uuid" varchar,
           "beneficiary_account_number" varchar,
           "payee_uuid"                 varchar,
           "hash"                       varchar,
           "import_details"             text,
           "created_at"                 datetime            NOT NULL DEFAULT (datetime('now')),
           "updated_at"                 datetime            NOT NULL DEFAULT (datetime('now')),
           CONSTRAINT "UQ_59e70023f4d9deaeb519c2808dc" UNIQUE ("bank_account_uuid", "hash"),
           CONSTRAINT "CHK_a9e694978d881b4a497668656b" CHECK ((time IS strftime('%H:%M:%S', time))),
           CONSTRAINT "CHK_445d387b8c8efc2f1506193f37" CHECK ((date IS strftime('%Y-%m-%d', date))),
           CONSTRAINT "CHK_8767f9eb6af95bef0d4ed60299" CHECK ((transfer_bank_account_uuid IS NULL OR amount < 0)),
           CONSTRAINT "CHK_e05ed3e1edee56a0f70e1ecce6" CHECK ((transfer_bank_account_uuid IS NULL OR payee_uuid IS NULL)),
           CONSTRAINT "FK_1c92609b3b609634fdda8fbf236" FOREIGN KEY ("payee_uuid") REFERENCES "payee" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION,
           CONSTRAINT "FK_e7ce7d0a97014124c74d16e994a" FOREIGN KEY ("transfer_bank_account_uuid") REFERENCES "bank_account" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION,
           CONSTRAINT "FK_eeaadf90e91735f8d3d024db2bb" FOREIGN KEY ("bank_account_uuid") REFERENCES "bank_account" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
       )`
    )
    await queryRunner.query(
      `INSERT INTO "temporary_bank_transaction"("uuid", "date", "time", "amount",
                                                "bank_account_uuid", "transfer_bank_account_uuid",
                                                "beneficiary_account_number", "payee_uuid",
                                                "hash", "import_details", "created_at",
                                                "updated_at")
       SELECT "uuid",
              "date",
              "time",
              "amount",
              "bank_account_uuid",
              "transfer_bank_account_uuid",
              "beneficiary_account_number",
              "payee_uuid",
              "hash",
              "import_details",
              "created_at",
              "updated_at"
       FROM "bank_transaction"`
    )
    await queryRunner.query(`DROP TABLE "bank_transaction"`)
    await queryRunner.query(`ALTER TABLE "temporary_bank_transaction"
        RENAME TO "bank_transaction"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bank_transaction"
        RENAME TO "temporary_bank_transaction"`)
    await queryRunner.query(`CREATE TABLE "bank_transaction"
                             (
                                 "uuid"                       varchar PRIMARY KEY NOT NULL,
                                 "date"                       date                NOT NULL,
                                 "time"                       varchar,
                                 "amount"                     integer             NOT NULL,
                                 "bank_account_uuid"          varchar             NOT NULL,
                                 "transfer_bank_account_uuid" varchar,
                                 "beneficiary_account_number" varchar,
                                 "payee_uuid"                 varchar,
                                 "hash"                       varchar,
                                 "import_details"             text,
                                 "created_at"                 datetime            NOT NULL DEFAULT (datetime('now')),
                                 "updated_at"                 datetime            NOT NULL DEFAULT (datetime('now')),
                                 CONSTRAINT "CHK_a9e694978d881b4a497668656b" CHECK ((time IS strftime('%H:%M:%S', time))),
                                 CONSTRAINT "CHK_445d387b8c8efc2f1506193f37" CHECK ((date IS strftime('%Y-%m-%d', date))),
                                 CONSTRAINT "CHK_8767f9eb6af95bef0d4ed60299" CHECK ((transfer_bank_account_uuid IS NULL OR amount < 0)),
                                 CONSTRAINT "CHK_e05ed3e1edee56a0f70e1ecce6" CHECK ((transfer_bank_account_uuid IS NULL OR payee_uuid IS NULL)),
                                 CONSTRAINT "FK_1c92609b3b609634fdda8fbf236" FOREIGN KEY ("payee_uuid") REFERENCES "payee" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION,
                                 CONSTRAINT "FK_e7ce7d0a97014124c74d16e994a" FOREIGN KEY ("transfer_bank_account_uuid") REFERENCES "bank_account" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION,
                                 CONSTRAINT "FK_eeaadf90e91735f8d3d024db2bb" FOREIGN KEY ("bank_account_uuid") REFERENCES "bank_account" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
                             )`)
    await queryRunner.query(`INSERT INTO "bank_transaction"("uuid", "date", "time", "amount", "bank_account_uuid",
                                                            "transfer_bank_account_uuid", "beneficiary_account_number",
                                                            "payee_uuid", "hash", "import_details", "created_at",
                                                            "updated_at")
                             SELECT "uuid",
                                    "date",
                                    "time",
                                    "amount",
                                    "bank_account_uuid",
                                    "transfer_bank_account_uuid",
                                    "beneficiary_account_number",
                                    "payee_uuid",
                                    "hash",
                                    "import_details",
                                    "created_at",
                                    "updated_at"
                             FROM "temporary_bank_transaction"`)
    await queryRunner.query(`DROP TABLE "temporary_bank_transaction"`)
  }
}
