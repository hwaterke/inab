import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import {Category} from './Category'
import {User} from './User'

@Entity()
@Index(['month', 'category'], {unique: true})
export class BudgetItem {
  @PrimaryGeneratedColumn('uuid')
  uuid = undefined

  @ManyToOne(() => User, (user) => user.budget_items, {nullable: false})
  user = undefined

  @Column('uuid')
  category_uuid = undefined

  @ManyToOne(() => Category, (category) => category.budget_items, {
    nullable: false,
  })
  @JoinColumn({name: 'category_uuid'})
  category = undefined

  @Column('date', {nullable: true})
  month = undefined

  @Column('integer')
  amount = undefined

  @CreateDateColumn()
  created_at = undefined

  @UpdateDateColumn()
  updated_at = undefined
}
