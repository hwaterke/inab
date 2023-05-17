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
import {CategoryGroup} from './category-group.entity'
import {BankTransaction} from '../../transactions/entities/bank-transaction.entities'

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string

  @Column()
  name!: string

  @ManyToOne(() => CategoryGroup, (categoryGroup) => categoryGroup.categories)
  @JoinColumn({name: 'category_group_uuid'})
  categoryGroup!: CategoryGroup

  @Column('uuid', {name: 'category_group_uuid'})
  categoryGroupUuid!: string

  @OneToMany(() => BankTransaction, (transaction) => transaction.category)
  transactions!: BankTransaction[]

  @CreateDateColumn({name: 'created_at'})
  createdAt!: Date

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt!: Date
}
