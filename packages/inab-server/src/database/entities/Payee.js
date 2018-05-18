import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import {Location} from './Location'
import {User} from './User'

@Entity()
export class Payee {
  @PrimaryGeneratedColumn('uuid') uuid = undefined

  @ManyToOne(() => User, user => user.payees, {nullable: false})
  user = undefined

  @OneToMany(() => Location, location => location.payee, {cascade: true, eager: true})
  locations = undefined

  @Column('varchar') name = undefined

  @CreateDateColumn() created_at = undefined

  @UpdateDateColumn() updated_at = undefined
}
