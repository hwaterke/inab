import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import {Category} from './Category'
import {User} from './User'

@Entity()
export class CategoryGroup {
  @PrimaryGeneratedColumn('uuid')
  uuid = undefined

  @ManyToOne(() => User, (user) => user.category_groups, {nullable: false})
  user = undefined

  @OneToMany(() => Category, (category) => category.category_group)
  categories = undefined

  @Column('varchar')
  name = undefined

  @Column('integer')
  priority = undefined

  @CreateDateColumn()
  created_at = undefined

  @UpdateDateColumn()
  updated_at = undefined
}
