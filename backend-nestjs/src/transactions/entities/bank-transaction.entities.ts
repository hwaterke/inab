import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import {BankAccount} from '../../bank-accounts/entities/bank-account.entity'

@Entity()
export class BankTransaction {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string

  @Column('date')
  date!: string

  @Column('varchar', {nullable: true})
  time!: string | null

  @ManyToOne(() => BankAccount, (account) => account.transactions)
  @JoinColumn({name: 'bank_account_uuid'})
  bankAccount!: BankAccount

  @Column('uuid', {name: 'bank_account_uuid'})
  bankAccountUuid!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
