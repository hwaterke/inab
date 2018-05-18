import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import {Transaction} from './Transaction'
import {User} from './User'

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid') uuid = undefined

  @ManyToOne(() => User, user => user.accounts, {nullable: false})
  user = undefined

  @OneToMany(() => Transaction, transaction => transaction.account)
  transactions = undefined

  @Column('varchar') name = undefined

  @CreateDateColumn() created_at = undefined

  @UpdateDateColumn() updated_at = undefined
}
