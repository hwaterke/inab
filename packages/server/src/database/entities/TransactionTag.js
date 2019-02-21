import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm'
import {Transaction} from './Transaction'

@Entity()
export class TransactionTag {
  @ManyToOne(() => Transaction, transaction => transaction.tags, {
    nullable: false,
    primary: true,
  })
  transaction = undefined

  @Column('varchar', {primary: true})
  name = undefined

  @CreateDateColumn()
  created_at = undefined

  @UpdateDateColumn()
  updated_at = undefined
}
