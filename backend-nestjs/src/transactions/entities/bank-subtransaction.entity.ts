import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import {Category} from '../../categories/entities/category.entity'

@Entity()
export class BankSubTransaction {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string

  @Column('integer')
  amount!: number

  @ManyToOne(() => Category)
  @JoinColumn({name: 'category_uuid'})
  category!: Category

  @Column('uuid', {name: 'category_uuid'})
  categoryUuid!: string

  @ManyToOne(() => Category, (account) => account.transactions, {
    nullable: false,
  })
  @JoinColumn({name: 'transaction_uuid'})
  transaction!: Category

  @Column('uuid', {name: 'transaction_uuid'})
  transactionUuid!: string

  @CreateDateColumn({name: 'created_at'})
  createdAt!: Date

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt!: Date
}
