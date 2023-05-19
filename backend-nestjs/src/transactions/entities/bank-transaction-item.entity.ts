import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import {Category} from '../../categories/entities/category.entity'
import {BankTransaction} from './bank-transaction.entities'

@Entity()
export class BankTransactionItem {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string

  @Column('integer')
  amount!: number

  @ManyToOne(() => BankTransaction, (transaction) => transaction.items)
  @JoinColumn({name: 'transaction_uuid'})
  transaction!: BankTransaction

  @Column('uuid', {name: 'transaction_uuid'})
  transactionUuid!: string

  @ManyToOne(() => Category)
  @JoinColumn({name: 'category_uuid'})
  category!: Category

  @Column('uuid', {name: 'category_uuid'})
  categoryUuid!: string

  // Flag to indicate if the amount is a credit. A credit is an amount that is expected to be reimbursed.
  @Column('boolean', {name: 'is_credit'})
  isCredit!: boolean

  // Link to another item being reimbursed by this one.
  @OneToOne(() => BankTransactionItem)
  @JoinColumn({name: 'reimburse_uuid'})
  reimburse!: BankTransactionItem | null

  @CreateDateColumn({name: 'created_at'})
  createdAt!: Date

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt!: Date
}
