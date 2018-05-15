import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import {User} from './User'

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid') uuid = undefined

  @ManyToOne(() => User, user => user.accounts, {nullable: false})
  user = undefined

  @Column('varchar') name = undefined

  @CreateDateColumn() created_at = undefined

  @UpdateDateColumn() updated_at = undefined
}
