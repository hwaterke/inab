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
import {BudgetItem} from './BudgetItem'
import {CategoryGroup} from './CategoryGroup'
import {Transaction} from './Transaction'
import {User} from './User'

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  uuid = undefined

  @ManyToOne(() => User, (user) => user.categories, {nullable: false})
  user = undefined

  @Column('uuid')
  category_group_uuid = undefined

  @ManyToOne(() => CategoryGroup, (categoryGroup) => categoryGroup.categories, {
    nullable: false,
  })
  @JoinColumn({name: 'category_group_uuid'})
  category_group = undefined

  @OneToMany(() => BudgetItem, (budget_item) => budget_item.category)
  budget_items = undefined

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions = undefined

  @Column('varchar')
  name = undefined

  @Column('integer')
  priority = undefined

  @Column('varchar', {nullable: true})
  goal_type = undefined

  @Column('date', {nullable: true})
  goal_creation_month = undefined

  @Column('integer', {default: 0})
  target_balance = undefined

  @Column('date', {nullable: true})
  target_balance_month = undefined

  @Column('integer', {default: 0})
  monthly_funding = undefined

  @CreateDateColumn()
  created_at = undefined

  @UpdateDateColumn()
  updated_at = undefined
}
