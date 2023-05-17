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
export class Payee {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string

  @Column()
  name!: string

  @OneToMany(() => BankTransaction, (transaction) => transaction.payee)
  transactions!: BankTransaction[]

  @CreateDateColumn({name: 'created_at'})
  createdAt!: Date

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt!: Date
}
