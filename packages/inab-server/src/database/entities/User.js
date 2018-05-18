import bcrypt from 'bcrypt'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import {Account} from './Account'
import {BudgetItem} from './BudgetItem'
import {Category} from './Category'
import {CategoryGroup} from './CategoryGroup'
import {Payee} from './Payee'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') uuid = undefined

  @Column('varchar', {unique: true})
  email = undefined

  @Column('varchar') password = undefined

  @Column('boolean', {default: false})
  is_admin = false

  @OneToMany(() => Account, account => account.user)
  accounts = undefined

  @OneToMany(() => CategoryGroup, categoryGroup => categoryGroup.user)
  category_groups = undefined

  @OneToMany(() => Category, category => category.user)
  categories = undefined

  @OneToMany(() => Payee, payee => payee.user)
  payees = undefined

  @OneToMany(() => BudgetItem, budgetItem => budgetItem.user)
  budget_items = undefined

  @CreateDateColumn() created_at = undefined

  @UpdateDateColumn() updated_at = undefined

  validatePassword(plainTextPassword) {
    return bcrypt.compare(plainTextPassword, this.password)
  }
}
