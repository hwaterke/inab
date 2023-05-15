import {MigrationInterface, QueryRunner} from 'typeorm'

export class CategoryMigration1684178212867 implements MigrationInterface {
  name = 'CategoryMigration1684178212867'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category_group"
       (
           "uuid" varchar PRIMARY KEY NOT NULL,
           "name" varchar             NOT NULL
       )`
    )

    await queryRunner.query(
      `CREATE TABLE "category"
       (
           "uuid"                varchar PRIMARY KEY NOT NULL,
           "name"                varchar             NOT NULL,
           "category_group_uuid" varchar             NOT NULL,
           CONSTRAINT "FK_4651a2a527afd8fba887bcd2a2e" FOREIGN KEY ("category_group_uuid") REFERENCES "category_group" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
       )`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "category"`)
    await queryRunner.query(`DROP TABLE "category_group"`)
  }
}
