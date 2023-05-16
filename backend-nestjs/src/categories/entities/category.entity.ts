import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import {CategoryGroup} from './category-group.entity'
import {BankTransaction} from '../../transactions/entities/bank-transaction.entities'

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string

  @Column()
  name!: string

  @ManyToOne(() => CategoryGroup, (categoryGroup) => categoryGroup.categories, {
    nullable: false,
  })
  @JoinColumn({name: 'category_group_uuid'})
  categoryGroup = undefined

  @Column('uuid', {name: 'category_group_uuid'})
  categoryGroupUuid = undefined

  @OneToMany(() => BankTransaction, (transaction) => transaction.category)
  transactions!: BankTransaction[]
}
