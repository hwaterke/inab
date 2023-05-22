import {
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
