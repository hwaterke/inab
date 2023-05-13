import {Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class BankSubTransaction {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string
}
