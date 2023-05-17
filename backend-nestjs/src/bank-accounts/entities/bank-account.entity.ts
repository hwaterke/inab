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

  @Column('varchar', {unique: true})
  iban!: string

  @OneToMany(() => BankTransaction, (transaction) => transaction.bankAccount)
  transactions!: BankTransaction[]

  @CreateDateColumn({name: 'created_at'})
  createdAt!: Date

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt!: Date
}
