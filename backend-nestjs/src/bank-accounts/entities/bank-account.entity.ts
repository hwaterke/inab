import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import {BankTransaction} from '../../transactions/entities/bank-transaction.entities'

@Entity()
export class BankAccount {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string

  @Column('varchar', {unique: true})
  name!: string

  @Column('varchar', {nullable: true})
  iban!: string | null

  @OneToMany(() => BankTransaction, (transaction) => transaction.bankAccount)
  transactions!: BankTransaction[]

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
