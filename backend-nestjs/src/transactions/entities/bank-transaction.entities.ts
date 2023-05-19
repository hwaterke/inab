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
import {BankAccount} from '../../bank-accounts/entities/bank-account.entity'
import {Payee} from '../../payees/entities/payee.entity'
import {Category} from '../../categories/entities/category.entity'
import {BankSubTransaction} from './bank-subtransaction.entity'

@Entity()
@Check(`date IS strftime('%Y-%m-%d', date)`)
@Check(`time IS strftime('%H:%M:%S', time)`)
export class BankTransaction {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string

  @Column('date')
  date!: string

  @Column('varchar', {nullable: true})
  time!: string | null

  @Column('integer')
  amount!: number

  @ManyToOne(() => BankAccount, (account) => account.transactions)
  @JoinColumn({name: 'bank_account_uuid'})
  bankAccount!: BankAccount
  @Column('uuid', {name: 'bank_account_uuid'})
  bankAccountUuid!: string

  @ManyToOne(() => BankAccount)
  @JoinColumn({name: 'transfer_bank_account_uuid'})
  transferBankAccount!: BankAccount
  @Column('uuid', {name: 'transfer_bank_account_uuid', nullable: true})
  transferBankAccountUuid!: string

  // Account number of the beneficiary of the transaction
  @Column('varchar', {name: 'beneficiary_account_number', nullable: true})
  beneficiaryAccountNumber!: string | null

  @ManyToOne(() => Payee, (payee) => payee.transactions)
  @JoinColumn({name: 'payee_uuid'})
  payee!: Payee | null
  @Column('uuid', {name: 'payee_uuid', nullable: true})
  payeeUuid!: string | null

  @ManyToOne(() => Category, (account) => account.transactions)
  @JoinColumn({name: 'category_uuid'})
  category!: Category
  @Column('uuid', {name: 'category_uuid', nullable: true})
  categoryUuid!: string

  @OneToMany(
    () => BankSubTransaction,
    (subtransaction) => subtransaction.transaction,
    {cascade: true}
  )
  subtransactions!: BankSubTransaction[]

  // Used with import to prevent creating duplicate transactions
  @Column('varchar', {nullable: true})
  hash!: string | null

  @Column('text', {name: 'import_details', nullable: true})
  importDetails!: string | null

  @CreateDateColumn({name: 'created_at'})
  createdAt!: Date

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt!: Date
}
