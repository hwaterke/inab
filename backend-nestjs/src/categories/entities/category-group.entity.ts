import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import {Category} from './category.entity'

@Entity()
export class CategoryGroup {
  @PrimaryGeneratedColumn('uuid')
  uuid!: number

  @Column()
  name!: string

  @OneToMany(() => Category, (category) => category.categoryGroup)
  categories!: Category[]
}
