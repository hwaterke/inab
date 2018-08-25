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
import {Account} from './Account'
import {Category} from './Category'
import {Payee} from './Payee'
import {Subtransaction} from './Subtransaction'
import {TransactionTag} from './TransactionTag'
import {User} from './User'

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  uuid = undefined

  @ManyToOne(() => User, user => user.transactions, {nullable: false})
  user = undefined

  @Column('date')
  date = undefined

  @Column('varchar', {nullable: true})
  time = undefined

  @Column('uuid', {nullable: true})
  payee_uuid = undefined
  @ManyToOne(() => Payee, payee => payee.transactions)
  @JoinColumn({name: 'payee_uuid'})
  payee = undefined

  @Column('varchar', {nullable: true})
  description = undefined

  @Column('integer')
  amount = undefined

  @Column('varchar', {nullable: true})
  type = undefined

  @Column('uuid', {nullable: true})
  category_uuid = undefined
  @ManyToOne(() => Category, category => category.transactions)
  @JoinColumn({name: 'category_uuid'})
  category = undefined

  @Column('uuid')
  account_uuid = undefined
  @ManyToOne(() => Account, account => account.transactions)
  @JoinColumn({name: 'account_uuid'})
  account = undefined

  @Column('uuid', {nullable: true})
  transfer_account_uuid = undefined
  @ManyToOne(() => Account)
  @JoinColumn({name: 'transfer_account_uuid'})
  transfer_account = undefined

  @OneToMany(
    () => Subtransaction,
    subtransaction => subtransaction.transaction,
    {cascade: true, eager: true}
  )
  subtransactions = undefined

  @OneToMany(() => TransactionTag, tag => tag.transaction, {
    cascade: true,
    eager: true,
  })
  tags = undefined

  @Column('datetime', {nullable: true})
  cleared_at = undefined

  @CreateDateColumn()
  created_at = undefined

  @UpdateDateColumn()
  updated_at = undefined
}
