import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import {CategoryGroup} from './category-group.entity'

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  uuid!: number

  @Column()
  name!: string

  @ManyToOne(() => CategoryGroup, (categoryGroup) => categoryGroup.categories, {
    nullable: false,
  })
  @JoinColumn({name: 'category_group_uuid'})
  categoryGroup = undefined

  @Column('uuid', {name: 'category_group_uuid'})
  categoryGroupUuid = undefined
}
