import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import {Category} from '../../categories/entities/category.entity'
import {BankTransaction} from './bank-transaction.entities'

@Entity()
// An item is either an income, a reimbursement or it has a category
@Check(
  [
    // Income
    '(is_income IS TRUE AND reimburse_uuid IS NULL AND category_uuid IS NULL)',
    // Category
    '(is_income IS FALSE AND reimburse_uuid IS NULL AND category_uuid IS NOT NULL)',
    // Reimbursement
    '(is_income IS FALSE AND reimburse_uuid IS NOT NULL AND category_uuid IS NULL)',
  ].join(' OR ')
)
// If the item is a reimbursement, it cannot be a credit
@Check(`reimburse_uuid IS NULL OR is_credit IS FALSE`)
// If the item is an income, the amount must be positive
@Check(`is_income IS FALSE OR amount > 0`)
// If the item is a reimbursement, the amount must be positive
@Check(`reimburse_uuid IS NULL OR amount > 0`)
// If the item is a credit, the amount must be negative
@Check(`is_credit IS FALSE OR amount < 0`)
// Amount cannot be 0
@Check(`amount <> 0`)
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

  @Column('text', {nullable: true})
  description!: string | null

  @ManyToOne(() => Category)
  @JoinColumn({name: 'category_uuid'})
  category!: Category | null
  @Column('uuid', {name: 'category_uuid', nullable: true})
  categoryUuid!: string | null

  // Flag to indicate if the amount is an income. An income does not have a category.
  @Column('boolean', {name: 'is_income'})
  isIncome!: boolean

  // Flag to indicate if the amount is a credit. A credit is an amount that is expected to be reimbursed.
  @Column('boolean', {name: 'is_credit'})
  isCredit!: boolean

  // Link to another item being reimbursed by this one.
  @ManyToOne(() => BankTransactionItem, (item) => item.reimbursedBy)
  @JoinColumn({name: 'reimburse_uuid'})
  reimburse!: BankTransactionItem | null
  @Column('uuid', {name: 'reimburse_uuid', nullable: true})
  reimburseUuid!: string | null

  @OneToMany(() => BankTransactionItem, (item) => item.reimburse)
  reimbursedBy!: BankTransactionItem[]

  @CreateDateColumn({name: 'created_at'})
  createdAt!: Date

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt!: Date
}
