import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import {Category} from './Category'
import {Transaction} from './Transaction'

@Entity()
export class Subtransaction {
  @PrimaryGeneratedColumn('uuid')
  uuid = undefined

  @Column('varchar', {nullable: true})
  description = undefined

  @Column('integer')
  amount = undefined

  @Column('uuid')
  category_uuid = undefined
  @ManyToOne(() => Category)
  @JoinColumn({name: 'category_uuid'})
  category = undefined

  @ManyToOne(() => Transaction, transaction => transaction.subtransactions, {
    nullable: false,
  })
  transaction = undefined

  @CreateDateColumn()
  created_at = undefined

  @UpdateDateColumn()
  updated_at = undefined
}
